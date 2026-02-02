import cron from "node-cron";
import contestModel from "../models/contestModel.js";
import { completeContestAndRewardService } from "../services/contestService.js";

export const contestStatusCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    /* UPCOMING → LIVE */
    await contestModel.updateMany(
      {
        status: "UPCOMING",
        isBlocked: false,
        startTime: { $lte: now },
        endTime: { $gt: now },
      },
      { $set: { status: "LIVE" } }
    );

    /* LIVE → COMPLETED + REWARD */
    const contestsToComplete = await contestModel.find({
      status: "LIVE",
      isBlocked: false,
      endTime: { $lte: now },
    });

    for (const contest of contestsToComplete) {
      contest.status = "COMPLETED";
      await contest.save();

      // 🔥 THIS IS THE MISSING PIECE
      await completeContestAndRewardService(contest._id);

      console.log(
        `✅ Contest completed & rewarded: ${contest.title}`
      );
    }
  });
};
