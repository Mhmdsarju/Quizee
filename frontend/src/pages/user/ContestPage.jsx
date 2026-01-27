import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";

export default function ContestPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, [search, sort, page]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/user/contest", {
        params: { search, sort, page },
      });
      setContests(data.data);
      setPagination(data.pagination);
    } catch {
      Swal.fire("Error", "Unable to load contests", "error");
    } finally {
      setLoading(false);
    }
  };

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

      navigate(
        `/user/quiz/${data.quizId}/play?contest=${data.contestId}`
      );
    } catch (err) {
      const message = err.response?.data?.message || "";

      if (
        message.toLowerCase().includes("insufficient") ||
        err.response?.data?.code === "INSUFFICIENT_BALANCE"
      ) {
        const res = await Swal.fire({
          title: "Insufficient Wallet Balance",
          text: "Add money to continue",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Add Funds",
        });

        if (res.isConfirmed) {
          navigate("/user/wallet", {
            state: {
              from: "contest",
              contestId: contest._id,
            },
          });
        }
      } else {
        Swal.fire("Oops", message || "Unable to join contest", "error");
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
  <div className="min-h-screen  py-6 px-4">
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

        <select
          value={sort}
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
      {loading ? (
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
                className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition flex flex-col"
              >
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                      {contest.title}
                    </h3>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Quiz: {contest.quiz?.title || "—"}
                  </p>
                </div>
                <div className="p-4 flex-1 space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Entry Fee</span>
                    <span className="font-semibold">
                      ₹{contest.entryFee}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400">
                    {new Date(contest.startTime).toLocaleString()} –{" "}
                    {new Date(contest.endTime).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border-t">
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
