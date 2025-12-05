import React, { useState, useEffect, useCallback } from "react";
import { X, Upload, Camera, ZoomIn, ZoomOut, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Student } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; // Import the helper

interface StudentFormProps {
  onClose: () => void;
  studentId?: string | null;
}

const StudentForm: React.FC<StudentFormProps> = ({ onClose, studentId }) => {
  const { students, addStudent, updateStudent } = useApp();
  const editingStudent = studentId
    ? students.find((s) => s.id === studentId)
    : null;

  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    course: "",
    year: "",
    SID: "",
    bloodGroup: "A+",
    admissionDate: new Date().toISOString().split("T")[0],
    photoUrl: "",
  });

  // --- CROPPER STATE ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent);
    }
  }, [editingStudent]);

  // 1. Handle File Select
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setShowCropper(true); // Open Cropper Modal
    });
    reader.readAsDataURL(file);
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
        setFormData((prev) => ({ ...prev, photoUrl: croppedImage }));
        setShowCropper(false);
        toast.success("Photo updated!");
      } catch (e) {
        console.error(e);
        toast.error("Failed to crop image");
      }
    }
  };

  // --- SUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (studentId && editingStudent) {
      updateStudent(studentId, formData);
      toast.success("Student updated successfully!");
    } else {
      const newStudent: Student = {
        ...formData,
        id: `student-${Date.now()}`,
        photoUrl: formData.photoUrl || "",
        password: "password123",
      } as Student;

      addStudent(newStudent);
      toast.success("New student added successfully!");
    }

    onClose();
  };

  // --- INPUT HANDLER ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden relative"
      >
        {/* HEADER */}
        <div className="bg-[#354D62] text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {studentId ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-8 overflow-y-auto flex-grow space-y-6">
            
            {/* PHOTO UPLOAD SECTION */}
            <div className="flex items-center gap-6 p-4 border border-slate-200 rounded-xl bg-slate-50">
              <div className="w-24 h-24 rounded-full border-2 border-slate-300 overflow-hidden bg-white flex-shrink-0 relative group">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    No Photo
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Student Photo</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoSelect} 
                    className="hidden" 
                    id="edit-photo-upload"
                  />
                  <label 
                    htmlFor="edit-photo-upload" 
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Camera className="w-4 h-4" /> Change Photo
                  </label>
                  <p className="text-xs text-slate-400 mt-2">JPG, PNG supported</p>
                </div>
              </div>
            </div>

            {/* FORM FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FIRST NAME */}
              <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none"
                  required
                />
              </div>

              {/* LAST NAME */}
              <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none"
                  required
                />
              </div>

              {/* SID */}
              <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Student ID (SID) *</label>
                <input
                  type="text"
                  name="SID"
                  value={formData.SID}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none font-mono"
                  placeholder="e.g. STU2024001"
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none"
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none"
                  required
                />
              </div>

              {/* COURSE */}
              <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Course *</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none"
                  required
                />
              </div>

              {/* YEAR (Dropdown) */}
              <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Academic Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none bg-white"
                  required
                >
                   <option value="">Select Year</option>
                   <option value="1st Year">1st Year</option>
                   <option value="2nd Year">2nd Year</option>
                   <option value="3rd Year">3rd Year</option>
                   <option value="4th Year">4th Year</option>
                </select>
              </div>

               {/* GENDER */}
               <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none bg-white"
                >
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                   <option value="Other">Other</option>
                </select>
              </div>

               {/* BLOOD GROUP (Dropdown) */}
               <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none bg-white"
                >
                   <option value="A+">A+</option>
                   <option value="A-">A-</option>
                   <option value="B+">B+</option>
                   <option value="B-">B-</option>
                   <option value="O+">O+</option>
                   <option value="O-">O-</option>
                   <option value="AB+">AB+</option>
                   <option value="AB-">AB-</option>
                </select>
              </div>

               {/* DATE OF BIRTH */}
               <div>
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none"
                />
              </div>

              {/* ADDRESS */}
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-bold text-slate-600">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#354D62] outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-slate-100 flex items-center gap-4 bg-slate-50">
            <button type="submit" className="flex-1 bg-[#354D62] text-white py-3 rounded-xl font-bold hover:bg-[#59748C] transition">
              {studentId ? "Update Student" : "Confirm Admission"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>

      {/* === CROPPER MODAL OVERLAY === */}
      <AnimatePresence>
        {showCropper && (
          <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[80vh]">
                
                <div className="bg-[#354D62] p-4 flex justify-between items-center">
                  <h3 className="text-white font-bold flex items-center gap-2"><Camera className="w-5 h-5" /> Crop Photo</h3>
                  <button onClick={() => setShowCropper(false)} className="text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
                </div>

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
                       onChange={(e) => setZoom(Number(e.target.value))} 
                       className="w-full h-2 bg-[#F5F9FA] rounded-lg appearance-none cursor-pointer accent-[#354D62]"
                     />
                   </div>
                   <div className="flex gap-3">
                     <button type="button" onClick={() => setShowCropper(false)} className="flex-1 py-3 rounded-xl border border-[#718CA1]/30 text-[#59748C] font-bold hover:bg-[#F5F9FA]">Cancel</button>
                     <button type="button" onClick={handleSaveCrop} className="flex-1 py-3 rounded-xl bg-[#354D62] text-white font-bold hover:bg-[#2C4052] shadow-lg flex items-center justify-center gap-2">
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

export default StudentForm;