import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import { quizGuard } from "../QuizGuard";
import {getQuizPlay,submitQuiz,validateQuestion,} from "../../api/quizApi";

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
  const forceSubmitRef = useRef(false);

  useEffect(() => {
    quizGuard.ongoing = true;
    return () => {
      quizGuard.ongoing = false;
    };
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizPlay(quizId);
        setQuestions(res.data.questions);
        setQuiz(res.data.quiz);
        setTimeLeft(res.data.quiz.timeLimit * 60);
      } catch {
        Swal.fire("Error", "Unable to load quiz", "error");
        navigate("/user/quiz", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  useEffect(() => {
    if (!quiz || submittedRef.current) return;

    if (timeLeft <= 0) {
      submitQuizHandler();
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

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && !submittedRef.current) {
        forceSubmitRef.current = true;

        Swal.fire({
          icon: "warning",
          title: "Tab Change Detected",
          text: "You switched tabs. Quiz will be submitted automatically.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          submitQuizHandler();
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    const onBlur = () => {
      if (submittedRef.current) return;

      forceSubmitRef.current = true;

      Swal.fire({
        icon: "warning",
        title: "Window Change Detected",
        text: "Quiz will be submitted automatically.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        submitQuizHandler();
      });
    };

    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  /* -------------------- DISABLE RIGHT CLICK -------------------- */
  useEffect(() => {
    const disable = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disable);
    return () => document.removeEventListener("contextmenu", disable);
  }, []);

  /* -------------------- DISABLE DEVTOOLS -------------------- */
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

  const selectOption = (index) => {
    const qid = questions[current]._id;
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };

  const validateCurrentQuestion = async () => {
    if (submittedRef.current) return true;

    try {
      await validateQuestion(quizId, questions[current]._id);
      return true;
    } catch {
      Swal.fire({
        icon: "warning",
        title: "Quiz Updated",
        text: "This quiz was updated by admin. Please retry.",
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

  const submitQuizHandler = async () => {
    if (submittedRef.current) return;

    submittedRef.current = true;
    quizGuard.ongoing = false;

    if (!forceSubmitRef.current) {
      const valid = await validateCurrentQuestion();
      if (!valid) return;
    }

    try {
      const res = await submitQuiz(quizId, { answers });

      navigate(`/user/quiz/${quizId}/result`, {
        state: res.data,
        replace: true,
      });
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-slate-800 text-white rounded-2xl shadow-2xl p-8 space-y-6">

        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <div className="bg-red-600 px-4 py-1 rounded-full text-sm font-semibold">
            ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>

        <div className="text-sm text-slate-300">
          Question {current + 1} / {questions.length}
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="text-lg">
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
                className={`w-full text-left px-5 py-3 rounded-xl border
                  ${
                    selected
                      ? "bg-green-600 border-green-600"
                      : "bg-slate-900 border-slate-600 hover:bg-slate-700"
                  }`}
              >
                <b className="mr-2">{String.fromCharCode(65 + i)}.</b>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-700">
          {current === questions.length - 1 ? (
            <button
              onClick={submitQuizHandler}
              disabled={!hasAnswered}
              className={`px-8 py-2 rounded-xl font-semibold
                ${
                  hasAnswered
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-slate-600 opacity-60 cursor-not-allowed"
                }`}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!hasAnswered}
              className={`px-8 py-2 rounded-xl font-semibold
                ${
                  hasAnswered
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-600 opacity-60 cursor-not-allowed"
                }`}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
