'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import Cookies from 'js-cookie';
import { postData } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifyType, setVerifyType] = useState('email'); // 'email' or 'forgot-password'
  const inputRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cooldownIntervalRef = useRef(null);

  useEffect(() => {
    // Get verify type from query params
    const type = searchParams.get('type') || 'email';
    const emailParam = searchParams.get('email');
    
    setVerifyType(type);
    
    // Get email from query params or cookies
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      const userEmail = Cookies.get('userEmail');
      if (userEmail) {
        setEmail(userEmail);
      } else {
        setError('Email not found. Please try again.');
      }
    }
  }, [searchParams]);

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
    setSuccess('');

    try {
      const otpCode = otp.join('');

      if (otpCode.length !== 6) {
        setError('Please enter all 6 digits');
        setLoading(false);
        return;
      }

      if (!email) {
        setError('Email not found. Please try again.');
        setLoading(false);
        return;
      }

      if (verifyType === 'email') {
        // Email verification flow
        console.log('Verifying email OTP:', email);
        const res = await postData('/api/users/verifyEmail', {
          email,
          otp: otpCode,
        });

        console.log('Email Verification Response:', res);
        
        if (res?.success === true) {
          console.log('Email verified successfully, redirecting to login');
          // Clear cookies and redirect to login
          Cookies.remove('userEmail');
          setSuccess('Email verified! Redirecting to login...');
          setTimeout(() => {
            router.push('/login');
          }, 500);
        } else {
          console.log('Email verification failed:', res?.message);
          setError(res?.message || 'Failed to verify OTP');
        }
      } else if (verifyType === 'forgot-password') {
        // Forgot password verification flow
        const normalizedEmail = email.trim().toLowerCase();
        console.log('Verifying OTP for forgot password:', normalizedEmail);
        
        const res = await postData('/api/users/verify-forgot-password', {
          email: normalizedEmail,
          otp: otpCode,
        });

        console.log('OTP Verification Response:', res);

        if (res?.success === true) {
          console.log('OTP verified successfully, redirecting to reset-password');
          // Store email in cookie to use in password reset page
          Cookies.set('resetEmail', normalizedEmail, { expires: 1 });
          setSuccess('OTP verified successfully! Redirecting...');
          setTimeout(() => {
            router.push('/reset-password');
          }, 500);
        } else {
          console.log('OTP verification failed:', res?.message);
          setError(res?.message || 'Failed to verify OTP');
        }
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

      const normalizedEmail = email.trim().toLowerCase();
      let res;
      if (verifyType === 'email') {
        res = await postData('/api/users/resendOtp', {
          email: normalizedEmail,
        });
      } else if (verifyType === 'forgot-password') {
        res = await postData('/api/users/resend-forgot-password-otp', {
          email: normalizedEmail,
        });
      }

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

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            {success}
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
