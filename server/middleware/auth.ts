import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { catchAsyncErrors } from "./catchAsyncErrors";
import userModel from "../models/user.model";

export const isAuthenticated = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      const access_token = req.cookies?.access_token as string;
      if (!access_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }
      const decode = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;
      if (!decode) {
        return next(new ErrorHandler("Access token is not valid!", 400));
      }
      try {
        const cachedUser = await redis.get(decode.id);
        if (cachedUser) {
          (req as any).user = JSON.parse(cachedUser);
          next();
          return;
        }
      } catch (error) {
        const redisError = error as Error;
        console.error("Redis get failed:", redisError.message);
      }
      const dbUser = await userModel.findById(decode.id).select("-password");
      if (!dbUser) {
        return next(new ErrorHandler("Please login to access this resourse", 400));
      }
      (req as any).user = dbUser;
      next();
    }
  );

  //validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role || "";
    if (!roles.includes(role)) {
      return next(
        new ErrorHandler(
          `Role: ${role} is not allowed to access this resourse`,
          403
        )
      );
    }
    next();
  };
};
