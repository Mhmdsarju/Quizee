import { useEffect, useState } from "react";
import useAdminList from "../../hooks/fetchData";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import QuizCard from "./rows/QuizCard";
import AddQuizModal from "./AddQuizModal";

export default function QuizManagement() {
  const {data,loading,pagination,search,setSearch,page,setPage, } = useAdminList({
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

  const handleAddSuccess = async () => {
  setOpenAdd(false);
  setPage(1);

  const res = await api.get("/admin/quiz", {
    params: { page: 1, limit: 6, search },
  });

  setQuizzes(res.data.data);
};


  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 mt-8">
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
          className="h-10 px-4 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
        >
          + Add Quiz
        </button>
      </div>
      {loading ? (
        <p className="text-center text-sm text-gray-400">
          Loading quizzes...
        </p>
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
        <div className="mt-10">
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {!loading && quizzes.length === 0 && search && (
        <div className="mt-6 text-center text-sm text-blue-quiz">
          No quizzes found for
          <span className="text-red-500 font-medium"> "{search}"</span>
        </div>
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
