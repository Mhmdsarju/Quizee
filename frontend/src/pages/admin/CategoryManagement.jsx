import { useEffect, useState } from "react";
import useAdminList from "../../hooks/fetchData";
import AdminList from "../../components/AdminList";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import CategoryRow from "./rows/CategoryRow";
import AddCategoryModal from "./AddCategoryModal";

export default function CategoryManagement() {
  const {data,loading,pagination,search,setSearch,page,setPage,
  } = useAdminList({
    endpoint: "/admin/categories",
    limit: 5,
  });

  const [categories, setCategories] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    if (Array.isArray(data)) {
      setCategories(data);
    }
  }, [data]);
  const handleToggleUI = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };
  const handleEditSuccess = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((c) =>
        c._id === updatedCategory._id ? updatedCategory : c
      )
    );
  };

  const handleAddSuccess = (newCategory) => {
    setCategories((prev) => [newCategory, ...prev]);
    setOpenAdd(false);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-9 mt-8">
        <h1 className="text-sm sm:text-base md:text-lg font-semibold text-blue-quiz">
          Category Management
        </h1>

        <SearchBar
          value={search}
          onChange={(val) => {
            setPage(1);
            setSearch(val);
          }}
          placeholder="Search categories..."
        />
      </div>

      <div className="flex justify-end mb-3">
        <button
          onClick={() => setOpenAdd(true)}
          className="h-10 px-4 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <AdminList
        headers={["ID", "Category Name", "Status", "Actions"]}
        data={categories}
        loading={loading}
        renderRow={(c) => (
          <CategoryRow
            {...c}
            onRefresh={handleToggleUI}
            onEdit={handleEditSuccess}
          />
        )}
      />

      {pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {!loading && categories.length === 0 && search && (
        <div className="mt-6 text-center text-blue-quiz text-sm">
          No categories found for
          <span className="text-red-500 font-medium"> "{search}"</span>
        </div>
      )}

      {openAdd && (
        <AddCategoryModal
          onClose={() => setOpenAdd(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
