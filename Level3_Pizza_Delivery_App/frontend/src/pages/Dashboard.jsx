import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
function Dashboard() {
const { user } = useSelector((state) => state.auth);
const dispatch = useDispatch();
const navigate = useNavigate();
const handleLogout = () => {
dispatch(logout());
toast.success('Logged out successfully');
navigate('/login');
};
return (
<div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50">
<nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
<div className="flex items-center gap-2">
<span className="text-2xl">🍕</span>
<h1 className="text-xl font-bold text-gray-800">Pizza Delivery</h1>
</div>
<div className="flex items-center gap-4">
<span className="text-gray-700">Hi, {user?.name}</span>
<button
         onClick={handleLogout}
         className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
       >
Logout
</button>
</div>
</nav>
<main className="max-w-4xl mx-auto p-6">
    <div className="bg-white rounded-2xl shadow-xl p-10">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}! 👋
        </h2>
        <p className="text-gray-600">
          {user?.isVerified
            ? "Your account is verified. Ready to order?"
            : '📧 Check your email to verify your account.'}
        </p>
      </div>

      <button
        onClick={() => navigate('/build-pizza')}
        className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-bold py-5 rounded-xl hover:from-orange-600 hover:to-red-600 transition text-xl shadow-lg mb-6"
      >
        🍕 Build Your Custom Pizza
      </button>
      <button
        onClick={() => navigate('/my-orders')}
        className="w-full bg-white border-2 border-orange-500 text-orange-600 font-bold py-4 rounded-xl hover:bg-orange-50 transition text-lg mb-6"
      >
        📦 View My Orders
      </button>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Account Info</h3>
        <p className="text-gray-600">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="text-gray-600">
          <strong>Role:</strong> {user?.role}
        </p>
        <p className="text-gray-600">
          <strong>Verified:</strong> {user?.isVerified ? '✅ Yes' : '❌ Not yet'}
        </p>
      </div>
    </div>
  </main>
</div>
);
}
export default Dashboard;