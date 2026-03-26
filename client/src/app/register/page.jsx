'use client'
import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { registerAction } from './register.action'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleInputFocus = (e) => {
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.3,
      ease: 'elastic.out(1, 0.3)',
    })

    const icon = e.target.parentElement?.querySelector('.input-icon')
    if (icon) {
      gsap.to(icon, {
        color: '#3b82f6',
        scale: 1.2,
        duration: 0.3,
      })
    }
  }

  const handleInputBlur = (e) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.3,
    })

    const icon = e.target.parentElement?.querySelector('.input-icon')
    if (icon) {
      gsap.to(icon, {
        color: '#9ca3af',
        scale: 1,
        duration: 0.3,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setErrorMessage('Please fix the errors above')
      
      gsap.to(formRef.current, {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: 'power2.inOut',
      })
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('fullName', formData.fullName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('password', formData.password)

      const result = await registerAction(formDataToSend)

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

        setSuccessMessage('✅ Registration successful! Redirecting...')
        setIsSubmitting(false)

        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false,
        })
        setErrors({})

        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      } else {
        setErrorMessage(result?.message || 'Registration failed. Please try again.')
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
      className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div
          ref={(el) => {
            if (el && !backgroundShapesRef.current.includes(el)) {
              backgroundShapesRef.current.push(el)
            }
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-teal-500 to-green-400 opacity-20 rounded-full filter blur-3xl"></div>
        <div
          ref={(el) => {
            if (el && !backgroundShapesRef.current[1]) {
              backgroundShapesRef.current[1] = el
            }
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-l from-teal-500 to-blue-500 opacity-15 rounded-full filter blur-3xl"></div>
        <div
          ref={(el) => {
            if (el && !backgroundShapesRef.current[2]) {
              backgroundShapesRef.current[2] = el
            }
          }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-500 opacity-10 rounded-full filter blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-400/50 rounded-xl text-green-300 flex items-center gap-3 animate-pulse shadow-lg shadow-green-500/20 backdrop-blur-sm">
            <div className="p-1 bg-green-500/30 rounded-lg">
              <FiCheck className="w-5 h-5" />
            </div>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/50 rounded-xl text-red-300 flex items-center gap-3 shadow-lg shadow-red-500/20 backdrop-blur-sm">
            <div className="p-1 bg-red-500/30 rounded-lg">
              <FiAlertCircle className="w-5 h-5" />
            </div>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-green-400 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
          
          {/* Form Container */}
          <form
          
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            
            {/* Header Section */}
            <div className="mb-8">
              {/* Icon */}
              <div className="inline-flex p-3 bg-gradient-to-br from-teal-500/30 to-green-400/30 rounded-xl mb-4 border border-teal-400/30">
                <FiUser className="w-8 h-8 text-teal-300" />
              </div>
              
              {/* Title */}
              <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-300 to-green-300 bg-clip-text text-transparent mb-2">
                Create Account
              </h1>
              <p className="text-gray-400 text-lg">Join our exclusive community and start shopping</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Full Name */}
              <div ref={(el) => inputsRef.current.push(el)}>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative flex items-center">
                    <FiUser className="input-icon absolute left-4 top-4 text-teal-400 w-5 h-5 transition-all group-focus-within:scale-110" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-teal-500'
                      }`}
                    />
                  </div>
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div ref={(el) => inputsRef.current.push(el)}>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative flex items-center">
                    <FiMail className="input-icon absolute left-4 top-4 text-teal-400 w-5 h-5 transition-all group-focus-within:scale-110" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="your@email.com"
                      className={`w-full pl-12 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-teal-500'
                      }`}
                    />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div ref={(el) => inputsRef.current.push(el)}>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative flex items-center">
                    <FiPhone className="input-icon absolute left-4 top-4 text-teal-400 w-5 h-5 transition-all group-focus-within:scale-110" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full pl-12 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-teal-500'
                      }`}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div ref={(el) => inputsRef.current.push(el)}>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative flex items-center">
                    <FiLock className="input-icon absolute left-4 top-4 text-teal-400 w-5 h-5 transition-all group-focus-within:scale-110" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-teal-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-teal-400 transition-colors">
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div ref={(el) => inputsRef.current.push(el)}>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                  <div className="relative flex items-center">
                    <FiLock className="input-icon absolute left-4 top-4 text-teal-400 w-5 h-5 transition-all group-focus-within:scale-110" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-teal-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-teal-400 transition-colors">
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2" ref={(el) => inputsRef.current.push(el)}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <div className="absolute inset-0 bg-teal-500/20 rounded group-hover:opacity-100 opacity-0 transition-opacity"></div>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="relative w-5 h-5 rounded bg-gray-700 border-2 border-gray-600 text-teal-500 cursor-pointer accent-teal-500 checked:bg-teal-500 checked:border-teal-500 transition-all"
                    />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                    I agree to the{' '}
                    <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors font-semibold">
                      Terms & Conditions
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" /> {errors.agreeTerms}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-teal-500 to-green-400 hover:from-teal-600 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white text-lg transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/50 transform hover:scale-105 active:scale-95 relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gradient-to-l from-gray-700 to-transparent"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="text-teal-400 hover:text-teal-300 transition-colors font-bold text-lg">
                  Sign In
                </a>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Your data is secure with us</span>
            </div>
          </form>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">🚀 Join thousands of happy customers shopping with us daily</p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
