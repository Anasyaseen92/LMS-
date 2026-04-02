require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { safeRedisSet } from "../utils/redisHealth";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";

//register
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerationUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email Already Exst!", 400));
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };
      const activationtoken = createActivationToken(user);

      const activationCode = activationtoken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your emial ${user.email} to activate your account`,
          activationtoken: activationtoken.token,
        });
      } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error:any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);
interface IActivationToken {
  token: String;
  activationtoken: String;
}
const getActivationSecret = (): Secret => {
  if (!process.env.ACTIVATION_SECRET) {
    console.warn(
      "ACTIVATION_SECRET is not set; using a temporary dev secret."
    );
    return "dev_activation_secret";
  }
  return process.env.ACTIVATION_SECRET as Secret;
};

export const createActivationToken = (user: any) => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign( 
    {
      user,
      activationCode,
    },
    getActivationSecret(),
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

 //activate User
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        activation_token,
        activation_code,
      } = req.body as IActivationRequest;

      const newUser: {
        user: IUser;
        activationCode: string;
      } = jwt.verify(
        activation_token,
        getActivationSecret()
      ) as any;
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
        message: "User activated successfully",
      });
    } catch (error:any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);

//login User
interface ILoginRequest {
  email: string;
  password: string;
}
export const LoginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      const normalizedEmail = email?.trim();
      const normalizedPassword = password?.trim();

      if (!normalizedEmail || !normalizedPassword) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const user = await userModel.findOne({ email: normalizedEmail }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      if (!user.password) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      const isPasswordMatch = await user.comparePassword(normalizedPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      sendToken(user, 200, res);
    } catch (error:any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const LogoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = (req as any).user?._id?.toString();
      if (userId) {
        void redis.del(userId).catch((error: Error) => {
          console.error("Redis del failed:", error.message);
        });
      }
      res.status(200).json({
        success: true,
        message: "User logged out successfully.",
      });
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update access token
export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      if (!refresh_token) {
        return next(new ErrorHandler("Please login to continue", 401));
      }
      const decode = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      if (!decode) {
        return next(new ErrorHandler("Could not Refresh token", 400));
      }
      let user: any = null;
      try {
        const session = await redis.get(decode.id as string);
        if (session) {
          user = JSON.parse(session);
        }
      } catch (error) {
        const redisError = error as Error;
        console.error("Redis get failed:", redisError.message);
      }
      if (!user) {
        const dbUser = await userModel.findById(decode.id).select("-password");
        if (!dbUser) {
          return next(
            new ErrorHandler("Session expired, please login again!", 401)
          );
        }
        user = dbUser;
      }
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string
      );
      const refresh_Token = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string
      );
      (req as any).user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refresh_Token, refreshTokenOptions);
      try {
        await redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800);
      } catch (error) {
        const redisError = error as Error;
        console.error("Redis set failed:", redisError.message);
      }
      next();
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get user Info
export const getUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id.toString() || "";
      getUserById(userId, res);
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//social Auths
interface ISocialAuthBody {
  email: string;
  name: string;
   avatar: {
    public_id: string;
    url: string;
  };
}
export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user Info
interface IUpdatUserBody {
  name?: string;
  email?: string;
}
export const updateUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdatUserBody;
      const userId = req.user?._id;
      if (!userId) {
        return next(new Error("User ID is undefined"));
      }
      const user = await userModel.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const normalizedName = name?.trim();
      const normalizedEmail = email?.trim();

      if (normalizedName) {
        user.name = normalizedName;
      }

      if (normalizedEmail && normalizedEmail !== user.email) {
        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
          return next(new ErrorHandler("Email already exists", 409));
        }
        user.email = normalizedEmail;
      }

      await user.save();
      void safeRedisSet(userId.toString(), JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}
export const updateUserPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }
      const user = await userModel.findById(req.user?._id).select("+password");
      if (user?.password === undefined) {
        return next(new ErrorHandler("User not found", 404));
      }
      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Old password is incorrect", 401));
      }
      user.password = newPassword;
      await user.save();
      const userId = req.user?._id.toString() || "";
      if (!userId) {
        return next(new Error("User ID is undefined"));
      }
      const sanitizedUser = await userModel.findById(req.user?._id).select("-password");
      if (sanitizedUser) {
        void safeRedisSet(userId, JSON.stringify(sanitizedUser));
      }
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user: sanitizedUser || undefined,
      });
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user profile picture
interface IUpdateProfilePicture {
  avatar: string;
}
export const updateUserProfilePicture = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const userId = req.user?._id.toString();
      const user = await userModel.findById(userId);
      if (avatar && user) {
        //if usere have one avatar then call this 
        if (user?.avatar?.public_id) {
          //first we are Deleting the old Image
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
             await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
        } else {
      if(avatar){
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
      }
        }
      }
      await user?.save();
      if (!userId) {
        return next(new Error("User ID is undefined"));
      }
      if (user) {
        void safeRedisSet(userId, JSON.stringify(user));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users ---admin
export const getAllUsers = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    getAllUsersService(res);
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//Update usere Role ---admin
export const updateUserRole = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id,role}=req.body;
      updateUserRoleService(res,id,role);
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//delete User ---only for admins
export const deleteUser=catchAsyncErrors(async(req: Request, res: Response, next: NextFunction)=>{
  try {

    const {id} =req.params ;
    const user=await userModel.findById(id);
    if (!user) {
    return next(new ErrorHandler("User not found", 400));
    }
    await user.deleteOne({ id });
    await redis.del(id as string);
    res.status(201).json({
    success: true,
    message: "User deleted successfully."
    })
  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
)
