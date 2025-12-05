import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Search, CheckCircle, AlertCircle, Wallet, TrendingUp, AlertTriangle, FileText, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminFees: React.FC = () => {
  const { students } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForInvoice, setSelectedStudentForInvoice] = useState<string | null>(null);

  // Mock Fee Logic
  const getFeeDetails = (id: string) => {
    const charCode = id.charCodeAt(id.length - 1);
    const isPaid = charCode % 2 === 0; 
    return {
      total: 50000, paid: isPaid ? 50000 : 35000, due: isPaid ? 0 : 15000, status: isPaid ? 'Paid' : 'Pending'
    };
  };

  const totalExpected = students.length * 50000;
  const totalCollected = students.reduce((acc, s) => acc + getFeeDetails(s.id).paid, 0);
  const totalPending = totalExpected - totalCollected;

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || s.SID?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-slate-800">Fee Management</h1><p className="text-slate-500 mt-1">Track payments and dues.</p></div>
        <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm font-bold transition-all"><Download className="w-4 h-4" /> Export Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="Total Expected" value={`₹${(totalExpected/100000).toFixed(2)} Lakh`} icon={Wallet} color="bg-indigo-50 text-indigo-600" />
         <StatCard label="Collected" value={`₹${(totalCollected/100000).toFixed(2)} Lakh`} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
         <StatCard label="Pending Dues" value={`₹${(totalPending/100000).toFixed(2)} Lakh`} icon={AlertTriangle} color="bg-rose-50 text-rose-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Fee Records</h3>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search student..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64" /></div>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                 <tr><th className="px-6 py-4">Student</th><th className="px-6 py-4">SID</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Paid</th><th className="px-6 py-4">Due</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredStudents.map((student) => {
                    const fee = getFeeDetails(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-medium text-slate-800">{student.firstName} {student.lastName}</td>
                         <td className="px-6 py-4 text-slate-500 font-mono">{student.SID}</td>
                         <td className="px-6 py-4 font-medium">₹{fee.total.toLocaleString()}</td>
                         <td className="px-6 py-4 text-emerald-600">₹{fee.paid.toLocaleString()}</td>
                         <td className="px-6 py-4 text-rose-600 font-bold">₹{fee.due.toLocaleString()}</td>
                         <td className="px-6 py-4">
                            {fee.status === 'Paid' ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200"><CheckCircle className="w-3 h-3"/> Paid</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200"><AlertCircle className="w-3 h-3"/> Pending</span>}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button onClick={() => setSelectedStudentForInvoice(student.id)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold hover:underline flex items-center gap-1 justify-end"><FileText className="w-3 h-3"/> View Invoice</button>
                         </td>
                      </tr>
                    );
                 })}
              </tbody>
           </table>
         </div>
      </div>

      {/* INVOICE MODAL */}
      <AnimatePresence>
        {selectedStudentForInvoice && (
          <InvoiceModal 
            studentId={selectedStudentForInvoice} 
            onClose={() => setSelectedStudentForInvoice(null)} 
            students={students}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

// --- HELPER COMPONENTS ---

const InvoiceModal = ({ studentId, onClose, students }: any) => {
  const student = students.find((s: any) => s.id === studentId);
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
         
         {/* Header */}
         <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className="text-slate-400 text-sm mt-1">Hostel Fee Receipt</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-6 h-6"/></button>
         </div>

         {/* Content */}
         <div className="p-8 overflow-y-auto">
            {/* Info Row */}
            <div className="flex justify-between mb-8">
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Billed To</p>
                 <h3 className="font-bold text-slate-800 text-lg">{student.firstName} {student.lastName}</h3>
                 <p className="text-sm text-slate-500">{student.SID}</p>
                 <p className="text-sm text-slate-500">Room {student.roomId || 'N/A'}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Invoice Details</p>
                 <p className="text-sm text-slate-600">Date: <span className="font-bold text-slate-800">19 Nov 2025</span></p>
                 <p className="text-sm text-slate-600">Invoice #: <span className="font-bold text-slate-800">INV-2025-001</span></p>
               </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm mb-8">
               <thead className="bg-slate-50 text-slate-500 font-bold text-left">
                  <tr>
                    <th className="p-3 rounded-l-lg">Description</th>
                    <th className="p-3 text-right rounded-r-lg">Amount</th>
                  </tr>
               </thead>
               <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100"><td className="p-3">Hostel Rent (Semester 1)</td><td className="p-3 text-right">₹25,000</td></tr>
                  <tr className="border-b border-slate-100"><td className="p-3">Mess Charges</td><td className="p-3 text-right">₹15,000</td></tr>
                  <tr className="border-b border-slate-100"><td className="p-3">Maintenance</td><td className="p-3 text-right">₹5,000</td></tr>
                  <tr className="border-b border-slate-100"><td className="p-3">Security Deposit</td><td className="p-3 text-right">₹5,000</td></tr>
               </tbody>
               <tfoot>
                  <tr>
                    <td className="p-3 font-bold text-right">Total</td>
                    <td className="p-3 text-right font-bold text-lg text-indigo-600">₹50,000</td>
                  </tr>
               </tfoot>
            </table>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Close</button>
              <button onClick={() => alert('Printing...')} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"><Printer className="w-4 h-4"/> Print Invoice</button>
            </div>
         </div>
      </motion.div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}><Icon className="w-6 h-6" /></div>
    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p><h3 className="text-2xl font-bold text-slate-800">{value}</h3></div>
  </div>
);

export default AdminFees;