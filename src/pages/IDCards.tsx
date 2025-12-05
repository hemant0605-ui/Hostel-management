import React, { useState } from "react";
import { Search, Download, Printer, UserPlus, IdCard } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const IDCards: React.FC = () => {
  const { students } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.SID || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    toast.info("Preparing ID Cards for printing...");
    setTimeout(() => window.print(), 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] p-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#354D62]">Student ID Cards</h1>
          <p className="text-[#59748C] mt-1">
            Generated <span className="font-bold text-[#354D62]">{filteredStudents.length}</span> digital IDs.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718CA1]" />
                <input 
                    type="text" 
                    placeholder="Search by Name or SID..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 border border-[#718CA1]/30 rounded-xl text-sm text-[#354D62] outline-none focus:ring-2 focus:ring-[#354D62] bg-white shadow-sm" 
                />
            </div>
            <button 
              onClick={handlePrint} 
              className="bg-white border border-[#718CA1]/30 text-[#354D62] px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#D7F2F7] transition flex items-center gap-2 font-bold text-sm"
            >
                <Printer className="w-4 h-4" /> Print All
            </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#718CA1]">
           <div className="bg-[#D7F2F7] p-4 rounded-full mb-4">
             <IdCard className="w-12 h-12 text-[#354D62]" />
           </div>
           <h3 className="text-lg font-bold text-[#354D62]">No Students Found</h3>
           <p className="mb-6">Add students to the directory to generate their ID cards.</p>
           <button 
             onClick={() => navigate('/admin/students/create')}
             className="px-6 py-2.5 bg-[#354D62] text-white rounded-xl font-bold shadow-md hover:bg-[#59748C] transition flex items-center gap-2"
           >
             <UserPlus className="w-4 h-4" /> Add Student
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStudents.map((student, index) => {
            const validDate = student.admissionDate ? new Date(student.admissionDate) : new Date();
            const expiryDate = new Date(validDate.setFullYear(validDate.getFullYear() + 4)).toLocaleDateString("en-GB");

            return (
              <motion.div 
                  key={student.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.05 }}
              >
                
                {/* CARD DESIGN */}
                <div className="w-full aspect-[3/4.9] bg-white rounded-3xl shadow-xl overflow-hidden relative group hover:-translate-y-2 transition-all duration-500 border border-[#718CA1]/10">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 h-[50%] bg-gradient-to-br from-[#354D62] to-[#59748C] rounded-b-[3rem] z-0"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#59748C] rounded-bl-[5rem] opacity-50 z-0"></div>
                  
                  <div className="absolute inset-0 p-6 z-10 flex flex-col items-center text-center">
                    
                    <h3 className="text-[#D7F2F7] font-bold text-[10px] tracking-[0.2em] mb-5 uppercase opacity-90">Hostel Pro Univ.</h3>

                    <div className="w-24 h-24 rounded-full border-4 border-white/20 p-1 shadow-lg backdrop-blur-sm">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden border-2 border-white">
                         <img 
                           src={student.photoUrl || "https://via.placeholder.com/150"} 
                           alt="photo" 
                           className="w-full h-full object-cover" 
                         />
                      </div>
                    </div>

                    <div className="mt-3">
                      <h2 className="text-white font-bold text-lg tracking-tight leading-tight line-clamp-1">
                        {student.firstName} {student.lastName}
                      </h2>
                      <p className="text-[#D7F2F7] text-xs font-medium mt-0.5">
                        {student.course} • {student.year}
                      </p>
                    </div>

                    <div className="mt-auto w-full bg-[#F5F9FA] rounded-xl shadow-inner p-4 space-y-2 text-left border border-[#E2E8F0]">
                      <div className="flex justify-between text-xs border-b border-[#718CA1]/10 pb-1.5">
                        <span className="text-[#718CA1] font-semibold">SID</span>
                        <span className="text-[#354D62] font-bold font-mono">{student.SID}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-[#718CA1]/10 pb-1.5">
                        <span className="text-[#718CA1] font-semibold">DOB</span>
                        <span className="text-[#354D62] font-bold">{student.dateOfBirth || 'N/A'}</span>
                      </div>
                      {/* 👇 NEW ADDRESS FIELD */}
                      <div className="flex justify-between text-xs border-b border-[#718CA1]/10 pb-1.5">
                         <span className="text-[#718CA1] font-semibold">City</span>
                         <span className="text-[#354D62] font-bold truncate max-w-[100px]">{student.address || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-0.5">
                        <span className="text-[#718CA1] font-semibold">Valid Thru</span>
                        <span className="text-rose-500 font-bold">{expiryDate}</span>
                      </div>
                    </div>

                  </div>
                </div>
                
                <button className="w-full mt-4 bg-[#354D62] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#59748C] transition flex items-center justify-center gap-2 shadow-md active:scale-95">
                   <Download className="w-4 h-4" /> Download Card
                </button>

              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IDCards;