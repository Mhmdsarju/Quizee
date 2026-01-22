import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import QuizImg from "../../assets/quiz.jpg";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import { useSelector } from "react-redux";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [attemptedQuizIds, setAttemptedQuizIds] = useState([]);

  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const token = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, [selectedCat, sort, page, search]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/quizzes", {
        params: { category: selectedCat, sort, page, search },
      });

      setQuizzes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Quiz fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!token) return;

    api
      .get("/admin/categories")
      .then((res) => {
        setCategories(res.data.data || res.data);
      })
      .catch((err) => {
        console.error("Category error:", err.response?.data);
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;

    api
      .get("/user/quiz-history")
      .then((res) => {
        const ids = res.data.map((a) => a.quiz._id);
        setAttemptedQuizIds(ids);
      })
      .catch((err) => {
        console.error("Quiz history error:", err);
      });
  }, [token]);

  const isAttempted = (quizId) => attemptedQuizIds.includes(quizId);

  const handleSearch = (value) => {
    setPage(1);
    if (value) {
      setParams({ search: value });
    } else {
      setParams({});
    }
  };
  return (
    <div className="min-h-screen p-8 container m-auto">
      <div className="flex gap-8">
        <div className="w-48">
          <h3 className="text-sm mb-4 font-semibold">TOPICS</h3>

          {categories.map((c) => (
            <label
              key={c._id}
              className="flex gap-2 text-sm cursor-pointer mb-2"
            >
              <input
                type="checkbox"
                checked={selectedCat === c._id}
                onChange={() => {
                  setPage(1);
                  setSelectedCat(selectedCat === c._id ? "" : c._id);
                }}
              />
              {c.name}
            </label>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex justify-end gap-4 items-center mb-6">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search quizzes..."
            />

            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
              className="border px-3 py-1 rounded-md text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : quizzes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">No quizzes found !!!</p>
              <p className="text-sm text-gray-500 mt-2">
                Try changing category, search or sort option
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => {
                  const attempted = isAttempted(quiz._id);

                  return (
                    <div
                      key={quiz._id}
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                    >
                      <img
                        src={quiz.image || QuizImg}
                        className="h-40 w-full object-cover"
                      />

                      <div className="bg-[#4b0f0f] p-4 text-white">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{quiz.title}</h3>

                          {attempted && (
                            <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                              Attempted
                            </span>
                          )}
                        </div>

                        <p className="text-xs mt-1">
                          {quiz.questionCount} Questions
                        </p>
                        <p className="text-xs">
                          Category: {quiz.category?.name}
                        </p>

                        <button
                          onClick={() => navigate(`/user/quiz/${quiz._id}`, {replace: true,})
                          }
                          className={`mt-3 w-full py-2 rounded font-medium transition
                            ${
                              attempted
                                ? "bg-blue-600 hover:bg-blue-700"
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

              {pagination && (
                <Pagination
                  page={page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
