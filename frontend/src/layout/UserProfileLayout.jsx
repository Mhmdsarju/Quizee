import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

export default function UserProfileLayout() {
  return (
    <div className="flex min-h-screen bg-[#f3ead8]">
      <UserSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
