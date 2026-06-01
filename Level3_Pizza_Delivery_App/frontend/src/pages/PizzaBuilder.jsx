import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../utils/api';
import PizzaPreview from '../components/PizzaPreview';
import PaymentModal from '../components/PaymentModal';
function PizzaBuilder() {
const [ingredients, setIngredients] = useState({});
const [loading, setLoading] = useState(true);
const [currentStep, setCurrentStep] = useState(1);
const [showPayment, setShowPayment] = useState(false);
const navigate = useNavigate();
const dispatch = useDispatch();
const { user } = useSelector((state) => state.auth);
const [pizza, setPizza] = useState({
base: null,
sauce: null,
cheese: null,
veggies: [],
meats: [],
});
useEffect(() => {
const fetchIngredients = async () => {
try {
const { data } = await api.get('/ingredients');
if (data.success) setIngredients(data.data);
} catch (error) {
toast.error('Failed to load ingredients');
} finally {
setLoading(false);
}
};
fetchIngredients();
}, []);
const calculateTotal = () => {
let total = 0;
if (pizza.base) total += pizza.base.price;
if (pizza.sauce) total += pizza.sauce.price;
if (pizza.cheese) total += pizza.cheese.price;
pizza.veggies.forEach((v) => (total += v.price));
pizza.meats.forEach((m) => (total += m.price));
return total.toFixed(2);
};
const handleSingleSelect = (category, item) => {
setPizza({ ...pizza, [category]: item });
};
const handleMultiSelect = (category, item) => {
const list = pizza[category];
const exists = list.find((i) => i._id === item._id);
if (exists) {
setPizza({ ...pizza, [category]: list.filter((i) => i._id !== item._id) });
} else {
setPizza({ ...pizza, [category]: [...list, item] });
}
};
const isSelected = (category, item) => {
if (Array.isArray(pizza[category])) {
return pizza[category].some((i) => i._id === item._id);
}
return pizza[category]?._id === item._id;
};
const canProceed = () => {
if (currentStep === 1) return pizza.base !== null;
if (currentStep === 2) return pizza.sauce !== null;
if (currentStep === 3) return pizza.cheese !== null;
return true;
};
const nextStep = () => {
if (!canProceed()) {
toast.error('Please make a selection to continue');
return;
}
setCurrentStep(currentStep + 1);
};
const prevStep = () => setCurrentStep(currentStep - 1);
const handlePlaceOrder = () => {
if (!pizza.base || !pizza.sauce || !pizza.cheese) {
toast.error('Please complete your pizza first');
return;
}
setShowPayment(true);
};
const handlePaymentSuccess = async (paymentId) => {
try {
const orderData = {
pizza: {
base: { id: pizza.base._id, name: pizza.base.name, price: pizza.base.price },
sauce: { id: pizza.sauce._id, name: pizza.sauce.name, price: pizza.sauce.price },
cheese: { id: pizza.cheese._id, name: pizza.cheese.name, price: pizza.cheese.price },
veggies: pizza.veggies.map((v) => ({ id: v._id, name: v.name, price: v.price })),
meats: pizza.meats.map((m) => ({ id: m._id, name: m.name, price: m.price })),
},
totalPrice: parseFloat(calculateTotal()),
paymentId: paymentId,
paymentStatus: 'Paid',
};
const { data } = await api.post('/orders', orderData);

  if (data.success) {
    setShowPayment(false);
    toast.success('Order placed successfully! 🍕');
    setTimeout(() => navigate('/dashboard'), 1500);
  }
} catch (error) {
  const message = error.response?.data?.message || 'Failed to place order';
  toast.error(message);
  setShowPayment(false);
}
};


const handleLogout = () => {
dispatch(logout());
toast.success('Logged out');
navigate('/login');
};
if (loading) {
return (
<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
<div className="text-center">
<div className="text-6xl mb-4 animate-bounce">🍕</div>
<p className="text-gray-600">Loading ingredients...</p>
</div>
</div>
);
}
const stepTitles = ['Choose Base', 'Choose Sauce', 'Choose Cheese', 'Add Veggies', 'Add Meats', 'Review & Order'];
const stepKeys = ['base', 'sauce', 'cheese', 'veggie', 'meat'];
return (
<div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50">
{/* NAVBAR */}
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
<main className="max-w-6xl mx-auto p-6">
    {/* PROGRESS BAR */}
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Build Your Pizza</h2>
        <span className="text-2xl font-bold text-orange-600">${calculateTotal()}</span>
      </div>
      <div className="flex items-center gap-2">
        {stepTitles.map((title, i) => (
          <div key={i} className="flex-1">
            <div
              className={`h-2 rounded-full ${
                i + 1 <= currentStep ? 'bg-linear-to-r from-orange-500 to-red-500' : 'bg-gray-200'
              }`}
            />
            <p className={`text-xs mt-1 ${i + 1 === currentStep ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
              {title}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* CONTENT GRID: Step content + Live Preview */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Step Content (2/3 width on large screens) */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Step {currentStep}: {stepTitles[currentStep - 1]}
        </h3>
        <p className="text-gray-500 mb-6">
          {currentStep <= 3 ? 'Choose one option' : currentStep <= 5 ? 'Choose as many as you like' : 'Review your pizza'}
        </p>

        {currentStep <= 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ingredients[currentStep <= 3 ? stepKeys[currentStep - 1] : stepKeys[currentStep - 1] + 's']?.map((item) => {
              const selected = isSelected(currentStep <= 3 ? stepKeys[currentStep - 1] : stepKeys[currentStep - 1] + 's', item);
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    if (currentStep <= 3) handleSingleSelect(stepKeys[currentStep - 1], item);
                    else handleMultiSelect(stepKeys[currentStep - 1] + 's', item);
                  }}
                  className={`cursor-pointer rounded-xl p-5 border-2 transition transform hover:scale-105 ${
                    selected
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    {selected && <span className="text-orange-500 text-xl">✓</span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                  <p className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* REVIEW STEP */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Your Pizza Summary 🍕</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between border-b border-orange-100 pb-2">
                  <span>Base: <strong>{pizza.base?.name}</strong></span>
                  <span>${pizza.base?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-orange-100 pb-2">
                  <span>Sauce: <strong>{pizza.sauce?.name}</strong></span>
                  <span>${pizza.sauce?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-orange-100 pb-2">
                  <span>Cheese: <strong>{pizza.cheese?.name}</strong></span>
                  <span>${pizza.cheese?.price.toFixed(2)}</span>
                </div>
                {pizza.veggies.length > 0 && (
                  <div className="border-b border-orange-100 pb-2">
                    <p className="font-semibold mb-1">Veggies:</p>
                    {pizza.veggies.map((v) => (
                      <div key={v._id} className="flex justify-between text-sm pl-4">
                        <span>{v.name}</span>
                        <span>${v.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {pizza.meats.length > 0 && (
                  <div className="border-b border-orange-100 pb-2">
                    <p className="font-semibold mb-1">Meats:</p>
                    {pizza.meats.map((m) => (
                      <div key={m._id} className="flex justify-between text-sm pl-4">
                        <span>{m.name}</span>
                        <span>${m.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between pt-2 text-xl font-bold text-orange-600">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition text-lg shadow-lg"
            >
              Place Order — ${calculateTotal()}
            </button>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          {currentStep < 6 && (
            <button
              onClick={nextStep}
              className="px-6 py-3 rounded-lg bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: Live Pizza Preview (1/3 width on large screens) */}
      <div className="lg:col-span-1">
        <PizzaPreview pizza={pizza} />
      </div>
    </div>
  </main>

  {/* PAYMENT MODAL */}
  {showPayment && (
    <PaymentModal
      amount={calculateTotal()}
      onSuccess={handlePaymentSuccess}
      onClose={() => setShowPayment(false)}
    />
  )}
</div>
);
}
export default PizzaBuilder;