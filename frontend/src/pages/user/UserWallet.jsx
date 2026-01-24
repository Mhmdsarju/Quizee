import { useEffect, useState } from "react";
import axios from "../../api/axios";
import AddMoneyModal from "./AddMoneyModal";
import { useSelector } from "react-redux";

export default function UserWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);

  const user=useSelector((state)=>state.auth.user);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = async () => {
    const res = await axios.get("/wallet");
    setBalance(res.data.balance);
  };

  const fetchTransactions = async () => {
    const res = await axios.get("/wallet/transactions");
    setTransactions(res.data);
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Wallet</h1>
            <p className="text-gray-600 text-sm">
              Manage your personal information and public profile.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            + Add Funds
          </button>
        </div>

        {/* WALLET CARD */}
        <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
          <p className="text-sm text-gray-300">TOTAL BALANCE</p>
          <h2 className="text-4xl font-bold mt-2">₹{balance}</h2>

          <div className="flex justify-between items-end mt-6 text-sm">
            <div>
              <p className="text-gray-400">ACCOUNT HOLDER</p>
              <p className="font-medium">{user?.name}</p>
            </div>

            <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs">
              Active
            </span>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-[#0f2a23] rounded-2xl p-6 text-white">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <span className="text-sm text-gray-300 cursor-pointer">
              View all
            </span>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 && (
              <p className="text-gray-400">No transactions yet</p>
            )}

            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="flex justify-between items-center bg-[#13352c] p-4 rounded-xl"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600/20">
                    💰
                  </div>

                  <div>
                    <p className="font-medium capitalize">{tx.reason}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`font-semibold ${
                    tx.type === "credit"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {open && <AddMoneyModal onClose={() => setOpen(false)} />}
    </div>
  );
}
