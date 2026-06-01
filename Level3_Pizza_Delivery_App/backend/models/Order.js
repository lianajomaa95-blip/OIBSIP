const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},
pizza: {
base: {
id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
name: String,
price: Number,
},
sauce: {
id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
name: String,
price: Number,
},
cheese: {
id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
name: String,
price: Number,
},
veggies: [
{
id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
name: String,
price: Number,
},
],
meats: [
{
id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
name: String,
price: Number,
},
],
},
totalPrice: {
type: Number,
required: true,
},
status: {
type: String,
enum: ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
default: 'Order Received',
},
paymentId: {
type: String,
default: '',
},
paymentStatus: {
type: String,
enum: ['Pending', 'Paid', 'Failed'],
default: 'Pending',
},
},
{
timestamps: true,
}
);
module.exports = mongoose.model('Order', orderSchema);