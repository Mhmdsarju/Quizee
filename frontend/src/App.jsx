import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import UserLayout from "./layout/userLayout";
import HomeUser from "./pages/user/home";
import ProtectedRoute from "./routes/protectedRoute";
import UserRoutes from "./routes/userRoutes";
import userRoutes from "./routes/userRoutes";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<UserLayout />}>
          <Route path="/" element={<HomeUser />} />
        </Route>

        {userRoutes}
       

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
