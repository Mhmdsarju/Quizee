import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import AdminLayout from '../layout/adminLayout';
import AdminDashboard from '../pages/admin/dashboard';


const adminRoutes=(
<Route path="/admin" element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
  <Route index element={<AdminDashboard/>}/>
</Route>
)


export default adminRoutes;