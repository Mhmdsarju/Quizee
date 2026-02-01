import cron from "node-cron";
import contestModel from "../models/contestModel.js";

export const contestStatusCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    /* UPCOMING to LIVE */
    await contestModel.updateMany(
      {
        status: "UPCOMING",
        isBlocked: false,
        startTime: { $lte: now },
        endTime: { $gt: now },
      },
      { $set: { status: "LIVE" } }
    );

    /* LIVE to COMPLETED */
    await contestModel.updateMany(
      {
        status: "LIVE",
        isBlocked: false,
        endTime: { $lte: now },
      },
      { $set: { status: "COMPLETED" } }
    );

    console.log("Contest status cron executed");
  });
};
