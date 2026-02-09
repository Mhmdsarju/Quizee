import { useNavigate } from "react-router-dom";
import ContestImg from "../assets/ContestImg.jpg";
import { useContest } from "../hooks/useContest";

const ContestCarousel = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useContest({ search: "",sort: "latest",page: 1});

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
                  <span className="text-xs text-gray-500">
                    ContestName :
                  </span>{" "}
                  {contest.title}
                </h4>

                <p className="text-xs text-gray-500">
                  Entry Fee: ₹{contest.entryFee}
                </p>

                {contest.hasJoined ? (
                  <button
                    onClick={() =>
                      navigate(
                        `/user/contest/${contest._id}/leaderboard`
                      )
                    }
                    className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    View Result
                  </button>
                ) : status.label === "LIVE" ? (
                  <button
                    onClick={() =>
                      navigate(
                        `/user/contest/${contest._id}/intro`
                      )
                    }
                    className="mt-auto bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    Register & Play
                  </button>
                ) : status.label === "UPCOMING" ? (
                  <button
                    disabled
                    className="mt-auto bg-gray-400 text-white text-sm font-medium py-2 rounded-lg cursor-not-allowed"
                  >
                    Not Started
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      navigate(
                        `/user/contest/${contest._id}/leaderboard`
                      )
                    }
                    className="mt-auto bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    View Leaderboard
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
