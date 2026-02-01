import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [showAnswers, setShowAnswers] = useState(false);


  useEffect(() => {
    if (!state) {
      navigate(`/user/quiz/${quizId}`, { replace: true });
    }
  }, [state, quizId, navigate]);

  if (!state) return null;

  useEffect(() => {
  window.history.pushState(null, "", window.location.href);

  const handleBack = () => {
    navigate("/user/quiz", { replace: true });
  };

  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, [navigate]);


  const { score, total, percentage, correctAnswers = [] } = state;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const safePercentage = Math.min(100, Math.max(0, Number(percentage)));

  const progress = (safePercentage / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <>
      <div className="min-h-screen">
        <div
        className="bg-black/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-4xl flex gap-8 text-white container m-auto mt-14"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80')",}}>
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <h2 className="text-2xl font-bold">Congrats!</h2>

          <div className="relative w-60 h-60">
            <svg className="w-full h-full">
              <circle cx="120" cy="120" r={radius} stroke="#334155" strokeWidth="14" fill="none"/>
              <circle cx="120" cy="120" r={radius} stroke="#ef4444" strokeWidth="14" fill="none" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"transform="rotate(-90 120 120)"/>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold">
                {score}/{total}
              </p>
              <p className="text-gray-300 text-sm">{safePercentage}% Score</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate(`/user/quiz/${quizId}`,{replace:true})} className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200" >
              Play Again
            </button>

            <button onClick={() => setShowAnswers(true)} className="px-6 py-2 bg-red-600 rounded-full hover:bg-red-700">
              Correct Answers
            </button>
          </div>
        </div>
        <div className="w-80 bg-[#0f172a] rounded-xl overflow-hidden shadow-lg">
          <img src="https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=80" className="h-40 w-full object-cover"/>

          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg">Next Up!</h3>
            <p className="text-sm text-gray-400">
              Try another quiz and improve your rank.
            </p>

            <button onClick={() => navigate("/user/quiz",{replace:true})} className="w-full bg-red-600 py-2 rounded" >
              Play More
            </button>
          </div>
        </div>
      </div>
      </div>

      {showAnswers && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f172a] w-full max-w-2xl rounded-xl p-6 text-white overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Correct Answers</h2>
              <button onClick={() => setShowAnswers(false)} className="text-red-500 text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {correctAnswers.length === 0 ? (
                <p className="text-gray-400">No answers available</p>
              ) : (
                correctAnswers.map((q, i) => (
                  <div key={i} className="bg-[#1e293b] p-4 rounded-lg">
                    <p className="font-medium mb-2">
                      {i + 1}. {q.question}
                    </p>
                    <p >
                         Correct answer is :
                        <span className="text-green-400 text-2xl ms-3">
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
