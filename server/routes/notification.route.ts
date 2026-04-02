import express from "express";
const notificationRouter = express.Router();
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotifications, updateNotificationStatus } from "../controllers/notificaion.controller";
import { updateAccessToken } from "../controllers/user.contoller";
notificationRouter.get(
  "/get-all-notifications",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

notificationRouter.put(
  "/update-notification/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotificationStatus
);

export default notificationRouter;