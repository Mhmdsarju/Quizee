import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <>
      <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-quiz-admin p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
    </>
  );
}
