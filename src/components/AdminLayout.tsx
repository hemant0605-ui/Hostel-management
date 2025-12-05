import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, DoorOpen, Ticket, FileText, 
  Bell, LogOut, Calendar, Wallet, Search, Menu, IdCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminLayout: React.FC = () => {
  const { admin, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#D7F2F7] font-sans text-[#354D62]">
      
      {/* === SIDEBAR === */}
      <aside className="w-64 bg-[#354D62] text-[#D7F2F7] flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-6">
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#D7F2F7] rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-[#354D62]" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Hostel<span className="text-[#718CA1]">Admin</span></span>
          </div>

          <nav className="space-y-1">
            {/* 👇 UPDATED: Changed text color to White/Bright Ice */}
            <p className="text-[11px] font-extrabold text-[#D7F2F7] uppercase tracking-widest mb-2 px-3 opacity-90">
              Overview
            </p>
            
            <NavItem icon={LayoutDashboard} label="Dashboard" active={isActive('/admin/dashboard')} onClick={() => navigate('/admin/dashboard')} />
            <NavItem icon={Users} label="Students" active={isActive('/admin/students')} onClick={() => navigate('/admin/students')} />
            <NavItem icon={DoorOpen} label="Rooms" active={isActive('/admin/rooms')} onClick={() => navigate('/admin/rooms')} />
            <NavItem icon={IdCard} label="ID Cards" active={isActive('/admin/idcards')} onClick={() => navigate('/admin/idcards')} />
            
            {/* 👇 UPDATED: Changed text color to White/Bright Ice */}
            <p className="text-[11px] font-extrabold text-[#D7F2F7] uppercase tracking-widest mb-2 px-3 mt-6 opacity-90">
              Management
            </p>

            <NavItem icon={Calendar} label="Attendance" active={isActive('/admin/attendance')} onClick={() => navigate('/admin/attendance')} />
            <NavItem icon={Wallet} label="Fees & Finance" active={isActive('/admin/fees')} onClick={() => navigate('/admin/fees')} />
            <NavItem icon={Ticket} label="Gate Passes" active={isActive('/admin/gatepass')} onClick={() => navigate('/admin/gatepass')} />
            <NavItem icon={FileText} label="Complaints" active={isActive('/admin/complaints')} onClick={() => navigate('/admin/complaints')} />
            <NavItem icon={Bell} label="Notices" active={isActive('/admin/notices')} onClick={() => navigate('/admin/notices')} />
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-[#59748C]/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#59748C] flex items-center justify-center text-white font-bold border border-[#718CA1]">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-[#D7F2F7]/80 truncate">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#2C4052] hover:bg-[#D7F2F7] text-[#D7F2F7] hover:text-[#354D62] py-2.5 rounded-lg transition-all text-xs font-bold border border-[#59748C]/50">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-[#718CA1]/20 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Menu className="w-6 h-6 text-[#59748C] md:hidden" />
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718CA1]" />
              <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2 bg-[#D7F2F7] border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-[#354D62] outline-none transition-all text-[#354D62] placeholder-[#718CA1]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-[#D7F2F7] rounded-full flex items-center justify-center text-[#354D62] font-bold text-xs">
                {new Date().getDate()}
             </div>
             <div className="text-right hidden sm:block">
               <p className="text-xs font-bold text-[#354D62]">Academic Year</p>
               <p className="text-[10px] text-[#59748C]">2024 - 2025</p>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
      active 
      ? 'bg-[#D7F2F7] text-[#354D62] shadow-md font-bold' 
      : 'text-[#D7F2F7]/80 hover:bg-[#59748C] hover:text-white'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'text-[#354D62]' : 'text-current'}`} />
    {label}
  </button>
);

export default AdminLayout;