import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Room } from '../types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface AddRoomModalProps {
  onClose: () => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ onClose }) => {
  const { addRoom } = useApp();
  const [form, setForm] = useState({
    roomNumber: '',
    floor: '1',
    capacity: '2',
    type: 'Double'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      roomNumber: form.roomNumber,
      floor: parseInt(form.floor),
      capacity: parseInt(form.capacity),
      type: form.type as any,
      occupiedBeds: 0,
      status: 'Available',
      students: [],
      amenities: ['WiFi', 'AC', 'Cupboard']
    };

    addRoom(newRoom);
    toast.success("Room added successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Room</h2>
          <button onClick={onClose}><X className="h-6 w-6 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room Number</label>
            <input required className="w-full border p-2 rounded" 
              value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Floor</label>
              <select className="w-full border p-2 rounded" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select className="w-full border p-2 rounded" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option>Single</option>
                <option>Double</option>
                <option>Triple</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input type="number" required className="w-full border p-2 rounded" 
              value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Create Room
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRoomModal;