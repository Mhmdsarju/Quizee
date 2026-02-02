import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ContestLeaderboard() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/user/contest/${contestId}/leaderboard`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [contestId]);

  const topThree = data.slice(0, 3);
  const others = data.slice(3);

  return (
    <div className="min-h-screen py-10 px-4 ">
      <div className="max-w-4xl mx-auto">
        <button
            onClick={() => navigate("/user/contest")}
            className="text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            ← Back to Contests
          </button>

        <div className="flex items-center justify-center mb-8">
          

          <h1 className="text-2xl font-semibold font-serif mb-20">
            Contest Leaderboard !!!
          </h1>

          <div /> 
        </div>

        {loading && (
          <p className="text-center text-gray-400 mt-20">
            Loading leaderboard...
          </p>
        )}

        {!loading && data.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-4">🏁</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              No Participants Joined !!!
            </h2>
            <p className="text-sm text-gray-500">
              Be the first one to the Next Contest  and top the leaderboard!
            </p>
          </div>
        )}
        {!loading && data.length > 0 && (
          <>
            <div className="flex justify-center items-end gap-6 mb-10">
              {topThree[1] && (
                <Podium
                  rank={2}
                  name={topThree[1].userId.name}
                  score={topThree[1].score}
                  height="h-28"
                  color="bg-gray-300"
                />
              )}

              {topThree[0] && (
                <Podium
                  rank={1}
                  name={topThree[0].userId.name}
                  score={topThree[0].score}
                  height="h-36"
                  highlight
                />
              )}

              {topThree[2] && (
                <Podium
                  rank={3}
                  name={topThree[2].userId.name}
                  score={topThree[2].score}
                  height="h-24"
                  color="bg-orange-300"
                />
              )}
            </div>
            {others.length > 0 && (
              <div className="bg-white rounded-xl shadow divide-y">
                {others.map((row, index) => (
                  <div
                    key={row._id}
                    className="flex justify-between items-center px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 text-gray-500">
                        {index + 4}
                      </span>
                      <span className="font-medium text-gray-800">
                        {row.userId.name}
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
      </div>
    </div>
  );
}
function Podium({ rank, name, score, height, color, highlight }) {
  return (
    <div className="flex flex-col items-center w-32 relative">
      {highlight && (
        <div className="absolute -top-6 text-2xl animate-bounce">
          👑
        </div>
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
        {name.charAt(0).toUpperCase()}
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
