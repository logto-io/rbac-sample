const { createRemoteJWKSet, jwtVerify } = require("jose");

const cmsApiResource = process.env.LOGTO_API_RESOURCE;

const getTokenFromHeader = (headers) => {
  const { authorization } = headers;
  const bearerTokenIdentifier = "Bearer";

  if (!authorization) {
    throw new Error("Authorization header missing");
  }

  if (!authorization.startsWith(bearerTokenIdentifier)) {
    throw new Error("Authorization token type not supported");
  }

  return authorization.slice(bearerTokenIdentifier.length + 1);
};

const hasScopes = (tokenScopes, requiredScopes) => {
  if (!requiredScopes || requiredScopes.length === 0) {
    return true;
  }
  const scopeSet = new Set(tokenScopes);
  return requiredScopes.every((scope) => scopeSet.has(scope));
};

const verifyJwt = async (token) => {
  const JWKS = createRemoteJWKSet(new URL(process.env.LOGTO_JWKS_URL));

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: process.env.LOGTO_ISSUER,
    audience: process.env.LOGTO_API_RESOURCE,
  });

  return payload;
};

const requireAuth = (requiredScopes = []) => {
  return async (req, res, next) => {
    try {
      // Extract the token
      const token = getTokenFromHeader(req.headers);

      // Verify the token
      const payload = await verifyJwt(token);

      // Add user info to request
      req.user = {
        id: payload.sub,
        scopes: payload.scope?.split(" ") || [],
      };

      // Verify required scopes
      if (!hasScopes(req.user.scopes, requiredScopes)) {
        throw new Error("Insufficient permissions");
      }

      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  };
};

module.exports = {
  requireAuth,
  hasScopes
};
