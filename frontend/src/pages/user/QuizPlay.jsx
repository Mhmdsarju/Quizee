import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import { quizGuard } from "../QuizGuard";

export default function QuizPlay() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const contestId = searchParams.get("contest");
  const isContest = Boolean(contestId);

  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const submittedRef = useRef(false);
  const forceSubmitRef = useRef(false);

  // Quiz Guard 
  useEffect(() => {
    quizGuard.ongoing = true;
    return () => {
      quizGuard.ongoing = false;
    };
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = isContest
          ? await api.get(`/user/contest/${contestId}/play`)
          : await api.get(`/user/quiz/${quizId}/play`);

        setQuestions(res.data.questions);
        setQuiz(res.data.quiz);
        setTimeLeft(res.data.quiz.timeLimit * 60);
      } catch {
        Swal.fire("Error", "Unable to load quiz", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

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

  // Prevent Refresh 
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

  // TAB CHANGE 
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && !submittedRef.current) {
        forceSubmitRef.current = true;

        Swal.fire({
          icon: "warning",
          title: "Tab Change Detected",
          text: "You switched tabs. As per quiz rules, the quiz cannot be continued and will be submitted automatically.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          submitQuiz();
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // WINDOW CHANGE 
  useEffect(() => {
    const onBlur = () => {
      if (submittedRef.current) return;

      forceSubmitRef.current = true;

      Swal.fire({
        icon: "warning",
        title: "Window Change Detected",
        text: "You changed the window. Quiz cannot be continued and will be submitted automatically.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        submitQuiz();
      });
    };

    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  // Disable Right Click 
  useEffect(() => {
    const disable = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disable);
    return () => document.removeEventListener("contextmenu", disable);
  }, []);

  // Disable DevTools Shortcuts 
  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Helpers 
  const selectOption = (index) => {
    const qid = questions[current]._id;
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };

  const validateCurrentQuestion = async () => {
    if (isContest || submittedRef.current) return true;

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
    if (!forceSubmitRef.current) {
      const valid = await validateCurrentQuestion();
      if (!valid) return;
    }

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const submitQuiz = async () => {
    if (submittedRef.current) return;

    submittedRef.current = true;
    quizGuard.ongoing = false;

    if (!forceSubmitRef.current) {
      const valid = await validateCurrentQuestion();
      if (!valid) return;
    }

    try {
      const res = await api.post(`/user/quiz/${quizId}/submit`, { answers });

      if (isContest) {
        await api.post(`/user/contest/${contestId}/submit`, {
          score: res.data.score,
          total: res.data.total,
          percentage: res.data.percentage,
        });

        navigate(`/user/contest/${contestId}/leaderboard`, { replace: true });
      } else {
        navigate(`/user/quiz/${quizId}/result`, {
          state: res.data,
          replace: true,
        });
      }
    } catch {
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

    <div className="min-h-screen flex items-center justify-center  from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-3xl bg-slate-800 text-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="w-full overflow-hidden bg-yellow-100 border-b border-yellow-300 rounded-sm">
          <div className="whitespace-nowrap animate-marquee py-2">
            <span className="mx-8 font-semibold text-red-700">
              ⚠️ Quiz Rules:
            </span>
            <span className="mx-8 text-gray-800">
              Do not switch tabs after the quiz started&ensp;•&ensp;Refreshing not allowed &ensp; •&ensp; Right-click disabled &ensp;• &ensp;If the rules has been <span className="text-red-400">violated</span> the quiz will automatically submit !!!
            </span>
            <span className="mx-8 text-gray-800">
              Do not switch tabs after the quiz started&ensp;•&ensp;Refreshing not allowed &ensp; •&ensp; Right-click disabled &ensp;• &ensp;If the rules has been <span className="text-red-400">violated</span> the quiz will automatically submit !!!
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <h2 className="text-xl font-semibold">{quiz.title}</h2>

          <div className="flex items-center gap-2 bg-red-600 px-4 py-1 rounded-full text-sm font-semibold">
            ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="flex justify-between text-sm text-slate-300">
          <span>
            Question {current + 1} / {questions.length}
          </span>
          <span>
            Answered: {Object.keys(answers).length}
          </span>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="text-lg font-medium leading-relaxed">
            {current + 1}. {q.question}
          </h3>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const selected = answers[q._id] === i;

            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-200
                ${selected
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-slate-900 border-slate-600 hover:bg-slate-700"
                  }
              `}
              >
                <span className="font-semibold mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <span className="text-sm text-slate-400">
            Select an option to continue
          </span>

          {current === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={!hasAnswered}
              className={`px-8 py-2 rounded-xl font-semibold transition
              ${hasAnswered
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-slate-600 opacity-60 cursor-not-allowed"
                }
            `}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!hasAnswered}
              className={`px-8 py-2 rounded-xl font-semibold transition
              ${hasAnswered
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-600 opacity-60 cursor-not-allowed"
                }
            `}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );


}
