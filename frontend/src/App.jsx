import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { refreshToken, setAuthChecked } from "./redux/authSlice";


import { getSubdomain } from "./getSubdomain";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  const dispatch = useDispatch();
  const { accessToken, hasTriedRefresh } = useSelector((state) => state.auth);
const subdomain = getSubdomain();

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
    </BrowserRouter>
  );
}

export default App;
