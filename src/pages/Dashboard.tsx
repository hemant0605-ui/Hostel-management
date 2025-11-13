import React from 'react';
import { Users, DoorOpen, UserCheck, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { students, rooms } = useApp();

  const totalStudents = students.length;
  const assignedStudents = students.filter(s => s.roomId).length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupiedBeds > 0).length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
  const occupancyRate = totalCapacity > 0 ? ((totalOccupied / totalCapacity) * 100).toFixed(1) : '0';

  const recentStudents = [...students].sort((a, b) => 
    new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your hostel overview</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            color="#6366f1"
            trend={`${assignedStudents} assigned to rooms`}
          />
          <StatCard
            title="Total Rooms"
            value={totalRooms}
            icon={DoorOpen}
            color="#8b5cf6"
            trend={`${availableRooms} available`}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            icon={UserCheck}
            color="#ec4899"
            trend={`${totalOccupied}/${totalCapacity} beds occupied`}
          />
          <StatCard
            title="Unassigned"
            value={totalStudents - assignedStudents}
            icon={AlertTriangle}
            color="#0fdcebff"
            trend="Students without rooms"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Admissions</h2>
            <div className="space-y-3">
              {recentStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <img
                    src={student.photoUrl || 'https://via.placeholder.com/40'}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{student.course} - {student.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(student.admissionDate).toLocaleDateString('en-GB')}
                    </p>
                    {student.roomId ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1">
                        Assigned
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full mt-1">
                        Pending
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Room Status Overview</h2>
            <div className="space-y-4">
              {['Available', 'Occupied', 'Full', 'Maintenance'].map((status, index) => {
                const count = rooms.filter(r => r.status === status).length;
                const percentage = totalRooms > 0 ? (count / totalRooms) * 100 : 0;
                const colors: Record<string, string> = {
                  'Available': 'bg-green-500',
                  'Occupied': 'bg-blue-500',
                  'Full': 'bg-red-500',
                  'Maintenance': 'bg-gray-500'
                };
                
                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">{status}</span>
                      <span className="text-gray-600 font-semibold">{count} rooms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className={`h-full ${colors[status]} rounded-full`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
