import fetch from "node-fetch";
export const makeRequest = async (endpoint, options) => {
    const response = await fetch(endpoint, options);
    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json());
    }
    catch (error) {
        console.error("Error making request:", error);
        return null;
    }
};
export const exchangeAccessToken = async ({ tokenEndpoint, clientId, resource, scope, personalAccessToken, }) => {
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        subject_token: personalAccessToken,
        subject_token_type: "urn:logto:token-type:personal_access_token",
        resource,
        scope,
    });
    const accessTokenResponse = await makeRequest(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });
    if (!accessTokenResponse) {
        throw new Error("Failed to exchange access token");
    }
    return {
        ...accessTokenResponse,
        // Calculate the expiration time
        expired_at: Date.now() + accessTokenResponse.expires_in * 1000,
    };
};
