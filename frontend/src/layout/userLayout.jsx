import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

export default function UserLayout() {
  return (
    <>
      <div className="user-app">
        <Navbar />
      <Outlet />
      <Footer/>
      </div>
    </>
  );
}
