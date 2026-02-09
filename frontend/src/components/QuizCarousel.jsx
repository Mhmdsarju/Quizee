import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import QuizImg from "../assets/quiz.jpg";
import { useQuizzes } from "../hooks/useQuizzes";
import { useAttemptedQuizIds } from "../hooks/useAttemptedQuizId";

const QuizCarousel = () => {
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.accessToken);

  const { data, isLoading } = useQuizzes({category: "",sort: "latest",page: 1,search: ""});

  const { data: attemptedQuizIds = [] } = useAttemptedQuizIds(token);

  const isAttempted = (id) => attemptedQuizIds.includes(id);

  if (isLoading) {
    return (
      <p className="text-center py-6 text-gray-500">
        Loading quizzes...
      </p>
    );
  }

  return (
    <div className="px-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
        {data?.data?.map((quiz) => {
          const attempted = isAttempted(quiz._id);

          return (
            <div
              key={quiz._id}
              className="min-w-[240px] max-w-[240px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 border border-black"
            >
              <div className="h-36 overflow-hidden relative border border-black">
                <img
                  src={quiz.image || QuizImg}
                  alt={quiz.title}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />

                {attempted && (
                  <span className="absolute top-2 right-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                    Attempted
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                 <span className="text-xs text-gray-500">Quiz Name :</span> {quiz.title}
                </h4>

                <p className="text-xs text-gray-500 border- border-black">
                  {quiz.questionCount} Questions
                </p>

                <button
                  onClick={() =>navigate(`/user/quiz/${quiz._id}`, {replace: true,})}
                  className={`mt-auto text-white text-sm font-medium py-2 rounded-lg transition border border-black
                    ${
                      attempted
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  `}
                >
                  {attempted ? "Retry Quiz" : "Start Quiz"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCarousel;
