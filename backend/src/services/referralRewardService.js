import UserModel from "../models/userModel.js";
import walletModel from "../models/walletModel.js";
import walletTransactionModel from "../models/walletTransaction.js";
import notificationModel from "../models/notificationModel.js";

export const processReferralReward = async ({
  winnerUserId,
  contest,
  rank,
}) => {
  
  if (rank > 3) return;


  if (contest.entryFee <= 0) return;

  const winner = await UserModel.findById(winnerUserId);
  if (!winner) return;

  // must be referred
  if (!winner.referredBy) return;

  // one time only
  if (winner.referralRewardGiven) return;

  const REFERRAL_REWARD_AMOUNT = 50;

  // credit referrer's wallet
  const wallet = await walletModel.findOneAndUpdate(
    { user: winner.referredBy },
    { $inc: { balance: REFERRAL_REWARD_AMOUNT } },
    { new: true }
  );

  await walletTransactionModel.create({
    user: winner.referredBy,
    type: "credit",
    amount: REFERRAL_REWARD_AMOUNT,
    reason: "referral_reward",
    reference: `referral_${contest._id}`,
    balanceAfter: wallet.balance,
  });

  // mark as rewarded
  winner.referralRewardGiven = true;
  await winner.save();

  // notify referrer
  await notificationModel.create({
    userId: winner.referredBy,
    title: "🎉 Referral Reward Earned",
    message: `Your referral won Top ${rank} in ${contest.title}. You earned ₹${REFERRAL_REWARD_AMOUNT}`,
    contestId: contest._id,
  });
};
