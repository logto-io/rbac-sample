import fetch, { RequestInit } from "node-fetch";

export const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T | null> => {
  const response = await fetch(endpoint, options);

  try {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
};

export type ExchangeAccessTokenOptions = {
  tokenEndpoint: string;
  clientId: string;
  resource: string;
  scope: string;
  personalAccessToken: string;
};

type AccessTokenResponse = {
  access_token: string;
  issued_token_type: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

export type AccessToken = AccessTokenResponse & {
  expired_at: number;
};

export const exchangeAccessToken = async ({
  tokenEndpoint,
  clientId,
  resource,
  scope,
  personalAccessToken,
}: ExchangeAccessTokenOptions): Promise<AccessToken> => {
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: personalAccessToken,
    subject_token_type: "urn:logto:token-type:personal_access_token",
    resource,
    scope,
  });

  const accessTokenResponse = await makeRequest<AccessTokenResponse>(
    tokenEndpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!accessTokenResponse) {
    throw new Error("Failed to exchange access token");
  }

  return {
    ...accessTokenResponse,
    // Calculate the expiration time
    expired_at: Date.now() + accessTokenResponse.expires_in * 1000,
  };
};
