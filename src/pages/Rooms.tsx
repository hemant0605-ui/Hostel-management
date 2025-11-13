import React, { useState } from 'react';
import { DoorOpen, Users, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import AssignStudentModal from '../components/AssignStudentModal';

const Rooms: React.FC = () => {
  const { rooms, students } = useApp();
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [assigningToRoom, setAssigningToRoom] = useState<string | null>(null);

  // ⭐ Automatically detect all floors (1–10)
  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);

  const filteredRooms =
    selectedFloor === 'all'
      ? rooms
      : rooms.filter((r) => r.floor === selectedFloor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Occupied':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Full':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Maintenance':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoomStudents = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return [];
    return students.filter((s) => room.students.includes(s.id));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Rooms</h1>
              <p className="text-gray-600">Manage room allocations and occupancy</p>
            </div>
          </div>

          {/* ⭐ Floor Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gray-700 font-medium">Filter by Floor:</span>

              {/* All floors */}
              <button
                onClick={() => setSelectedFloor('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFloor === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Floors
              </button>

              {/* ⭐ Dynamically generated floors */}
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFloor === floor
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Floor {floor}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room, index) => {
              const roomStudents = getRoomStudents(room.id);

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  {/* Header */}
                  <div
                    className={`p-4 ${
                      room.status === 'Available'
                        ? 'bg-green-500'
                        : room.status === 'Occupied'
                        ? 'bg-blue-500'
                        : room.status === 'Full'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    } text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DoorOpen className="h-6 w-6" />
                        <span className="text-xl font-bold">{room.roomNumber}</span>
                      </div>
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        Floor {room.floor}
                      </span>
                    </div>
                    <p className="text-sm mt-2 opacity-90">{room.type} Room</p>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          room.status
                        )}`}
                      >
                        {room.status}
                      </span>

                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          {room.occupiedBeds}/{room.capacity}
                        </span>
                      </div>
                    </div>

                    {/* Occupancy bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Occupancy</span>
                        <span>{((room.occupiedBeds / room.capacity) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            room.occupiedBeds === room.capacity
                              ? 'bg-red-500'
                              : room.occupiedBeds > 0
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(room.occupiedBeds / room.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Students */}
                    {roomStudents.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Residents:</p>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {roomStudents.map((student) => (
                            <div
                              key={student.id}
                              className="text-xs bg-gray-50 p-2 rounded flex items-center space-x-2"
                            >
                              <img
                                src={student.photoUrl || 'https://via.placeholder.com/30'}
                                alt={`${student.firstName} ${student.lastName}`}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-gray-700 font-medium truncate">
                                {student.firstName} {student.lastName}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assign Student Button */}
                  {room.status !== 'Full' && room.status !== 'Maintenance' && (
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => setAssigningToRoom(room.id)}
                        className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2 text-sm font-semibold"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Assign Student</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {assigningToRoom && (
          <AssignStudentModal
            roomId={assigningToRoom}
            onClose={() => setAssigningToRoom(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Rooms;
