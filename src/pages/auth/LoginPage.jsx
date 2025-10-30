import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-center text-foreground mb-1">Welcome Back</h2>
      <p className="text-center text-muted-foreground mb-6">Sign in to continue</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div className="text-right">
            <Link to="/forgot-password"
                className="text-sm text-primary hover:underline">
                Forgot Password?
            </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login'}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
