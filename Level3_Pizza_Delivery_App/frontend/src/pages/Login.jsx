import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import api from '../utils/api';
function Login() {
const [formData, setFormData] = useState({ email: '', password: '' });
const dispatch = useDispatch();
const navigate = useNavigate();
const { loading } = useSelector((state) => state.auth);
const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
e.preventDefault();
if (!formData.email || !formData.password) {
  toast.error('Please fill in all fields');
  return;
}

dispatch(loginStart());

try {
  const { data } = await api.post('/auth/login', formData);

  if (data.success) {
    dispatch(loginSuccess(data.data));
    toast.success('Welcome back, ' + data.data.name + '!');

    if (data.data.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }
} catch (error) {
  const message = error.response?.data?.message || 'Login failed. Please try again.';
  dispatch(loginFailure(message));
  toast.error(message);
}
};
return (
<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-100 to-red-100 p-6">
<div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full">
<div className="text-center mb-8">
<h1 className="text-5xl mb-2">🍕</h1>
<h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
<p className="text-gray-500 mt-2">Login to continue your pizza journey</p>
</div>
<form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your password"
        />
      </div>

      <div className="text-right">
        <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <p className="text-center text-gray-600 mt-6">
      Don't have an account?{' '}
      <Link to="/register" className="text-orange-600 font-semibold hover:text-orange-700">
        Sign up
      </Link>
    </p>
  </div>
</div>
);
}
export default Login;