import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Student, Room, Admin } from '../types';
import { generateMockData } from '../utils/mockData';

// --- INTERFACES ---
export interface Complaint { id: string; studentId: string; subject: string; description: string; status: 'Pending' | 'In Progress' | 'Resolved'; date: string; }
export interface Notice { id: string; title: string; content: string; date: string; type: 'General' | 'Urgent' | 'Event'; }
export interface GatePass { id: string; studentId: string; type: 'Night Out' | 'Leave' | 'Outing'; reason: string; startDate: string; endDate: string; status: 'Pending' | 'Approved' | 'Rejected'; appliedDate: string; }
export interface Attendance { id: string; studentId: string; date: string; status: 'Present' | 'Absent'; }

interface AppContextType {
  students: Student[]; rooms: Room[]; admin: Admin | null; isAuthenticated: boolean; currentStudent: Student | null;
  complaints: Complaint[]; notices: Notice[]; gatePasses: GatePass[]; attendance: Attendance[];
  
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addRoom: (room: Room) => void;
  assignStudentToRoom: (studentId: string, roomId: string) => void;
  removeStudentFromRoom: (studentId: string) => void;
  
  addComplaint: (c: Complaint) => void;
  updateComplaintStatus: (id: string, status: 'Pending' | 'In Progress' | 'Resolved') => void;
  
  applyGatePass: (pass: GatePass) => void;
  updateGatePassStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  
  addNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;
  
  toggleAttendance: (studentId: string) => void;

  login: (username: string, password: string) => boolean;
  logout: () => void;
  loginStudent: (sid: string, password: string) => boolean;
  logoutStudent: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const ADMIN_CREDENTIALS: Admin = { username: 'admin', password: 'admin123', name: 'Admin User' };

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // --- STATE INITIALIZATION ---
  const [admin, setAdmin] = useState<Admin | null>(() => localStorage.getItem('isAuthenticated') === 'true' ? ADMIN_CREDENTIALS : null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isAuthenticated') === 'true');

  const [students, setStudents] = useState<Student[]>(() => JSON.parse(localStorage.getItem('students') || '[]'));
  const [rooms, setRooms] = useState<Room[]>(() => JSON.parse(localStorage.getItem('rooms') || '[]'));
  const [complaints, setComplaints] = useState<Complaint[]>(() => JSON.parse(localStorage.getItem('complaints') || '[]'));
  const [notices, setNotices] = useState<Notice[]>(() => JSON.parse(localStorage.getItem('notices') || '[]'));
  const [gatePasses, setGatePasses] = useState<GatePass[]>(() => JSON.parse(localStorage.getItem('gatePasses') || '[]'));
  const [attendance, setAttendance] = useState<Attendance[]>(() => JSON.parse(localStorage.getItem('attendance') || '[]'));
  
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const savedId = localStorage.getItem('currentStudentId');
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    return savedId ? savedStudents.find((s: any) => s.id === savedId) || null : null;
  });

  // --- CRITICAL FIX: KEEP CURRENT STUDENT SYNCED ---
  // Whenever 'students' list updates (e.g., room assigned), update 'currentStudent' too.
  useEffect(() => {
    if (currentStudent) {
      const updatedData = students.find(s => s.id === currentStudent.id);
      if (updatedData && JSON.stringify(updatedData) !== JSON.stringify(currentStudent)) {
        setCurrentStudent(updatedData);
      }
    }
  }, [students]); // Runs whenever students list changes

  // --- LOAD MOCK DATA IF EMPTY ---
  useEffect(() => {
    if (students.length === 0) {
      const { students: mockS, rooms: mockR } = generateMockData();
      setStudents(mockS);
      setRooms(mockR);
      localStorage.setItem('students', JSON.stringify(mockS));
      localStorage.setItem('rooms', JSON.stringify(mockR));
    }
  }, []);

  const save = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

  // --- STORAGE SYNC (Multi-tab support) ---
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      if (e.key === 'students') setStudents(JSON.parse(e.newValue));
      if (e.key === 'rooms') setRooms(JSON.parse(e.newValue));
      if (e.key === 'gatePasses') setGatePasses(JSON.parse(e.newValue));
      if (e.key === 'complaints') setComplaints(JSON.parse(e.newValue));
      if (e.key === 'notices') setNotices(JSON.parse(e.newValue));
      if (e.key === 'attendance') setAttendance(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- DATA PERSISTENCE ---
  useEffect(() => { if (students.length > 0) save('students', students); }, [students]);
  useEffect(() => { if (rooms.length > 0) save('rooms', rooms); }, [rooms]);
  useEffect(() => { save('complaints', complaints); }, [complaints]);
  useEffect(() => { save('notices', notices); }, [notices]);
  useEffect(() => { save('gatePasses', gatePasses); }, [gatePasses]);
  useEffect(() => { save('attendance', attendance); }, [attendance]);

  // --- ACTIONS ---
  const login = (u: string, p: string) => {
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true); setAdmin(ADMIN_CREDENTIALS); localStorage.setItem('isAuthenticated', 'true'); return true;
    } return false;
  };
  const logout = () => { setIsAuthenticated(false); setAdmin(null); localStorage.removeItem('isAuthenticated'); };
  
  const loginStudent = (sid: string, p: string) => {
    const found = students.find(s => s.SID === sid && s.password === p);
    if (found) { setCurrentStudent(found); localStorage.setItem('currentStudentId', found.id); return true; } return false;
  };
  const logoutStudent = () => { setCurrentStudent(null); localStorage.removeItem('currentStudentId'); };

  const addStudent = (s: Student) => setStudents(prev => [...prev, s]);
  const updateStudent = (id: string, u: Partial<Student>) => setStudents(prev => prev.map(s => s.id === id ? { ...s, ...u } : s));
  
  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setRooms(prev => prev.map(r => ({ ...r, students: r.students.filter(sid => sid !== id), occupiedBeds: r.students.filter(sid => sid !== id).length })));
  };

  const addRoom = (r: Room) => setRooms(prev => [...prev, r]);

  const assignStudentToRoom = (sid: string, rid: string) => {
    // Update Student
    setStudents(prev => prev.map(s => s.id === sid ? { ...s, roomId: rid } : s));

    // Update Rooms
    setRooms(prev => prev.map(r => {
      // Remove from old room
      if(r.students.includes(sid) && r.id !== rid) {
        const ns = r.students.filter(id => id !== sid);
        return { ...r, students: ns, occupiedBeds: ns.length, status: ns.length === 0 ? 'Available' : 'Occupied' };
      }
      // Add to new room
      if(r.id === rid && !r.students.includes(sid)) {
        const ns = [...r.students, sid];
        return { ...r, students: ns, occupiedBeds: ns.length, status: ns.length >= r.capacity ? 'Full' : 'Occupied' };
      }
      return r;
    }));
  };

  const removeStudentFromRoom = (sid: string) => {
    setStudents(prev => prev.map(s => s.id === sid ? { ...s, roomId: undefined } : s));
    setRooms(prev => prev.map(r => {
      if(r.students.includes(sid)) {
        const ns = r.students.filter(id => id !== sid);
        return { ...r, students: ns, occupiedBeds: ns.length, status: ns.length === 0 ? 'Available' : 'Occupied' };
      }
      return r;
    }));
  };

  const addComplaint = (c: Complaint) => setComplaints(p => [c, ...p]);
  const updateComplaintStatus = (id: string, s: any) => setComplaints(p => p.map(c => c.id === id ? { ...c, status: s } : c));
  
  const applyGatePass = (g: GatePass) => setGatePasses(p => [g, ...p]);
  const updateGatePassStatus = (id: string, s: any) => setGatePasses(p => p.map(g => g.id === id ? { ...g, status: s } : g));
  
  const addNotice = (n: Notice) => setNotices(p => [n, ...p]);
  const deleteNotice = (id: string) => setNotices(p => p.filter(n => n.id !== id));
  
  const toggleAttendance = (sid: string) => {
    const today = new Date().toISOString().split('T')[0];
    const exists = attendance.find(a => a.studentId === sid && a.date === today);
    if (exists) setAttendance(prev => prev.filter(a => a.id !== exists.id));
    else setAttendance(prev => [...prev, { id: Date.now().toString(), studentId: sid, date: today, status: 'Present' as const }]);
  };

  return (
    <AppContext.Provider value={{
      students, rooms, admin, isAuthenticated, currentStudent, complaints, notices, gatePasses, attendance,
      addStudent, updateStudent, deleteStudent, addRoom, assignStudentToRoom, removeStudentFromRoom, 
      addComplaint, updateComplaintStatus, applyGatePass, updateGatePassStatus, addNotice, deleteNotice, toggleAttendance,
      login, logout, loginStudent, logoutStudent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};