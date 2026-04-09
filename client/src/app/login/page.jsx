'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { postData } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '@/firebase';
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const isSecureContext = typeof window !== 'undefined' && window.location.protocol === 'https:';
const authCookieOptions = {
  secure: isSecureContext,
  sameSite: isSecureContext ? 'Strict' : 'Lax',
};



 
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Call backend API to login
      const res = await postData('/api/users/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res?.success === true && res?.date?.accessToken) {
        // Store tokens in cookies
        Cookies.set('accessToken', res.date.accessToken, {
          expires: 7,
          ...authCookieOptions,
        });
        
        if (res.date.refreshToken) {
          Cookies.set('refreshToken', res.date.refreshToken, {
            expires: 30,
            ...authCookieOptions,
          });
        }

        // Save basic identity for header UI.
        Cookies.set('userEmail', formData.email, { expires: 7 });
        Cookies.set('userName', formData.email.split('@')[0], { expires: 7 });
        
        // Redirect to home
        router.push('/');
      } else {
        setError(res?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signWithGoogle = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const fields = {
        name: user.displayName || user.providerData?.[0]?.displayName || 'Google User',
        email: user.email || user.providerData?.[0]?.email,
        password: null,
        avatar: user.photoURL || user.providerData?.[0]?.photoURL || '',
        mobile: user.phoneNumber || user.providerData?.[0]?.phoneNumber || '',
      };

      if (!fields.email) {
        throw new Error('Google account email is required');
      }

      const res = await postData('/api/users/authWithGoogle', fields);

      if (res?.success === true) {
        const accessToken = res?.data?.accessToken;
        const refreshToken = res?.data?.refreshToken;
        const userName = res?.data?.userName;
        const userEmail = res?.data?.userEmail;

        if (accessToken) {
          Cookies.set('accessToken', accessToken, {
            expires: 7,
            ...authCookieOptions,
          });
        }

        if (refreshToken) {
          Cookies.set('refreshToken', refreshToken, {
            expires: 30,
            ...authCookieOptions,
          });
        }

        if (userName) {
          Cookies.set('userName', userName, { expires: 7 });
        }

        if (userEmail) {
          Cookies.set('userEmail', userEmail, { expires: 7 });
        }

        router.push('/');
      } else {
        setError(res?.message || 'Google login failed');
      }
    } catch (err) {
      setError(err?.message || 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-cyan-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                LOGGING IN...
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {/* Sign-up Link */}
        <p className="text-center text-gray-600 mt-6">
          Not Registered?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:text-blue-700 transition">
            Sign Up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-gray-500 font-semibold text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={signWithGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              CONNECTING...
            </span>
          ) : (
            'LOGIN WITH GOOGLE'
          )}
        </button>
      </div>
    </div>
  );
}
