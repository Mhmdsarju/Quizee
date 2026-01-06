import { useEffect, useState } from "react";
import useAdminList from "../../hooks/fetchUsers";
import AdminList from "../../components/AdminList";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import UserRow from "./rows/UserRow";

export default function UserManagement() {
  const {data,loading,pagination,search,setSearch,page,setPage,} = useAdminList({
    endpoint: "/admin/users",
    limit: 10,
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  const handleBlockToggleUI = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-9 mt-8">
        <h1 className="text-xl font-semibold text-blue-quiz">
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
        data={users}
        loading={loading}
        renderRow={(u) => (
          <UserRow {...u} onRefresh={handleBlockToggleUI} />
        )}
      />

      {pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
