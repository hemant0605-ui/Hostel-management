import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Search, FileText, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminComplaints: React.FC = () => {
  const { complaints, students, updateComplaintStatus } = useApp();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = complaints
    .filter(c => filter === 'All' ? true : c.status === filter)
    .filter(c => c.subject.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleStatus = (id: string, s: 'In Progress' | 'Resolved') => {
    updateComplaintStatus(id, s);
    toast.success(`Complaint marked as ${s}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] p-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#354D62]">Complaints</h1>
          <p className="text-[#59748C] mt-1">Track and resolve student issues.</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718CA1]" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2.5 border border-[#718CA1]/30 rounded-xl text-sm text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-white shadow-sm"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)} 
            className="px-4 py-2.5 border border-[#718CA1]/30 rounded-xl bg-white text-[#354D62] font-bold text-sm focus:ring-2 focus:ring-[#354D62] outline-none cursor-pointer shadow-sm"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>All</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#718CA1]">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No {filter.toLowerCase()} complaints found.</p>
          </div>
        )}

        {filtered.map((c, i) => {
          const s = students.find(s => s.id === c.studentId);
          
          // Status Colors
          const borderClass = c.status === 'Pending' ? 'border-l-amber-500' : c.status === 'In Progress' ? 'border-l-blue-500' : 'border-l-emerald-500';
          const statusBg = c.status === 'Pending' ? 'bg-amber-50 text-amber-700' : c.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700';

          return (
            <motion.div 
              key={c.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }} 
              className={`bg-white p-6 rounded-xl shadow-sm border border-[#718CA1]/20 border-l-4 ${borderClass} flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-[#354D62]">{c.subject}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${statusBg}`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-[#718CA1] font-mono">{c.date}</span>
                </div>
                <p className="text-[#59748C] text-sm mb-4 leading-relaxed bg-[#F5F9FA] p-3 rounded-lg border border-[#718CA1]/10">
                  {c.description}
                </p>
                <div className="flex items-center gap-2">
                  <img src={s?.photoUrl || ""} className="w-6 h-6 rounded-full border border-[#718CA1]/30" />
                  <span className="text-xs font-bold text-[#718CA1]">
                    Raised by: <span className="text-[#354D62]">{s?.firstName} {s?.lastName}</span> (Room {s?.roomId})
                  </span>
                </div>
              </div>

              <div className="flex items-center self-start md:self-center">
                {c.status === 'Pending' && (
                  <button 
                    onClick={() => handleStatus(c.id, 'In Progress')} 
                    className="bg-[#59748C] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-[#354D62] transition shadow-sm"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Progress
                  </button>
                )}

                {c.status === 'In Progress' && (
                  <button 
                    onClick={() => handleStatus(c.id, 'Resolved')} 
                    className="bg-[#354D62] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-[#2C4052] transition shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Resolve Issue
                  </button>
                )}

                {c.status === 'Resolved' && (
                  <div className="flex flex-col items-end">
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100 flex items-center gap-2">
                       <CheckCircle className="w-4 h-4" /> Resolved
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminComplaints;