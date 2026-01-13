import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

export default function QuizIntro() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/user/quiz/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Quiz Not Available",
          text: err.response?.data?.message || "Unable to load quiz",
        }).then(() => {
          navigate("/user/quiz");
        });

        setQuiz(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const startQuiz = async () => {
    try {
      navigate(`/user/quiz/${quizId}/play`);
    } catch (err) {
      if (err.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Quiz Unavailable",
          text: "This quiz has been disabled by admin.",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire("Error", "Unable to start quiz", "error");
      }
    }
  };

  if (loading) return <Loader />;
  if (!quiz) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-7">
      <div className="bg-white w-full max-w-xl p-10 rounded-2xl shadow-2xl space-y-6 relative">
        <button
          onClick={() => navigate("/user/quiz")}
          className="absolute top-5 left-5 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-900 mt-4">
          {quiz.quiz.title}
        </h1>

        <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-6">
          <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Category</p>
            <p className="text-lg font-semibold text-gray-800">
              {quiz.quiz.category?.name}
            </p>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Questions</p>
            <p className="text-lg font-semibold text-gray-800">
              {quiz.totalQuestions}
            </p>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Time Limit</p>
            <p className="text-lg font-semibold text-gray-800">
              {quiz.quiz.timeLimit} mins
            </p>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full mt-8 py-3 rounded-xl bg-red-600 text-white font-semibold text-lg hover:bg-red-700 transition shadow-lg"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
