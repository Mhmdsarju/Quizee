import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
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
import QuizzesManagement from "./pages/admin/QuizzesManagement";
import ContestManagement from "./pages/admin/ContestManagement";
import TransactionManagement from "./pages/admin/TransactionManagement";
import UserManagement from "./pages/admin/UserManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import UserProfileLayout from "./layout/UserProfileLayout";
import ProfilePage from "./pages/user/userProfile";
import ProtectedRoute from "./routes/protectedRoute";
import PublicRoute from "./routes/publicRoutes";
import { refreshToken } from "./redux/authSlice";
import UserWallet from "./pages/user/UserWallet";
import UserSettings from "./pages/user/UserSettings";
import UserHistory from "./pages/user/UserHistory";
import UserNotifications from "./pages/user/UserNotifications";
import GoogleSuccess from "./pages/GoogleSuccess";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<ProtectedRoute role="user"><UserLayout/></ProtectedRoute>}>
          <Route path="/" element={<HomeUser />} />
        </Route>

        <Route element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
          <Route path="/user/quiz" element={<QuizPage />} />
          <Route path="/user/contest" element={<ContestPage />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
        </Route>

        <Route element={ <ProtectedRoute role="user"><UserProfileLayout /></ProtectedRoute>}>
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/wallet" element={<UserWallet />} />
          <Route path="/user/settings" element={<UserSettings />} />
          <Route path="/user/history" element={<UserHistory />} />
        </Route>

        <Route path="/admin"element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="quizzes" element={<QuizzesManagement />} />
          <Route path="contests" element={<ContestManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
        </Route>

        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/verify-otp" element={<ForgotOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
