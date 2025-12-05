import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { UserPlus, Trash2, Edit3, Search, Mail, Phone, BedDouble } from "lucide-react";
import { useApp } from "../context/AppContext";
import StudentForm from "../components/StudentForm";
import AssignRoomModal from "../components/AssignRoomModal"; // <--- Import Modal
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Students: React.FC = () => {
  const { students, deleteStudent } = useApp();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // State for Room Modal
  const [changeRoomId, setChangeRoomId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      (s.SID || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

  const handleDelete = (id: string) => {
    if(window.confirm("Are you sure you want to remove this student?")) {
       deleteStudent(id);
       toast.success("Student record deleted.");
    }
  };

  return (
    <div className="space-y-6 bg-[#F5F9FA] min-h-screen p-6">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-[#354D62]">Student Directory</h1><p className="text-[#59748C] text-sm mt-1">Manage admission details and profiles.</p></div>
        <button onClick={() => navigate('/admin/students/create')} className="bg-[#354D62] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:bg-[#59748C] transition-all"><UserPlus className="h-5 w-5" /> New Admission</button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#718CA1]/30 shadow-sm flex justify-between items-center">
         <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#718CA1]" />
            <input type="text" placeholder="Search by Name or SID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-[#718CA1]/30 rounded-xl text-sm text-[#354D62] outline-none focus:ring-2 focus:ring-[#354D62]" />
         </div>
      </div>

      <div className="bg-white border border-[#718CA1]/30 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#354D62] text-[#D7F2F7] font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">SID</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#718CA1]/20">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-[#D7F2F7]/20 transition-colors group">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={student.photoUrl || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover border border-[#718CA1]" /><div><p className="font-bold text-[#354D62]">{student.firstName} {student.lastName}</p><p className="text-xs text-[#718CA1]">{student.gender}</p></div></div></td>
                <td className="px-6 py-4 font-mono text-[#59748C]">{student.SID}</td>
                <td className="px-6 py-4 text-[#59748C]"><div className="flex flex-col gap-1"><div className="flex items-center gap-2 text-xs"><Mail className="w-3 h-3"/> {student.email}</div><div className="flex items-center gap-2 text-xs"><Phone className="w-3 h-3"/> {student.phone}</div></div></td>
                <td className="px-6 py-4">
                   <span className={`inline-flex px-2.5 py-1 rounded-lg font-bold text-xs border ${student.roomId ? 'bg-[#D7F2F7] text-[#354D62] border-[#718CA1]' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                     {student.roomId ? `Room ${student.roomId}` : 'Unassigned'}
                   </span>
                </td>
                <td className="px-6 py-4 text-[#59748C]"><p className="font-medium">{student.course}</p><p className="text-xs text-[#718CA1]">{student.year}</p></td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* CHANGE ROOM BUTTON */}
                      <button onClick={() => setChangeRoomId(student.id)} className="p-2 text-[#354D62] hover:bg-[#D7F2F7] rounded-lg transition" title="Change Room">
                        <BedDouble className="w-4 h-4" />
                      </button>
                      
                      <button onClick={() => { setEditId(student.id); setShowForm(true); }} className="p-2 text-[#59748C] hover:bg-[#F5F9FA] rounded-lg transition">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showForm && <StudentForm studentId={editId} onClose={() => setShowForm(false)} />}
      
      {/* Room Change Modal */}
      {changeRoomId && (
        <AssignRoomModal 
          studentId={changeRoomId} 
          onClose={() => setChangeRoomId(null)} 
        />
      )}

    </div>
  );
};

export default Students;