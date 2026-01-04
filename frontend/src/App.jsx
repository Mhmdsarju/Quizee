import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotOtp from "./pages/ForgetOtp";
import ResetPassword from "./pages/ResetPassword";
import UserLayout from "./layout/userLayout";
import HomeUser from "./pages/user/home";
import QuizPage from "./pages/user/QuizPage";
import ContestPage from "./pages/user/ContestPage";
import AdminLayout from "./layout/adminLayout";
import AdminDashboard from "./pages/admin/dashboard";
import ProtectedRoute from "./routes/protectedRoute";
import PublicRoute from "./routes/publicRoutes";
import { refreshToken } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(refreshToken());
}, [dispatch]);


  return (
    <BrowserRouter>
      <Routes>

        <Route element={<UserLayout />}>
          <Route path="/" element={<HomeUser />} />
        </Route>

        <Route path="/user"element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route path="quiz" element={<QuizPage />} />
          <Route path="contest" element={<ContestPage />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="/login"element={<PublicRoute><Login /></PublicRoute>}/>
        <Route path="/signup"element={<PublicRoute><Signup /></PublicRoute>}/>
        <Route path="/verify-otp"element={<PublicRoute><VerifyOtp /></PublicRoute>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/verify-otp" element={<ForgotOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
