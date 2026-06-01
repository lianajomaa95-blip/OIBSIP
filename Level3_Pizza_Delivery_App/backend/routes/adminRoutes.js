const express = require('express');
const router = express.Router();
const {
getDashboardStats,
getAllOrders,
updateOrderStatus,
getInventory,
updateInventory,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
// All routes require login (protect) AND admin role (admin)
router.get('/stats', protect, admin, getDashboardStats);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/inventory', protect, admin, getInventory);
router.put('/inventory/:id', protect, admin, updateInventory);
module.exports = router;