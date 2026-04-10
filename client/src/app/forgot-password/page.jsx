'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, HelpCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Send forgot password request to backend
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      setSuccess('An OTP has been sent to your email address');
      setEmail('');
      // Navigate to verify page after 2 seconds
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(normalizedEmail)}&type=forgot-password`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
        {/* Icon Section */}
        <div className="flex justify-center mb-8 relative w-24 h-24 mx-auto">
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Lock Icon Background */}
              <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center">
                <Lock size={40} className="text-purple-600" />
              </div>
              {/* Question Mark Icon */}
              <div className="absolute bottom-0 right-0 bg-orange-400 rounded-full p-2 border-4 border-white">
                <HelpCircle size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Forgot Password
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your registered email address and we'll send you a<br />
          One-Time Password (OTP) to reset your password.
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

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
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
