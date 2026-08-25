const revokedTokens = new Map();

function revokeToken(token, expiresInMs) {
  revokedTokens.set(token, Date.now() + expiresInMs);
  if (revokedTokens.size > 10000) {
    const now = Date.now();
    for (const [t, expiry] of revokedTokens) {
      if (expiry < now) revokedTokens.delete(t);
    }
  }
}

function isTokenRevoked(token) {
  const expiry = revokedTokens.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    revokedTokens.delete(token);
    return false;
  }
  return true;
}

module.exports = { revokeToken, isTokenRevoked };
