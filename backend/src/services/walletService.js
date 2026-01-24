import walletModel from "../models/walletModel.js";
import walletTransactionModel from "../models/walletTransaction.js";

export const getUserWallet = async (userId) => {
  const wallet = await walletModel.findOne({ user: userId });
  if (!wallet) throw new Error("Wallet not found");
  return wallet;
};
export const creditWallet = async ({
  userId,
  amount,
  reason,
  reference,
}) => {
  const amt = Number(amount);

  if (!amt || amt <= 0) {
    throw new Error("Invalid amount");
  }

  const wallet = await getUserWallet(userId);

  wallet.balance = Number(wallet.balance) + amt;
  await wallet.save();

  await walletTransactionModel.create({
    user: userId,
    type: "credit",
    amount: amt,           
    reason,
    reference,
    balanceAfter: wallet.balance,
  });

  return wallet.balance;
};

export const debitWallet = async ({
  userId,
  amount,
  reason,
  reference,
}) => {
  const amt = Number(amount);

  if (!amt || amt <= 0) {
    throw new Error("Invalid amount");
  }

  const wallet = await getUserWallet(userId);

  if (wallet.balance < amt) {
    throw new Error("Insufficient wallet balance");
  }

  wallet.balance = Number(wallet.balance) - amt;
  await wallet.save();

  await walletTransactionModel.create({
    user: userId,
    type: "debit",
    amount: amt,             
    reason,
    reference,
    balanceAfter: wallet.balance,
  });

  return wallet.balance;
};
