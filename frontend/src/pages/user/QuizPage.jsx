import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import QuizImg from "../../assets/quiz.jpg";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";

import { useQuizzes } from "../../hooks/useQuizzes";
import { useCategories } from "../../hooks/useCategories";
import { useAttemptedQuizIds } from "../../hooks/useAttemptedQuizId";


export default function QuizPage() {
  const [selectedCat, setSelectedCat] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";

  const token = useSelector((s) => s.auth.accessToken);
  const navigate = useNavigate();

  const { data: quizRes, isLoading } = useQuizzes({category: selectedCat,sort,page,search});

  const { data: categories = [] } = useCategories(token);
  const { data: attemptedQuizIds = [] } = useAttemptedQuizIds(token);

  const quizzes = quizRes?.data || [];
  const pagination = quizRes?.pagination;

  const isAttempted = (id) => attemptedQuizIds.includes(id);

  const handleSearch = (value) => {
    setPage(1);
    value ? setParams({ search: value }) : setParams({});
  };

  return (
    <div className="min-h-screen p-8 container m-auto">
      <div className="flex gap-8">

        <div className="w-48">
          <h3 className="text-sm mb-4 font-semibold">TOPICS</h3>

          {categories.map((c) => (
            <label key={c._id} className="flex gap-2 text-sm cursor-pointer mb-2">
              <input type="checkbox" checked={selectedCat === c._id}
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
            <SearchBar value={search} onChange={handleSearch} placeholder="Search quizzes..." />

            <select value={sort} onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
              className="border px-3 py-1 rounded-md text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {isLoading ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {quizzes.map((quiz) => {
                  const attempted = isAttempted(quiz._id);

                  return (
                    <div key={quiz._id} className="bg-white rounded-xl overflow-hidden shadow-2xl hover:shadow-lg transition border border-black ">
                      <img src={quiz.image || QuizImg} className="h-40 w-full object-cover hover:scale-105 transition-transform duration-300 border-b  border-black" />

                      <div className="bg-slate-400  ">
                        <div className="flex justify-between items-start border-b p-2">
                          <h3 className="font-semibold">{quiz.title}</h3>

                          {attempted && (
                            <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                              Attempted
                            </span>
                          )}
                        </div>

                        <p className="text-xs  p-2 border-b">
                         <span className="text-gray-600">Questions :</span> {quiz.questionCount} 
                        </p>
                        <p className="text-xs p-2 border-b">
                         <span className="text-gray-600">Category :</span> {quiz.category?.name}
                        </p>

                        <button onClick={() => navigate(`/user/quiz/${quiz._id}`, {replace: true,})}
                          className={`mt w-full py-2 rounded font-medium transition text-white
                        ${attempted
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
