const mongoose = require('mongoose');
const ingredientSchema = new mongoose.Schema(
{
name: {
type: String,
required: [true, 'Ingredient name is required'],
trim: true,
},
description: {
type: String,
default: '',
trim: true,
},
category: {
type: String,
enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
required: true,
},
price: {
type: Number,
required: true,
min: 0,
},
stock: {
type: Number,
required: true,
default: 50,
min: 0,
},
threshold: {
type: Number,
default: 20,
},
image: {
type: String,
default: '',
},
isAvailable: {
type: Boolean,
default: true,
},
},
{
timestamps: true,
}
);
module.exports = mongoose.model('Ingredient', ingredientSchema);