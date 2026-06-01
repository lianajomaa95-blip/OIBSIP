import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        if (!active) return;
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully! You can now login.');
        }
      } catch (error) {
        if (!active) return;
        setStatus('error');
        setMessage(
          error.response?.data?.message || 'Verification link is invalid or has expired.'
        );
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-100 to-red-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-5xl mb-2">
            {status === 'verifying' ? '🍕' : status === 'success' ? '✅' : '❌'}
          </h1>
          <h2 className="text-3xl font-bold text-gray-800">
            {status === 'verifying'
              ? 'Verifying Email'
              : status === 'success'
                ? 'Email Verified'
                : 'Verification Failed'}
          </h2>
        </div>

        <p className="text-gray-600 mb-8">
          {status === 'verifying' ? 'Please wait while we verify your email...' : message}
        </p>

        {status !== 'verifying' && (
          <Link
            to="/login"
            className="inline-block w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
