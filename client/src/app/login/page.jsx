'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const containerRef = useRef(null)
  const formRef = useRef(null)
  const inputsRef = useRef([])
  const backgroundShapesRef = useRef([])

  // Animate background shapes
  useEffect(() => {
    const shapes = backgroundShapesRef.current
    
    shapes.forEach((shape, index) => {
      gsap.to(shape, {
        y: Math.sin(index) * 60,
        x: Math.cos(index) * 60,
        duration: 8 + index * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
  }, [])

  // Form entrance animation
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
      })
    }

    inputsRef.current.forEach((input, index) => {
      if (input) {
        gsap.from(input, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.1 * (index + 1),
          ease: 'power2.out',
        })
      }
    })
  }, [])

  // Input focus animations
  const handleInputFocus = (index) => {
    gsap.to(inputsRef.current[index], {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleInputBlur = (index) => {
    gsap.to(inputsRef.current[index], {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('rememberMe', formData.rememberMe)

      const result = await loginAction(formDataToSend)

      if (result?.success) {
        gsap.to(formRef.current, {
          scale: 1.05,
          duration: 0.3,
        })
        gsap.to(formRef.current, {
          scale: 1,
          duration: 0.5,
          delay: 0.3,
        })

        setSuccessMessage('✅ Login successful! Redirecting...')
        setIsSubmitting(false)

        setFormData({
          email: '',
          password: '',
          rememberMe: false,
        })
        setErrors({})

        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      } else {
        setErrorMessage(result?.message || 'Login failed. Please try again.')
        setIsSubmitting(false)
        
        gsap.to(formRef.current, {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
        })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setErrorMessage('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex items-center justify-center p-4 overflow-hidden relative"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={(el) => (backgroundShapesRef.current[0] = el)}
          className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-full blur-3xl"
        />
        <div
          ref={(el) => (backgroundShapesRef.current[1] = el)}
          className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-3xl"
        />
        <div
          ref={(el) => (backgroundShapesRef.current[2] = el)}
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-teal-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand area */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Form card */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-3 animate-pulse">
              <FiCheckCircle className="text-emerald-400 text-xl flex-shrink-0" />
              <p className="text-emerald-300 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
              <FiAlertCircle className="text-red-400 text-xl flex-shrink-0" />
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Email field */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 text-lg pointer-events-none" />
              <input
                ref={(el) => (inputsRef.current[0] = el)}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleInputFocus(0)}
                onBlur={() => handleInputBlur(0)}
                className={`w-full pl-12 pr-4 py-3 bg-white/10 border-2 rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-gray-400 ${
                  errors.email
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/20 focus:border-teal-500'
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <FiAlertCircle className="text-xs" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 text-lg pointer-events-none" />
              <input
                ref={(el) => (inputsRef.current[1] = el)}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleInputFocus(1)}
                onBlur={() => handleInputBlur(1)}
                className={`w-full pl-12 pr-12 py-3 bg-white/10 border-2 rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-gray-400 ${
                  errors.password
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/20 focus:border-teal-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <FiAlertCircle className="text-xs" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-white/10 border border-white/20 text-teal-500 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-gray-300 text-sm">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-lg"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-400">
                New to our store?
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <Link
            href="/register"
            className="block w-full py-3 border-2 border-white/20 hover:border-teal-500 text-center text-teal-400 hover:text-teal-300 font-semibold rounded-lg transition-all duration-300"
          >
            Create Account
          </Link>
        </form>

        {/* Footer text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-teal-400 hover:text-teal-300 transition-colors">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
