import { useEffect, useState } from "react";
import useAdminList from "../../hooks/fetchData";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import AddContestModal from "./AddContestModal";
import ContestCard from "./rows/ContestCard";
import EditContestModal from "./EditContestmodal";

export default function ContestManagement() {
  const {data,loading,pagination,search,setSearch,page,setPage,} = useAdminList({
    endpoint: "/admin/contest",
    limit: 6,
  });

  const [contests, setContests] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editContest, setEditContest] = useState(null);

  useEffect(() => {
    console.log("CONTEST API RESPONSE 👉", data);

    if (Array.isArray(data)) {
      setContests(data);
    } else if (Array.isArray(data?.data)) {
      setContests(data.data);
    } else if (Array.isArray(data?.contests)) {
      setContests(data.contests);
    } else {
      setContests([]);
    }
  }, [data]);

  const handleUpdateContest = (updatedContest) => {
    setEditContest(null);
    setContests((prev) =>
      prev.map((c) =>
        c._id === updatedContest._id ? updatedContest : c
      )
    );
  };

  const handleAddSuccess = (newContest) => {
    setOpenAdd(false);
    setContests((prev) => [newContest, ...prev]);
  };

  return (
    <div className="p-2">
  
      <div className="flex justify-between items-center mb-8 mt-8">
        <h1 className="text-lg font-semibold text-blue-quiz">
          Contest Management
        </h1>

        <SearchBar
          value={search}
          onChange={(val) => {
            setPage(1);
            setSearch(val);
          }}
          placeholder="Search contests..."
        />
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setOpenAdd(true)}
          className="h-10 px-4 bg-green-600 text-white rounded-md"
        >
          + Add Contest
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : contests.length === 0 ? (
        <p className="text-center text-gray-400">No contests found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard
              key={contest._id}
              contest={contest}
              onUpdate={handleUpdateContest}
              onEdit={() => setEditContest(contest)}
            />
          ))}
        </div>
      )}

      {pagination?.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {openAdd && (
        <AddContestModal
          onClose={() => setOpenAdd(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {editContest && (
        <EditContestModal
          contest={editContest}
          onClose={() => setEditContest(null)}
          onSuccess={handleUpdateContest}
        />
      )}
    </div>
  );
}
