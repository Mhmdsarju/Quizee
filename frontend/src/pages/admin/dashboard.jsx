import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { Users, Gamepad2, Trophy, TrendingUp, TrendingDown, Wallet, Download, Calendar, Filter } from "lucide-react";
import {
  fetchDashboardStats, fetchSummaryReport, fetchReasonWiseReport, fetchMonthlyReport, fetchDailyReport,
  fetchCustomReport,
} from "../../api/adminReportApi";


const DASH_COLORS = ["#6366F1", "#10B981", "#F59E0B"];
const PIE_COLORS = {
  add_money: "#22c55e",
  contest_fee: "#3b82f6",
  referral_reward: "#8b5cf6",
  reward: "#f97316",
  contest_reward: "#ef4444",
  refund: "#ec4899",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [view, setView] = useState("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedRange, setAppliedRange] = useState(null);

  useEffect(() => {
  loadDashboardStats();
  loadSummaryAndPie();
  loadChartData(); 
}, []);


  useEffect(() => {
    if (view !== "custom") {
      setAppliedRange(null);
      loadChartData();
      loadSummaryAndPie();
    }
  }, [view]);

  useEffect(() => {
    if (view === "custom" && appliedRange) {
      loadChartData();
      loadSummaryAndPie(appliedRange);
    }
  }, [appliedRange]);

  const loadDashboardStats = async () => {
    try {
      const res = await fetchDashboardStats();
      setStats(res.data);
    } catch {
      setError("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const loadSummaryAndPie = async (range = null) => {
    try {
      const query = range ? `?from=${range.from}&to=${range.to}` : "";
      const [summaryRes, reasonRes] = await Promise.all([
        fetchSummaryReport(query),
        fetchReasonWiseReport(query),
      ]);
      setSummary(summaryRes.data);
      setReasons(reasonRes.data);
    } catch (err) {
      console.error("Error loading reports", err);
    }
  };

  const loadChartData = async () => {
    try {
      let res;

      if (view === "monthly") res = await fetchMonthlyReport();
      else if (view === "daily") res = await fetchDailyReport();
      else if (view === "custom" && appliedRange)
        res = await fetchCustomReport(appliedRange.from, appliedRange.to);

      if (!res) return; 

      setChartData(
        res.data.map((d) => ({
          label:
            typeof d._id === "string"
              ? d._id
              : `${d._id.month}/${d._id.year}`,
          income: d.income,
          expense: d.expense,
        }))
      );
    } catch (err) {
      console.error("Error loading chart data", err);
    }
  };


  const applyCustomRange = () => {
    if (fromDate && toDate) setAppliedRange({ from: fromDate, to: toDate });
  };

  const downloadPDF = () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    let url = "";
    if (view === "monthly") url = `${baseUrl}/api/admin/reports/pdf/monthly`;
    if (view === "daily") url = `${baseUrl}/api/admin/reports/pdf/daily`;
    if (view === "custom" && appliedRange)
      url = `${baseUrl}/api/admin/reports/pdf/custom?from=${appliedRange.from}&to=${appliedRange.to}`;
    if (url) window.open(url, "_blank");
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <p className="text-slate-500 font-medium animate-pulse">Loading amazing insights...</p>
    </div>
  );

  if (error) return <div className="p-6 text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">{error}</div>;

  const pieData = [
    { name: "Total Users", value: stats?.totalUsers || 0 },
    { name: "Active Quizzes", value: stats?.activeQuizzes || 0 },
    { name: "Active Contests", value: stats?.activeContests || 0 },
  ];

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} icon={<Users />} color="bg-indigo-600" />
          <StatCard title="Active Quizzes" value={stats.activeQuizzes} icon={<Gamepad2 />} color="bg-emerald-600" />
          <StatCard title="Active Contests" value={stats.activeContests} icon={<Trophy />} color="bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card title="Platform Overview" subtitle="User & Content distribution">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={DASH_COLORS[i]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DASH_COLORS[i] }} />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Wallet size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Financial Reports</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <select
                      value={view}
                      onChange={(e) => setView(e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 pl-4 pr-10 py-2 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="monthly">Monthly View</option>
                      <option value="daily">Daily View</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    <Filter className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                  </div>

                  <button
                    onClick={downloadPDF}
                    disabled={view === "custom" && !appliedRange}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-slate-800 disabled:opacity-40 transition-all shadow-md active:scale-95"
                  >
                    <Download size={16} /> PDF
                  </button>
                </div>
              </div>

              {view === "custom" && (
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} />
                    <input type="date" className="bg-transparent outline-none font-medium" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  </div>
                  <span className="text-slate-300">to</span>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} />
                    <input type="date" className="bg-transparent outline-none font-medium" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                  </div>
                  <button onClick={applyCustomRange} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 ml-auto">
                    Apply Filter
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <GradientStat title="Total Income" value={summary.totalIncome} type="up" color="green" />
                <GradientStat title="Total Expense" value={summary.totalExpense} type="down" color="red" />
                <GradientStat title="Net Profit" value={summary.netProfit} type="profit" color="indigo" />
              </div>

              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} name="Income" />
                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <Card title="Transaction Breakdown" subtitle="Categorized spending and earnings">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reasons} dataKey="totalAmount" nameKey="_id" outerRadius={120} labelLine={false} stroke="none">
                    {reasons.map((r, i) => (
                      <Cell key={i} fill={PIE_COLORS[r._id] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `₹ ${v.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasons.map((r, i) => (
                <div key={i} className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[r._id] || "#94a3b8" }} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{r._id.replace('_', ' ')}</span>
                  </div>
                  <span className="text-xl font-bold text-slate-800">₹ {r.totalAmount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


const Card = ({ title, subtitle, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
    <div className="relative z-10">
      <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
        {icon}
      </div>
      <p className="text-white/80 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h2 className="text-4xl font-black mt-1">{(value || 0).toLocaleString()}</h2>
    </div>

    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
  </div>
);

const GradientStat = ({ title, value, type }) => {
  const isUp = type === "up" || type === "profit";
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className={`p-1.5 rounded-lg ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {type === "up" && <TrendingUp size={14} />}
          {type === "down" && <TrendingDown size={14} />}
          {type === "profit" && <TrendingUp size={14} />}
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-800">
        ₹ {(value || 0).toLocaleString()}
      </h3>
    </div>
  );
};