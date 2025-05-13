import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  generateTokens,
  validateRefreshToken,
} from "../../service/auth.service";
import { AppError, errorKinds } from "../../../../utils/error-handling";
import { StatusCode } from "../../../../utils/Status";
import { IUser } from "../../models/user.model";
import passport from "passport";
import ENV from "../../../../config/custom-env";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(StatusCode.Created).json({ message: "User registered", user });
  } catch (error: any) {
    if (error.code === 11000) {
      return AppError.new(
        errorKinds.alreadyExist,
        "Email already exists",
        error
      ).response(res);
    }

    AppError.new(
      errorKinds.internalServerError,
      "Registration failed",
      error
    ).response(res);
  }
};

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        console.log(err);

        return AppError.new(
          errorKinds.internalServerError,
          "Authentication error",
          err
        ).response(res);
      }

      if (!user) {
        console.log(user);

        return AppError.new(
          errorKinds.invalidCredential,
          "Invalid email or password",
          info
        ).response(res);
      }

      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: (ENV.ACCESS_TOKEN_EXPIRES_IN as any) || "15m",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: (ENV.REFRESH_TOKEN_EXPIRES_IN as any) || "7d",
      });
      res.json({ message: "Login successful" });
    }
  )(req, res, next);
};

export const logoutController = (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    res.status(StatusCode.OK).json({
      message: "User logged out successfully",
    });
  } catch (error: any) {
    if (error instanceof AppError) return error.response(res);

    return AppError.new(
      errorKinds.internalServerError,
      "Unexpected error during logout",
      error
    ).response(res);
  }
};

export const getUserController = (req: Request, res: Response) => {
  if (!req.user) {
    return AppError.new(
      errorKinds.notAuthorized,
      "User not authenticated"
    ).response(res);
  }

  res.json({ user: req.user });
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw AppError.new(errorKinds.invalidToken, "Refresh token is missing");
    }

    const payload = validateRefreshToken(refreshToken);
    const newTokens = generateTokens({ _id: payload.id } as IUser);

    res.status(StatusCode.OK).json({
      message: "New access token issued",
      ...newTokens,
    });
  } catch (error: any) {
    if (error instanceof AppError) return error.response(res);

    return AppError.new(
      errorKinds.internalServerError,
      "Unexpected error during token refresh",
      error
    ).response(res);
  }
};
