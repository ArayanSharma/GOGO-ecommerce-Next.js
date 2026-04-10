'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, EyeOff, Eye } from 'lucide-react';
import Cookies from 'js-cookie';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get email from cookies
    const resetEmail = Cookies.get('resetEmail');
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      setError('Session expired. Please try forgot password again.');
      setTimeout(() => {
        router.push('/forgot-password');
      }, 2000);
    }
  }, [router]);

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!newPassword || !confirmPassword) {
        setError('Please fill all fields');
        setLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      if (!validatePassword(newPassword)) {
        setError('Password must contain uppercase, lowercase, and numbers');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Call backend API to change password
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/forgot-password/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: normalizedEmail,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to change password');
        setLoading(false);
        return;
      }

      setSuccess('Password changed successfully!');
      // Clear cookies and redirect to login after 2 seconds
      setTimeout(() => {
        Cookies.remove('resetEmail');
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
        {/* Icon Section */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center">
            <Lock size={40} className="text-purple-600" />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Reset Password
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your new password to reset your account
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

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Display */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              At least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'RESETTING...' : 'RESET PASSWORD'}
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
