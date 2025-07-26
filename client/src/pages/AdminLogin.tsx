import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handlePopState = () => {
      navigate('/', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-card rounded-2xl shadow-2xl border border-border text-card-foreground"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary text-white p-3 rounded-full shadow-md mb-2">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Portal</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2 rounded-lg border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-lg border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all"
          >
            <LockKeyhole size={18} />
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
