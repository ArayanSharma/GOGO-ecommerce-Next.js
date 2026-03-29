'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('rinku.planetc@gmail.com'); // This should come from previous step
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const otpCode = otp.join('');

      if (otpCode.length !== 6) {
        setError('Please enter all 6 digits');
        setLoading(false);
        return;
      }

      // Add your OTP verification logic here
      console.log('Verifying OTP:', otpCode);
      // TODO: Connect to backend API
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
        {/* Shield Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Shield size={80} className="text-blue-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Verify OTP
        </h1>

        {/* Email Display */}
        <p className="text-center text-gray-600 text-sm mb-6">
          OTP send to <span className="text-teal-500 font-semibold">{email}</span>
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* OTP Input Boxes Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
              />
            ))}
          </div>

          {/* Verify OTP Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'VERIFYING...' : 'VERIFY OTP'}
          </button>
        </form>

        {/* Resend OTP Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Didn't receive OTP?{' '}
            <button className="text-teal-500 font-semibold hover:underline">
              Resend
            </button>
          </p>
        </div>

        {/* Back to Login Link */}
        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-gray-700 hover:text-teal-500 font-semibold text-sm flex items-center justify-center gap-1 transition"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
