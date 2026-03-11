import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gray-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gray-700/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative w-full max-w-md z-10">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        <div className="glass border border-gray-800 rounded-2xl shadow-glow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 mb-4 shadow-glow">
              <span className="text-2xl text-white">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-gradient-silver mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-400">
              {isSubmitted 
                ? 'Check your email for reset instructions' 
                : 'Enter your email to reset your password'}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
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
                    placeholder="Enter your email"
                    required
                  />
                </div>
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
                    Sending reset link...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 shadow-glow">
                <FiCheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Reset Link Sent!
                </h3>
                <p className="text-gray-400">
                  We've sent a password reset link to <br />
                  <span className="font-medium text-white">{email || 'your email'}</span>
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 text-white py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300 text-center group"
                >
                  Return to Login
                </Link>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="block w-full bg-gray-900/50 border border-gray-700 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                >
                  Resend Reset Link
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>If you don't receive an email within a few minutes, please check your spam folder.</p>
          </div>
        </div>

        {/* Additional Glow Effects */}
        <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-transparent rounded-2xl blur-xl -z-10 opacity-30" />
        <div className="absolute -inset-6 bg-gradient-to-br from-gray-800/20 to-black/20 rounded-2xl blur-2xl -z-20" />
      </div>
    </div>
  );
};

export default ForgotPassword;