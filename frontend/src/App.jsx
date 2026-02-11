import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { refreshToken, setAuthChecked } from "./redux/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getSubdomain } from "./getSubdomain";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { useNotifications } from "./hooks/useNotifications";

function App() {
  const dispatch = useDispatch();
  const { accessToken, hasTriedRefresh } = useSelector((state) => state.auth);
  const subdomain = getSubdomain();

  useNotifications();

  useEffect(() => {
    if (subdomain === "admin") {
      dispatch(setAuthChecked());
      return;
    }

    if (!accessToken && !hasTriedRefresh) {
      dispatch(refreshToken());
    }
  }, [dispatch, accessToken, hasTriedRefresh, subdomain]);
  return (
    <BrowserRouter>
      {subdomain === "admin" ? <AdminRoutes /> : <UserRoutes />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
