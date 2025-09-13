// components/AuthPage.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthPage() {
  const { login, signup } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    confirm: false
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.username) newErrors.loginUsername = "Username or email is required";
    if (!loginData.password) newErrors.loginPassword = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.username || signupData.username.length < 3) 
      newErrors.signupUsername = "Username must be at least 3 characters";
    if (!signupData.email || !signupData.email.includes("@")) 
      newErrors.signupEmail = "Please enter a valid email";
    if (!signupData.password || signupData.password.length < 6) 
      newErrors.signupPassword = "Password must be at least 6 characters";
    if (signupData.password !== signupData.confirmPassword) 
      newErrors.signupConfirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateLogin()) {
      login(loginData.username, loginData.password);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      signup(signupData.username, signupData.email, signupData.password);
      setSuccessMessage("Account created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setActiveTab("login");
        // Reset signup form
        setSignupData({ username: "", email: "", password: "", confirmPassword: "" });
      }, 3000);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
        <div className="flex bg-indigo-100">
          <button
            className={`flex-1 py-4 font-medium transition-colors ${
              activeTab === "login" 
                ? "text-indigo-800 border-b-2 border-indigo-800" 
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 font-medium transition-colors ${
              activeTab === "signup" 
                ? "text-indigo-800 border-b-2 border-indigo-800" 
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6">
          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
              
              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <input
                  type="text"
                  id="login-username"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter your username or email"
                />
                {errors.loginUsername && (
                  <p className="text-red-500 text-xs mt-1">{errors.loginUsername}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword.login ? "text" : "password"}
                  id="login-password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => togglePasswordVisibility("login")}
                >
                  {showPassword.login ? "🙈" : "👁️"}
                </button>
                {errors.loginPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.loginPassword}</p>
                )}
              </div>

              <div className="text-right mb-2">
                <a href="#" className="text-sm text-indigo-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Login
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mb-4">
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  <span className="sr-only">Google</span>
                  🅶
                </button>
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  <span className="sr-only">Facebook</span>
                  🅵
                </button>
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  <span className="sr-only">GitHub</span>
                  🐙
                </button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-indigo-600 font-semibold hover:underline"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
              <p className="text-center text-gray-600 mb-6">Join us to get started</p>
              
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {successMessage}
                </div>
              )}

              <div>
                <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Choose a username"
                />
                {errors.signupUsername && (
                  <p className="text-red-500 text-xs mt-1">{errors.signupUsername}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter your email"
                />
                {errors.signupEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.signupEmail}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword.signup ? "text" : "password"}
                  id="signup-password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => togglePasswordVisibility("signup")}
                >
                  {showPassword.signup ? "🙈" : "👁️"}
                </button>
                {errors.signupPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.signupPassword}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  id="signup-confirm-password"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPassword.confirm ? "🙈" : "👁️"}
                </button>
                {errors.signupConfirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.signupConfirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Create Account
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mb-4">
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  <span className="sr-only">Google</span>
                  🅶
                </button>
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  <span className="sr-only">Facebook</span>
                  🅵
                </button>
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  <span className="sr-only">GitHub</span>
                  🐙
                </button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-indigo-600 font-semibold hover:underline"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}