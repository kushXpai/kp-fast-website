// src/pages/Login.tsx

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { Eye, EyeOff, User, Mail, Lock, UserCheck } from 'lucide-react';

// interface Player {
//   id: string;
//   name: string;
//   mobile_number: string;
//   username: string;
//   email: string;
//   date_of_birth: string;
//   batch: string;
//   batter_type: string;
//   player_role: string;
//   bowler_type: string;
//   is_approved: boolean;
//   created_at: string;
// }

export default function PlayerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        alert('Email not found');
        setIsLoading(false);
        return;
      }

      const isCorrect = await bcrypt.compare(password, data.password);
      if (!isCorrect) {
        alert('Incorrect password');
        setIsLoading(false);
        return;
      }

      if (!data.is_approved) {
        alert('Account pending approval.');
        setIsLoading(false);
        return;
      }

      // Store player data in localStorage
      localStorage.setItem('player', JSON.stringify(data));
      
      // Redirect to dashboard
      router.push('/PlayerDashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;40&quot; height=&quot;40&quot; viewBox=&quot;0 0 40 40&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.03&quot;%3E%3Cpath d=&quot;M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4 shadow-xl">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">KP FAST</h1>
          <p className="text-green-200">Player Portal</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center mb-6">
              Welcome Back
            </h2>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-200">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-green-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-200">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-green-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-green-200">New to KP FAST?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <button
            onClick={() => router.push('/SignUp')}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-lg border border-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <UserCheck className="h-5 w-5" />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center space-x-6 mt-6">
          <button
            onClick={() => router.push('/Admin/Login')}
            className="text-green-300 hover:text-white transition-colors text-sm"
          >
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
}