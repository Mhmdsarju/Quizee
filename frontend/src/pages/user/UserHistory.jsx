import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UserHistory() {
  const [activeTab, setActiveTab] = useState("quiz");
  const [quizHistory, setQuizHistory] = useState([]);
  const [contestHistory, setContestHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "quiz") {
      fetchQuizHistory();
    } else if (activeTab === "contest") {
      fetchContestHistory();
    }
  }, [activeTab]);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/quiz-history");
      setQuizHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContestHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/contest-history");
      setContestHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">
        History
      </h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition ${
            activeTab === "quiz"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Quiz
        </button>

        <button
          onClick={() => setActiveTab("contest")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition ${
            activeTab === "contest"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Contest
        </button>
      </div>

      {activeTab === "quiz" && (
        <>
          {loading && (
            <p className="text-center text-gray-500">
              Loading...
            </p>
          )}

          {!loading && quizHistory.length === 0 && (
            <p className="text-center text-gray-500">
              No quiz attempts found
            </p>
          )}

          <div className="grid gap-4">
            {!loading &&
              quizHistory.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.quiz.title}
                    </h3>

                    <span className="text-sm text-gray-500">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">
                        Score:
                      </span>{" "}
                      {item.score} / {item.total}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Percentage:
                      </span>{" "}
                      {item.percentage}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {activeTab === "contest" && (
        <>
          {loading && (
            <p className="text-center text-gray-500">
              Loading...
            </p>
          )}

          {!loading && contestHistory.length === 0 && (
            <p className="text-center text-gray-500">
              No contest attempts found
            </p>
          )}

          <div className="grid gap-4">
            {!loading &&
              contestHistory.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.contest.title}
                    </h3>

                    <span className="text-sm text-gray-500">
                      {new Date(
                        item.playedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Quiz: {item.quiz.title}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">
                        Score:
                      </span>{" "}
                      {item.score}/{item.total}
                    </p>

                    <p>
                      <span className="font-medium">
                        Percentage:
                      </span>{" "}
                      {item.percentage}%
                    </p>

                    {item.rank && (
                      <p>
                        <span className="font-medium">
                          Rank:
                        </span>{" "}
                        #{item.rank}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
