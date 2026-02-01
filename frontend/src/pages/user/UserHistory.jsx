import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import {
  useQuizHistory,
  useContestHistory,
} from "../../hooks/useUserHistory";

export default function UserHistory() {
  const [activeTab, setActiveTab] = useState("quiz");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const {
    data: quizData,
    isLoading: quizLoading,
  } = useQuizHistory({ page, search });

  const {
    data: contestData,
    isLoading: contestLoading,
  } = useContestHistory({ page, search });

  const loading =
    activeTab === "quiz" ? quizLoading : contestLoading;

  const history =
    activeTab === "quiz"
      ? quizData?.data || []
      : contestData?.data || [];

  const totalPages =
    activeTab === "quiz"
      ? quizData?.pagination?.totalPages || 1
      : contestData?.pagination?.totalPages || 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-6">History</h1>

        <SearchBar
          value={search}
          onChange={(val) => {
            setPage(1);
            setSearch(val);
          }}
          placeholder={
            activeTab === "quiz"
              ? "Search quiz history..."
              : "Search contest history..."
          }
        />
      </div>

      <div className="flex gap-4 mb-6">
        {["quiz", "contest"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab === "quiz" ? "Quiz" : "Contest"}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {!loading && history.length === 0 && (
        <p className="text-center  text-red-500">
          No {activeTab} attempts found !!!
        </p>
      )}

      <div className="grid gap-4">
        {!loading &&
          history.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">
                  {activeTab === "quiz"
                    ? item.quiz.title
                    : item.contestId?.title || "Contest"}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-700 flex gap-6">
                <p>
                  <b>Score:</b> {item.score}/{item.total}
                </p>
                <p>
                  <b>Percentage:</b> {item.percentage}%
                </p>
              </div>
            </div>
          ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
