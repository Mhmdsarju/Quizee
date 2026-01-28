import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import { quizGuard } from "../QuizGuard";


export default function QuizPlay() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const [searchParams] = useSearchParams();
  const contestId=searchParams.get("contest");
  const isContest = Boolean(contestId);

  const submittedRef = useRef(false);

  useEffect(() => {
    quizGuard.ongoing = true; 

    return () => {
      quizGuard.ongoing = false; 
    };
  }, []);


  const checkContestBlocked = async () => {
  if (!isContest) return true;

  try {
    const { data } = await api.get(
      `/user/contest/${contestId}/status`
    );

    if (data.isBlocked) {
      quizGuard.ongoing = false;

      await Swal.fire({
        icon: "warning",
        title: "Contest Blocked",
        text: "Contest blocked by admin. Your money will be refunded.",
        confirmButtonText: "OK",
      });

      navigate("/user/contest", { replace: true });
      return false;
    }

    return true;
  } catch {
    return false;
  }
};




  useEffect(() => {
    const fetchQuiz = async () => {
  try {
    let res;

    if (isContest) {
      res = await api.get(`/user/contest/${contestId}/play`);
    } else {
      res = await api.get(`/user/quiz/${quizId}/play`);
    }

    setQuestions(res.data.questions);
    setQuiz(res.data.quiz);
    setTimeLeft(res.data.quiz.timeLimit * 60);
  } catch {
    Swal.fire(
      "Error",
      "Unable to load quiz",
      "error"
    );
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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!quizGuard.ongoing) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const selectOption = (index) => {
    const qid = questions[current]._id;
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };

  const validateCurrentQuestion = async () => {
    if (isContest) return true;

    if (submittedRef.current) return false;

    try {
      await api.post(`/user/quiz/${quizId}/validate-question`, {
        questionId: questions[current]._id,
      });
      return true;
    } catch {
      Swal.fire({
        icon: "warning",
        title: "Quiz Updated",
        text: "This quiz is updated by admin. Please retry.",
      }).then(() => {
        quizGuard.ongoing = false;
        navigate(`/user/quiz/${quizId}`, { replace: true });
      });
      return false;
    }
  };

  const next = async () => {
    const contestOk =await checkContestBlocked();
    if (!contestOk) return;

    const valid = await validateCurrentQuestion();
    if (!valid) return;

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const submitQuiz = async () => {
  if (submittedRef.current) return;
  
   const contestOk = await checkContestBlocked();
  if (!contestOk) return;

  const valid = await validateCurrentQuestion();
  if (!valid) return;

  submittedRef.current = true;
  quizGuard.ongoing = false;

  try {
    const res = await api.post(`/user/quiz/${quizId}/submit`, { answers });
    if (isContest) {
      await api.post(`/user/contest/${contestId}/submit`, {
        score: res.data.score,
        total: res.data.total,
        percentage: res.data.percentage,
      });

      navigate(`/user/contest/${contestId}/leaderboard`, {
        replace: true,
      });
    }
    else {
      navigate(`/user/quiz/${quizId}/result`, {
        state: res.data,
        replace: true,
      });
    }
  } catch (err) {
    Swal.fire("Error", "Submit failed", "error");
    submittedRef.current = false;
    quizGuard.ongoing = true;
  }
};

  if (loading) return <Loader />;
  if (!quiz || !questions.length)
    return <p className="text-center text-white mt-10">No questions found</p>;

  const q = questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const hasAnswered = answers[q._id] !== undefined;

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
              className={`w-full text-left px-4 py-2 rounded border ${
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
                  : "bg-gray-600 opacity-60"
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
                  : "bg-gray-600 opacity-60"
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
