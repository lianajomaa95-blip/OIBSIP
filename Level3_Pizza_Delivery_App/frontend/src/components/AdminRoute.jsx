import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
function AdminRoute({ children }) {
const { isAuthenticated, user } = useSelector((state) => state.auth);
if (!isAuthenticated) {
return <Navigate to="/login" />;
}
if (user?.role !== 'admin') {
return <Navigate to="/dashboard" />;
}
return children;
}
export default AdminRoute;