import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  generateTokens,
  validateRefreshToken,
  generateAccessToken,
} from "../../service/auth.service";
import { AppError, errorKinds } from "../../../../utils/error-handling";
import { StatusCode } from "../../../../utils/Status";
import userModel, { IUser } from "../../models/user.model";
import { AuthUser } from "../dto";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(StatusCode.Created).json({ message: "User registered" });
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

export const loginController = async (
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
    await userModel.findByIdAndUpdate(user._id, { lastLogin: new Date(), refreshToken });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : AppError.new(errorKinds.internalServerError, "internal Server Error")
    );
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    await userModel.findByIdAndUpdate(user._id, { lastLogout: new Date(), refreshToken: null });
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
  const dto = new AuthUser(req.user);
  res.json({ user: dto });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    const user = await userModel.findOne({ refreshToken });
    if(!user) {
      throw AppError.new(errorKinds.invalidToken, "Refresh token is invalid");
    }

    if (!refreshToken) {
      throw AppError.new(errorKinds.invalidToken, "Refresh token is missing");
    }

    const payload = validateRefreshToken(refreshToken);
    const accessToken = generateAccessToken({_id: payload.id} as IUser);

    res.status(StatusCode.OK).json({
      message: "New access token issued",
      accessToken,
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
