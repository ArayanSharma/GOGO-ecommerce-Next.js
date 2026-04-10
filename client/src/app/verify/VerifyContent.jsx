'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import Cookies from 'js-cookie';
import { postData } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyContent() {
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
    setSuccess('');

    try {
      if (!email) {
        setError('Email not found. Please try again.');
        setResending(false);
        return;
      }

      if (verifyType === 'email') {
        // Resend email verification OTP
        const res = await postData('/api/users/resend-email-otp', {
          email,
        });

        if (res?.success) {
          setSuccess('OTP sent to your email!');
          setResendCooldown(60);
        } else {
          setError(res?.message || 'Failed to resend OTP');
        }
      } else if (verifyType === 'forgot-password') {
        // Resend forgot password OTP
        const normalizedEmail = email.trim().toLowerCase();
        const res = await postData('/api/users/resend-forgot-password-otp', {
          email: normalizedEmail,
        });

        if (res?.success) {
          setSuccess('OTP sent to your email!');
          setResendCooldown(60);
        } else {
          setError(res?.message || 'Failed to resend OTP');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Logo and Title */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4'>
            <Shield className='w-8 h-8 text-emerald-600' />
          </div>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Verify OTP</h1>
          <p className='text-slate-600'>
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Email Display */}
          <div className='rounded-2xl bg-emerald-50 p-4 border border-emerald-100'>
            <p className='text-sm text-slate-600'>OTP sent to:</p>
            <p className='text-lg font-semibold text-slate-900'>{email}</p>
          </div>

          {/* OTP Input */}
          <div className='space-y-4'>
            <div className='flex gap-2 justify-between'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors bg-white'
                  placeholder='0'
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200'>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className='rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200'>
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 transition-colors'
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {/* Resend OTP */}
        <div className='mt-6 text-center'>
          <p className='text-slate-600 text-sm'>Didn't receive the code?</p>
          <button
            type='button'
            onClick={handleResend}
            disabled={resending || resendCooldown > 0 || loading}
            className='mt-2 text-emerald-600 font-semibold hover:text-emerald-700 disabled:text-slate-400 transition-colors'
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : resending
              ? 'Sending...'
              : 'Resend OTP'}
          </button>
        </div>

        {/* Back to Login */}
        <div className='mt-8 text-center'>
          <Link
            href='/login'
            className='text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors'
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
