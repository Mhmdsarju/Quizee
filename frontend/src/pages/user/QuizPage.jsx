import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Filter, X, ChevronDown } from "lucide-react";

import QuizImg from "../../assets/quiz.jpg";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import CategoryFilter from "../../components/CategoryFilter";

import { useQuizzes } from "../../hooks/useQuizzes";
import { useCategories } from "../../hooks/useCategories";
import { useAttemptedQuizIds } from "../../hooks/useAttemptedQuizId";

export default function QuizPage() {
  const [selectedCat, setSelectedCat] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";

  const token = useSelector((s) => s.auth.accessToken);
  const navigate = useNavigate();

  const { data: quizRes, isLoading } = useQuizzes({
    category: selectedCat,
    sort,
    page,
    search,
  });

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search quizzes..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm font-medium"
            >
              <Filter size={18} /> Filters
            </button>

            <div className="relative flex-1 md:flex-none">
              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                className="w-full appearance-none bg-white border border-gray-300 px-4 py-2 pr-10 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <CategoryFilter
                categories={categories}
                selectedCat={selectedCat}
                onSelect={(catId) => {
                  setPage(1);
                  setSelectedCat(catId);
                }}
              />
            </div>
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <Loader />
            ) : quizzes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-5xl mb-4">🔍</p>
                <p className="text-gray-800 font-semibold text-lg">
                  No quizzes found
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your filters or search term
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  {quizzes.map((quiz) => {
                    const attempted = isAttempted(quiz._id);

                    return (
                      <div
                        key={quiz._id}
                        className="group bg-white rounded-2xl overflow-hidden border border-black shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        <div className="relative overflow-hidden h-44">
                          <img
                            src={quiz.image || QuizImg}
                            alt={quiz.title}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 border border-black"
                          />

                          {attempted && (
                            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-md">
                              Attempted
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                            {quiz.title}
                          </h3>

                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                            <span>
                              Questions: <b>{quiz.questionCount}</b>
                            </span>
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold uppercase">
                              {quiz.category?.name}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/user/quiz/${quiz._id}`, {
                                replace: true,
                              })
                            }
                            className={`mt-auto w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-md
                              ${
                                attempted
                                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  : "bg-rose-600 hover:bg-rose-700 text-white"
                              }
                            `}
                          >
                            {attempted
                              ? "Retry Challenge"
                              : "Start Quiz"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {pagination && (
                  <div className="mt-10">
                    <Pagination
                      page={page}
                      totalPages={pagination.totalPages}
                      onPageChange={(p) => setPage(p)}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCat={selectedCat}
              onSelect={(catId) => {
                setPage(1);
                setSelectedCat(catId);
              }}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
