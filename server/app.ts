import express, { NextFunction, Request, Response } from "express";
import { ErrorMiddleware } from  "./middleware/error"
export const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
//body parser
app.use(express.json({ limit: "50mb" }));
//cookie parser
app.use(cookieParser()); 

// cors -> cross origin resource sharing
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
//api routes
app.use("/api/v1", UserRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);



app.use(express.json());  

app.use(ErrorMiddleware);