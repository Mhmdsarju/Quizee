import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import {
  useQuizHistory,
  useContestHistory,
} from "../../hooks/useUserHistory";
import api from "../../api/axios";
import Swal from "sweetalert2";

export default function UserHistory() {
  const [activeTab, setActiveTab] = useState("quiz");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sendingId, setSendingId] = useState(null); 

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

  const sendCertificateToEmail = async (certificateUrl, id) => {
    try {
      setSendingId(id);

      Swal.fire({
        title: "Sending...",
        text: "Please wait while we send your certificate",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await api.post("/user/send-certificate", {
        certificateUrl,
      });

      Swal.fire({
        icon: "success",
        title: "Sent!",
        text: " Certificate sent to your email successfully",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: " Failed to send certificate. Please try again.",
      });
    } finally {
      setSendingId(null);
    }
  };

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
        <p className="text-center text-red-500">
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
                    ? item.quiz?.title
                    : item.contestTitle || item.contestId?.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-6">
                <p>
                  <b>Score:</b> {item.score}/{item.total}
                </p>
                <p>
                  <b>Percentage:</b> {item.percentage}%
                </p>

                {activeTab === "contest" && (
                  <>
                    <p>
                      <b>Rank:</b>{" "}
                      {item.rank ? (
                        <span className="text-green-700 font-semibold">
                          #{item.rank}
                        </span>
                      ) : (
                        "—"
                      )}
                    </p>

                    {item.rewardAmount > 0 && (
                      <p className="text-green-700 font-semibold">
                        Reward: ₹{item.rewardAmount}
                      </p>
                    )}
                  </>
                )}
              </div>

              {activeTab === "contest" &&
                item.certificateIssued &&
                item.certificateUrl && (
                  <div className="mt-4 flex gap-4">
                    <a
                      href={`${import.meta.env.VITE_API_URL}${item.certificateUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-5 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
                    >
                       Download Certificate
                    </a>

                    <button
                      onClick={() =>
                        sendCertificateToEmail(
                          item.certificateUrl,
                          item._id
                        )
                      }
                      disabled={sendingId === item._id}
                      className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {sendingId === item._id
                        ? "Sending..."
                        : " Send to Email"}
                    </button>
                  </div>
                )}
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
