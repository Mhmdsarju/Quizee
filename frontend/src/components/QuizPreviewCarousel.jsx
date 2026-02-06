import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuizImg from "../assets/quiz.jpg";

const DUMMY_QUIZZES = Array.from({ length: 9 });

const QuizPreviewCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 relative">
      <div className="flex gap-4 overflow-x-auto py-2 blur-sm pointer-events-none">
        {DUMMY_QUIZZES.map((_, index) => (
          <div
            key={index}
            className="min-w-[240px] max-w-[240px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0 border border-black"
          >
            <div className="h-36 overflow-hidden relative border border-black">
              <img
                src={QuizImg}
                alt="Quiz Preview"
                className="h-full w-full object-cover"
              />

              <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                LOCKED
              </span>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-gray-800">
                Quiz Name
              </h4>

              <p className="text-xs text-gray-500">-- Questions</p>

              <button className="mt-auto bg-red-500 text-white text-sm py-2 rounded-lg">
                Login to Start
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Lock size={34} className="mb-2" />
        <p className="text-sm mb-3 text-red">Login to unlock quizzes</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-quiz text-quiz-admin rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default QuizPreviewCarousel;
