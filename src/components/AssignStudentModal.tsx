import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

interface AssignStudentModalProps {
  roomId: string;
  onClose: () => void;
}

const AssignStudentModal: React.FC<AssignStudentModalProps> = ({ roomId, onClose }) => {
  const { students, rooms, assignStudentToRoom } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const room = rooms.find(r => r.id === roomId);
  
  const unassignedStudents = useMemo(() => 
    students.filter(s => !s.roomId), 
    [students]
  );

  const filteredStudents = useMemo(() =>
    unassignedStudents.filter(student =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [unassignedStudents, searchTerm]
  );

  if (!room) return null;

  const handleAssign = () => {
    if (selectedStudent) {
      assignStudentToRoom(selectedStudent, roomId);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assign Student to Room {room.roomNumber}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for an unassigned student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Unassigned Students</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {filteredStudents.map(student => (
                <motion.div
                  key={student.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedStudent === student.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <img src={student.photoUrl} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold text-gray-800">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-gray-500">{student.rollNumber}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <p className="text-center text-gray-500 py-8">No unassigned students found.</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleAssign}
              disabled={!selectedStudent}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Student
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssignStudentModal;
