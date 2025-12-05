import React, { useState, useEffect } from 'react';
import { 
  Users, DoorOpen, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Calendar, Plus, ArrowRight, Activity, CheckCircle, Bell, BarChart3, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { students, rooms, attendance, notices } = useApp();
  const navigate = useNavigate();

  // --- REAL-TIME STATS CALCULATION ---
  const totalStudents = students.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupiedBeds > 0).length;
  const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(0) : '0';
  
  const totalRevenue = totalStudents * 50000; 
  const collectedRevenue = totalStudents * 35000;
  
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;
  const attendancePercent = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(0) : 0;

  // Mock Data for Floor Occupancy
  const floorStats = [
    { floor: 1, capacity: 50, occupied: 45 },
    { floor: 2, capacity: 50, occupied: 30 },
    { floor: 3, capacity: 50, occupied: 12 },
    { floor: 4, capacity: 50, occupied: 5 },
  ];

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 pb-10 bg-[#F5F9FA] min-h-screen p-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#354D62]">Dashboard Overview</h1>
          <p className="text-[#59748C] text-sm mt-1">
            Hostel performance for <span className="font-semibold text-[#354D62]">{time.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#718CA1]/30 text-[#59748C] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#F5F9FA] transition flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4" /> Download Report
          </button>
          {/* Removed "Add Student" button as requested */}
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ThemeStatCard title="Total Students" value={totalStudents} icon={Users} trend="+12% New" trendUp={true} />
        <ThemeStatCard title="Occupancy" value={`${occupancyRate}%`} icon={DoorOpen} trend={`${200 - occupiedRooms} Rooms Free`} trendUp={false} />
        <ThemeStatCard title="Revenue" value={`₹${(collectedRevenue / 100000).toFixed(1)}L`} icon={Wallet} trend="92% Collection" trendUp={true} />
        <ThemeStatCard title="Attendance" value={`${attendancePercent}%`} icon={Calendar} trend={`${totalStudents - presentToday} Absent`} trendUp={false} />
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 1. REVENUE BAR CHART (IMPROVED LOOK) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#718CA1]/20 shadow-sm p-6 flex flex-col h-[450px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-[#354D62] text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#59748C]" /> Monthly Revenue
              </h3>
              <p className="text-xs text-[#718CA1]">Income vs Projected (Yearly)</p>
            </div>
            <div className="flex gap-4">
               <LegendItem color="bg-[#354D62]" label="Collected" />
               <LegendItem color="bg-[#D7F2F7]" label="Pending" />
            </div>
          </div>
          
          {/* CSS BAR CHART */}
          <div className="flex-1 flex items-end justify-between gap-3 sm:gap-6 px-2 pb-2 border-b border-slate-100">
            {[65, 50, 80, 75, 60, 90, 55, 70, 85, 60, 95, 100].map((h, i) => (
              <div key={i} className="w-full h-full flex flex-col justify-end gap-1 group cursor-pointer">
                {/* Tooltip container */}
                <div className="relative flex flex-col items-center">
                   {/* Tooltip */}
                   <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#354D62] text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none z-10">
                      ₹{(h * 1500).toLocaleString()}
                   </div>
                   
                   {/* Bar Segment 1 (Pending - Light) */}
                   <div style={{ height: `${100 - h}%` }} className="w-full bg-[#F1F5F9] rounded-t-sm"></div>
                   {/* Bar Segment 2 (Collected - Dark) */}
                   <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${h}%` }} 
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="w-full bg-[#354D62] rounded-t-md opacity-90 group-hover:opacity-100 group-hover:bg-[#59748C] transition-all"
                   ></motion.div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-[#718CA1] mt-3 uppercase tracking-wider px-1">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* 2. RIGHT COLUMN */}
        <div className="xl:col-span-1 flex flex-col gap-6">
           
           {/* Quick Actions */}
           <div className="bg-[#354D62] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Quick Actions</h3>
                <p className="text-[#D7F2F7]/70 text-xs mb-5">Shortcuts for daily tasks.</p>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionBtn label="Attendance" icon={Calendar} onClick={() => navigate('/admin/attendance')} />
                  <QuickActionBtn label="Fee Status" icon={Wallet} onClick={() => navigate('/admin/fees')} />
                  <QuickActionBtn label="Gate Pass" icon={Activity} onClick={() => navigate('/admin/gatepass')} />
                  <QuickActionBtn label="Students" icon={Users} onClick={() => navigate('/admin/students')} />
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#59748C] rounded-full blur-3xl opacity-50"></div>
           </div>

           {/* Live Activity Feed */}
           <div className="bg-white rounded-2xl border border-[#718CA1]/20 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[250px]">
              <div className="p-4 border-b border-[#718CA1]/10 bg-[#F5F9FA] flex justify-between items-center">
                 <h3 className="font-bold text-[#354D62] text-sm flex items-center gap-2">
                   <Activity className="w-4 h-4 text-[#59748C]" /> Live Updates
                 </h3>
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto">
                 <ActivityItem title="New Admission" desc="Rahul Kumar added to Room 101" time="2m ago" color="bg-emerald-100 text-emerald-700" icon={Users} />
                 <ActivityItem title="Fee Payment" desc="Sneha paid ₹25,000" time="15m ago" color="bg-[#D7F2F7] text-[#354D62]" icon={Wallet} />
                 <ActivityItem title="Gate Pass" desc="Amit requested Night Out" time="1h ago" color="bg-amber-100 text-amber-700" icon={Activity} />
                 <ActivityItem title="Complaint" desc="Room 204 reported Fan Issue" time="3h ago" color="bg-rose-100 text-rose-700" icon={Bell} />
              </div>
           </div>

        </div>
      </div>

      {/* --- BOTTOM SECTION: NEW FEATURES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 3. OCCUPANCY ANALYTICS (New Feature) */}
        <div className="bg-white rounded-2xl border border-[#718CA1]/20 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#354D62] text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#59748C]" /> Occupancy by Floor
              </h3>
              <button onClick={() => navigate('/admin/rooms')} className="text-xs font-bold text-[#354D62] hover:underline">Manage Rooms</button>
           </div>
           <div className="space-y-5">
             {floorStats.map((f) => (
               <div key={f.floor}>
                 <div className="flex justify-between text-xs font-bold text-[#59748C] mb-1.5">
                    <span>Floor {f.floor}</span>
                    <span>{f.occupied} / {f.capacity} Beds</span>
                 </div>
                 <div className="w-full bg-[#F5F9FA] rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${(f.occupied / f.capacity) * 100}%` }} transition={{ duration: 1 }}
                      className={`h-full rounded-full ${f.occupied > 40 ? 'bg-rose-500' : f.occupied > 20 ? 'bg-[#354D62]' : 'bg-emerald-500'}`} 
                    />
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* 4. RECENT NOTICES (New Feature) */}
        <div className="bg-white rounded-2xl border border-[#718CA1]/20 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#354D62] text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#59748C]" /> Recent Notices
              </h3>
              <button onClick={() => navigate('/admin/notices')} className="text-xs font-bold text-[#354D62] hover:underline">View All</button>
           </div>
           <div className="space-y-3">
             {notices.length === 0 ? (
               <p className="text-xs text-[#718CA1] text-center py-4">No active notices.</p>
             ) : (
               notices.slice(0, 3).map((n) => (
                 <div key={n.id} className="p-3 rounded-xl bg-[#F5F9FA] border border-[#718CA1]/10 flex items-start gap-3">
                    <div className={`w-1.5 h-full min-h-[40px] rounded-full ${n.type === 'Urgent' ? 'bg-rose-500' : 'bg-[#354D62]'}`}></div>
                    <div>
                       <h4 className="text-sm font-bold text-[#354D62]">{n.title}</h4>
                       <p className="text-xs text-[#718CA1] line-clamp-1">{n.content}</p>
                       <span className="text-[10px] text-[#59748C] mt-1 block">{n.date}</span>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

// --- COMPONENTS ---

const ThemeStatCard = ({ title, value, icon: Icon, trend, trendUp }: any) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-[#718CA1]/20 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start">
      <div><p className="text-[#718CA1] text-xs font-bold uppercase tracking-wider group-hover:text-[#354D62] transition-colors">{title}</p><h3 className="text-3xl font-bold text-[#354D62] mt-2">{value}</h3></div>
      <div className="p-3 rounded-xl bg-[#D7F2F7] text-[#354D62] group-hover:scale-110 transition-transform"><Icon className="w-6 h-6" /></div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-xs font-bold w-fit px-2 py-1 rounded border border-[#718CA1]/10 bg-[#F5F9FA]">
       <span className={trendUp ? 'text-emerald-600' : 'text-rose-500'}>{trendUp ? <ArrowUpRight className="w-3 h-3 inline mr-1" /> : <ArrowDownRight className="w-3 h-3 inline mr-1" />}{trend}</span>
    </div>
  </motion.div>
);

const ActivityItem = ({ title, desc, time, color, icon: Icon }: any) => (
  <div className="flex gap-3 items-start">
     <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}><Icon className="w-4 h-4" /></div>
     <div className="flex-1 min-w-0"><p className="text-sm font-bold text-[#354D62]">{title}</p><p className="text-xs text-[#718CA1] truncate">{desc}</p></div>
     <span className="text-[10px] text-[#718CA1] font-medium whitespace-nowrap">{time}</span>
  </div>
);

const QuickActionBtn = ({ label, icon: Icon, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all border border-white/5">
    <Icon className="w-5 h-5 text-[#D7F2F7]" />
    <span className="text-xs font-medium text-[#D7F2F7]">{label}</span>
  </button>
);

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${color}`}></div><span className="text-xs font-bold text-[#59748C]">{label}</span></div>
);

export default Dashboard; 