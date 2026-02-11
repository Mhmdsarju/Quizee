import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { quizGuard } from "../QuizGuard";
import { getContestQuiz, submitContestQuiz } from "../../api/contestApi";



export default function ContestQuizPlay() {
  const { id: contestId } = useParams();
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
    getContestQuiz(contestId).then((res) => {
        setQuiz(res.data.quiz);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.quiz.timeLimit * 60);
      })
      .catch(() => {
        Swal.fire("Error", "Unable to load contest quiz", "error");
        navigate("/user/contest");
      })
      .finally(() => setLoading(false));
  }, [contestId, navigate]);

  // TIMER 
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

  // PREVENT REFRESH 
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submittedRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
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
          text: "You switched tabs. Contest will be submitted automatically.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          navigate(`/user/contest/${contestId}/leaderboard`, {
            replace: true,
          });
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // WINDOW BLUR 
  useEffect(() => {
    const onBlur = () => {
      if (submittedRef.current) return;

      forceSubmitRef.current = true;

      Swal.fire({
        icon: "warning",
        title: "Window Change Detected",
        text: "Contest will be submitted automatically.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate(`/user/contest/${contestId}/leaderboard`, {
          replace: true,
        });
      });
    };

    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  // DISABLE RIGHT CLICK 
  useEffect(() => {
    const disable = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disable);
    return () => document.removeEventListener("contextmenu", disable);
  }, []);

  // DISABLE DEVTOOLS 
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

  // SELECT OPTION 
  const selectOption = (index) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: index,
    }));
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const submitQuiz = async () => {
    if (submittedRef.current) return;
    if (timeLeft <= 0) {
      submittedRef.current = true;

      Swal.fire({
        icon: "info",
        title: "Contest Ended",
        text: "Contest time has ended. Your answers were auto submitted.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        navigate(`/user/contest/${contestId}/leaderboard`, {
          replace: true,
        });
      });

      return;
    }
    submittedRef.current = true;

    try {
      const answersArray = questions.map((_, i) =>
        answers[i] !== undefined ? answers[i] : -1
      );

      await submitContestQuiz(contestId, {answers: answersArray,timeTaken: quiz.timeLimit * 60 - timeLeft,});

      navigate(`/user/contest/${contestId}/leaderboard`, {
        replace: true,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Submit failed",
        "error"
      );
      submittedRef.current = false;
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!questions.length) return null;

  const q = questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const hasAnswered = answers[current] !== undefined;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-slate-800 text-white rounded-2xl shadow-2xl p-8 space-y-6">

        <div className="w-full overflow-hidden bg-orange-100 border-b border-orange-300">
          <div className="whitespace-nowrap animate-marquee py-2">

            <span className="mx-8 font-semibold text-red-700">
              ⚠️ Contest Rules:
            </span>

            <span className="mx-8 text-gray-800">
              Do not switch tabs after the contest starts
              &ensp;•&ensp;
              Refreshing is not allowed
              &ensp;•&ensp;
              Right-click is disabled
              &ensp;•&ensp;
              If any rule is
              <span className="text-red-500 font-semibold mx-1">violated</span>
              the contest will be auto submitted
              &ensp;•&ensp;
              <span className="font-semibold text-red-700">
                Entry fee is NON-REFUNDABLE
              </span>
              Right-click is disabled
            </span>

            <span className="mx-8 text-gray-800">
              Do not switch tabs after the contest starts
              &ensp;•&ensp;
              Refreshing is not allowed
              &ensp;•&ensp;
              Right-click is disabled
              &ensp;•&ensp;
              If any rule is
              <span className="text-red-500 font-semibold mx-1">violated</span>
              the contest will be auto submitted
              &ensp;•&ensp;
              <span className="font-semibold text-red-700">
                Entry fee is NON-REFUNDABLE
              </span>
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
            const selected = answers[current] === i;

            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                className={`w-full text-left px-5 py-3 rounded-xl border transition
                  ${selected
                    ? "bg-green-600 border-green-600"
                    : "bg-slate-900 border-slate-600 hover:bg-slate-700"
                  }`}
              >
                <span className="font-semibold mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-700">
          {current === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={!hasAnswered}
              className={`px-8 py-2 rounded-xl font-semibold
                ${hasAnswered
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-slate-600 opacity-60 cursor-not-allowed"
                }`}
            >
              Submit Contest
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!hasAnswered}
              className={`px-8 py-2 rounded-xl font-semibold
                ${hasAnswered
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
