import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Pagination from "../../components/Pagination";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Search, 
  Calendar, 
  User as UserIcon, 
  ArrowRightLeft,
  Filter,
  RefreshCw
} from "lucide-react";

export default function TransactionManagement() {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadSummary = async () => {
    try {
      const res = await api.get("/admin/reports/summary");
      setSummary(res.data);
    } catch {
      setError("Failed to load summary stats");
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reports/transactions", {
        params: { page, limit: 10 },
      });
      setTransactions(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getReasonBadge = (reason) => {
    const styles = {
      add_money: "bg-green-100 text-green-700 border-green-200",
      contest_fee: "bg-blue-100 text-blue-700 border-blue-200",
      reward: "bg-purple-100 text-purple-700 border-purple-200",
      refund: "bg-pink-100 text-pink-700 border-pink-200",
    };
    return styles[reason] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
              <ArrowRightLeft className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Wallet Transactions</h1>
              <p className="text-slate-500 text-sm">Monitor all platform financial movements</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            title="Total Income" 
            value={summary.totalIncome} 
            icon={<ArrowUpCircle />} 
            color="emerald" 
          />
          <StatCard 
            title="Total Expense" 
            value={summary.totalExpense} 
            icon={<ArrowDownCircle />} 
            color="rose" 
          />
          <StatCard 
            title="Net Profit" 
            value={summary.netProfit} 
            icon={<Wallet />} 
            color="indigo" 
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          
          <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <h2 className="text-lg font-bold text-slate-800">Transaction History</h2>
            
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <RefreshCw className="animate-spin" size={32} />
              <p className="font-medium">Fetching transactions...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center text-rose-500 font-medium">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="p-20 text-center text-slate-400 font-medium">No transactions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">UserId</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => {
                    const shortUserId = t.user?._id ? t.user._id.slice(-6).toUpperCase() : "N/A";
                    const isIncome = t.type === "income";

                    return (
                      <tr key={t._id} className="group hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">
                              {new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar size={10} /> {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            
                            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-100/50">
                              #{shortUserId}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${getReasonBadge(t.reason)}`}>
                            {t.reason.replace("_", " ")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`text-base font-black ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                              {isIncome ? "+" : "-"} ₹{t.amount.toLocaleString()}
                            </span>
                            
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-5 border-t border-slate-50 bg-slate-50/30">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


const StatCard = ({ title, value, icon, color }) => {
  const themes = {
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-100",
    rose: "from-rose-500 to-red-600 shadow-rose-100",
    indigo: "from-indigo-500 to-blue-600 shadow-indigo-100",
  };

  return (
    <div className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br ${themes[color]} text-white shadow-xl transition-transform hover:scale-[1.02] duration-300`}>
      <div className="relative z-10 flex flex-col gap-1">
        <div className="bg-white/20 w-10 h-10 flex items-center justify-center rounded-xl mb-2 backdrop-blur-md">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h2 className="text-3xl font-black italic tracking-tight">₹ {(value || 0).toLocaleString()}</h2>
      </div>
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
};