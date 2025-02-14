import { useLogto } from "@logto/react";
import { API_RESOURCE } from "../config";
import { useState, useEffect } from "react";

export const useUserData = () => {
  const { getAccessTokenClaims } = useLogto();
  const [userScopes, setUserScopes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const fetchScopes = async () => {
      const token = await getAccessTokenClaims(API_RESOURCE);
      setUserScopes(token?.scope?.split(" ") ?? []);
      setUserId(token?.sub);
    };

    fetchScopes();
  }, [getAccessTokenClaims]);

  return { userId, userScopes };
};
