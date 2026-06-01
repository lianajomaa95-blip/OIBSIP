const Order = require('../models/Order');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
const getDashboardStats = async (req, res) => {
try {
const totalOrders = await Order.countDocuments();
const totalUsers = await User.countDocuments({ role: 'user' });
// Calculate total revenue from paid orders
const paidOrders = await Order.find({ paymentStatus: 'Paid' });
const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

// Count low-stock ingredients (stock below threshold)
const lowStockItems = await Ingredient.find({
  $expr: { $lte: ['$stock', '$threshold'] },
});

// Orders by status
const ordersByStatus = {
  'Order Received': await Order.countDocuments({ status: 'Order Received' }),
  'In the Kitchen': await Order.countDocuments({ status: 'In the Kitchen' }),
  'Sent to Delivery': await Order.countDocuments({ status: 'Sent to Delivery' }),
  'Delivered': await Order.countDocuments({ status: 'Delivered' }),
};

res.status(200).json({
  success: true,
  data: {
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue.toFixed(2),
    lowStockCount: lowStockItems.length,
    lowStockItems: lowStockItems.map((i) => ({ name: i.name, stock: i.stock, category: i.category })),
    ordersByStatus,
  },
});
} catch (error) {
console.error('Get stats error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};
// @desc    Get all orders (admin view)
// @route   GET /api/admin/orders
// @access  Admin only
const getAllOrders = async (req, res) => {
try {
const orders = await Order.find()
.populate('user', 'name email')
.sort({ createdAt: -1 });
res.status(200).json({
  success: true,
  count: orders.length,
  data: orders,
});
} catch (error) {
console.error('Get all orders error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};
// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin only
const updateOrderStatus = async (req, res) => {
try {
const { status } = req.body;
const validStatuses = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];
if (!validStatuses.includes(status)) {
return res.status(400).json({ success: false, message: 'Invalid status' });
}
const order = await Order.findById(req.params.id);
if (!order) {
return res.status(404).json({ success: false, message: 'Order not found' });
}
order.status = status;
await order.save();
// REAL-TIME: notify the user who owns this order
const io = req.app.get('io');
io.to(order.user.toString()).emit('orderStatusUpdate', {
  orderId: order._id.toString(),
  status: status,
  message: `Your order #${order._id.toString().slice(-8).toUpperCase()} is now "${status}"`,
});

res.status(200).json({
  success: true,
  message: `Order status updated to "${status}"`,
  data: order,
});
} catch (error) {
console.error('Update order status error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};



// @desc    Get all ingredients (admin inventory view)
// @route   GET /api/admin/inventory
// @access  Admin only
const getInventory = async (req, res) => {
try {
const ingredients = await Ingredient.find().sort({ category: 1, name: 1 });
res.status(200).json({
  success: true,
  count: ingredients.length,
  data: ingredients,
});
} catch (error) {
console.error('Get inventory error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};
// @desc    Update ingredient stock
// @route   PUT /api/admin/inventory/:id
// @access  Admin only
const updateInventory = async (req, res) => {
try {
const { stock, price, threshold, isAvailable } = req.body;
const ingredient = await Ingredient.findById(req.params.id);
if (!ingredient) {
  return res.status(404).json({ success: false, message: 'Ingredient not found' });
}

if (stock !== undefined) ingredient.stock = stock;
if (price !== undefined) ingredient.price = price;
if (threshold !== undefined) ingredient.threshold = threshold;
if (isAvailable !== undefined) ingredient.isAvailable = isAvailable;

await ingredient.save();

res.status(200).json({
  success: true,
  message: 'Ingredient updated successfully',
  data: ingredient,
});
} catch (error) {
console.error('Update inventory error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};
module.exports = {
getDashboardStats,
getAllOrders,
updateOrderStatus,
getInventory,
updateInventory,
};