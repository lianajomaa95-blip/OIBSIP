const express = require('express');
const router = express.Router();
const {
createOrder,
getMyOrders,
getOrderById,
confirmPayment,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/confirm-payment', protect, confirmPayment);
module.exports = router;