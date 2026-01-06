import { useEffect, useState } from "react";
import useAdminList from "../../hooks/fetchUsers";
import AdminList from "../../components/AdminList";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import UserRow from "./rows/UserRow";

export default function UserManagement() {
  const { data, loading, pagination, search, setSearch, page, setPage } =
    useAdminList({
      endpoint: "/admin/users",
      limit: 10,
    });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  const handleBlockToggleUI = (id) => {
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBlocked: !u.isBlocked } : u)));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-9 mt-8">
        <h1 className="text-sm sm:text-base md:text-lg font-semibold text-blue-quiz">
          User Management
        </h1>

        <SearchBar
          value={search}
          onChange={(val) => {
            setPage(1);
            setSearch(val);
          }}
          placeholder="Search users..."
        />
      </div>

      <AdminList
        headers={["ID", "User Info", "Role", "Status", "Actions"]}
        data={users.filter((u)=>u.role!="admin")}
        loading={loading}
        renderRow={(u) => <UserRow {...u} onRefresh={handleBlockToggleUI} />}
      />

      {pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
      {!loading && users.length === 0 && search && (
        <div className="mt-6 text-center text-blue-quiz text-sm">
          No users found for
          <span className="text-red-500 font-medium"> "{search}"</span>
        </div>
      )}
    </div>
  );
}
