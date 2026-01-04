import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import UserLayout from "./layout/userLayout";
import HomeUser from "./pages/user/home";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshToken } from "./redux/authSlice";
import VerifyOtp from "./pages/VerifyOtp";
import PublicRoute from "./routes/publicRoutes"; 

function App() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      dispatch(refreshToken());
    }
  }, [dispatch, accessToken]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomeUser />} />
        </Route>

        {userRoutes}
        {adminRoutes}
          
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
        <Route path="/signup"element={<PublicRoute><Signup /></PublicRoute>}/>
        <Route path="/verify-otp"element={<PublicRoute><VerifyOtp /></PublicRoute>}/></Routes>
    </BrowserRouter>
  );
}

export default App;
