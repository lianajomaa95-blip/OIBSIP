import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import api from '../utils/api';
import socket from '../utils/socket';
function MyOrders() {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();
const dispatch = useDispatch();
const { user } = useSelector((state) => state.auth);
useEffect(() => {
const fetchOrders = async () => {
try {
const { data } = await api.get('/orders/my-orders');
if (data.success) setOrders(data.data);
} catch (error) {
toast.error('Failed to load orders');
} finally {
setLoading(false);
}
};
fetchOrders();
// REAL-TIME: connect socket and listen for status updates
if (user?._id) {
  socket.connect();
  socket.emit('join', user._id);

  socket.on('orderStatusUpdate', (data) => {
    toast.success(data.message, { duration: 4000, icon: '🔔' });
    // Update the specific order's status live
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === data.orderId ? { ...order, status: data.status } : order
      )
    );
  });
}

// Cleanup when leaving the page
return () => {
  socket.off('orderStatusUpdate');
  socket.disconnect();
};
}, [user?._id]);
const handleLogout = () => {
dispatch(logout());
navigate('/login');
};
const getStatusColor = (status) => {
const colors = {
'Order Received': 'bg-blue-100 text-blue-700',
'In the Kitchen': 'bg-yellow-100 text-yellow-700',
'Sent to Delivery': 'bg-purple-100 text-purple-700',
'Delivered': 'bg-green-100 text-green-700',
};
return colors[status] || 'bg-gray-100 text-gray-700';
};
return (
<div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50">
<nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
<div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
<span className="text-2xl">🍕</span>
<h1 className="text-xl font-bold text-gray-800">Pizza Delivery</h1>
</div>
<div className="flex items-center gap-4">
<span className="text-gray-700 hidden sm:block">Hi, {user?.name}</span>
<button
         onClick={handleLogout}
         className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
       >
Logout
</button>
</div>
</nav>
<main className="max-w-4xl mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
      <button
        onClick={() => navigate('/build-pizza')}
        className="bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold px-5 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition"
      >
        + New Order
      </button>
    </div>

    {loading ? (
      <div className="text-center py-12">
        <div className="text-5xl mb-4 animate-bounce">🍕</div>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    ) : orders.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🍕</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet!</h3>
        <p className="text-gray-500 mb-6">Build your first pizza and start ordering.</p>
        <button
          onClick={() => navigate('/build-pizza')}
          className="bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition"
        >
          Build a Pizza
        </button>
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Base</p>
                  <p className="font-semibold text-gray-700">{order.pizza.base.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Sauce</p>
                  <p className="font-semibold text-gray-700">{order.pizza.sauce.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Cheese</p>
                  <p className="font-semibold text-gray-700">{order.pizza.cheese.name}</p>
                </div>
                {order.pizza.veggies?.length > 0 && (
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-gray-500 text-xs">Veggies</p>
                    <p className="font-semibold text-gray-700 text-sm">
                      {order.pizza.veggies.map((v) => v.name).join(', ')}
                    </p>
                  </div>
                )}
                {order.pizza.meats?.length > 0 && (
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-gray-500 text-xs">Meats</p>
                    <p className="font-semibold text-gray-700 text-sm">
                      {order.pizza.meats.map((m) => m.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className={`text-xs mt-1 font-semibold ${
                  order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  💳 {order.paymentStatus}
                </p>
              </div>
              <p className="text-2xl font-bold text-orange-600">${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
</div>
);
}
export default MyOrders;