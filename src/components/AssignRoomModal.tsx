import React, { useState } from 'react';
import { X, DoorOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

interface AssignRoomModalProps {
  studentId: string;
  onClose: () => void;
}

const AssignRoomModal: React.FC<AssignRoomModalProps> = ({ studentId, onClose }) => {
  const { students, rooms, assignStudentToRoom, removeStudentFromRoom } = useApp();
  const student = students.find(s => s.id === studentId);
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  if (!student) return null;

  // Filter rooms that have space (Capacity > Occupied)
  const availableRooms = rooms.filter(r => r.occupiedBeds < r.capacity && r.status !== 'Maintenance');
  const currentRoom = student.roomId ? rooms.find(r => r.id === student.roomId) : null;

  const handleAssign = () => {
    if (selectedRoom) {
      // This function in AppContext handles moving (removing from old, adding to new)
      assignStudentToRoom(studentId, selectedRoom);
      onClose();
    }
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to unassign this student?')) {
      removeStudentFromRoom(studentId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#354D62]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#354D62] p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DoorOpen className="w-6 h-6 text-[#D7F2F7]" /> Change Room
            </h2>
            <p className="text-[#D7F2F7]/80 text-sm mt-1">
              Assigning: <span className="font-bold text-white">{student.firstName} {student.lastName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          
          {/* Current Status */}
          <div className="mb-6 bg-[#F5F9FA] p-4 rounded-xl border border-[#718CA1]/20 flex justify-between items-center">
             <div>
               <p className="text-xs font-bold text-[#718CA1] uppercase">Current Room</p>
               <p className="text-lg font-bold text-[#354D62]">
                 {currentRoom ? `Room ${currentRoom.roomNumber}` : 'Unassigned'}
               </p>
             </div>
             {currentRoom && (
               <button onClick={handleRemove} className="text-xs font-bold text-rose-600 hover:underline">
                 Unassign
               </button>
             )}
          </div>

          {/* Available Rooms List */}
          <h3 className="font-bold text-[#354D62] mb-3">Select New Room</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableRooms.length === 0 && (
              <div className="col-span-2 text-center py-8 text-[#718CA1]">
                No available rooms found.
              </div>
            )}
            
            {availableRooms.map(room => (
              <div 
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center group ${
                  selectedRoom === room.id 
                  ? 'border-[#354D62] bg-[#354D62] text-white shadow-md' 
                  : 'border-[#718CA1]/20 hover:border-[#354D62] hover:bg-[#F5F9FA] text-[#354D62]'
                }`}
              >
                <div>
                  <p className="font-bold text-lg">Room {room.roomNumber}</p>
                  <p className={`text-xs ${selectedRoom === room.id ? 'text-[#D7F2F7]' : 'text-[#718CA1]'}`}>
                    Floor {room.floor} • {room.type}
                  </p>
                </div>
                <div className="text-right">
                   <span className={`text-xs font-bold px-2 py-1 rounded ${
                     selectedRoom === room.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                   }`}>
                     {room.capacity - room.occupiedBeds} Free
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#718CA1]/20 bg-[#F5F9FA] flex justify-end gap-3">
           <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-[#718CA1]/30 text-[#59748C] font-bold hover:bg-white">Cancel</button>
           <button 
             onClick={handleAssign} 
             disabled={!selectedRoom}
             className="px-8 py-2.5 rounded-xl bg-[#354D62] text-white font-bold shadow-lg hover:bg-[#59748C] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             Confirm Change <ArrowRight className="w-4 h-4" />
           </button>
        </div>

      </motion.div>
    </div>
  );
};

export default AssignRoomModal;