import { Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import UserLayout from "../layout/userLayout";
import QuizPage from "../pages/user/QuizPage";
import ContestPage from "../pages/user/ContestPage";


const userRoutes = (
  <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
    <Route path="quiz" element={<QuizPage/>} />
    <Route path="contest" element={<ContestPage/>} />
  </Route>
);

export default userRoutes;
