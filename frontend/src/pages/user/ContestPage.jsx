import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Trophy, Wallet, Clock, Filter } from "lucide-react"; 
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ContestImg from "../../assets/ContestImg.jpg";
import { useContest } from "../../hooks/useContest";

export default function ContestPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();

  const { data: contestRes, isLoading } = useContest({
    search,
    sort,
    page,
    status: statusFilter,
  });

  const contests = contestRes?.data || [];
  const pagination = contestRes?.pagination;

  const getStatusInfo = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    if (contest.isBlocked)
      return { label: "BLOCKED", color: "bg-red-100 text-red-700", dot: "bg-red-500" };
    if (now < start)
      return { label: "UPCOMING", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" };
    if (now < end)
      return { label: "LIVE", color: "bg-green-100 text-green-700", dot: "bg-green-500 animate-pulse" };
    return { label: "COMPLETED", color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
  };

  return (
    <div className="min-h-screen  py-6 px-4 ">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Contests</h1>
            <p className="text-gray-500 text-sm mt-1">Join active challenges and win rewards</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-80">
                <SearchBar
                    value={search}
                    onChange={(val) => { setPage(1); setSearch(val); }}
                    placeholder="Search contests..."
                />
            </div>
            
            <div className="flex gap-2">
                <select
                    value={statusFilter}
                    onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
                    className="flex-1 md:w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="ALL">All Status</option>
                    <option value="LIVE">Live</option>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="COMPLETED">Completed</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => { setPage(1); setSort(e.target.value); }}
                    className="flex-1 md:w-44 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="feeLow">Fee: Low to High</option>
                    <option value="feeHigh">Fee: High to Low</option>
                </select>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 mt-4 font-medium">Loading contests...</p>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-xl font-bold text-gray-800">No contests found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {contests.map((contest) => {
              const status = getStatusInfo(contest);

              return (
                <div
                  key={contest._id}
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-black flex flex-col overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={contest.image || ContestImg}
                      alt={contest.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 border border-black"
                    />
                    <div className="absolute top-4 right-4">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${status.color}`}>
                            <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                            {status.label}
                        </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-1">
                      {contest.title}
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Wallet size={18} className="text-indigo-500" />
                                <span className="text-sm font-medium">Entry Fee</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">₹{contest.entryFee}</span>
                        </div>

                        <div className="flex items-start gap-3 px-1">
                            <Calendar size={18} className="text-gray-400 mt-0.5" />
                            <div className="text-xs text-gray-500 leading-relaxed">
                                <p className="font-semibold text-gray-700">Starts: {new Date(contest.startTime).toLocaleString()}</p>
                                <p>Ends: {new Date(contest.endTime).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                      {contest.hasJoined ? (
                        <button
                          onClick={() => navigate(`/user/contest/${contest._id}/leaderboard`)}
                          className="w-full py-3 rounded-2xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          View Ranking
                        </button>
                      ) : status.label === "LIVE" ? (
                        <button
                          onClick={() => navigate(`/user/contest/${contest._id}/intro`)}
                          className="w-full py-3 rounded-2xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 transition-all transform active:scale-95"
                        >
                          Register & Play Now
                        </button>
                      ) : status.label === "UPCOMING" ? (
                        <div className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
                          <Clock size={16} />
                          <span className="text-sm font-bold">Starts @ {new Date(contest.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate(`/user/contest/${contest._id}/leaderboard`)}
                          className="w-full py-3 rounded-2xl text-sm font-bold bg-gray-800 text-white hover:bg-gray-900 transition-all"
                        >
                          View Leaderboard
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination && (
          <div className="mt-12 flex justify-center">
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}