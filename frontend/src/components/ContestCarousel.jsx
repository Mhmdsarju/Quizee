import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ContestImg from "../assets/ContestImg.jpg";
import { useContest } from "../hooks/useContest";
import api from "../api/axios";

const ContestCarousel = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useContest({
    search: "",
    sort: "latest",
    page: 1,
  });

  if (isLoading) {
    return (
      <p className="text-center py-6 text-gray-500">
        Loading contests...
      </p>
    );
  }

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
      Swal.fire("Oops", message || "Unable to join contest", "error");
    }
  };

  return (
    <div className="px-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
        {data?.data?.map((contest) => {
          const status = getStatusInfo(contest);

          return (
            <div
              key={contest._id}
              className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 border border-black"
            >
              <div className="h-40 overflow-hidden relative border border-black">
                <img
                  src={contest.image || ContestImg}
                  alt={contest.title}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />

                <span
                  className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}
                >
                  {status.label}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                 <span className="text-xs text-gray-500">ContestName :</span>  {contest.title}
                </h4>

                <p className="text-xs text-gray-500">
                  Entry Fee: ₹{contest.entryFee}
                </p>

                {contest.hasJoined ? (
                  <button onClick={() => navigate( `/user/contest/${contest._id}/leaderboard`)}
                    className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    View Result
                  </button>
                ) : status.label === "LIVE" ? (
                  <button
                    onClick={() => handleJoin(contest)}
                    className="mt-auto bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    Register & Play
                  </button>
                ) : (
                  <button onClick={() => navigate( `/user/contest/${contest._id}/leaderboard`)}
                    className="mt-auto bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContestCarousel;
