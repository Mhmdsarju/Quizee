import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import PublicRoute from "./publicRoutes";

import UserLayout from "../layout/userLayout";
import UserProfileLayout from "../layout/UserProfileLayout";

import HomeUser from "../pages/user/home";
import QuizPage from "../pages/user/QuizPage";
import ContestPage from "../pages/user/ContestPage";
import UserNotifications from "../pages/user/UserNotifications";
import QuizIntro from "../pages/user/QuizIntro";
import QuizPlay from "../pages/user/QuizPlay";
import QuizResult from "../pages/user/QuizResult";
import ProfilePage from "../pages/user/userProfile";
import UserWallet from "../pages/user/UserWallet";
import UserSettings from "../pages/user/UserSettings";
import UserHistory from "../pages/user/UserHistory";
import VerifyOtp from "../pages/VerifyOtp";
import ForgotPassword from "../pages/ForgotPassword";
import ForgotOtp from "../pages/ForgetOtp";
import ResetPassword from "../pages/ResetPassword";
import Login from "../pages/login";
import Signup from "../pages/signup";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/verify-otp" element={<ForgotOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
       

      <Route element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
        <Route index element={<HomeUser />} />
        <Route path="user/quiz" element={<QuizPage />} />
        <Route path="user/contest" element={<ContestPage />} />
        <Route path="user/notifications" element={<UserNotifications />} />
        <Route path="user/quiz/:quizId" element={<QuizIntro />} />
        <Route path="user/quiz/:quizId/play" element={<QuizPlay />} />
        <Route path="user/quiz/:quizId/result" element={<QuizResult />} />
      </Route>

      <Route element={<ProtectedRoute role="user"><UserProfileLayout /></ProtectedRoute>}>
        <Route path="user/profile" element={<ProfilePage />} />
        <Route path="user/wallet" element={<UserWallet />} />
        <Route path="user/settings" element={<UserSettings />} />
        <Route path="user/history" element={<UserHistory />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
