require('dotenv').config();
const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient');
const ingredients = [
// BASES (5)
{ name: 'Thin Crust', description: 'Classic crispy thin crust', category: 'base', price: 5, stock: 50 },
{ name: 'Pan Crust', description: 'Thick and fluffy pan crust', category: 'base', price: 6, stock: 50 },
{ name: 'Stuffed Crust', description: 'Cheese-stuffed edges', category: 'base', price: 8, stock: 30 },
{ name: 'Whole Wheat', description: 'Healthy whole wheat crust', category: 'base', price: 7, stock: 40 },
{ name: 'Gluten Free', description: 'Gluten-free alternative', category: 'base', price: 9, stock: 25 },
// SAUCES (5)
{ name: 'Classic Tomato', description: 'Traditional Italian tomato sauce', category: 'sauce', price: 1.5, stock: 100 },
{ name: 'Pesto', description: 'Fresh basil pesto', category: 'sauce', price: 2.5, stock: 50 },
{ name: 'BBQ Sauce', description: 'Smoky barbecue', category: 'sauce', price: 2, stock: 60 },
{ name: 'White Garlic', description: 'Creamy garlic sauce', category: 'sauce', price: 2, stock: 50 },
{ name: 'Spicy Marinara', description: 'Tomato with a kick', category: 'sauce', price: 2, stock: 50 },
// CHEESES (5)
{ name: 'Mozzarella', description: 'Classic stretchy cheese', category: 'cheese', price: 3, stock: 80 },
{ name: 'Cheddar', description: 'Sharp cheddar', category: 'cheese', price: 3.5, stock: 50 },
{ name: 'Parmesan', description: 'Aged Italian parmesan', category: 'cheese', price: 4, stock: 40 },
{ name: 'Feta', description: 'Crumbly Greek cheese', category: 'cheese', price: 4, stock: 35 },
{ name: 'Vegan Cheese', description: 'Plant-based cheese', category: 'cheese', price: 5, stock: 25 },
// VEGGIES (8)
{ name: 'Mushrooms', description: 'Fresh sliced mushrooms', category: 'veggie', price: 1, stock: 100 },
{ name: 'Onions', description: 'Red and white onions', category: 'veggie', price: 0.5, stock: 100 },
{ name: 'Bell Peppers', description: 'Mixed colored peppers', category: 'veggie', price: 1, stock: 100 },
{ name: 'Olives', description: 'Black and green olives', category: 'veggie', price: 1.5, stock: 80 },
{ name: 'Tomatoes', description: 'Fresh cherry tomatoes', category: 'veggie', price: 1, stock: 100 },
{ name: 'Jalapeños', description: 'Spicy jalapeño slices', category: 'veggie', price: 1, stock: 60 },
{ name: 'Spinach', description: 'Baby spinach leaves', category: 'veggie', price: 1, stock: 70 },
{ name: 'Corn', description: 'Sweet corn kernels', category: 'veggie', price: 1, stock: 80 },
// MEATS (5)
{ name: 'Pepperoni', description: 'Classic pepperoni slices', category: 'meat', price: 3, stock: 80 },
{ name: 'Chicken', description: 'Grilled chicken', category: 'meat', price: 4, stock: 60 },
{ name: 'Beef', description: 'Seasoned ground beef', category: 'meat', price: 4, stock: 50 },
{ name: 'Bacon', description: 'Crispy bacon bits', category: 'meat', price: 3.5, stock: 50 },
{ name: 'Sausage', description: 'Italian sausage', category: 'meat', price: 3.5, stock: 60 },
];
const seedDatabase = async () => {
try {
await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');
await Ingredient.deleteMany({});
console.log('Cleared existing ingredients');

await Ingredient.insertMany(ingredients);
console.log(`Successfully seeded ${ingredients.length} ingredients`);

process.exit(0);
} catch (error) {
console.error('Seeding error:', error);
process.exit(1);
}
};
seedDatabase();