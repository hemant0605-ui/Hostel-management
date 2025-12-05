import React, { useState } from 'react';
import { useApp, Notice } from '../context/AppContext';
import { Bell, Trash2, Plus, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminNotices: React.FC = () => {
  const { notices, addNotice, deleteNotice } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'General' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    addNotice({ id: Date.now().toString(), title: form.title, content: form.content, type: form.type as any, date: new Date().toISOString().split('T')[0] });
    toast.success("Notice published!");
    setShowForm(false); setForm({ title: '', content: '', type: 'General' });
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Urgent': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Event': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-[#D7F2F7] text-[#354D62] border-[#718CA1]/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] p-6 space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#354D62]">Notice Board</h1>
          <p className="text-[#59748C] mt-1">Announcements for students.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-[#354D62] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:bg-[#59748C] transition-all font-bold text-sm"
        >
          <Plus className="w-5 h-5" /> Post Notice
        </button>
      </div>

      <div className="grid gap-4">
        {notices.length === 0 && (
          <div className="text-center py-20 text-[#718CA1]">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No active notices.</p>
          </div>
        )}

        {notices.map((n) => (
          <motion.div 
            key={n.id} 
            layout 
            className="bg-white p-6 rounded-2xl shadow-sm border border-[#718CA1]/30 flex justify-between items-start hover:shadow-md transition group"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getTypeColor(n.type)}`}>
                  {n.type}
                </span>
                <span className="text-xs text-[#718CA1] flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {n.date}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#354D62]">{n.title}</h3>
              <p className="text-[#59748C] text-sm mt-2 leading-relaxed">{n.content}</p>
            </div>
            <button 
              onClick={() => { deleteNotice(n.id); toast.info("Notice deleted"); }} 
              className="text-[#718CA1] hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* MODAL */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-[#354D62]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="bg-[#354D62] p-5 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-white">New Announcement</h2>
                 <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-white/70 hover:text-white"/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5">Title</label>
                  <input className="w-full p-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA]" placeholder="e.g. Holiday Notice" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5">Type</label>
                  <select className="w-full p-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA]" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option>General</option><option>Urgent</option><option>Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5">Message</label>
                  <textarea className="w-full p-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA]" rows={4} placeholder="Write details here..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-[#718CA1]/30 py-3 rounded-xl text-[#59748C] font-bold hover:bg-[#F5F9FA]">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#354D62] text-white py-3 rounded-xl font-bold hover:bg-[#59748C] shadow-md transition">Publish</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotices;