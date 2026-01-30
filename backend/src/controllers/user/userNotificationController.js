import notificationModel from "../../models/notificationModel.js";

export const getUserNotificationHandler = async (req, res) => {
  const notifications = await notificationModel.find({
    userId: req.user.id
  }).sort({ createdAt: -1 });

  res.json(notifications);
}

export const UserNotificationMarkAsReadHandler = async (req, res) => {
  const { id } = req.params;

  await notificationModel.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { isRead: true }
  );

  res.json({ success: true });
};

export const UserNotificationMarkAllAsReadHandler = async (req, res) => {
  await notificationModel.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true }
  );

  res.json({ success: true });
};