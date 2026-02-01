import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

export default function ContestIntro() {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await api.get(`/user/contest/${contestId}/status`);
        setContest(res.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Contest Not Available",
          text:
            err.response?.data?.message ||
            "Unable to load contest",
        }).then(() => {
          navigate("/user/contest");
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId, navigate]);

  const startContest = () => {
    navigate(`/user/contest/${contestId}/play`);
  };

  if (loading) return <Loader />;
  if (!contest) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-7">
      <div className="bg-white w-full max-w-xl p-10 rounded-2xl shadow-2xl space-y-6 relative">
        <button
          onClick={() => navigate("/user/contest")}
          className="absolute top-5 left-5 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-900 mt-4">
          Contest Instructions
        </h1>

        <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>

       

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-6">
          <h3 className="text-lg font-semibold text-red-700 mb-3">
            Contest Rules & Instructions
          </h3>

          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>
              Contest once started <b>cannot be paused or restarted</b>.
            </li>
            <li>
              <b>Each participant can submit only once</b>.
            </li>
            <li>
              <b>Score is calculated automatically</b> after submission.
            </li>
            <li>
              In case of tie, <b>less time taken</b> gets higher rank.
            </li>
            <li>
              Switching tabs or refreshing the page may lead to
              <b> automatic submission</b>.
            </li>
            <li>
              Final ranking will be shown in the <b>leaderboard</b>.
            </li>
            <li>
              Once the quiz is started, it <b>must be completed in one sitting</b>.
            </li>
            <li>
              <b>Do not switch tabs or windows.</b> If a tab or window change is
              detected, the quiz will be <b>automatically submitted</b>.
            </li>
            <li>
              <b>Refreshing the page is not allowed.</b> Refreshing will end the
              quiz.
            </li>
            <li>
              <b>Right-click is disabled</b> during the quiz.
            </li>
            <li>
              <b>Developer tools and keyboard shortcuts</b> are restricted.
            </li>
            <li>
              If any rule is violated, the quiz <b>cannot be continued</b>.
            </li>
          </ul>

          <p className="text-xs text-gray-500 mt-3">
            ⚠️ Ensure stable internet connection before starting
            the contest.
          </p>
        </div>

        <button
          onClick={startContest}
          className="w-full mt-8 py-3 rounded-xl bg-red-600 text-white font-semibold text-lg hover:bg-red-700 transition shadow-lg"
        >
          Start Contest
        </button>
      </div>
    </div>
  );
}
