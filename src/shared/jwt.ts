
import { SignJWT, jwtVerify } from "jose";

import { env } from "../config/env.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function createAccessToken(
  userId: string
): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

export async function verifyAccessToken(
  token: string
): Promise<string> {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  if (!payload.sub) {
    throw new Error("Token sem identificador de usuário.");
  }

  return payload.sub;
}
