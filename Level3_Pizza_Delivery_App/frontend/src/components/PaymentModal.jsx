import { useState } from 'react';
import toast from 'react-hot-toast';
function PaymentModal({ amount, onSuccess, onClose }) {
const [processing, setProcessing] = useState(false);
const [step, setStep] = useState('details'); // 'details' or 'processing' or 'success'
const handlePay = () => {
setStep('processing');
setProcessing(true);
// Simulate payment processing delay (like real gateways)
setTimeout(() => {
  setStep('success');
  setTimeout(() => {
    const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    onSuccess(mockPaymentId);
  }, 1000);
}, 2000);
};
return (
<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
{/* HEADER */}
<div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-5 flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="bg-white text-blue-700 font-bold rounded-lg px-3 py-1 text-sm">
Razorpay
</div>
<span className="text-sm opacity-90">Secure Test Payment</span>
</div>
{step === 'details' && (
<button
           onClick={onClose}
           className="text-white hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center transition"
         >
✕
</button>
)}
</div>
{/* CONTENT */}
    <div className="p-6">
      {/* DETAILS STEP */}
      {step === 'details' && (
        <>
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="text-4xl font-bold text-gray-800">${amount}</p>
            <p className="text-xs text-gray-400 mt-1">Pizza Delivery</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-5">
            <p className="text-xs text-yellow-800 font-semibold mb-1">⚠️ TEST MODE</p>
            <p className="text-xs text-yellow-700">
              This is a simulated payment. No real charges will be made.
            </p>
          </div>

          <div className="space-y-3 mb-5">
            <p className="text-sm font-semibold text-gray-700">Test Card Details (pre-filled):</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Card Number</span>
                <span className="font-mono text-gray-800">4111 1111 1111 1111</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expiry</span>
                <span className="font-mono text-gray-800">12/26</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">CVV</span>
                <span className="font-mono text-gray-800">123</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-800">Test User</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePay}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
          >
            Pay ${amount}
          </button>

          <button
            onClick={onClose}
            className="w-full text-gray-500 text-sm py-3 hover:text-gray-700"
          >
            Cancel Payment
          </button>
        </>
      )}

      {/* PROCESSING STEP */}
      {step === 'processing' && (
        <div className="text-center py-12">
          <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment...</h3>
          <p className="text-gray-500 text-sm">Please don't close this window</p>
          <p className="text-gray-400 text-xs mt-4">Verifying card details...</p>
        </div>
      )}

      {/* SUCCESS STEP */}
      {step === 'success' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-500 text-sm">Amount charged: ${amount}</p>
          <p className="text-xs text-gray-400 mt-3">Confirming your order...</p>
        </div>
      )}
    </div>

    {/* FOOTER */}
    {step === 'details' && (
      <div className="bg-gray-50 px-6 py-3 text-center">
        <p className="text-xs text-gray-400">Secured by Razorpay (Mock for Demo)</p>
      </div>
    )}
  </div>
</div>
);
}
export default PaymentModal;