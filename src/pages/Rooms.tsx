import React, { useState, useMemo } from "react";
import { DoorOpen, UserPlus, Search, Filter, Bed } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import AssignStudentModal from "../components/AssignStudentModal";
import { toast } from "react-toastify";

const Rooms: React.FC = () => {
  const { rooms, students } = useApp();
  const [selectedFloor, setSelectedFloor] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningToRoom, setAssigningToRoom] = useState<string | null>(null);

  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
  const occupancyPercentage = Math.round((totalOccupied / totalCapacity) * 100);

  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);
  const filteredRooms = useMemo(() => rooms.filter((room) => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFloor = selectedFloor === "All" || room.floor.toString() === selectedFloor;
      const matchesStatus = statusFilter === "All" || room.status === statusFilter;
      return matchesSearch && matchesFloor && matchesStatus;
  }), [rooms, searchTerm, selectedFloor, statusFilter]);

  const getRoomStudents = (roomId: string) => students.filter((s) => s.roomId === roomId);
  const handleAssignToast = () => toast.success("Student assigned successfully!");

  return (
    // 👇 UPDATED BACKGROUND
    <div className="space-y-8 pb-10 bg-[#D7F2F7] min-h-screen p-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div><h1 className="text-3xl font-bold text-[#354D62]">Room Management</h1><p className="text-[#59748C] mt-1">Overview of hostel capacity and allocation.</p></div>
        <div className="flex gap-4">
          <div className="bg-white border border-[#718CA1]/30 px-5 py-2 rounded-xl shadow-sm flex items-center gap-3"><div className="p-2 bg-[#D7F2F7] rounded-lg text-[#354D62]"><DoorOpen className="w-5 h-5" /></div><div><p className="text-xs text-[#718CA1] font-bold uppercase">Total Rooms</p><p className="text-lg font-bold text-[#354D62]">{totalRooms}</p></div></div>
          <div className="bg-white border border-[#718CA1]/30 px-5 py-2 rounded-xl shadow-sm flex items-center gap-3"><div className="p-2 bg-[#D7F2F7] rounded-lg text-[#354D62]"><Bed className="w-5 h-5" /></div><div><p className="text-xs text-[#718CA1] font-bold uppercase">Occupancy</p><p className="text-lg font-bold text-[#354D62]">{occupancyPercentage}%</p></div></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#718CA1]/30 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718CA1]" /><input type="text" placeholder="Search room number..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-[#718CA1]/30 rounded-xl text-sm text-[#354D62] placeholder-[#718CA1] focus:ring-2 focus:ring-[#354D62] outline-none transition-all" /></div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F9FA] border border-[#718CA1]/30 rounded-xl min-w-fit"><Filter className="w-4 h-4 text-[#59748C]" /><select value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)} className="bg-transparent text-sm font-medium text-[#354D62] outline-none cursor-pointer"><option value="All">All Floors</option>{floors.map(f => <option key={f} value={f}>Floor {f}</option>)}</select></div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F9FA] border border-[#718CA1]/30 rounded-xl min-w-fit"><div className="w-2 h-2 rounded-full bg-[#59748C]"></div><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-sm font-medium text-[#354D62] outline-none cursor-pointer"><option value="All">All Status</option><option value="Available">Available</option><option value="Occupied">Occupied</option><option value="Full">Full</option><option value="Maintenance">Maintenance</option></select></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.length === 0 && (<div className="col-span-full text-center py-20 text-[#718CA1]"><DoorOpen className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>No rooms match your filters.</p></div>)}
        {filteredRooms.map((room, index) => {
          const roomStudents = getRoomStudents(room.id);
          const percentage = (room.occupiedBeds / room.capacity) * 100;
          return (
            <motion.div key={room.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.03 }} className="bg-[#354D62] rounded-2xl border border-[#59748C] shadow-lg hover:shadow-2xl transition-all overflow-hidden group">
              <div className="p-5 border-b border-[#59748C] flex justify-between items-start">
                <div><div className="flex items-center gap-2 mb-1"><span className="text-2xl font-bold text-white">{room.roomNumber}</span><span className="px-2 py-0.5 bg-[#2C4052] text-[#D7F2F7] text-[10px] font-bold uppercase rounded border border-[#59748C]">{room.type}</span></div><p className="text-xs text-[#D7F2F7]/70 font-medium">Floor {room.floor}</p></div>
                <StatusBadge status={room.status} />
              </div>
              <div className="p-5 space-y-4">
                <div><div className="flex justify-between text-xs font-bold text-[#D7F2F7]/60 mb-1.5"><span>Capacity</span><span className={room.occupiedBeds === room.capacity ? "text-rose-400" : "text-[#D7F2F7]"}>{room.occupiedBeds} / {room.capacity}</span></div><div className="w-full bg-[#2C4052] rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-500 ${percentage === 100 ? 'bg-rose-500' : percentage > 0 ? 'bg-[#718CA1]' : 'bg-[#D7F2F7]'}`} style={{ width: `${percentage}%` }}></div></div></div>
                {roomStudents.length > 0 ? (<div className="flex items-center -space-x-2 pt-1">{roomStudents.map(s => (<img key={s.id} src={s.photoUrl || "https://via.placeholder.com/30"} className="w-8 h-8 rounded-full border-2 border-[#354D62] object-cover" alt="student"/>))}</div>) : (<p className="text-xs text-[#718CA1] italic pt-2">No residents yet.</p>)}
              </div>
              {room.status !== 'Full' && room.status !== 'Maintenance' && (<div className="px-5 pb-5"><button onClick={() => setAssigningToRoom(room.id)} className="w-full py-2.5 rounded-xl bg-[#D7F2F7] text-[#354D62] font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> Assign Student</button></div>)}
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>{assigningToRoom && (<AssignStudentModal roomId={assigningToRoom} onClose={() => { setAssigningToRoom(null); handleAssignToast(); }} />)}</AnimatePresence>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { 'Available': 'bg-[#D7F2F7]/10 text-[#D7F2F7] border-[#D7F2F7]/30', 'Occupied': 'bg-[#718CA1]/20 text-[#D7F2F7] border-[#718CA1]/30', 'Full': 'bg-rose-500/10 text-rose-300 border-rose-500/30', 'Maintenance': 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
  return <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${styles[status] || 'bg-[#2C4052] text-slate-400'}`}>{status}</span>;
};

export default Rooms;