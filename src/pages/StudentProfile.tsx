import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, BookOpen, Calendar, Droplet } from 'lucide-react';

const StudentProfile: React.FC = () => {
  const { currentStudent, rooms } = useApp();

  if (!currentStudent) return null;

  const studentRoom = rooms.find(r => r.id === currentStudent.roomId);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

      <div className="container mx-auto px-4 -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 text-center border-b">
                <img 
                  src={currentStudent.photoUrl} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover -mt-16 bg-white"
                />
                <h1 className="text-2xl font-bold text-gray-800 mt-4">
                  {currentStudent.firstName} {currentStudent.lastName}
                </h1>
                <p className="text-indigo-600 font-medium">{currentStudent.course}</p>
                <p className="text-gray-500 text-sm">{currentStudent.year}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-indigo-500" />
                  <span>{currentStudent.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-indigo-500" />
                  <span>{currentStudent.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-500" />
                  <span className="text-sm">{currentStudent.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Room */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-500" /> 
                Academic & Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Student ID (SID)</p>
                    <p className="font-semibold text-gray-800">{currentStudent.SID}</p>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Roll Number</p>
                    <p className="font-semibold text-gray-800">{currentStudent.rollNumber}</p>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-semibold text-gray-800">{currentStudent.dateOfBirth}</span>
                    </div>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <div className="flex items-center mt-1">
                      <Droplet className="w-4 h-4 mr-2 text-red-500" />
                      <span className="font-semibold text-gray-800">{currentStudent.bloodGroup}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Room Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Accommodation Status</h2>
              
              {studentRoom ? (
                <div className="border-2 border-indigo-100 rounded-xl p-6 bg-indigo-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Room Number</p>
                      <p className="text-3xl font-bold text-indigo-600">{studentRoom.roomNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Floor</p>
                      <p className="font-semibold">{studentRoom.floor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-semibold">{studentRoom.type} Bed</p>
                    </div>
                  </div>

                  <div className="border-t border-indigo-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Room Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {studentRoom.amenities.map(a => (
                        <span key={a} className="px-2 py-1 bg-white border border-indigo-100 rounded text-xs text-indigo-600">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        You have not been assigned a room yet. Please contact the hostel admin.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;