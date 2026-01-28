import contestModel from "../models/contestModel.js";
import contestParticipantsModel from "../models/contestParticipantsModel.js";
import contestResultModel from "../models/contestResultModel.js";
import questionModel from "../models/questionModel.js";
import walletModel from "../models/walletModel.js";
import walletTransactionModel from "../models/walletTransaction.js";
import { paginateAndSearch } from "../utils/paginateAndSearch.js";

export const createContestService = async (payload) => {
  const questions = await questionModel.find({
    quizId: payload.quiz,
  }).select("question options correctAnswer");

  if (!questions.length) {
    throw new Error("Quiz has no questions");
  }

  const contest = await contestModel.create({
    ...payload,
    image: payload.image || null, 
    questionsSnapshot: questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    })),
  });

  return await contest.populate("quiz", "title timeLimit");
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

export const getUserContestsService = async ({
  search,
  page,
  limit,
  userId,
  sort = "newest",
}) => {
  let sortQuery = { createdAt: -1 };

  if (sort === "oldest") sortQuery = { createdAt: 1 };
  if (sort === "feeLow") sortQuery = { entryFee: 1 };
  if (sort === "feeHigh") sortQuery = { entryFee: -1 };

  const result = await paginateAndSearch({
    model: contestModel,
    search,
    searchFields: ["title"],
    page,
    limit,
    populate: { path: "quiz", select: "title timeLimit" },
    filter: {
      isBlocked: false,
      status: { $in: ["UPCOMING", "LIVE", "COMPLETED"] },
    },
    sort: sortQuery,
  });

  const contestIds = result.data.map((c) => c._id);

  const joined = await contestParticipantsModel.find({
    contest: { $in: contestIds },
    user: userId,
  });

  const joinedSet = new Set(joined.map((j) => j.contest.toString()));

  const dataWithJoinStatus = result.data.map((contest) => ({
    ...contest.toObject(),
    hasJoined: joinedSet.has(contest._id.toString()),
  }));

  return { ...result, data: dataWithJoinStatus };
};

export const joinContestService = async ({ contestId, userId }) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };
  if (contest.isBlocked) return { status: "BLOCKED" };

  const now = new Date();
  if (now < contest.startTime) return { status: "NOT_STARTED" };
  if (now >= contest.endTime) return { status: "COMPLETED" };

  const joined = await contestParticipantsModel.findOne({
    contest: contestId,
    user: userId,
  });

  if (joined) {
    return {
      status: "ALREADY_JOINED",
      contestId: contest._id,
      quizId: contest.quiz,
    };
  }

  const wallet = await walletModel.findOne({ user: userId });
  if (!wallet || wallet.balance < contest.entryFee)
    return { status: "INSUFFICIENT_BALANCE" };

  wallet.balance -= contest.entryFee;
  await wallet.save();

  await walletTransactionModel.create({
    user: userId,
    type: "debit",
    amount: contest.entryFee,
    reason: "contest_fee",
    reference: contestId.toString(),
    balanceAfter: wallet.balance,
  });

  await contestParticipantsModel.create({
    contest: contestId,
    quiz: contest.quiz,
    user: userId,
  });

  return {
    status: "SUCCESS",
    contestId: contest._id,
    quizId: contest.quiz,
  };
};
export const toggleContestBlockService = async (contestId) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };
  if (contest.status === "COMPLETED") return { status: "COMPLETED" };

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
        await walletTransactionModel.create({
          user: p.user,
          type: "credit",
          amount: contest.entryFee,
          reason: "refund",
          reference: contestId.toString(),
          balanceAfter: wallet.balance,
        });

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

  const allowed = [
    "title",
    "startTime",
    "endTime",
    "image",
  ];

  allowed.forEach((f) => {
    if (payload[f] !== undefined) contest[f] = payload[f];
  });

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
export const submitContestQuizService = async ({
  contestId,
  userId,
  score,
  total,
  percentage,
  timeTaken,
}) => {
  try {
    const contest = await contestModel.findById(contestId).select("quiz");
    if (!contest) return { status: "CONTEST_NOT_FOUND" };

    const result = await contestResultModel.create({
      contestId,
      quizId: contest.quiz,
      userId,
      score,
      total,
      percentage,
      timeTaken,
    });

    return { status: "SUCCESS", result };
  } catch (err) {
    if (err.code === 11000) return { status: "ALREADY_SUBMITTED" };
    throw err;
  }
};

export const getContestLeaderboardService = async ({ contestId }) => {
  return await contestResultModel
    .find({ contestId })
    .populate("userId", "name")
    .sort({ score: -1, timeTaken: 1, createdAt: 1 });
};

export const getUserContestHistoryService = async (userId) => {
  const history = await contestResultModel
    .find({ userId })
    .populate("contestId", "title")
    .populate("quizId", "title")
    .sort({ createdAt: -1 });

  return history.map((h) => ({
    _id: h._id,
    contest: h.contestId,
    quiz: h.quizId,
    score: h.score,
    total: h.total,
    percentage: h.percentage,
    rank: h.rank,
    playedAt: h.createdAt,
  }));
};

export const getContestQuizPlayService = async ({ contestId }) => {
  const contest = await contestModel
    .findById(contestId)
    .populate("quiz", "timeLimit title")
    .select("quiz questionsSnapshot startTime endTime isBlocked");

  if (!contest) return { status: "NOT_FOUND" };
  if (contest.isBlocked) return { status: "BLOCKED" };

  const now = new Date();
  if (now < contest.startTime) return { status: "NOT_STARTED" };
  if (now > contest.endTime) return { status: "ENDED" };
  if (!contest.questionsSnapshot?.length)
    return { status: "NO_QUESTIONS" };

  return {
    status: "SUCCESS",
    quiz: {
      title: contest.quiz.title,
      timeLimit: contest.quiz.timeLimit,
    },
    questions: contest.questionsSnapshot,
  };
};
