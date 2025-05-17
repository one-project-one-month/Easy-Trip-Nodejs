import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  generateTokens,
  validateRefreshToken,
} from "../../service/auth.service";
import { AppError, errorKinds } from "../../../../utils/error-handling";
import { StatusCode } from "../../../../utils/Status";
import { IUser } from "../../models/user.model";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(StatusCode.Created).json({ message: "User registered", user });
  } catch (error: any) {
    if (error.code === 11000) {
      throw AppError.new(
        errorKinds.alreadyExist,
        "Email already exists",
        error
      );
    }

    throw AppError.new(
      errorKinds.internalServerError,
      "Registration failed",
      error
    );
  }
};

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    if (!user) {
      throw AppError.new(
        errorKinds.invalidCredential,
        "Invalid email or password"
      );
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7,
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : AppError.new(errorKinds.internalServerError, "internal Server Error")
    );
  }
};

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken");
    res.status(StatusCode.OK).json({
      message: "User logged out successfully",
    });
  } catch (error: any) {
    next(
      error instanceof AppError
        ? error
        : AppError.new(errorKinds.internalServerError, "internal Server Error")
    );
  }
};

export const getUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw AppError.new(
      errorKinds.notAuthorized,
      "User not authenticated"
    ).response(res);
  }

  res.json({ user: req.user });
};

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(
      error instanceof AppError
        ? error
        : AppError.new(errorKinds.internalServerError, "internal Server Error")
    );
  }
};

export const googleOAuthController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      throw AppError.new(errorKinds.invalidCredential, "Google login failed");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7,
    });

    res.redirect("http://localhost:3001");
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : AppError.new(
            errorKinds.internalServerError,
            "Google OAuth callback error"
          )
    );
  }
};
