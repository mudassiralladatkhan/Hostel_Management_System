import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      toast.error('This email is already in use.');
    } else {
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-center text-foreground mb-1">Create an Account</h2>
      <p className="text-center text-muted-foreground mb-6">Get started with HMS</p>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
          <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground" required />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground" required />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground">
            <option>Student</option>
            <option>Warden</option>
            <option>Admin</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:bg-primary/50">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;
