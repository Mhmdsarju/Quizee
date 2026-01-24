import contestModel from "../models/contestModel";
import contestParticipantsModel from "../models/contestParticipantsModel";
import walletModel from "../models/walletModel";

export const createContest = async (payload) => {
  return await contestModel.create(payload);
};

export const listAdminContests = async () => {
  return await contestModel.find().populate("quiz");
};
export const listUserContests = async () => {
  return await contestModel.find({ status: { $ne: "COMPLETED" } }).populate("quiz");
};
export const joinContest = async ({ contestId, userId }) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };

  if (contest.status !== "UPCOMING") return { status: "CONTEST_STARTED" };

  const alreadyJoined = await contestParticipantsModel.findOne({
    contest: contestId,
    user: userId,
  });
  if (alreadyJoined) return { status: "ALREADY_JOINED" };

  const wallet = await walletModel.findOne({ user: userId });
  if (!wallet || wallet.balance < contest.entryFee)
    return { status: "INSUFFICIENT_BALANCE" };

  // debit wallet
  wallet.balance -= contest.entryFee;
  await wallet.save();

  await contestParticipantsModel.create({
    contest: contestId,
    quiz: contest.quiz,
    user: userId,
  });

  return { status: "SUCCESS" };
};


export const blockContestService = async (contestId) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };

  if (contest.status === "COMPLETED")
    return { status: "ALREADY_COMPLETED" };

  // find joined users
  const participants = await contestParticipantsModel.find({ contest: contestId });

  // refund wallet
  for (const p of participants) {
    const wallet = await walletModel.findOne({ user: p.user });
    if (wallet) {
      wallet.balance += contest.entryFee;
      await wallet.save();
    }
  }

  contest.status = "BLOCKED";
  await contest.save();

  return { status: "SUCCESS", refundedUsers: participants.length };
};

export const editContestService = async (contestId, payload) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };

  if (contest.status !== "UPCOMING")
    return { status: "EDIT_NOT_ALLOWED" };

  // allowed fields only
  const allowedFields = ["title", "rules", "startTime", "endTime"];
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      contest[field] = payload[field];
    }
  });

  await contest.save();
  return { status: "SUCCESS", contest };
};

export const endContestService = async (contestId) => {
  const contest = await contestModel.findById(contestId);
  if (!contest) return { status: "NOT_FOUND" };

  if (contest.status !== "LIVE")
    return { status: "NOT_LIVE" };

  // get participants sorted by score (high → low)
  const participants = await contestParticipantsModel.find({
    contest: contestId,
  }).sort({ score: -1 });

  if (participants.length === 0) {
    contest.status = "COMPLETED";
    await contest.save();
    return { status: "NO_PARTICIPANTS" };
  }

  /* ===== SIMPLE PRIZE LOGIC (example) =====
     1st → 50%
     2nd → 30%
     3rd → 20%
  */
  const prizeMap = [0.5, 0.3, 0.2];
  const prizePool = contest.entryFee * participants.length;

  for (let i = 0; i < participants.length; i++) {
    const p = participants[i];
    p.rank = i + 1;

    if (i < prizeMap.length) {
      const prizeAmount = Math.floor(prizePool * prizeMap[i]);
      p.prize = prizeAmount;

      const wallet = await Wallet.findOne({ user: p.user });
      if (wallet) {
        wallet.balance += prizeAmount;
        await wallet.save();
      }
    } else {
      p.prize = 0;
    }

    await p.save();
  }

  contest.status = "COMPLETED";
  await contest.save();

  return {
    status: "SUCCESS",
    totalParticipants: participants.length,
    prizePool,
  };
};