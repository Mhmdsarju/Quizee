import userModel from "../../models/userModel.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";


export const getAllUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const result = await paginateAndSearch({
      model: userModel,
      search,
      searchFields: ["name", "email"],
      page: Number(page),
      limit: Number(limit),
      select: "-password",
    });
    res.json(result);
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const blockUser = async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = !user.isBlocked;
  if(user.isBlocked){
     user.refreshTokenVersion+=1;
  }
  await user.save();

  res.json({
    message: user.isBlocked ? "User blocked" : "User unblocked",
    isBlocked: user.isBlocked
  });
};

