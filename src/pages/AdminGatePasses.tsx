import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Ticket, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminGatePasses: React.FC = () => {
  const { gatePasses, students, updateGatePassStatus } = useApp();
  const [filter, setFilter] = useState<'Pending' | 'History'>('Pending');

  const filteredPasses = gatePasses.filter(p => 
    filter === 'Pending' ? p.status === 'Pending' : p.status !== 'Pending'
  );

  const handleStatus = (id: string, status: 'Approved' | 'Rejected') => {
    updateGatePassStatus(id, status);
    toast.success(`Request ${status}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] p-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#354D62]">Gate Pass Requests</h1>
          <p className="text-[#59748C] mt-1">Manage student entry and exit permissions.</p>
        </div>
        
        {/* Custom Filter Toggle */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-[#718CA1]/30">
          {['Pending', 'History'].map((f) => (
             <button 
               key={f} 
               onClick={() => setFilter(f as any)} 
               className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                 filter === f 
                 ? 'bg-[#354D62] text-white shadow-md' 
                 : 'text-[#718CA1] hover:text-[#354D62] hover:bg-[#F5F9FA]'
               }`}
             >
               {f}
             </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4">
        {filteredPasses.length === 0 && (
          <div className="text-center py-20 text-[#718CA1]">
            <Ticket className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No {filter.toLowerCase()} requests found.</p>
          </div>
        )}

        {filteredPasses.map((pass, index) => {
          const student = students.find(s => s.id === pass.studentId);
          return (
            <motion.div 
              key={pass.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-[#718CA1]/30 p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all"
            >
              {/* Left: Info */}
              <div className="flex items-start gap-5 w-full md:w-auto">
                 <img 
                   src={student?.photoUrl || "https://via.placeholder.com/50"} 
                   className="w-14 h-14 rounded-full object-cover border-2 border-[#D7F2F7]" 
                   alt="" 
                 />
                 <div>
                    <h3 className="font-bold text-[#354D62] text-lg">
                      {student?.firstName} {student?.lastName} 
                      <span className="text-sm font-normal text-[#718CA1] ml-2">({student?.SID})</span>
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                      <span className="px-2.5 py-1 bg-[#D7F2F7] text-[#354D62] rounded-lg text-xs font-bold uppercase tracking-wide border border-[#718CA1]/30">
                        {pass.type}
                      </span>
                      <span className="flex items-center gap-1 text-[#59748C] font-medium">
                        <Calendar className="w-4 h-4 text-[#718CA1]" /> 
                        {pass.startDate} <span className="text-[#718CA1] mx-1">to</span> {pass.endDate}
                      </span>
                    </div>
                    
                    <p className="text-sm text-[#59748C] mt-3 bg-[#F5F9FA] p-2 rounded-lg border border-[#718CA1]/10 italic">
                      "{pass.reason}"
                    </p>
                 </div>
              </div>

              {/* Right: Actions */}
              {pass.status === 'Pending' ? (
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleStatus(pass.id, 'Rejected')}
                    className="flex-1 md:flex-none px-5 py-2.5 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <XCircle className="w-5 h-5" /> Reject
                  </button>
                  <button 
                    onClick={() => handleStatus(pass.id, 'Approved')}
                    className="flex-1 md:flex-none px-8 py-2.5 bg-[#354D62] text-white rounded-xl hover:bg-[#59748C] font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle className="w-5 h-5" /> Approve
                  </button>
                </div>
              ) : (
                <span className={`px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border ${
                  pass.status === 'Approved' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {pass.status === 'Approved' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {pass.status}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminGatePasses;