import { useEffect, useState } from "react";
import useAdminList from "../../hooks/fetchData";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import QuizCard from "./rows/QuizCard";
import AddQuizModal from "./AddQuizModal";

export default function QuizManagement() {
  const {data,loading,pagination,search,setSearch,page,setPage,} = useAdminList({
    endpoint: "/admin/quiz",
    limit: 6,
  });

  const [quizzes, setQuizzes] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    if (Array.isArray(data)) {
      setQuizzes(data);
    }
  }, [data]);

  const handleToggleUI = (id) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q._id === id ? { ...q, isActive: !q.isActive } : q
      )
    );
  };

  const handleEditSuccess = (updatedQuiz) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q._id === updatedQuiz._id ? updatedQuiz : q
      )
    );
  };

  const handleAddSuccess = (newQuiz) => {
    setOpenAdd(false);
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 mt-8">
        <h1 className="text-lg font-semibold text-blue-quiz">
          Quiz Management
        </h1>

        <SearchBar
          value={search}
          onChange={(val) => {
            setPage(1);
            setSearch(val);
          }}
          placeholder="Search quizzes..."
        />
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setOpenAdd(true)}
          className="h-10 px-4 bg-green-600 text-white rounded-md"
        >
          + Add Quiz
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q) => (
            <QuizCard
              key={q._id}
              {...q}
              onToggle={handleToggleUI}
              onEdit={handleEditSuccess}
            />
          ))}
        </div>
      )}

      {pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {openAdd && (
        <AddQuizModal
          onClose={() => setOpenAdd(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
