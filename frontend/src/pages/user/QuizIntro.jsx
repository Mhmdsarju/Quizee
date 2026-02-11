import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock,  HelpCircle, LayoutGrid, AlertTriangle, ArrowLeft, ShieldAlert,Zap} from "lucide-react";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import { getQuizIntro } from "../../api/quizApi";
getQuizIntro

export default function QuizIntro() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await getQuizIntro(quizId);
        setQuiz(data);
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
    navigate(`/user/quiz/${quizId}/play`);
  };

  if (loading) return <Loader />;
  if (!quiz) return null;

  return (
    <div className="min-h-screen flex items-center justify-center  py-10 px-4 sm:px-6">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden relative border border-gray-100">
        
        <div className="h-32 bg-gradient-to-r from-red-600 to-rose-500 p-8 relative">
           <button
            onClick={() => navigate("/user/quiz")}
            className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-all bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-2xl shadow-lg border border-gray-50">
            <Zap size={32} className="text-red-500 fill-red-500" />
          </div>
        </div>

        <div className="pt-14 pb-10 px-6 sm:px-12 text-center">
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
            {quiz.quiz.title}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mb-8">Ready to test your knowledge?</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-red-100">
              <LayoutGrid className="text-red-500 mb-2" size={20} />
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Category</span>
              <span className="text-gray-800 font-bold">{quiz.quiz.category?.name}</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <HelpCircle className="text-blue-500 mb-2" size={20} />
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Questions</span>
              <span className="text-gray-800 font-bold">{quiz.totalQuestions} Items</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Clock className="text-amber-500 mb-2" size={20} />
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Time Limit</span>
              <span className="text-gray-800 font-bold">{quiz.quiz.timeLimit} Mins</span>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert size={80} className="text-amber-600" />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-amber-600" size={20} />
                <h3 className="text-lg font-bold text-amber-900">Strict Instructions</h3>
            </div>

            <ul className="space-y-3 relative z-10">
              {[
                "Must be completed in one sitting.",
                "Tab switching will trigger auto-submit.",
                "Page refresh will end the session.",
                "Developer tools are strictly prohibited."
              ].map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-amber-800/80 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <button
                onClick={startQuiz}
                className="group relative w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-[0.98] overflow-hidden"
            >
                <span className="relative z-10">Initialize Quiz</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <ShieldAlert size={12} /> Proctored Session Enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}