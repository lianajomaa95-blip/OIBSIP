import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PizzaBuilder from './pages/PizzaBuilder';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
function ProtectedRoute({ children }) {
const { isAuthenticated } = useSelector((state) => state.auth);
return isAuthenticated ? children : <Navigate to="/login" />;
}
function App() {
const { isAuthenticated, user } = useSelector((state) => state.auth);
const home = isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login';
return (
<Routes>
<Route path="/" element={<Navigate to={home} />} />
<Route path="/login" element={isAuthenticated ? <Navigate to={home} /> : <Login />} />
<Route path="/register" element={isAuthenticated ? <Navigate to={home} /> : <Register />} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/build-pizza" element={<ProtectedRoute><PizzaBuilder /></ProtectedRoute>} />
<Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
</Routes>
);
}
export default App;
