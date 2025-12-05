import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, User, GraduationCap, AlertCircle, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

type LoginRole = 'admin' | 'student';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<LoginRole>('admin');
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  
  const { login, loginStudent } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      // Admin Login
      const success = login(formData.id, formData.password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin username or password');
      }
    } else {
      // Student Login
      const success = loginStudent(formData.id, formData.password);
      if (success) {
        navigate('/student/profile');
      } else {
        // Debugging: Log what is happening to console
        console.log("Failed Login Attempt:", formData);
        setError('Invalid Student SID or password');
      }
    }
  };

  // 👇 EMERGENCY FIX BUTTON FUNCTION
  const handleEmergencyFix = () => {
    try {
      const savedStudents = localStorage.getItem('students');
      if (savedStudents) {
        const parsed = JSON.parse(savedStudents);
        const fixed = parsed.map((s: any) => ({
          ...s,
          password: 'password123' // Force password on everyone
        }));
        localStorage.setItem('students', JSON.stringify(fixed));
        alert(`✅ Successfully fixed ${fixed.length} student accounts! \n\nPassword is now: password123`);
        window.location.reload();
      } else {
        alert("No data found to fix. Please login as Admin and add students.");
      }
    } catch (err) {
      alert("Error fixing data: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-50 p-6 text-center border-b border-gray-100">
          <Building2 className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Hostel Portal</h1>
          <p className="text-gray-500 text-sm">Please sign in to continue</p>
        </div>

        <div className="p-8">
          
          {/* Toggle Switch */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8 relative">
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
              animate={{ x: role === 'admin' ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => { setRole('admin'); setError(''); setFormData({id: '', password: ''}); }}
              className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 ${role === 'admin' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              Admin
            </button>
            <button
              onClick={() => { setRole('student'); setError(''); setFormData({id: '', password: ''}); }}
              className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 ${role === 'student' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              Student
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2 text-red-700 text-sm overflow-hidden"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {role === 'admin' ? 'Username' : 'Student SID'}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {role === 'admin' ? <User className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                </div>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder={role === 'admin' ? "admin" : "e.g. 23181437"}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] duration-200"
            >
              {role === 'admin' ? 'Admin Login' : 'Student Login'}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-xs text-gray-500">
              {role === 'admin' 
                ? "Username: admin / Password: admin123" 
                : "Default Password: password123"}
            </p>

            {/* REPAIR BUTTON - Click this if login fails */}
            <button 
              onClick={handleEmergencyFix}
              className="text-xs text-red-500 hover:text-red-700 flex items-center justify-center w-full gap-1"
            >
              <Wrench className="h-3 w-3" /> Repair Student Data
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;