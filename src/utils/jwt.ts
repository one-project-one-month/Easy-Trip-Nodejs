import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import ENV from "../config/custom-env";
import { IUser } from "../feature/auth/models/user.model";
import { AppError, errorKinds } from "./error-handling";

const accessTokenPrivateKey = Buffer.from(
  ENV.ACCESS_TOKEN_PRIVATE_KEY!,
  "base64"
).toString("ascii");

const refreshTokenPrivateKey = Buffer.from(
  ENV.REFRESH_TOKEN_PRIVATE_KEY!,
  "base64"
).toString("ascii");

export const accessTokenPublicKey = Buffer.from(
  ENV.ACCESS_TOKEN_PUBLIC_KEY!,
  "base64"
).toString("ascii");
const refreshTokenPublicKey = Buffer.from(
  ENV.REFRESH_TOKEN_PUBLIC_KEY!,
  "base64"
).toString("ascii");

export const signAccessToken = (user: IUser): string => {
  const options: SignOptions = {
    algorithm: "RS256",
    expiresIn: '15m',
  };

  return jwt.sign({ id: user._id.toString() }, accessTokenPrivateKey, options);
};

export const signRefreshToken = (user: IUser): string => {
  const options: SignOptions = {
    algorithm: "RS256",
    expiresIn: '7d',
  };

  return jwt.sign({ id: user._id }, refreshTokenPrivateKey, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, accessTokenPublicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;
  } catch (err) {
    throw AppError.new(errorKinds.invalidToken, "Access token is invalid");
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, refreshTokenPublicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;
  } catch (err) {
    throw AppError.new(errorKinds.invalidToken, "Refresh token is invalid");
  }
};
