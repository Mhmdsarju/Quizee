import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ContestImg from "../../assets/quiz.jpg";
import { useContest } from "../../hooks/useContest";
import api from "../../api/axios";

export default function ContestPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const { data: contestRes, isLoading } = useContest({search,sort,page,});

  const contests = contestRes?.data || [];
  const pagination = contestRes?.pagination;

  const handleJoin = async (contest) => {
  const res = await Swal.fire({
    title: "Register & Play?",
    text: `₹${contest.entryFee} will be deducted from your wallet`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Pay & Play",
  });

  if (!res.isConfirmed) return;

  try {
    const { data } = await api.post(
      `/user/contest/${contest._id}/join`
    );

    Swal.fire({
      title: "Success",
      text: data.message,
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate(`/user/contest/${data.contestId}/intro`);
  } catch (err) {
    const message = err.response?.data?.message || "";

    if (message.toLowerCase().includes("insufficient")) {
      const res = await Swal.fire({
        title: "Insufficient Wallet Balance",
        text: "Add money to continue",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Add Funds",
      });

      if (res.isConfirmed) {
        navigate("/user/wallet", {
          state: { from: "contest" },
        });
      }
    } else {
      Swal.fire(
        "Oops",
        message || "Unable to join contest",
        "error"
      );
    }
  }
};


  const getStatusInfo = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    if (contest.isBlocked)
      return { label: "BLOCKED", color: "bg-red-100 text-red-700" };
    if (now < start)
      return { label: "UPCOMING", color: "bg-blue-100 text-blue-700" };
    if (now < end)
      return { label: "LIVE", color: "bg-green-100 text-green-700" };
    return { label: "COMPLETED", color: "bg-gray-200 text-gray-700" };
  };

  return (
    <div className="min-h-screen py-6 px-4 container m-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Contests
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-end">
          <SearchBar
            value={search}
            onChange={(val) => {
              setPage(1);
              setSearch(val);
            }}
            placeholder="Search contests..."
          />

          <select value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="feeLow">Entry Fee: Low → High</option>
            <option value="feeHigh">Entry Fee: High → Low</option>
          </select>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400 mt-20">
            Loading contests...
          </p>
        ) : contests.length === 0 ? (
          <p className="text-center text-red-600 mt-20">
            No contests found !!!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
              const status = getStatusInfo(contest);

              return (
                <div
                  key={contest._id}
                  className="bg-slate-400 rounded-2xl shadow-sm border hover:shadow-md transition flex flex-col overflow-hidden text-white border-black"
                >
                  <img
                    src={contest.image || ContestImg}
                    alt={contest.title}
                    className="h-40 w-full object-cover hover:scale-105 transition-transform duration-300 border-b border-black"
                  />

                  <div className="p-3 border-b">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-black">
                        {contest.title}
                      </h3>

                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex-1 text-sm  space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Entry Fee :</span>
                      <span className="font-semibold  text-black">
                        ₹{contest.entryFee}
                      </span>
                    </div>

                    <div className="text-xs ">
                      {new Date(contest.startTime).toLocaleString()} –{" "}
                      {new Date(contest.endTime).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 border-t">
                    {contest.hasJoined ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/user/contest/${contest._id}/leaderboard`
                          )
                        }
                        className="w-full py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        View Result
                      </button>
                    ) : status.label === "LIVE" ? (
                      <button
                        onClick={() => handleJoin(contest)}
                        className="w-full py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                      >
                        Register & Play
                      </button>
                    ) : status.label === "UPCOMING" ? (
                      <p className="text-center text-sm text-gray-500">
                        Starts at{" "}
                        <span className="font-medium">
                          {new Date(
                            contest.startTime
                          ).toLocaleTimeString()}
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(
                            `/user/contest/${contest._id}/leaderboard`
                          )
                        }
                        className="w-full py-2 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-800"
                      >
                        View Leaderboard
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination && (
          <div className="mt-8">
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
