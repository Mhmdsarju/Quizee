import contestModel from "../models/contestModel.js";
import contestParticipantsModel from "../models/contestParticipantsModel.js";
import walletModel from "../models/walletModel.js";
import { paginateAndSearch } from "../utils/paginateAndSearch.js";

export const createContestService = async (payload) => {
  const contest = await contestModel.create(payload);
  return await contest.populate("quiz", "title");
};
export const getAdminContestsService = async ({ search, page, limit }) => {
  const result = await paginateAndSearch({
    model: contestModel,
    search,
    searchFields: ["title"],
    page,
    limit,
    populate: { path: "quiz", select: "title" },
    sort: { createdAt: -1 },
  });

  const dataWithCount = await Promise.all(
    result.data.map(async (contest) => {
      const count = await contestParticipantsModel.countDocuments({
        contest: contest._id,
      });

      return {
        ...contest.toObject(),
        participantsCount: count,
      };
    })
  );

  return { ...result, data: dataWithCount };
};

export const getUserContestsService = async ({ search, page, limit }) => {
  return await paginateAndSearch({
    model: contestModel,
    search,
    searchFields: ["title"],
    page,
    limit,
    populate: { path: "quiz", select: "title duration" },
    filter: {
      isBlocked: false,
      status: { $in: ["UPCOMING", "LIVE"] },
    },
    sort: { startTime: 1 },
  });
};

export const joinContestService = async ({ contestId, userId }) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };
  if (contest.isBlocked) return { status: "BLOCKED" };

  const now = new Date();

  if (contest.startTime <= now)
    return { status: "CONTEST_STARTED" };

  const joined = await contestParticipantsModel.findOne({
    contest: contestId,
    user: userId,
  });
  if (joined) return { status: "ALREADY_JOINED" };

  const wallet = await walletModel.findOne({ user: userId });
  if (!wallet || wallet.balance < contest.entryFee)
    return { status: "INSUFFICIENT_BALANCE" };

  wallet.balance -= contest.entryFee;
  await wallet.save();

  await contestParticipantsModel.create({
    contest: contestId,
    quiz: contest.quiz,
    user: userId,
  });

  return { status: "SUCCESS" };
};


export const toggleContestBlockService = async (contestId) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };

  if (contest.status === "COMPLETED")
    return { status: "COMPLETED" };

  let refundedUsers = 0;

  if (!contest.isBlocked) {
    const participants = await contestParticipantsModel.find({
      contest: contestId,
    });

    for (const p of participants) {
      const wallet = await walletModel.findOne({ user: p.user });
      if (wallet) {
        wallet.balance += contest.entryFee;
        await wallet.save();
        refundedUsers++;
      }
    }
  }

  contest.isBlocked = !contest.isBlocked;
  await contest.save();

  const populatedContest = await contest.populate("quiz", "title");

  return {
    status: "SUCCESS",
    isBlocked: populatedContest.isBlocked, 
    refundedUsers,
    contest: populatedContest,
  };
};

export const editContestService = async (contestId, payload) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };

  const now = new Date();

  if (contest.isBlocked || contest.startTime <= now)
    return { status: "EDIT_NOT_ALLOWED" };

  const allowed = ["title", "rules", "startTime", "endTime"];
  allowed.forEach(
    (f) => payload[f] !== undefined && (contest[f] = payload[f])
  );

  await contest.save();

  const populatedContest = await contest.populate("quiz", "title");
  return { status: "SUCCESS", contest: populatedContest };
};


export const endContestService = async (contestId) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };
  if (contest.status !== "LIVE") return { status: "NOT_LIVE" };

  contest.status = "COMPLETED";
  await contest.save();

  return { status: "SUCCESS" };
};
