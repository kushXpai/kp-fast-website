// src/pages/SignUp.tsx

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { Eye, EyeOff, User, Mail, Lock, Calendar, UserPlus, ChevronDown } from 'lucide-react';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    mobile_number: '',
    email: '',
    password: '',
    date_of_birth: '',
    batter_type: '',
    player_role: 'Batsman',
    bowler_type: '', // This will remain empty/null if not selected
    batch: 'Baroda Cricket Association',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const hashedPassword = await bcrypt.hash(form.password, 10);

    const playerData = {
      ...form,
      password: hashedPassword,
      bowler_type: form.bowler_type === '' ? null : form.bowler_type,
    };

    const { error } = await supabase.from('players').insert([playerData]);

    if (!error) {
      alert('Signup successful! Wait for approval.');
      router.push('/Login');
    } else {
      alert(error.message);
    }
  } catch (err) {
    console.error('Signup error:', err);
    alert('Signup failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;40&quot; height=&quot;40&quot; viewBox=&quot;0 0 40 40&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.03&quot;%3E%3Cpath d=&quot;M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4 shadow-xl">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join KP FAST</h1>
          <p className="text-green-200">Create your player account</p>
        </div>

        {/* Sign Up Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center mb-6">
              Player Registration
            </h2>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Mobile Number</label>
                  <input
                    type="tel"
                    value={form.mobile_number}
                    onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your mobile number"
                    pattern="[0-9]{10,15}"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-green-300" />
                    </div>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-green-300" />
                    </div>
                    <input
                      type="date"
                      value={form.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-200">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-green-300" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Create a password"
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
            </div>

            {/* Cricket Information Section */}
            <div className="space-y-4 pt-4 border-t border-white/20">
              <h3 className="text-lg font-medium text-white flex items-center">
                <span className="w-5 h-5 mr-2 text-orange-400">🏏</span>
                Cricket Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Player Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Player Role</label>
                  <div className="relative">
                    <select
                      value={form.player_role}
                      onChange={(e) => handleInputChange('player_role', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      <option value="Batsman" className="bg-gray-800">Batsman</option>
                      <option value="Wicketkeeper" className="bg-gray-800">Wicketkeeper</option>
                      <option value="Allrounder" className="bg-gray-800">Allrounder</option>
                      <option value="Bowler" className="bg-gray-800">Bowler</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300 pointer-events-none" />
                  </div>
                </div>

                {/* Batter Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Batter Type</label>
                  <div className="relative">
                    <select
                      value={form.batter_type}
                      onChange={(e) => handleInputChange('batter_type', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      <option value="" className="bg-gray-800">Select Batter Type</option>
                      <option value="Right Hand" className="bg-gray-800">Right Hand</option>
                      <option value="Left Hand" className="bg-gray-800">Left Hand</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bowler Type - Made Completely Optional */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">
                    Bowler Type 
                    <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.bowler_type}
                      onChange={(e) => handleInputChange('bowler_type', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      <option value="" className="bg-gray-800">No bowling specialization</option>
                      <option value="Right Arm Fast" className="bg-gray-800">Right Arm Fast</option>
                      <option value="Left Arm Fast" className="bg-gray-800">Left Arm Fast</option>
                      <option value="Right Arm Medium" className="bg-gray-800">Right Arm Medium</option>
                      <option value="Left Arm Medium" className="bg-gray-800">Left Arm Medium</option>
                      <option value="Off Spin" className="bg-gray-800">Off Spin</option>
                      <option value="Leg Spin" className="bg-gray-800">Leg Spin</option>
                      <option value="Left Arm Spin" className="bg-gray-800">Left Arm Spin</option>
                      <option value="Chinaman" className="bg-gray-800">Chinaman</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-400">
                    Leave as default if you don&rsquo;t bowl or specialize in bowling
                  </p>
                </div>

                {/* Batch/Team */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-200">Team/Association</label>
                  <div className="relative">
                    <select
                      value={form.batch}
                      onChange={(e) => handleInputChange('batch', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      <option value="Baroda Cricket Association" className="bg-gray-800">Baroda Cricket Association</option>
                      <option value="Delhi Capitals" className="bg-gray-800">Delhi Capitals</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-4 border-t border-white/20">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  </div>
                  <div className="text-sm text-orange-200">
                    <p className="font-medium mb-1">Account Approval Required</p>
                    <p>Your account will be reviewed by an admin before activation. You&rsquo;ll receive an email notification once approved.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Create Player Account</span>
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-green-200 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/Login')}
                className="text-white font-medium hover:text-green-300 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-green-300 text-sm">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}