'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import Cookies from 'js-cookie';
import { postData } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const router = useRouter();
  const cooldownIntervalRef = useRef(null);

  useEffect(() => {
    // Get email from cookies (set during registration)
    const userEmail = Cookies.get('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    } else {
      setError('Email not found. Please register first.');
    }
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownIntervalRef.current);
  }, [resendCooldown]);

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

      if (!email) {
        setError('Email not found. Please register first.');
        setLoading(false);
        return;
      }

      // Call backend API to verify OTP
      const res = await postData('/api/users/verifyEmail', {
        email,
        otp: otpCode,
      });

      if (res?.success === true || res?.error === false) {
        // Clear cookies and redirect to login
        Cookies.remove('userEmail');
        router.push('/login');
      } else {
        setError(res?.message || 'Failed to verify OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      if (!email) {
        setError('Email not found');
        return;
      }

      // Call backend API to resend OTP
      const res = await postData('/api/users/resendOtp', {
        email,
      });

      if (res?.success === true || res?.error === false) {
        setError('');
        alert('OTP sent successfully!');
        setOtp(['', '', '', '', '', '']);
        // Start 2 minute (120 seconds) cooldown
        setResendCooldown(120);
      } else {
        setError(res?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
            <button 
              type="button"
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
              className="text-teal-500 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {resendCooldown > 0 
                ? `Resend (${resendCooldown}s)` 
                : resending 
                ? 'Resending...' 
                : 'Resend'}
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
