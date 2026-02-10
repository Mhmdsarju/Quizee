import asyncHandler from "express-async-handler";
import notificationModel from "../../models/notificationModel.js";
import AppError from "../../utils/AppError.js";
import { statusCode } from "../../constant/constants.js";

export const getUserNotificationHandler = asyncHandler(async (req, res) => {
  const notifications = await notificationModel
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(notifications);
});

export const UserNotificationMarkAsReadHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await notificationModel.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { isRead: true }
  );

  if (!updated) {
    throw new AppError(
      "Notification not found",
      statusCode.NOT_FOUND
    );
  }

  res.json({ success: true });
});

export const UserNotificationMarkAllAsReadHandler = asyncHandler(async (req, res) => {
  await notificationModel.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true }
  );

  res.json({ success: true });
});
