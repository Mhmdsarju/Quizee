import React, { useEffect, useState } from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,Legend,PieChart,Pie,Cell,} from "recharts";
import api from "../../api/axios";
import Pagination from "../../components/Pagination";

const PIE_COLORS = {
  add_money: "#22c55e",
  contest_fee: "#3b82f6",
  referral_reward: "#8b5cf6",
  reward: "#f97316",
  contest_reward: "#ef4444",
  refund: "#ec4899",
  admin_adjustment: "#64748b",
};

export default function TransactionManagement() {
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [view, setView] = useState("monthly");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadSummaryAndPie();
  }, []);

  useEffect(() => {
    loadChartData();
  }, [view]);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadSummaryAndPie = async () => {
    const [summaryRes, reasonRes] = await Promise.all([
      api.get("/admin/reports/summary"),
      api.get("/admin/reports/reason-wise"),
    ]);
    setSummary(summaryRes.data);
    setReasons(reasonRes.data);
  };

  const loadChartData = async () => {
    const url =
      view === "monthly"
        ? "/admin/reports/monthly"
        : "/admin/reports/daily";

    const res = await api.get(url);

    setChartData(
      res.data.map((d) => ({
        label:
          view === "monthly"
            ? `${d._id.month}/${d._id.year}`
            : d._id,
        income: d.income,
        expense: d.expense,
      }))
    );
  };

  const loadTransactions = async () => {
    const res = await api.get("/admin/reports/transactions", {
      params: { page, limit: 10 },
    });
    setTransactions(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
  };

  const downloadPDF = () => {
    const baseUrl = import.meta.env.VITE_API_URL;

    const url =
      view === "monthly"
        ? `${baseUrl}/api/admin/reports/pdf/monthly`
        : `${baseUrl}/api/admin/reports/pdf/daily`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  p-6 space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Wallet Transaction Management
        </h1>

        <div className="flex gap-3">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-3 py-2 rounded-lg border shadow-sm text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>

          <button
            onClick={downloadPDF}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
          >
            Download {view === "monthly" ? "Monthly" : "Daily"} PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Total Income" value={summary.totalIncome} type="income" />
        <StatCard title="Total Expense" value={summary.totalExpense} type="expense" />
        <StatCard title="Net Profit" value={summary.netProfit} type="profit" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <Card title={`${view === "monthly" ? "Monthly" : "Daily"} Income vs Expense`}>
          <BarChart width={520} height={300} data={chartData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(v) => `₹ ${v}`} />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </Card>

        <Card title="Reason Wise Breakdown">
          <PieChart width={420} height={300}>
            <Pie
              data={reasons}
              dataKey="totalAmount"
              nameKey="_id"
              outerRadius={115}
              label
            >
              {reasons.map((r, i) => (
                <Cell key={i} fill={PIE_COLORS[r._id] || "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₹ ${v}`} />
            <Legend />
          </PieChart>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-gray-700">
            Wallet Transactions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-600 text-white sticky top-0 ">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">User</th>
                <th className="p-3">Type</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="text-center hover:bg-slate-50 transition border">
                  <td className="p-2">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 font-medium">{t.user?.name || "-"}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.type === "credit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="p-2 capitalize">{t.reason}</td>
                  <td className="p-2 font-semibold">₹ {t.amount}</td>
                  <td className="p-2">₹ {t.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}


const Card = ({ title, children }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg">
    <h2 className="font-semibold mb-4 text-gray-700">{title}</h2>
    {children}
  </div>
);

const StatCard = ({ title, value, type }) => {
  const colorMap = {
    income: "from-green-500 to-emerald-600",
    expense: "from-red-500 to-rose-600",
    profit: "from-indigo-500 to-purple-600",
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${colorMap[type]} text-white`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-1">₹ {value}</h2>
    </div>
  );
};
