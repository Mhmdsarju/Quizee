import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ContestLeaderboard() {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [contestStatus, setContestStatus] = useState(null);
  const [myResult, setMyResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/user/contest/${contestId}/status`)
      .then((res) => {
        setContestStatus(res.data.status);

        if (res.data.status === "COMPLETED") {
        
          api
            .get(`/user/contest/${contestId}/leaderboard`)
            .then((res) => setData(res.data || []));

          api
            .get(`/user/contest/${contestId}/result`)
            .then((res) => setMyResult(res.data))
            .catch(() => setMyResult(null));
        }
      })
      .finally(() => setLoading(false));
  }, [contestId]);

  // Always sort by rank 
  const { topThree, others } = useMemo(() => {
    const sorted = [...data].sort(
      (a, b) => (a.rank ?? 9999) - (b.rank ?? 9999)
    );

    return {
      topThree: sorted.filter((d) => d.rank <= 3),
      others: sorted.filter((d) => d.rank > 3),
    };
  }, [data]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate("/user/contest")}
          className="text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          ← Back to Contests
        </button>

        <h1 className="text-2xl font-semibold text-center mt-6 mb-8">
          Contest Leaderboard 🏆
        </h1>

        {loading && (
          <p className="text-center text-gray-400 mt-20">
            Loading leaderboard...
          </p>
        )}

        {!loading && contestStatus && contestStatus !== "COMPLETED" && (
          <div className="bg-white rounded-2xl shadow p-10 text-center mt-10">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Contest not completed yet
            </h2>
            <p className="text-sm text-gray-500">
              Results will be published once the contest ends.
            </p>
          </div>
        )}

        {!loading &&
          contestStatus === "COMPLETED" &&
          data.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <div className="text-5xl mb-4">🏁</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                No Participants Joined
              </h2>
            </div>
          )}

        {!loading &&
          contestStatus === "COMPLETED" &&
          data.length > 0 && (
            <>
              <div className="flex justify-center items-end gap-6 mb-12">
                {renderPodium(topThree, 2)}
                {renderPodium(topThree, 1, true)}
                {renderPodium(topThree, 3)}
              </div>

              {others.length > 0 && (
                <div className="bg-white rounded-xl shadow divide-y">
                  {others.map((row) => (
                    <div
                      key={row._id}
                      className="flex justify-between items-center px-4 py-3 text-sm"
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 text-gray-500">
                          {row.rank}
                        </span>
                        <span className="font-medium text-gray-800">
                          {row.userId?.name}
                        </span>
                      </span>

                      <span className="font-semibold text-gray-700">
                        {row.score} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!loading &&
          contestStatus === "COMPLETED" &&
          myResult &&
          myResult.rank <= 3 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-10 text-center">
              <h2 className="text-lg font-semibold text-green-700">
                 Congratulations! You are a Winner
              </h2>

              <p className="text-sm text-gray-700 mt-2">
                Rank #{myResult.rank} · Reward ₹{myResult.rewardAmount}
              </p>

              {myResult.certificateIssued && myResult.certificateUrl && (
                <a
                  href={`${import.meta.env.VITE_API_URL}${myResult.certificateUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                   Download Certificate
                </a>
              )}
            </div>
          )}
      </div>
    </div>
  );
}


function renderPodium(topThree, rank, highlight = false) {
  const user = topThree.find((u) => u.rank === rank);
  if (!user) return null;

  const heightMap = {
    1: "h-36",
    2: "h-28",
    3: "h-24",
  };

  const colorMap = {
    1: "from-yellow-100 to-white border-yellow-300",
    2: "bg-gray-300",
    3: "bg-orange-300",
  };

  return (
    <Podium
      rank={rank}
      name={user.userId?.name}
      score={user.score}
      height={heightMap[rank]}
      highlight={highlight}
      color={colorMap[rank]}
    />
  );
}

function Podium({ rank, name, score, height, color, highlight }) {
  return (
    <div className="flex flex-col items-center w-32 relative">
      {highlight && (
        <div className="absolute -top-6 text-2xl animate-bounce">👑</div>
      )}

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center 
        text-white font-bold mb-2 shadow-md border-2
        ${
          highlight
            ? "bg-yellow-500 border-yellow-300"
            : "bg-gray-500 border-white"
        }`}
      >
        {name?.charAt(0)?.toUpperCase()}
      </div>

      <p
        className={`text-sm font-semibold mb-1 text-center ${
          highlight ? "text-yellow-700" : "text-gray-700"
        }`}
      >
        {name}
      </p>

      <div
        className={`w-full ${height} rounded-t-xl flex items-end justify-center 
        shadow-lg ${
          highlight
            ? "bg-gradient-to-t from-yellow-100 to-white border-2 border-yellow-300"
            : color
        }`}
      >
        <span className="mb-4 text-6xl font-extrabold text-white">
          {rank}
        </span>
      </div>

      <p
        className={`text-xs mt-2 font-medium ${
          highlight ? "text-yellow-700" : "text-gray-600"
        }`}
      >
        {score} pts
      </p>
    </div>
  );
}
