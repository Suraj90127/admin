import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../reducer/authSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error, token, isAuthenticated } = useSelector(
    (state) => state.auth
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing in...");

    const result = await dispatch(
      adminLogin({
        email,
        password,
      })
    );

    toast.dismiss(toastId);

    // ✅ SUCCESS
    if (adminLogin.fulfilled.match(result)) {
      toast.success("Login successful 🚀");
      navigate("/dashboard");
    }

    // ❌ ERROR
    if (adminLogin.rejected.match(result)) {
      toast.error(result.payload || "Invalid credentials ❌");
    }
  };



  useEffect(() => {
    if (isAuthenticated) {
      console.log("USER LOGGED IN, TOKEN:", token);
    }
    if (error) {
      console.error("LOGIN ERROR:", error);
    }
  }, [isAuthenticated, error, token]);



  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-700/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="glass border border-gray-800 rounded-2xl shadow-glow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 mb-4 shadow-glow">
              <span className="text-2xl text-white">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-gradient-silver mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your gaming dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all backdrop-blur-sm"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border ${rememberMe ? 'bg-gray-300 border-gray-300' : 'border-gray-600'} transition-colors`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 mx-auto mt-0.5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-400">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-gray-300 hover:text-white transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 text-white py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-900 text-gray-500">
                  Demo Credentials
                </span>
              </div>
            </div>

            <div className="text-center space-y-2 text-sm">
              <p className="text-gray-300">Email: <span className="text-white">admin@gaming.com</span></p>
              <p className="text-gray-300">Password: <span className="text-white">password123</span></p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button className="text-gray-300 hover:text-white font-medium hover:underline transition-colors">
                Contact Administrator
              </button>
            </p>
          </div>
        </div>

        {/* Additional Glow Effects */}
        <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-transparent rounded-2xl blur-xl -z-10 opacity-50" />
        <div className="absolute -inset-6 bg-gradient-to-br from-gray-800/20 to-black/20 rounded-2xl blur-2xl -z-20" />
      </div>

      {/* Style for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;