import React, { useState, useEffect } from 'react';
import { useApp, Complaint, GatePass, Notice } from '../context/AppContext';
import { 
  LayoutDashboard, CreditCard, FileText, Bell, 
  LogOut, Plus, Clock, CheckCircle, Ticket, Calendar, 
  Search, AlertCircle, X, Loader2, Wallet, ChevronRight, Building, 
  Siren, Phone, Ambulance, ShieldAlert, User, Eye, QrCode,
  Smartphone, Globe, Mail, MapPin, Hash, BookOpen, Droplet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- TYPES ---
interface ComplaintFormData { subject: string; description: string; }
interface GatePassFormData { type: 'Outing' | 'Leave' | 'Night Out'; startDate: string; endDate: string; reason: string; }

const StudentDashboard: React.FC = () => {
  const { currentStudent, logoutStudent, complaints, addComplaint, notices, gatePasses, applyGatePass, attendance, toggleAttendance } = useApp();
  const navigate = useNavigate();
  
  // 👇 ADDED 'profile' TO TABS
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'attendance' | 'fees' | 'complaints' | 'gatepass' | 'idcard'>('dashboard');
  
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showGatePassModal, setShowGatePassModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  
  const [selectedPass, setSelectedPass] = useState<GatePass | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasReadNotices, setHasReadNotices] = useState(false);

  if (!currentStudent) return null;

  const studentComplaints = complaints.filter(c => c.studentId === currentStudent.id);
  const studentPasses = gatePasses.filter(p => p.studentId === currentStudent.id);
  const pendingFees = 15000;

  const handleLogout = () => {
    logoutStudent();
    navigate('/login');
  };

  const markAllRead = () => {
    setHasReadNotices(true);
  };

  return (
    <div className="flex h-screen bg-[#F5F9FA] font-sans text-[#354D62]" onClick={() => setShowNotifications(false)}>
      
      {/* === SIDEBAR === */}
      <aside className="w-72 bg-[#354D62] text-[#D7F2F7] flex flex-col h-full shadow-2xl z-20" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-9 h-9 bg-[#D7F2F7] rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-[#354D62]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Hostel <span className="text-[#718CA1]">Portal</span></span>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-[#718CA1] uppercase tracking-wider mb-3 px-4">Main Menu</p>
            <NavButton icon={LayoutDashboard} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            
            {/* 👇 NEW PROFILE TAB */}
            <NavButton icon={User} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            
            <NavButton icon={CreditCard} label="My ID Card" active={activeTab === 'idcard'} onClick={() => setActiveTab('idcard')} />
            <NavButton icon={Calendar} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
            <NavButton icon={Wallet} label="Fees & Payment" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
            
            <p className="text-[10px] font-bold text-[#718CA1] uppercase tracking-wider mb-3 px-4 mt-8">Requests</p>
            <NavButton icon={FileText} label="Complaints" active={activeTab === 'complaints'} onClick={() => setActiveTab('complaints')} />
            <NavButton icon={Ticket} label="Gate Pass" active={activeTab === 'gatepass'} onClick={() => setActiveTab('gatepass')} />
            
            <button 
              onClick={() => setShowEmergencyModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 mt-6 rounded-xl transition-all duration-200 font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-900/20 animate-pulse"
            >
              <Siren className="w-5 h-5" /> Emergency Help
            </button>
          </div>
        </div>

        <div className="mt-auto p-5 border-t border-[#59748C]/30 m-4 bg-[#2C4052] rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <img src={currentStudent.photoUrl || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full border border-[#718CA1] shadow-sm object-cover" alt="Profile" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentStudent.firstName}</p>
              <p className="text-xs text-[#718CA1] truncate">Room {currentStudent.roomId || 'N/A'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#354D62] border border-[#59748C] hover:bg-[#D7F2F7] hover:text-[#354D62] text-[#D7F2F7] py-2 rounded-xl transition-all text-xs font-bold shadow-sm">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#718CA1]/20 flex items-center justify-between px-8 sticky top-0 z-10" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-[#354D62] capitalize">{activeTab.replace('-', ' ')}</h2>
            <span className="text-xs text-[#59748C]">Welcome back to your portal</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white border border-[#718CA1]/30 px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-[#354D62] rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-[#59748C]">Session 2024-25</span>
             </div>
             
             <div className="relative">
               <button 
                 onClick={() => setShowNotifications(!showNotifications)}
                 className={`relative p-2 rounded-full transition ${showNotifications ? 'bg-[#D7F2F7] text-[#354D62]' : 'text-[#718CA1] hover:bg-[#F5F9FA]'}`}
               >
                 <Bell className="w-5 h-5" />
                 {notices.length > 0 && !hasReadNotices && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                 )}
               </button>

               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                     className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#718CA1]/20 overflow-hidden z-50"
                     onClick={e => e.stopPropagation()}
                   >
                     <div className="p-4 border-b border-[#F5F9FA] bg-[#F5F9FA] flex justify-between items-center">
                       <h3 className="font-bold text-[#354D62] text-sm">Notifications</h3>
                       <span onClick={markAllRead} className="text-xs text-[#354D62] font-bold cursor-pointer hover:underline">Mark all read</span>
                     </div>
                     <div className="max-h-64 overflow-y-auto">
                       {notices.length === 0 ? (
                         <div className="p-8 text-center text-[#718CA1] text-xs">No new notifications</div>
                       ) : (
                         notices.map(n => (
                           <div key={n.id} className="p-4 hover:bg-[#F5F9FA] border-b border-[#F5F9FA] last:border-0 transition-colors">
                             <div className="flex justify-between items-start mb-1">
                               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${n.type === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-[#D7F2F7] text-[#354D62]'}`}>{n.type}</span>
                               <span className="text-[10px] text-[#718CA1]">{n.date}</span>
                             </div>
                             <p className="text-sm font-bold text-[#354D62]">{n.title}</p>
                             <p className="text-xs text-[#59748C] mt-0.5 line-clamp-2">{n.content}</p>
                           </div>
                         ))
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView key="dash" student={currentStudent} notices={notices} hasReadNotices={hasReadNotices} pendingFees={pendingFees} />}
            
            {/* 👇 NEW PROFILE VIEW */}
            {activeTab === 'profile' && <ProfileView key="profile" student={currentStudent} />}
            
            {activeTab === 'idcard' && <IDCardView key="idcard" student={currentStudent} />}
            {activeTab === 'attendance' && <AttendanceView key="att" attendance={attendance.filter(a => a.studentId === currentStudent.id)} onToggle={() => toggleAttendance(currentStudent.id)} />}
            {activeTab === 'fees' && <FeesView key="fees" student={currentStudent} pendingFees={pendingFees} />}
            {activeTab === 'complaints' && <ComplaintsView key="comp" complaints={studentComplaints} onCreate={() => setShowComplaintModal(true)} />}
            {activeTab === 'gatepass' && <GatePassView key="pass" passes={studentPasses} onCreate={() => setShowGatePassModal(true)} onView={(p) => setSelectedPass(p)} />}
          </AnimatePresence>
        </div>
      </main>

      {/* MODALS */}
      {showComplaintModal && <Modal title="Raise a Complaint" onClose={() => setShowComplaintModal(false)}><ComplaintForm onSubmit={(data: ComplaintFormData) => { addComplaint({ id: Date.now().toString(), studentId: currentStudent.id, date: new Date().toISOString().split('T')[0], status: 'Pending', ...data }); setShowComplaintModal(false); }} onClose={() => setShowComplaintModal(false)} /></Modal>}
      {showGatePassModal && <Modal title="Apply Gate Pass" onClose={() => setShowGatePassModal(false)}><GatePassForm onSubmit={(data: GatePassFormData) => { applyGatePass({ id: Date.now().toString(), studentId: currentStudent.id, status: 'Pending', appliedDate: new Date().toISOString().split('T')[0], ...data }); setShowGatePassModal(false); }} onClose={() => setShowGatePassModal(false)} /></Modal>}
      {showEmergencyModal && <EmergencyModal onClose={() => setShowEmergencyModal(false)} />}
      {selectedPass && <DigitalPassModal pass={selectedPass} student={currentStudent} onClose={() => setSelectedPass(null)} />}
    </div>
  );
};

// ==========================================
// 1. PROFILE VIEW (NEW)
// ==========================================
const ProfileView = ({ student }: any) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#718CA1]/20 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#354D62] to-[#59748C]"></div>
        <div className="px-8 pb-8 relative">
           <div className="absolute -top-16 left-8 border-4 border-white rounded-full bg-white p-1 shadow-md">
             <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200">
               <img src={student.photoUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="Student" />
             </div>
           </div>
           <div className="ml-40 pt-4">
             <h1 className="text-3xl font-bold text-[#354D62]">{student.firstName} {student.lastName}</h1>
             <p className="text-[#59748C] font-medium flex items-center gap-2 mt-1">
               <Building className="w-4 h-4" /> Room {student.roomId || 'Unassigned'} • {student.course} ({student.year})
             </p>
           </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Info */}
        <div className="bg-white p-8 rounded-2xl border border-[#718CA1]/20 shadow-sm">
           <h3 className="font-bold text-[#354D62] text-lg mb-6 border-b border-[#F5F9FA] pb-3">Personal Information</h3>
           <div className="space-y-5">
             <ProfileField icon={Hash} label="Student ID (SID)" value={student.SID} />
             <ProfileField icon={Calendar} label="Date of Birth" value={student.dateOfBirth} />
             <ProfileField icon={User} label="Gender" value={student.gender} />
             <ProfileField icon={Droplet} label="Blood Group" value={student.bloodGroup || 'N/A'} />
           </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-2xl border border-[#718CA1]/20 shadow-sm">
           <h3 className="font-bold text-[#354D62] text-lg mb-6 border-b border-[#F5F9FA] pb-3">Contact Details</h3>
           <div className="space-y-5">
             <ProfileField icon={Mail} label="Email Address" value={student.email} />
             <ProfileField icon={Phone} label="Phone Number" value={student.phone} />
             <ProfileField icon={MapPin} label="Permanent Address" value={student.address} />
             <ProfileField icon={Clock} label="Admission Date" value={new Date(student.admissionDate).toLocaleDateString()} />
           </div>
        </div>

      </div>
    </motion.div>
  );
};

const ProfileField = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-4">
     <div className="p-2.5 bg-[#F5F9FA] rounded-lg text-[#718CA1]">
       <Icon className="w-5 h-5" />
     </div>
     <div>
       <p className="text-xs font-bold text-[#718CA1] uppercase tracking-wide">{label}</p>
       <p className="text-sm font-semibold text-[#354D62] mt-0.5">{value || 'Not Provided'}</p>
     </div>
  </div>
);

// ==========================================
// 2. ID CARD VIEW (UPDATED WITH ADDRESS)
// ==========================================
const IDCardView = ({ student }: any) => {
  const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString("en-GB");
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center items-center h-full">
      <div className="w-80 h-[520px] rounded-3xl shadow-2xl bg-white overflow-hidden relative border border-[#718CA1]/20 group hover:scale-105 transition-all duration-500">
        <div className="absolute inset-0 h-[50%] bg-gradient-to-br from-[#354D62] to-[#59748C] rounded-b-[3rem] z-0"></div>
        
        <div className="absolute inset-0 p-6 z-10 flex flex-col items-center text-center">
          <h3 className="text-[#D7F2F7] font-bold text-[10px] tracking-[0.2em] mb-4 uppercase opacity-90">Jagannath Univercity</h3>
          
          <div className="w-28 h-28 rounded-full border-4 border-white/30 p-1 shadow-lg backdrop-blur-sm bg-white/10">
            <div className="w-full h-full rounded-full bg-white overflow-hidden border-2 border-white">
               <img src={student.photoUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="student" />
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="text-white font-bold text-xl tracking-tight leading-tight">{student.firstName} {student.lastName}</h2>
            <p className="text-[#D7F2F7] text-xs font-medium mt-1 px-3 py-0.5 bg-white/10 rounded-full inline-block backdrop-blur-sm">{student.course} • {student.year}</p>
          </div>

          <div className="mt-auto w-full bg-[#F5F9FA] rounded-xl shadow-inner p-4 space-y-2.5 text-left border border-[#E2E8F0]">
            <div className="flex justify-between text-xs border-b border-[#718CA1]/10 pb-1.5">
              <span className="text-[#59748C] font-semibold">SID</span><span className="text-[#354D62] font-bold font-mono">{student.SID}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-[#718CA1]/10 pb-1.5">
              <span className="text-[#59748C] font-semibold">DOB</span><span className="text-[#354D62] font-bold">{student.dateOfBirth || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-[#718CA1]/10 pb-1.5">
              <span className="text-[#59748C] font-semibold">Blood</span><span className="text-[#354D62] font-bold">{student.bloodGroup || 'N/A'}</span>
            </div>
            {/* ADDRESS FIELD ADDED */}
            <div className="flex justify-between text-xs border-b border-[#718CA1]/10 pb-1.5">
               <span className="text-[#59748C] font-semibold">City</span>
               <span className="text-[#354D62] font-bold truncate max-w-[100px]" title={student.address}>{student.address || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-[#59748C] font-semibold">Valid Thru</span><span className="text-rose-500 font-bold">{expiryDate}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- EXISTING VIEWS (UNCHANGED) ---
const DashboardView = ({ student, notices, hasReadNotices, pendingFees }: any) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="bg-gradient-to-r from-[#354D62] to-[#59748C] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"><div className="relative z-10"><h1 className="text-3xl font-bold mb-2">Hello, {student.firstName}!</h1><p className="text-[#D7F2F7] opacity-90">Welcome to your student portal.</p></div><div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><StatCard label="Room No" value={student.roomId || "N/A"} sub={student.floor ? `Floor ${student.floor}` : 'Pending'} color="bg-[#D7F2F7]" text="text-[#354D62]" icon={LayoutDashboard} /><StatCard label="Fees Due" value={`₹${pendingFees}`} sub="Due 5th Dec" color="bg-rose-50" text="text-rose-600" icon={Wallet} /><StatCard label="Gate Passes" value="2" sub="Approved" color="bg-emerald-50" text="text-emerald-600" icon={Ticket} /><StatCard label="Notices" value={hasReadNotices ? 0 : notices.length} sub="Unread Updates" color="bg-[#354D62]/10" text="text-[#354D62]" icon={Bell} /></div>
  </motion.div>
);
const FeesView = ({ student, pendingFees }: any) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8"><div className="bg-white p-8 rounded-2xl border border-[#718CA1]/20 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"><div className="relative z-10"><div className="flex items-center gap-2 mb-2"><span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded">Unpaid</span><p className="text-xs font-bold text-[#718CA1] uppercase tracking-wider">Total Outstanding</p></div><h1 className="text-4xl font-bold text-[#354D62] tracking-tight">₹{pendingFees.toLocaleString()}<span className="text-lg text-[#718CA1] font-medium">.00</span></h1><p className="text-sm text-[#59748C] mt-1">Due Date: <span className="font-medium text-rose-600">05 Dec 2025</span></p></div><div className="relative z-10 w-full md:w-auto"><button onClick={() => setShowPaymentModal(true)} className="w-full md:w-auto bg-[#354D62] hover:bg-[#59748C] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"><CreditCard className="w-5 h-5"/> Pay Now</button><p className="text-[10px] text-[#718CA1] text-center mt-2 flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" /> Secure Payment 256-bit SSL</p></div></div><div className="bg-white rounded-2xl border border-[#718CA1]/20 shadow-sm overflow-hidden"><div className="px-8 py-5 border-b border-[#718CA1]/20 bg-[#F5F9FA] flex justify-between items-center"><h3 className="font-bold text-[#354D62] flex items-center gap-2"><FileText className="w-4 h-4 text-[#718CA1]" /> Fee Breakdown</h3><span className="text-xs font-medium text-[#59748C]">2nd Semester</span></div><div className="p-8"><div className="space-y-4 text-sm"><FeeRow label="Hostel Accommodation (Double Bed)" amount="25,000" /><FeeRow label="Mess Charges (4 Meals/Day)" amount="15,000" /><FeeRow label="Laundry & Maintenance" amount="5,000" /><FeeRow label="Security Deposit (Refundable)" amount="2,000" /><div className="border-t border-dashed border-[#718CA1]/20 my-4"></div><FeeRow label="Total Hostel Fee" amount="47,000" bold /><FeeRow label="Scholarship / Adjustment" amount="- 2,000" color="text-emerald-600" /><FeeRow label="Previously Paid" amount="- 30,000" color="text-emerald-600" /><div className="border-t border-[#718CA1]/20 my-4"></div><div className="flex justify-between items-center text-lg bg-[#F5F9FA] p-4 rounded-xl"><span className="font-bold text-[#354D62]">Net Payable</span><span className="font-bold text-[#354D62]">₹15,000</span></div></div></div></div>{showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} amount={pendingFees} />}</motion.div>);
};
const PaymentModal = ({ onClose, amount }: any) => {
    const [method, setMethod] = useState<'Card' | 'UPI' | 'NetBanking'>('Card');
    const [isProcessing, setIsProcessing] = useState(false);
    const handlePayment = (e: React.FormEvent) => { e.preventDefault(); setIsProcessing(true); setTimeout(() => { setIsProcessing(false); alert(`Payment of ₹${amount.toLocaleString()} Successful via ${method}!`); onClose(); }, 2000); };
    return (<div className="fixed inset-0 bg-[#354D62]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"><div className="px-6 py-4 border-b border-[#718CA1]/20 flex justify-between items-center bg-[#F5F9FA]"><div><h3 className="font-bold text-lg text-[#354D62]">Payment Gateway</h3><p className="text-xs text-[#59748C]">Secure 256-bit SSL Transaction</p></div><button onClick={onClose} className="p-2 hover:bg-[#F5F9FA] rounded-full transition"><X className="w-5 h-5 text-[#718CA1]" /></button></div><div className="bg-[#354D62] p-6 text-center text-white"><p className="text-[#D7F2F7] text-xs font-bold uppercase tracking-wider">Total Payable</p><h2 className="text-3xl font-bold mt-1">₹{amount.toLocaleString()}</h2></div><div className="flex flex-1 overflow-hidden"><div className="w-1/3 bg-[#F5F9FA] border-r border-[#718CA1]/20 p-2 space-y-2"><MethodTab icon={CreditCard} label="Card" active={method === 'Card'} onClick={() => setMethod('Card')} /><MethodTab icon={Smartphone} label="UPI" active={method === 'UPI'} onClick={() => setMethod('UPI')} /><MethodTab icon={Globe} label="Net Banking" active={method === 'NetBanking'} onClick={() => setMethod('NetBanking')} /></div><div className="w-2/3 p-6 overflow-y-auto"><form onSubmit={handlePayment} className="space-y-4">{method === 'Card' && (<div><label className="text-xs font-bold text-[#59748C] uppercase mb-1 block">Card Number</label><input className="w-full border border-[#718CA1]/30 p-3 rounded-xl text-sm focus:ring-2 focus:ring-[#354D62] outline-none" placeholder="0000 0000 0000 0000" required /></div>)}{method === 'UPI' && (<div><label className="text-xs font-bold text-[#59748C] uppercase mb-1 block">UPI ID</label><input className="w-full border border-[#718CA1]/30 p-3 rounded-xl text-sm focus:ring-2 focus:ring-[#354D62] outline-none" placeholder="username@bank" required /></div>)}{method === 'NetBanking' && (<div><label className="text-xs font-bold text-[#59748C] uppercase mb-1 block">Select Bank</label><select className="w-full border border-[#718CA1]/30 p-3 rounded-xl text-sm focus:ring-2 focus:ring-[#354D62] outline-none"><option>HDFC</option><option>SBI</option><option>ICICI</option></select></div>)}<div className="pt-4"><button type="submit" disabled={isProcessing} className="w-full bg-[#354D62] text-white py-3 rounded-xl font-bold hover:bg-[#59748C]">{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pay Securely'}</button></div></form></div></div></motion.div></div>);
};
const AttendanceView = ({ attendance, onToggle }: { attendance: any[], onToggle: () => void }) => {
    const today = new Date().toISOString().split('T')[0];
    const isMarked = attendance.some(a => a.date === today);
    const days = Array.from({ length: 30 }, (_, i) => { const dateNum = i + 1; const status = Math.random() > 0.8 ? 'Absent' : 'Present'; return { day: dateNum, status }; });
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto"><div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#718CA1]/20"><div><h2 className="text-xl font-bold text-[#354D62]">Daily Attendance</h2><p className="text-sm text-[#59748C]">Date: <span className="font-mono font-bold">{today}</span></p></div>{isMarked ? (<button onClick={onToggle} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-rose-200 transition-all"><X className="w-5 h-5" /> Unmark Present</button>) : (<button onClick={onToggle} className="bg-[#354D62] hover:bg-[#59748C] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Mark Present</button>)}</div><div className="bg-white p-6 rounded-2xl border border-[#718CA1]/20 shadow-sm"><h3 className="font-bold text-[#354D62] mb-6">Attendance History</h3><div className="grid grid-cols-7 gap-3">{['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-xs font-bold text-[#718CA1]">{d}</div>)}{days.map((d) => (<div key={d.day} className={`aspect-square rounded-xl flex flex-col items-center justify-center border text-sm font-medium ${d.status === 'Present' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}><span>{d.day}</span><span className="text-[8px] uppercase font-bold mt-1">{d.status === 'Present' ? 'P' : 'A'}</span></div>))}</div></div></motion.div>);
};
const ComplaintsView: React.FC<{ complaints: Complaint[]; onCreate: () => void; }> = ({ complaints, onCreate }) => (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto"><div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold text-[#354D62]">My Complaints</h2></div><ActionButton label="New" icon={Plus} onClick={onCreate} primary /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{complaints.map(c => <div key={c.id} className="bg-white p-5 rounded-xl shadow-sm border border-[#718CA1]/20"><div className="flex justify-between mb-2"><StatusBadge status={c.status} /><span className="text-xs text-[#718CA1]">{c.date}</span></div><h3 className="font-bold text-[#354D62]">{c.subject}</h3><p className="text-sm text-[#59748C]">{c.description}</p></div>)}</div></motion.div>);
const GatePassView: React.FC<{ passes: GatePass[]; onCreate: () => void; onView: (p: GatePass) => void }> = ({ passes, onCreate, onView }) => (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto"><div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold text-[#354D62]">Gate Passes</h2></div><ActionButton label="Apply" icon={Plus} onClick={onCreate} primary /></div><div className="space-y-3">{passes.map(p => <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border border-[#718CA1]/20 flex justify-between items-center"><div><div className="flex items-center gap-3 mb-1"><h4 className="font-bold text-[#354D62]">{p.type}</h4><span className="text-[10px] px-2 py-0.5 bg-[#F5F9FA] text-[#59748C] rounded font-bold">Applied: {p.appliedDate}</span></div><div className="flex items-center gap-2 text-xs font-semibold text-[#718CA1] bg-[#F5F9FA] px-3 py-1 rounded-lg w-fit"><Calendar className="w-3 h-3" /> {p.startDate} <span className="text-[#354D62] mx-1">to</span> {p.endDate}</div></div><div className="flex items-center gap-3"><StatusBadge status={p.status} />{p.status === 'Approved' && (<button onClick={() => onView(p)} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors" title="View Digital Pass"><Eye className="w-5 h-5" /></button>)}</div></div>)}</div></motion.div>);

// --- HELPERS ---
const EmergencyModal = ({ onClose }: { onClose: () => void }) => { const handleSOS = () => { alert("🚨 SOS ALERT SENT!\n\nAdmin and Warden have been notified of your location."); onClose(); }; return (<div className="fixed inset-0 bg-[#354D62]/80 backdrop-blur-md flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"><div className="bg-rose-600 p-6 text-white text-center"><div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse"><Siren className="w-8 h-8" /></div><h2 className="text-2xl font-bold">Emergency Assistance</h2><p className="text-rose-100 text-sm mt-1">Quick contacts for urgent help</p></div><div className="p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><ContactCard title="Warden" phone="+91 98765 43210" icon={User} /><ContactCard title="Security" phone="+91 99999 88888" icon={ShieldAlert} /><ContactCard title="Ambulance" phone="108" icon={Ambulance} /><ContactCard title="Police" phone="100" icon={Siren} /></div><div className="pt-4"><button onClick={handleSOS} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"><Bell className="w-5 h-5" /> TRIGGER SOS ALERT</button><button onClick={onClose} className="w-full mt-3 py-3 text-[#718CA1] font-bold text-sm hover:bg-[#F5F9FA] rounded-xl">Cancel</button></div></div></motion.div></div>); };
const DigitalPassModal = ({ pass, student, onClose }: { pass: GatePass; student: any; onClose: () => void }) => (<div className="fixed inset-0 bg-[#354D62]/90 backdrop-blur-md flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9, opacity: 0, rotateX: 20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border-4 border-[#D7F2F7] relative"><div className="bg-emerald-600 p-4 text-center text-white relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div><h2 className="text-xl font-black tracking-widest uppercase relative z-10">GATE PASS APPROVED</h2><p className="text-[10px] opacity-90 relative z-10">Hostel Management System</p></div><div className="p-6 text-center"><div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto -mt-12 bg-white overflow-hidden"><img src={student.photoUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="Student" /></div><h3 className="text-xl font-bold text-[#354D62] mt-3">{student.firstName} {student.lastName}</h3><p className="text-sm text-[#59748C] font-medium mb-6">{student.course} • Room {student.roomId}</p><div className="bg-[#F5F9FA] rounded-xl p-4 border border-[#718CA1]/20 text-left space-y-3"><div className="flex justify-between border-b border-[#718CA1]/10 pb-2"><span className="text-xs font-bold text-[#718CA1] uppercase">Type</span><span className="text-sm font-bold text-[#354D62]">{pass.type}</span></div><div className="flex justify-between border-b border-[#718CA1]/10 pb-2"><span className="text-xs font-bold text-[#718CA1] uppercase">Valid From</span><span className="text-sm font-bold text-[#354D62]">{pass.startDate}</span></div><div className="flex justify-between border-b border-[#718CA1]/10 pb-2"><span className="text-xs font-bold text-[#718CA1] uppercase">Valid To</span><span className="text-sm font-bold text-[#354D62]">{pass.endDate}</span></div></div><div className="mt-6 flex flex-col items-center gap-2"><div className="p-2 bg-white border-2 border-[#354D62] rounded-lg"><QrCode className="w-16 h-16 text-[#354D62]" /></div><p className="text-[10px] text-[#718CA1] font-mono uppercase tracking-widest">Scan at Security Gate</p></div></div><div className="p-4 bg-[#354D62] text-center"><button onClick={onClose} className="text-white font-bold text-sm hover:underline">Close Pass</button></div></motion.div></div>);
const ContactCard = ({ title, phone, icon: Icon }: any) => (<div className="bg-[#F5F9FA] p-4 rounded-xl border border-[#718CA1]/20 text-center hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer group"><Icon className="w-6 h-6 mx-auto text-[#718CA1] group-hover:text-rose-500 mb-2" /><p className="text-xs font-bold text-[#59748C] uppercase">{title}</p><p className="text-sm font-bold text-[#354D62] group-hover:text-rose-700">{phone}</p></div>);
const MethodTab = ({ icon: Icon, label, active, onClick }: any) => (<div onClick={onClick} className={`cursor-pointer p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${active ? 'bg-white shadow-sm text-[#354D62] ring-1 ring-[#354D62]' : 'text-[#718CA1] hover:bg-white'}`}><Icon className="w-5 h-5" /><span className="text-[10px] font-bold">{label}</span></div>);
const FeeRow = ({ label, amount, bold, color }: any) => (<div className={`flex justify-between items-center ${bold ? 'font-bold text-[#354D62]' : 'text-[#59748C]'} ${color || ''}`}><span>{label}</span><span>₹{amount}</span></div>);
const NavButton = ({ icon: Icon, label, active, onClick }: any) => (<button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Icon className="w-5 h-5" />{label}</button>);
const ActionButton = ({ label, icon: Icon, onClick, primary }: any) => (<button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm ${primary ? 'bg-[#354D62] text-white hover:bg-[#59748C]' : 'bg-white text-[#354D62] border border-[#718CA1]/30'}`}><Icon className="w-4 h-4" /> {label}</button>);
const StatCard = ({ label, value, sub, color, text, icon: Icon }: any) => (<div className="bg-white p-6 rounded-2xl border border-[#718CA1]/20 shadow-sm flex justify-between"><div><p className="text-xs font-bold text-[#718CA1] uppercase">{label}</p><p className="text-2xl font-bold text-[#354D62]">{value}</p><p className={`text-[10px] font-bold ${text}`}>{sub}</p></div><div className={`p-3 rounded-xl ${color}`}><Icon className="w-6 h-6" /></div></div>);
const StatusBadge = ({ status }: { status: string }) => { const styles: any = { 'Pending': 'bg-amber-100 text-amber-700', 'In Progress': 'bg-blue-100 text-blue-700', 'Resolved': 'bg-emerald-100 text-emerald-700', 'Approved': 'bg-emerald-100 text-emerald-700', 'Rejected': 'bg-red-100 text-red-700' }; return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>{status}</span>; };
const Modal = ({ title, children, onClose }: any) => (<div className="fixed inset-0 bg-[#354D62]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"><div className="px-6 py-4 border-b flex justify-between bg-[#F5F9FA]"><h3 className="font-bold text-lg text-[#354D62]">{title}</h3><button onClick={onClose}><X className="w-5 h-5 text-[#718CA1]" /></button></div><div className="p-6">{children}</div></div></div>);
const ComplaintForm = ({ onSubmit, onClose }: any) => { const [form, setForm] = useState<ComplaintFormData>({ subject: '', description: '' }); return (<div className="space-y-4"><input className="w-full border p-3 rounded-xl border-[#718CA1]/30" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /><textarea className="w-full border p-3 rounded-xl border-[#718CA1]/30" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /><div className="flex gap-3"><button onClick={onClose} className="flex-1 border border-[#718CA1]/30 py-3 rounded-xl text-[#59748C]">Cancel</button><button onClick={() => onSubmit(form)} className="flex-1 bg-[#354D62] text-white py-3 rounded-xl">Submit</button></div></div>); };
const GatePassForm = ({ onSubmit, onClose }: any) => { const [form, setForm] = useState<GatePassFormData>({ type: 'Outing', startDate: '', endDate: '', reason: '' }); return (<div className="space-y-4"><select className="w-full border p-3 rounded-xl border-[#718CA1]/30" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}><option>Outing</option><option>Leave</option><option>Night Out</option></select><div className="grid grid-cols-2 gap-4"><input type="date" className="border p-3 rounded-xl border-[#718CA1]/30" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /><input type="date" className="border p-3 rounded-xl border-[#718CA1]/30" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div><textarea className="w-full border p-3 rounded-xl border-[#718CA1]/30" placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} /><div className="flex gap-3"><button onClick={onClose} className="flex-1 border border-[#718CA1]/30 py-3 rounded-xl text-[#59748C]">Cancel</button><button onClick={() => onSubmit(form)} className="flex-1 bg-[#354D62] text-white py-3 rounded-xl">Apply</button></div></div>); };

export default StudentDashboard;