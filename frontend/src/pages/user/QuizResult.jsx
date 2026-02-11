import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Trophy, RotateCcw, LayoutDashboard, ChevronRight, X, Check, ArrowRight } from "lucide-react";

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
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <div className="min-h-screen  text-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
                <Trophy size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Quiz Completed!</h1>
            <p className="text-slate-500 mt-2">Here's how you performed in this session.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative flex-shrink-0">
                    <svg className="w-56 h-56 transform -rotate-90">
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="16" fill="transparent" 
                            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
                            strokeLinecap="round" className="text-emerald-500 transition-all duration-1000" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
                        <span className="text-5xl font-black text-slate-900">{percentage}%</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score</span>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Great Effort!</h2>
                    <p className="text-slate-500 mb-8">You answered <span className="text-slate-900 font-bold">{score} questions correctly</span> out of {total}. Keep practicing to reach 100%!</p>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <button 
                            onClick={() => navigate(`/user/quiz/${quizId}`, { replace: true })}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                        >
                            <RotateCcw size={18} /> Retake Quiz
                        </button>
                        <button 
                            onClick={() => setShowAnswers(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-200 transition"
                        >
                            Review Answers
                        </button>
                    </div>
                </div>
            </div>
          </div>
          <div className="bg-blue-quiz  rounded-[2.5rem] p-8 text-white shadow-xl ">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LayoutDashboard size={20} /> What's Next?
            </h3>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed">Your skills are improving! Try a different category to broaden your knowledge base.</p>
            
            <div className="space-y-4">
                <button 
                    onClick={() => navigate("/user/quiz", { replace: true })}
                    className="w-full group flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 transition-all"
                >
                    <span className="font-bold">Explore Quizzes</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="aspect-video w-full rounded-2xl overflow-hidden mt-4">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400" className="w-full h-full object-cover opacity-80" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {showAnswers && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-white">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAnswers(false)} />
          <div className="relative bg-blue-quiz w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center ">
                <h2 className="text-xl font-bold flex items-center gap-2"><Check className="text-emerald-500" /> Answer Key</h2>
                <button onClick={() => setShowAnswers(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50 ">
              {correctAnswers.map((q, i) => (
                <div key={i} className="bg- p-5 bg-blue-quiz rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">Question {i + 1}</p>
                  <p className="font-bold text-white mb-4">{q.question}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2  text-green-500 rounded-xl font-bold text-sm">
                   <span className="text-gray-500">Correct Answer is : </span>{q.correctOption}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}