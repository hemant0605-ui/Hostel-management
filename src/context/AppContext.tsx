import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Room, Admin } from '../types';
import { generateMockData } from '../utils/mockData';

interface AppContextType {
  students: Student[];
  rooms: Room[];
  admin: Admin | null;
  isAuthenticated: boolean;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  assignStudentToRoom: (studentId: string, roomId: string) => void;
  removeStudentFromRoom: (studentId: string) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_CREDENTIALS: Admin = {
  username: 'admin',
  password: 'admin123',
  name: 'Admin User'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setAdmin(ADMIN_CREDENTIALS);
    }

    try {
      const savedStudents = localStorage.getItem('students');
      const savedRooms = localStorage.getItem('rooms');

      if (savedStudents && savedRooms) {
        setStudents(JSON.parse(savedStudents));
        setRooms(JSON.parse(savedRooms));
      } else {
        const { students: mockStudents, rooms: mockRooms } = generateMockData();
        setStudents(mockStudents);
        setRooms(mockRooms);
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage, resetting to mock data.", error);
      const { students: mockStudents, rooms: mockRooms } = generateMockData();
      setStudents(mockStudents);
      setRooms(mockRooms);
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }
  }, [rooms]);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setAdmin(ADMIN_CREDENTIALS);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdmin(null);
    localStorage.removeItem('isAuthenticated');
    // Optional: Clear all app data on logout
    // localStorage.removeItem('students');
    // localStorage.removeItem('rooms');
  };

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedStudent } : s));
  };

  const deleteStudent = (id: string) => {
    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;

    // If student is in a room, update the room state first
    if (studentToDelete.roomId) {
      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === studentToDelete.roomId) {
            const newStudents = room.students.filter(studentId => studentId !== id);
            const occupiedBeds = newStudents.length;
            return {
              ...room,
              students: newStudents,
              occupiedBeds,
              status: occupiedBeds === 0 ? 'Available' : 'Occupied' as Room['status'],
            };
          }
          return room;
        })
      );
    }

    // Then, remove the student from the students list
    setStudents(prevStudents => prevStudents.filter(s => s.id !== id));
  };

  const addRoom = (room: Room) => {
    setRooms(prev => [...prev, room]);
  };

  const updateRoom = (id: string, updatedRoom: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updatedRoom } : r));
  };

  const assignStudentToRoom = (studentId: string, newRoomId: string) => {
    const studentToAssign = students.find(s => s.id === studentId);
    const newRoom = rooms.find(r => r.id === newRoomId);

    if (!studentToAssign || !newRoom || newRoom.occupiedBeds >= newRoom.capacity) {
      console.error("Cannot assign student to room: Invalid data or room is full.");
      return;
    }

    const oldRoomId = studentToAssign.roomId;
    if (oldRoomId === newRoomId) return;

    // Atomically update rooms and students
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        // Add student to the new room
        if (room.id === newRoomId) {
          const newStudents = [...room.students, studentId];
          const occupiedBeds = newStudents.length;
          return {
            ...room,
            students: newStudents,
            occupiedBeds,
            status: occupiedBeds >= room.capacity ? 'Full' : 'Occupied' as Room['status']
          };
        }
        // Remove student from the old room
        if (room.id === oldRoomId) {
          const newStudents = room.students.filter(id => id !== studentId);
          const occupiedBeds = newStudents.length;
          return {
            ...room,
            students: newStudents,
            occupiedBeds,
            status: occupiedBeds === 0 ? 'Available' : 'Occupied' as Room['status']
          };
        }
        return room;
      });
    });

    setStudents(prevStudents =>
      prevStudents.map(s =>
        s.id === studentId ? { ...s, roomId: newRoomId } : s
      )
    );
  };

  const removeStudentFromRoom = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student?.roomId) return;

    const oldRoomId = student.roomId;

    setRooms(prev => prev.map(r => {
      if (r.id === oldRoomId) {
        const newStudents = r.students.filter(id => id !== studentId);
        const occupiedBeds = newStudents.length;
        return {
          ...r,
          students: newStudents,
          occupiedBeds,
          status: occupiedBeds === 0 ? 'Available' : 'Occupied' as Room['status']
        };
      }
      return r;
    }));

    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, roomId: undefined } : s
    ));
  };

  return (
    <AppContext.Provider value={{
      students,
      rooms,
      admin,
      isAuthenticated,
      addStudent,
      updateStudent,
      deleteStudent,
      addRoom,
      updateRoom,
      assignStudentToRoom,
      removeStudentFromRoom,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
