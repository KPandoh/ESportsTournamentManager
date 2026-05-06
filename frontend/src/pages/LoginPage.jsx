import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isRegistering) {
      result = await register(username, password);
    } else {
      result = await login(username, password);
    }

    setLoading(false);

    if (result.success) {
      navigate('/dashboard'); // Redirect to dashboard after login/register
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card w-full max-w-md p-8 relative z-10 overflow-hidden"
      >
        {/* Animated accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-cinematic tracking-wider text-glow uppercase">
            {isRegistering ? 'INITIALIZE AGENT' : 'SYSTEM LOGIN'}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {isRegistering ? 'Create your operational credentials' : 'Enter your credentials to access the nexus'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-glow flex items-center justify-center gap-2 py-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-pulse">PROCESSING...</span>
            ) : (
              <>
                {isRegistering ? 'CREATE AGENT' : 'AUTHENTICATE'} 
                {isRegistering ? <UserPlus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setUsername('');
              setPassword('');
            }}
            className="text-xs text-gray-400 hover:text-primary transition-colors uppercase tracking-wider"
          >
            {isRegistering ? 'Already have credentials? Login' : 'Need clearance? Request Access'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
