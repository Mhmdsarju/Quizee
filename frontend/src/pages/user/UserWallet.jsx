import { useEffect, useState } from "react";
import AddMoneyModal from "./AddMoneyModal";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { getWalletBalance, getWalletTransactions } from "../../api/walletApi";

export default function UserWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchWallet = async () => {
    const res =  await getWalletBalance();
    setBalance(res.data.balance);
  };

  const fetchTransactions = async () => {
    const res = await getWalletTransactions({page,limit: 5,});
    setTransactions(res.data.data);
    setPagination(res.data.pagination);
  };

  const handleAddFundsSuccess = async () => {
    await fetchWallet();
    await fetchTransactions();
    setOpen(false);

    if (location.state?.from === "contest") {
      navigate("/user/contest", { replace: true });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Wallet
            </h1>
            <p className="text-sm text-gray-500">
              Manage your wallet balance
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            + Add Funds
          </button>
        </div>

        <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow">
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

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Transaction History
          </h3>

          {transactions.length === 0 ? (
            <p className="text-sm text-gray-400">
              No transactions yet
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex justify-between items-center border rounded-xl p-4"
                  >
                    <div>
                      <p className="font-medium capitalize text-gray-800">
                        {transaction.reason}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toDateString()}
                      </p>
                    </div>

                    <span
                      className={`font-semibold ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₹
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>

              {pagination && (
                <div className="mt-6">
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {open && (
        <AddMoneyModal
          onClose={() => setOpen(false)}
          onSuccess={handleAddFundsSuccess}
        />
      )}
    </div>
  );
}
