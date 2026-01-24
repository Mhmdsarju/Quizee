import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import AdminLayout from "../layout/adminLayout";

import AdminDashboard from "../pages/admin/dashboard";
import UserManagement from "../pages/admin/UserManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";
import QuizzesManagement from "../pages/admin/QuizzesManagement";
import ContestManagement from "../pages/admin/ContestManagement";
import TransactionManagement from "../pages/admin/TransactionManagement";
import QuizQuestions from "../pages/admin/questions/QuizQuestions";
import Login from "../pages/login";

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Login />} />
      <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="quizzes" element={<QuizzesManagement />} />
        <Route path="contests" element={<ContestManagement />} />
        <Route path="transactions" element={<TransactionManagement />} />
        <Route path="/admin/quizzes/:quizId/questions" element={<QuizQuestions />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
