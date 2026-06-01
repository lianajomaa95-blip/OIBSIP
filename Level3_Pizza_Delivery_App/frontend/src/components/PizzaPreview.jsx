
import { useMemo } from 'react';
// Maps for toppings — emojis that appear visually on the pizza
const veggieEmojis = {
Mushrooms: '🍄',
Onions: '🧅',
'Bell Peppers': '🫑',
Olives: '🫒',
Tomatoes: '🍅',
Jalapeños: '🌶️',
Spinach: '🥬',
Corn: '🌽',
};
const meatEmojis = {
Pepperoni: '🍕',
Chicken: '🍗',
Beef: '🥩',
Bacon: '🥓',
Sausage: '🌭',
};
// Sauce colors
const sauceColors = {
'Classic Tomato': '#dc2626',
Pesto: '#65a30d',
'BBQ Sauce': '#92400e',
'White Garlic': '#fef3c7',
'Spicy Marinara': '#b91c1c',
};
// Base colors
const baseColors = {
'Thin Crust': '#d97706',
'Pan Crust': '#b45309',
'Stuffed Crust': '#92400e',
'Whole Wheat': '#78350f',
'Gluten Free': '#fbbf24',
};
function PizzaPreview({ pizza }) {
const sauceColor = pizza.sauce ? sauceColors[pizza.sauce.name] || '#dc2626' : null;
const baseColor = pizza.base ? baseColors[pizza.base.name] || '#d97706' : '#e5e7eb';
// Generate random positions for toppings — stable per ingredient
const toppingPositions = useMemo(() => {
const all = [...pizza.veggies, ...pizza.meats];
return all.map((item, idx) => {
// Use ingredient ID to seed a "random" but stable position
const seed = item._id.charCodeAt(0) + item._id.charCodeAt(1) + idx;
const angle = (seed * 37) % 360;
const radius = 25 + ((seed * 13) % 25);
const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
const emoji = veggieEmojis[item.name] || meatEmojis[item.name] || '🍕';
return { x, y, emoji, id: item._id };
});
}, [pizza.veggies, pizza.meats]);
return (
<div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
<h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Live Preview</h3>
<div className="relative w-full aspect-square max-w-xs mx-auto">
    {/* Empty plate when nothing selected */}
    {!pizza.base && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full border-4 border-dashed border-gray-200">
        <div className="text-center text-gray-400">
          <div className="text-5xl mb-2">🍽️</div>
          <p className="text-sm">Select a base to start</p>
        </div>
      </div>
    )}

    {/* PIZZA BASE (crust) */}
    {pizza.base && (
      <div
        className="absolute inset-0 rounded-full shadow-lg transition-all duration-500"
        style={{ backgroundColor: baseColor, border: '6px solid #92400e' }}
      />
    )}

    {/* SAUCE LAYER */}
    {pizza.sauce && (
      <div
        className="absolute inset-3 rounded-full transition-all duration-500"
        style={{ backgroundColor: sauceColor, opacity: 0.85 }}
      />
    )}

    {/* CHEESE LAYER (subtle yellow overlay with texture) */}
    {pizza.cheese && (
      <div
        className="absolute inset-5 rounded-full transition-all duration-500"
        style={{
          background: 'radial-gradient(circle, #fef3c7 30%, #fde68a 70%)',
          opacity: 0.7,
        }}
      />
    )}

    {/* TOPPINGS (veggies + meats as emojis) */}
    {toppingPositions.map((t) => (
      <div
        key={t.id}
        className="absolute text-2xl transition-all duration-300"
        style={{
          left: `${t.x}%`,
          top: `${t.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {t.emoji}
      </div>
    ))}
  </div>

  {/* INGREDIENT SUMMARY BELOW PIZZA */}
  <div className="mt-6 space-y-2 text-sm">
    {pizza.base && (
      <div className="flex justify-between text-gray-700">
        <span>🥖 {pizza.base.name}</span>
        <span className="font-medium">${pizza.base.price.toFixed(2)}</span>
      </div>
    )}
    {pizza.sauce && (
      <div className="flex justify-between text-gray-700">
        <span>🥫 {pizza.sauce.name}</span>
        <span className="font-medium">${pizza.sauce.price.toFixed(2)}</span>
      </div>
    )}
    {pizza.cheese && (
      <div className="flex justify-between text-gray-700">
        <span>🧀 {pizza.cheese.name}</span>
        <span className="font-medium">${pizza.cheese.price.toFixed(2)}</span>
      </div>
    )}
    {pizza.veggies.length > 0 && (
      <div className="text-gray-700">
        <p className="font-semibold mb-1">🥗 Veggies:</p>
        {pizza.veggies.map((v) => (
          <div key={v._id} className="flex justify-between pl-4 text-xs">
            <span>{veggieEmojis[v.name] || '•'} {v.name}</span>
            <span>${v.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    )}
    {pizza.meats.length > 0 && (
      <div className="text-gray-700">
        <p className="font-semibold mb-1">🍖 Meats:</p>
        {pizza.meats.map((m) => (
          <div key={m._id} className="flex justify-between pl-4 text-xs">
            <span>{meatEmojis[m.name] || '•'} {m.name}</span>
            <span>${m.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
);
}
export default PizzaPreview;