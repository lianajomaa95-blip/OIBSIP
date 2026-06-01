import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import api from '../utils/api';
function AdminDashboard() {
const [activeTab, setActiveTab] = useState('overview');
const [stats, setStats] = useState(null);
const [orders, setOrders] = useState([]);
const [inventory, setInventory] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();
const dispatch = useDispatch();
const { user } = useSelector((state) => state.auth);
const fetchAll = async () => {
try {
const [statsRes, ordersRes, invRes] = await Promise.all([
api.get('/admin/stats'),
api.get('/admin/orders'),
api.get('/admin/inventory'),
]);
if (statsRes.data.success) setStats(statsRes.data.data);
if (ordersRes.data.success) setOrders(ordersRes.data.data);
if (invRes.data.success) setInventory(invRes.data.data);
} catch (error) {
toast.error('Failed to load admin data');
} finally {
setLoading(false);
}
};
useEffect(() => {
fetchAll();
}, []);
const handleLogout = () => {
dispatch(logout());
navigate('/login');
};
const handleStatusChange = async (orderId, newStatus) => {
try {
const { data } = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
if (data.success) {
toast.success(data.message);
setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
}
} catch (error) {
toast.error('Failed to update status');
}
};
const handleStockUpdate = async (id, newStock) => {
try {
const { data } = await api.put(`/admin/inventory/${id}`, { stock: parseInt(newStock) });
if (data.success) {
toast.success('Stock updated');
setInventory(inventory.map((i) => (i._id === id ? { ...i, stock: parseInt(newStock) } : i)));
}
} catch (error) {
toast.error('Failed to update stock');
}
};
const getStockColor = (stock, threshold) => {
if (stock <= threshold / 2) return 'text-red-600 bg-red-50';
if (stock <= threshold) return 'text-yellow-600 bg-yellow-50';
return 'text-green-600 bg-green-50';
};
const statusOptions = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];
if (loading) {
return (
<div className="min-h-screen flex items-center justify-center bg-gray-100">
<div className="text-center">
<div className="text-6xl mb-4 animate-bounce">⚙️</div>
<p className="text-gray-600">Loading admin panel...</p>
</div>
</div>
);
}
return (
<div className="min-h-screen bg-gray-100">
{/* NAVBAR */}
<nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
<div className="flex items-center gap-2">
<span className="text-2xl">🍕</span>
<h1 className="text-xl font-bold">Admin Panel</h1>
</div>
<div className="flex items-center gap-4">
<span className="text-gray-300 hidden sm:block">{user?.name} (Admin)</span>
<button
         onClick={handleLogout}
         className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
       >
Logout
</button>
</div>
</nav>
{/* TABS */}
  <div className="bg-white shadow-sm px-6">
    <div className="max-w-6xl mx-auto flex gap-1">
      {['overview', 'orders', 'inventory'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-4 font-semibold capitalize transition border-b-2 ${
            activeTab === tab
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>

  <main className="max-w-6xl mx-auto p-6">
    {/* OVERVIEW TAB */}
    {activeTab === 'overview' && stats && (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Total Customers</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Low Stock Items</p>
            <p className="text-3xl font-bold text-red-600">{stats.lowStockCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">Orders by Status</h3>
            <div className="space-y-3">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-gray-600">{status}</span>
                  <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">⚠️ Low Stock Alerts</h3>
            {stats.lowStockItems.length === 0 ? (
              <p className="text-green-600">All ingredients well stocked! ✅</p>
            ) : (
              <div className="space-y-2">
                {stats.lowStockItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-red-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-700 capitalize">{item.name} ({item.category})</span>
                    <span className="text-red-600 font-bold">{item.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* ORDERS TAB */}
    {activeTab === 'orders' && (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">All Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-500">
            No orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {order.user?.name} ({order.user?.email})
                  </p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">${order.totalPrice.toFixed(2)}</p>
                  <p className={`text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    💳 {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
                <span className="font-semibold">{order.pizza.base.name}</span> base, {order.pizza.sauce.name} sauce, {order.pizza.cheese.name} cheese
                {order.pizza.veggies?.length > 0 && <span> + {order.pizza.veggies.map(v => v.name).join(', ')}</span>}
                {order.pizza.meats?.length > 0 && <span> + {order.pizza.meats.map(m => m.name).join(', ')}</span>}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    )}

    {/* INVENTORY TAB */}
    {activeTab === 'inventory' && (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{item.category}</td>
                  <td className="px-4 py-3 text-gray-700">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStockColor(item.stock, item.threshold)}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={item.stock}
                      min="0"
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      onBlur={(e) => {
                        if (parseInt(e.target.value) !== item.stock) {
                          handleStockUpdate(item._id, e.target.value);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">💡 Edit a stock number and click outside the box to save.</p>
      </div>
    )}
  </main>
</div>
);
}
export default AdminDashboard;