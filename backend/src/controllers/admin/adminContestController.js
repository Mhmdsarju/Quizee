import asyncHandler from "express-async-handler";
import {createContestService,getAdminContestsService,editContestService,toggleContestBlockService,endContestService,completeContestAndRewardService,} from "../../services/contestService.js";
import cloudinary from "../../config/cloudinary.js";
import { statusCode } from "../../constant/constants.js";
import AppError from "../../utils/AppError.js";

export const createContestHandler = asyncHandler(async (req, res) => {
  let imageUrl = null;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "quiz-app/contests",
    });
    imageUrl = result.secure_url;
  }

  const contest = await createContestService({
    ...req.body,
    image: imageUrl,
  });

  res.status(statusCode.CREATED).json(contest);
});

export const getAdminContestsHandler = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const result = await getAdminContestsService({
    search,
    page: Number(page),
    limit: Number(limit),
  });

  res.json(result);
});

export const editContestHandler = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "quiz-app/contests",
    });
    payload.image = result.secure_url;
  }

  const result = await editContestService(req.params.id, payload);

  if (result.status === "NOT_FOUND") {
    throw new AppError("Contest not found", statusCode.NOT_FOUND);
  }

  if (result.status === "EDIT_NOT_ALLOWED") {
    throw new AppError("Edit not allowed", statusCode.BAD_REQUEST);
  }

  res.json({
    message: "Contest updated",
    contest: result.contest,
  });
});

export const toggleBlockContestHandler = asyncHandler(async (req, res) => {
  const result = await toggleContestBlockService(req.params.id);

  if (result.status === "NOT_FOUND") {
    throw new AppError("Contest not found", statusCode.NOT_FOUND);
  }

  if (result.status === "COMPLETED") {
    throw new AppError(
      "Completed contest cannot be blocked",
      statusCode.BAD_REQUEST
    );
  }

  res.json({
    message: result.isBlocked ? "Contest blocked" : "Contest unblocked",
    refundedUsers: result.refundedUsers,
    contest: result.contest,
  });
});

export const endContestHandler = asyncHandler(async (req, res) => {
  const result = await endContestService(req.params.id);

  if (result.status === "NOT_FOUND") {
    throw new AppError("Contest not found", statusCode.NOT_FOUND);
  }

  if (result.status === "NOT_LIVE") {
    throw new AppError("Contest not live", statusCode.BAD_REQUEST);
  }

  res.json({
    message: "Contest ended",
    prizePool: result.prizePool,
    totalParticipants: result.totalParticipants,
  });
});

export const completeContestRewardHandler = asyncHandler(async (req, res) => {
  const result = await completeContestAndRewardService(req.params.id);
  res.json(result);
});
