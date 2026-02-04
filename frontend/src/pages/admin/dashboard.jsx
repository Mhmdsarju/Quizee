import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, BookOpen, Trophy, Activity } from "lucide-react"; 
import {PieChart,Pie, Cell,Tooltip,ResponsiveContainer,} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"]; 

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return <p className="p-6 text-red-500 font-medium">{error}</p>;

  const pieData = [
    { name: "Total Users", value: stats.totalUsers },
    { name: "Active Quizzes", value: stats.activeQuizzes },
    { name: "Active Contests", value: stats.activeContests },
  ];

  return (
    <div className="p-8 min-h-screen space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users size={24} />} 
          color="bg-indigo-50 text-indigo-600" 
        />
        <StatCard 
          title="Active Quizzes" 
          value={stats.activeQuizzes} 
          icon={<BookOpen size={24} />} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          title="Active Contests" 
          value={stats.activeContests} 
          icon={<Trophy size={24} />} 
          color="bg-amber-50 text-amber-600" 
        />
      </div>
      <div className="bg-blue-quiz shadow-sm border border-gray-100 p-8 rounded-2xl text-white">
        <div className="flex items-center gap-2 mb-8">
          <Activity className="text-indigo-600" size={20} />
          <h3 className="font-bold  text-lg">Platform Distribution</h3>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around">
          <div className="w-full md:w-1/2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>


          <div className="grid grid-cols-1 gap-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between gap-12 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className=" font-medium">{item.name} :</span>
                </div>
                <span className="font-bold ">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-blue-quiz text-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className=" font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}