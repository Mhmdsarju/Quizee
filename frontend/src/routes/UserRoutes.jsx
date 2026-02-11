import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import PublicRoute from "./publicRoutes";

import UserLayout from "../layout/userLayout";
import UserProfileLayout from "../layout/UserProfileLayout";

import HomeUser from "../pages/user/home";
import QuizPage from "../pages/user/QuizPage";
import ContestPage from "../pages/user/ContestPage";
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
import GoogleSuccess from "../pages/GoogleSuccess";
import ContestLeaderboard from "../pages/user/ContestLeaderboard";
import ContestQuizPlay from "../pages/user/ContestQuizPlay";
import ContestIntro from "../pages/user/ContestIntro";
import NotFound from "../pages/NotFound";


const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomeUser />} />
      </Route>

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password/verify-otp" element={<ForgotOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/google-success" element={<GoogleSuccess />} />

      <Route element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
        <Route path="user/quiz" element={<QuizPage />} />
        <Route path="user/contest" element={<ContestPage />} />
        <Route path="user/quiz/:quizId" element={<QuizIntro />} />
        <Route path="user/quiz/:quizId/play" element={<QuizPlay />} />
        <Route path="user/quiz/:quizId/result" element={<QuizResult />} />
        <Route path="user/contest/:contestId/leaderboard" element={<ContestLeaderboard />} />
        <Route path="user/contest/:id/play" element={<ContestQuizPlay />} />
        <Route path="user/contest/:contestId/intro" element={<ContestIntro />} />
      </Route>

      <Route element={<ProtectedRoute role="user"><UserProfileLayout /></ProtectedRoute>}>
        <Route path="user/profile" element={<ProfilePage />} />
        <Route path="user/wallet" element={<UserWallet />} />
        <Route path="user/settings" element={<UserSettings />} />
        <Route path="user/history" element={<UserHistory />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default UserRoutes;
