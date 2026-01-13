import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

export default function QuizPlay() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/user/quiz/${quizId}/play`);
        setQuestions(res.data.questions);
        setQuiz(res.data.quiz);
        setTimeLeft(res.data.quiz.timeLimit * 60);
      } catch (err) {
        if (err.response?.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Quiz Unavailable",
            text: err.response?.data?.message || "Quiz disabled by admin",
            confirmButtonText: "Go to Quizzes",
          }).then(() => {
            navigate("/user/quiz");
          });
        } else {
          Swal.fire("Error", "Failed to load quiz", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  useEffect(() => {
    if (!quiz || submittedRef.current) return;

    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  const selectOption = (index) => {
    const qid = questions[current]._id;
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };
  const validateCurrentQuestion = async () => {
    const currentQid = questions[current]._id;

    try {
      await api.post(`/user/quiz/${quizId}/validate-question`, {
        questionId: currentQid,
      });
      return true;
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "Quiz Updated",
        text:
          err.response?.data?.message ||
          "This question was removed by admin. Please restart the quiz.",
      }).then(() => {
        navigate(`/user/quiz/${quizId}`);
      });
      return false;
    }
  };

  const next = async () => {
    const valid = await validateCurrentQuestion();
    if (!valid) return;

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const submitQuiz = async () => {
    if (submittedRef.current) return;

    const valid = await validateCurrentQuestion();
    if (!valid) return;

    submittedRef.current = true;

    try {
      const res = await api.post(`/user/quiz/${quizId}/submit`, {
        answers,
      });

      navigate(`/user/quiz/${quizId}/result`, {
        state: res.data,
        replace: true,
      });
    } catch (err) {
      Swal.fire("Error", "Submit failed", "error");
      submittedRef.current = false;
    }
  };

  if (loading) return <Loader />;
  if (!quiz || !questions.length)
    return <p className="text-center text-white mt-10">No questions found</p>;

  const q = questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const currentQid = questions[current]._id;
  const hasAnswered = answers[currentQid] !== undefined;

  return (
    <div className="min-h-screen px-7">
      <div className="max-w-3xl mx-auto bg-[#1e293b] p-10 rounded-xl space-y-4 text-white mt-12 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">{quiz.title}</h2>
          <span className="bg-red-600 px-3 py-1 rounded">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <h3 className="text-lg font-medium">
          {current + 1}. {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectOption(i)}
              className={`w-full text-left px-4 py-2 rounded border transition ${
                answers[q._id] === i
                  ? "bg-green-600 border-green-600"
                  : "border-gray-500 hover:bg-[#334155]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <span className="text-sm">
            Question {current + 1} of {questions.length}
          </span>

          {current === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={!hasAnswered}
              className={`px-6 py-2 rounded ${
                hasAnswered
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 cursor-not-allowed opacity-60"
              }`}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!hasAnswered}
              className={`px-6 py-2 rounded ${
                hasAnswered
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed opacity-60"
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
