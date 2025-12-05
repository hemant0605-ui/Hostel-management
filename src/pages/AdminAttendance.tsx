import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, CheckCircle, XCircle, User, Calendar, Filter, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAttendance: React.FC = () => {
  const { students, attendance, toggleAttendance } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Present' | 'Absent'>('All');

  // Get Today's Date (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Calculate Stats
  const totalStudents = students.length;
  const totalPresent = attendance.filter(a => a.date === today && a.status === 'Present').length;
  const totalAbsent = totalStudents - totalPresent;
  const attendancePercentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  // Filter Logic
  const filteredStudents = students.filter(s => {
    const isPresent = attendance.some(a => a.studentId === s.id && a.date === today);
    const matchesSearch = s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.SID || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'Present') return matchesSearch && isPresent;
    if (filterStatus === 'Absent') return matchesSearch && !isPresent;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">Daily Attendance</h1>
           <p className="text-slate-500 mt-1 flex items-center gap-2">
             <Calendar className="w-4 h-4" /> Today: <span className="font-mono font-bold text-slate-700">{today}</span>
           </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Present Card */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-emerald-100">
               <CheckCircle className="w-7 h-7" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present Today</p>
               <h3 className="text-3xl font-bold text-slate-800">{totalPresent}</h3>
            </div>
         </div>

         {/* Absent Card */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border-4 border-rose-100">
               <XCircle className="w-7 h-7" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent Today</p>
               <h3 className="text-3xl font-bold text-slate-800">{totalAbsent}</h3>
            </div>
         </div>

         {/* Percentage Card */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border-4 border-indigo-100">
               <PieChart className="w-7 h-7" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</p>
               <h3 className="text-3xl font-bold text-slate-800">{attendancePercentage}%</h3>
            </div>
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         
         {/* Toolbar */}
         <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-slate-600">Filter:</span>
               <button 
                 onClick={() => setFilterStatus('All')} 
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${filterStatus === 'All' ? 'bg-slate-800 text-white' : 'bg-white border text-slate-500'}`}
               >
                 All
               </button>
               <button 
                 onClick={() => setFilterStatus('Present')} 
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${filterStatus === 'Present' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-500'}`}
               >
                 Present
               </button>
               <button 
                 onClick={() => setFilterStatus('Absent')} 
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${filterStatus === 'Absent' ? 'bg-rose-600 text-white' : 'bg-white border text-slate-500'}`}
               >
                 Absent
               </button>
            </div>

            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search student..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none" 
               />
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                 <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">SID</th>
                    <th className="px-6 py-4">Room No</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400">No students found matching filters.</td>
                    </tr>
                 )}
                 {filteredStudents.map((student, index) => {
                    // CHECK DATABASE FOR ATTENDANCE
                    const isPresent = attendance.some(a => a.studentId === student.id && a.date === today);
                    
                    return (
                      <motion.tr 
                        key={student.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                         <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                            <img src={student.photoUrl || "https://via.placeholder.com/40"} className="w-8 h-8 rounded-full object-cover border border-slate-200" alt="" />
                            {student.firstName} {student.lastName}
                         </td>
                         <td className="px-6 py-4 text-slate-500 font-mono">{student.SID}</td>
                         <td className="px-6 py-4 text-slate-600 font-bold">{student.roomId || '-'}</td>
                         <td className="px-6 py-4">
                            {isPresent ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                                <CheckCircle className="w-3 h-3" /> Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
                                <XCircle className="w-3 h-3" /> Absent
                              </span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => toggleAttendance(student.id)}
                              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm ${
                                isPresent 
                                ? 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              {isPresent ? 'Mark Absent' : 'Mark Present'}
                            </button>
                         </td>
                      </motion.tr>
                    );
                 })}
              </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default AdminAttendance;