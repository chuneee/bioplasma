// src/utils/jwt.ts
export function parseJwt(token: string) {
  const base64Payload = token.split(".")[1];
  return JSON.parse(atob(base64Payload));
}

export function getTokenExpiration(token: string): number {
  const payload = parseJwt(token);
  return payload.exp * 1000; // ms
}
