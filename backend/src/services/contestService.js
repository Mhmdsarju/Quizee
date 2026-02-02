import contestModel from "../models/contestModel.js";
import contestParticipantsModel from "../models/contestParticipantsModel.js";
import contestResultModel from "../models/contestResultModel.js";
import questionModel from "../models/questionModel.js";
import walletModel from "../models/walletModel.js";
import walletTransactionModel from "../models/walletTransaction.js";
import { paginateAndSearch } from "../utils/paginateAndSearch.js";
import UserModel from "../models/userModel.js"
import notificationModel from '../models/notificationModel.js'
import { getIo } from "../config/socket.js";

export const createContestService = async (payload) => {
  const users = await UserModel.find({}, "_id");

  const contestExists = await contestModel.exists({
    title: new RegExp(`^${payload.title.trim()}$`, "i"),
  });

  if (contestExists) {
    throw new Error("Contest with this name already exists");
  }

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

  const notifications = users.map(user => ({
    userId: user._id,
    title: "New Contest !!!",
    message: `${contest.title}  is avaliable on Quizeee... please checkout!!!`,
    contestId: contest._id,
  }))

  await notificationModel.insertMany(notifications);

  getIo().emit("new_notification", {
    _id: "temp-" + Date.now(),
    title: "New Contest !!!",
    message: `${contest.title}  is avaliable on Quizeee... please checkout!!!`,
    contestId: contest._id,
    isRead: false,
    createdAt: new Date(),
  })


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

export const getUserContestsService = async ({ search, page, limit, userId, sort = "newest" }) => {
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
  answers,
  timeTaken,
}) => {
  try {
    const contest = await contestModel.findById(contestId);

    if (!contest) {
      return { status: "CONTEST_NOT_FOUND" };
    }

    if (contest.status === "COMPLETED") {
      return { status: "CONTEST_COMPLETED" };
    }
    const questions = contest.questionsSnapshot;

    if (!Array.isArray(questions) || questions.length === 0) {
      return { status: "NO_QUESTIONS" };
    }

    if (!Array.isArray(answers) || answers.length !== questions.length) {
      return { status: "INVALID_ANSWERS" };
    }

    const already = await contestResultModel.findOne({
      contestId,
      userId,
    });

    if (already) {
      return { status: "ALREADY_SUBMITTED" };
    }

    let score = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    const result = await contestResultModel.create({
      contestId,
      quizId: contest.quiz,
      contestTitle: contest.title,
      userId,
      score,
      total,
      percentage,
      timeTaken,
    });

    return { status: "SUCCESS", result };
  } catch (err) {
    if (err.code === 11000) {
      return { status: "ALREADY_SUBMITTED" };
    }
    throw err;
  }
};



export const getContestLeaderboardService = async ({ contestId }) => {
  return await contestResultModel
    .find({ contestId })
    .populate("userId", "name")
    .sort({ rank: 1 });
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


export const completeContestAndRewardService = async (contestId) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };
  if (contest.status !== "COMPLETED")
    return { status: "NOT_COMPLETED" };

  // already rewarded check (idempotent)
  const alreadyRanked = await contestResultModel.findOne({
    contestId,
    rank: { $exists: true },
  });
  if (alreadyRanked) return { status: "ALREADY_PROCESSED" };

  // 1️⃣ fetch all results
  const results = await contestResultModel
    .find({ contestId })
    .sort({ score: -1, timeTaken: 1, createdAt: 1 });

  if (!results.length) return { status: "NO_PARTICIPANTS" };

  // 2️⃣ Rank assign
  let rank = 1;
  for (const r of results) {
    r.rank = rank++;
    await r.save();
  }

  // 3️⃣ Reward config
  const CASH_REWARDS = {
    1: 100,
    2: 50,
    3: 25,
  };

  // 4️⃣ Top 3 reward credit
  for (const r of results.slice(0, 3)) {
    const amount = CASH_REWARDS[r.rank];
    if (!amount) continue;

    const wallet = await walletModel.findOneAndUpdate(
      { user: r.userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );

    await walletTransactionModel.create({
      user: r.userId,
      type: "credit",
      amount,
      reason: "contest_reward",
      reference: contestId.toString(),
      balanceAfter: wallet.balance,
    });

    r.rewardAmount = amount;
    r.rewardCredited = true;
    r.certificateIssued = true;
    await r.save();

    // 🔔 optional notification
    await notificationModel.create({
      userId: r.userId,
      title: "🎉 Contest Reward Credited",
      message: `You won ₹${amount} in ${contest.title}`,
      contestId,
    });
  }

  return { status: "SUCCESS" };
};
