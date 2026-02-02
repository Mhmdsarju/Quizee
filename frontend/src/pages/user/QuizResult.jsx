import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (!state) navigate(`/user/quiz/${quizId}`, { replace: true });
  }, [state, quizId, navigate]);

  if (!state) return null;

  const { score, total, percentage, correctAnswers = [] } = state;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = Math.min(100, Math.max(0, Number(percentage)));
  const progress = (safePercentage / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-14">
       <h1 className="text-4xl text-blue-quiz">Quiz Result !!!!</h1>
        
        <div className="w-full max-w-5xl bg-blue-quiz/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-white flex flex-col md:flex-row gap-10">
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
            <h2 className="text-3xl font-extrabold">
               Congratulations!
            </h2>

            <div className="relative w-64 h-64">
              <svg className="w-full h-full">
                <defs>
                  <linearGradient id="grad">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>

                <circle
                  cx="128"
                  cy="128"
                  r={radius}
                  stroke="#334155"
                  strokeWidth="14"
                  fill="none"
                />

                <circle
                  cx="128"
                  cy="128"
                  r={radius}
                  stroke="url(#grad)"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 128 128)"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold">
                  {score}/{total}
                </p>
                <p className="text-gray-300 mt-1">
                  {safePercentage}% Score
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate(`/user/quiz/${quizId}`, { replace: true })}
                className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                 Play Again
              </button>

              <button
                onClick={() => setShowAnswers(true)}
                className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 transition"
              >
                View Answers
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 bg-[#020617] rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=80"
              className="h-44 w-full object-cover"
            />

            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-xl">
                🚀 Next Up
              </h3>

              <p className="text-sm text-gray-400">
                Try another quiz and boost your rank.
              </p>

              <button
                onClick={() => navigate("/user/quiz", { replace: true })}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium transition"
              >
                Play More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ANSWERS MODAL */}
      {showAnswers && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#020617] w-full max-w-2xl rounded-2xl p-6 text-white max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                ✅ Correct Answers
              </h2>
              <button
                onClick={() => setShowAnswers(false)}
                className="text-red-400 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {correctAnswers.length === 0 ? (
                <p className="text-gray-400">No answers available</p>
              ) : (
                correctAnswers.map((q, i) => (
                  <div
                    key={i}
                    className="bg-[#0f172a] p-4 rounded-xl"
                  >
                    <p className="font-medium mb-2">
                      {i + 1}. {q.question}
                    </p>
                    <p>
                      Correct Answer :
                      <span className="text-green-400 text-xl ml-2">
                        {q.correctOption}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

