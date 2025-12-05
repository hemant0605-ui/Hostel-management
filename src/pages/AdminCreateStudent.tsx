import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, ChevronLeft, User, Mail, Phone, 
  BookOpen, Calendar, MapPin, Hash, Droplet, Upload, Camera, X, Check, ZoomIn, ZoomOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop'; // <--- NEW IMPORT
import getCroppedImg from '../utils/cropImage'; // <--- NEW IMPORT

const AdminCreateStudent: React.FC = () => {
  const { addStudent } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', 
    SID: '', password: 'password123', 
    course: '', year: '1st Year',
    gender: 'Male', address: '', 
    dateOfBirth: '', bloodGroup: 'A+',
    photoUrl: ''
  });

  // --- CROPPER STATE ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);

  // 1. Select File
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setShowCropper(true); // Open Modal
      });
      reader.readAsDataURL(file);
    }
  };

  // 2. Capture Crop Area
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 3. Save Cropped Image
  const handleSaveCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setForm({ ...form, photoUrl: croppedImage });
        setShowCropper(false);
        showToast('Profile picture updated!', 'success');
      } catch (e) {
        console.error(e);
        showToast('Failed to crop image', 'error');
      }
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.SID || !form.firstName) { showToast('Required fields missing', 'error'); return; }
    
    const newStudent: any = { 
      id: 'student-' + Date.now(), 
      ...form, 
      admissionDate: new Date().toISOString() 
    };
    
    addStudent(newStudent);
    showToast('Student admitted successfully!', 'success');
    navigate('/admin/students');
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] p-6 flex flex-col items-center relative">
      
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#59748C] hover:text-[#354D62] mb-6 font-bold transition-colors self-start">
          <ChevronLeft className="w-5 h-5" /> Back to Directory
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border border-[#718CA1]/20 overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#354D62] p-8 text-white flex justify-between items-center relative overflow-hidden">
             <div className="relative z-10">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                 <div className="p-2 bg-[#D7F2F7]/10 rounded-lg backdrop-blur-sm"><UserPlus className="w-6 h-6 text-[#D7F2F7]" /></div>
                 New Student Admission
               </h2>
               <p className="text-[#D7F2F7]/80 text-sm mt-2 ml-1">Register a new student into the hostel system.</p>
             </div>
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          </div>
          
          <form onSubmit={submit} className="p-8 space-y-8">
            
            {/* PHOTO UPLOAD SECTION */}
            <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-[#F5F9FA] rounded-xl border border-[#718CA1]/20">
               <div className="relative group cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-[#D7F2F7] flex items-center justify-center relative">
                    {form.photoUrl ? (
                      <img src={form.photoUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <User className="w-12 h-12 text-[#718CA1]/50" />
                    )}
                 </div>
                 <div className="absolute bottom-0 right-0 bg-[#354D62] p-2 rounded-full text-white shadow-lg hover:bg-[#59748C] transition-all z-10">
                    <Camera className="w-4 h-4" />
                 </div>
               </div>
               
               <div className="text-center sm:text-left">
                 <h3 className="text-[#354D62] font-bold text-lg">Profile Picture</h3>
                 <p className="text-[#718CA1] text-sm mt-1 mb-3">Upload a clear face photo for ID Card generation.</p>
                 <div>
                    <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                    <label htmlFor="photo-upload" className="px-4 py-2 bg-white border border-[#718CA1]/30 rounded-lg text-sm font-bold text-[#354D62] hover:bg-[#D7F2F7] transition cursor-pointer flex items-center gap-2 w-fit mx-auto sm:mx-0">
                        <Upload className="w-4 h-4" /> Choose File
                    </label>
                 </div>
               </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="text-[#354D62] font-bold text-sm uppercase tracking-wider mb-5 border-b border-[#F5F9FA] pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup icon={User} label="First Name" placeholder="John" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} required />
                <InputGroup icon={User} label="Last Name" placeholder="Doe" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} required />
                <InputGroup icon={Mail} label="Email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                <InputGroup icon={Phone} label="Phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                <div className="md:col-span-1">
                   <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5 ml-1">Date of Birth</label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718CA1]" />
                     <input type="date" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA]" value={form.dateOfBirth} onChange={e=>setForm({...form, dateOfBirth: e.target.value})} />
                   </div>
                </div>
                <div className="md:col-span-1">
                   <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5 ml-1">Gender</label>
                   <div className="relative">
                      <select value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})} className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA] appearance-none">
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                   </div>
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div>
              <h3 className="text-[#354D62] font-bold text-sm uppercase tracking-wider mb-5 border-b border-[#F5F9FA] pb-2">Academic & Login</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup icon={Hash} label="Student ID (SID)" placeholder="STU2025001" value={form.SID} onChange={(e) => setForm({...form, SID: e.target.value})} required />
                <div className="md:col-span-1">
                   <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5 ml-1">Blood Group</label>
                   <div className="relative">
                      <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718CA1]" />
                      <select value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA]">
                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                      </select>
                   </div>
                </div>
                <InputGroup icon={BookOpen} label="Course" placeholder="B.Tech / MBA" value={form.course} onChange={(e) => setForm({...form, course: e.target.value})} />
                <div>
                   <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5 ml-1">Year</label>
                   <select value={form.year} onChange={e=>setForm({...form, year: e.target.value})} className="w-full p-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA]">
                      <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                   </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
               <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5 ml-1 flex items-center gap-2"><MapPin className="w-3 h-3"/> Permanent Address</label>
               <textarea rows={3} value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="w-full p-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA]" placeholder="Enter full address here..."></textarea>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#718CA1]/10 flex justify-end gap-4">
               <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 rounded-xl border border-[#718CA1]/30 text-[#59748C] font-bold hover:bg-[#F5F9FA] transition-all">Cancel</button>
               <button type="submit" className="px-10 py-3 rounded-xl bg-[#354D62] text-white font-bold shadow-lg hover:bg-[#2C4052] hover:shadow-xl transition-all transform active:scale-95">Confirm Admission</button>
            </div>

          </form>
        </motion.div>
      </div>

      {/* === CROPPER MODAL === */}
      <AnimatePresence>
        {showCropper && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[80vh]">
                
                {/* Header */}
                <div className="bg-[#354D62] p-4 flex justify-between items-center">
                  <h3 className="text-white font-bold flex items-center gap-2"><Camera className="w-5 h-5" /> Edit Photo</h3>
                  <button onClick={() => setShowCropper(false)} className="text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
                </div>

                {/* Cropper Area */}
                <div className="relative flex-1 bg-black">
                  <Cropper
                    image={imageSrc || ''}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                {/* Controls */}
                <div className="p-6 bg-white space-y-6">
                   <div>
                     <div className="flex justify-between text-xs font-bold text-[#59748C] mb-2">
                       <span className="flex items-center gap-1"><ZoomOut className="w-3 h-3"/> Zoom Out</span>
                       <span className="flex items-center gap-1">Zoom In <ZoomIn className="w-3 h-3"/></span>
                     </div>
                     <input 
                       type="range" 
                       value={zoom} 
                       min={1} 
                       max={3} 
                       step={0.1} 
                       aria-labelledby="Zoom"
                       onChange={(e) => setZoom(Number(e.target.value))} 
                       className="w-full h-2 bg-[#F5F9FA] rounded-lg appearance-none cursor-pointer accent-[#354D62]"
                     />
                   </div>
                   <div className="flex gap-3">
                     <button onClick={() => setShowCropper(false)} className="flex-1 py-3 rounded-xl border border-[#718CA1]/30 text-[#59748C] font-bold hover:bg-[#F5F9FA]">Cancel</button>
                     <button onClick={handleSaveCrop} className="flex-1 py-3 rounded-xl bg-[#354D62] text-white font-bold hover:bg-[#2C4052] shadow-lg flex items-center justify-center gap-2">
                       <Check className="w-5 h-5" /> Save Photo
                     </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Reusable Input Component with Type Safety
interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  label: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ icon: Icon, label, required, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-[#59748C] uppercase mb-1.5 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718CA1]" />
      <input 
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#718CA1]/30 text-[#354D62] focus:ring-2 focus:ring-[#354D62] outline-none bg-[#F5F9FA] transition-all placeholder:text-slate-400" 
        {...props} 
      />
    </div>
  </div>
);

export default AdminCreateStudent;