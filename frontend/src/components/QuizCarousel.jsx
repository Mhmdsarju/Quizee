import { useQuizzes } from "../hooks/useQuizzes";
import QuizImg from "../assets/quiz.jpg"

const QuizCarousel = () => {
  const { data, isLoading } = useQuizzes({
    category: "",
    sort: "latest",
    page: 1,
    search: "",
  });

  if (isLoading)
    return (
      <p className="text-center py-6 text-gray-500">
        Loading quizzes...
      </p>
    );

  return (
    <div className="px-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
        {data?.data?.map((quiz) => (
          <div
            key={quiz._id}
            className="min-w-[240px] max-w-[240px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0"
          >
            <div className="h-36 overflow-hidden">
              <img src={quiz.image||QuizImg} alt="quiz" className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"/>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                {quiz.title}
              </h4>

              <p className="text-xs text-gray-500">
                {quiz.questionsCount} Questions
              </p>

              <button className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition">
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizCarousel;
