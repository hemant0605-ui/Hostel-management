import React, { useState } from 'react';
import { X, DoorOpen } from 'lucide-react';
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

  const availableRooms = rooms.filter(r => r.occupiedBeds < r.capacity && r.status !== 'Maintenance');
  const currentRoom = student.roomId ? rooms.find(r => r.id === student.roomId) : null;

  const handleAssign = () => {
    if (selectedRoom) {
      assignStudentToRoom(studentId, selectedRoom);
      onClose();
    }
  };

  const handleRemove = () => {
    if (window.confirm('Remove student from current room?')) {
      removeStudentFromRoom(studentId);
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
          <h2 className="text-2xl font-bold">Assign Room</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Student Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">{student.firstName} {student.lastName}</span> - {student.rollNumber}
              </p>
              <p className="text-sm text-gray-600 mt-1">{student.course} - {student.year}</p>
              {currentRoom && (
                <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <span className="text-blue-700 font-medium">
                    Currently in Room: {currentRoom.roomNumber}
                  </span>
                  <button
                    onClick={handleRemove}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Rooms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {availableRooms.map(room => (
                <motion.div
                  key={room.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRoom === room.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <DoorOpen className="h-5 w-5 text-indigo-600" />
                      <span className="font-bold text-gray-800">Room {room.roomNumber}</span>
                    </div>
                    <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {room.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Floor {room.floor}</p>
                    <p className="font-semibold text-indigo-600 mt-1">
                      {room.occupiedBeds}/{room.capacity} Occupied
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {availableRooms.length === 0 && (
              <p className="text-center text-gray-500 py-8">No rooms available</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleAssign}
              disabled={!selectedRoom}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Room
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

export default AssignRoomModal;
