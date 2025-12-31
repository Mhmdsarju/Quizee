import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <h2>Admin Sidebar</h2>
      <Outlet />
    </>
  );
}
