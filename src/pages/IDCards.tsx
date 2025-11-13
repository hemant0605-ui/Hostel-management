import React, { useState } from 'react';
import { Download, Search, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const IDCards: React.FC = () => {
  const { students } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = (studentId: string) => {
    const printContent = document.getElementById(`id-card-${studentId}`);
    if (!printContent) return;

    const tailwindLink = Array.from(document.head.getElementsByTagName('link')).find(
      (link) => link.rel === 'stylesheet'
    );

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Student ID Card</title>
          ${tailwindLink ? tailwindLink.outerHTML : ''}
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              background-color: #f0f0f0;
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
            @media print {
              body { background-color: #fff; display: block; }
              .id-card-container { box-shadow: none !important; margin: 0; page-break-after: always; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ID Cards</h1>
          <p className="text-gray-600">Generate and print student ID cards</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStudents.map((student, index) => {
            const admissionDate = new Date(student.admissionDate);
            const expiryDate = new Date(new Date(student.admissionDate).setFullYear(admissionDate.getFullYear() + 4)).toLocaleDateString('en-GB');
            const joinDate = new Date(student.admissionDate).toLocaleDateString('en-GB');

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div id={`id-card-${student.id}`} className="w-[300px] h-[475px] relative font-sans rounded-2xl overflow-hidden shadow-xl bg-white id-card-container">
                  {/* Background layers */}
                  <div className="absolute inset-0">
                    <div className="absolute bottom-0 left-0 w-full h-[55%] bg-[#ffc107]" />
                    <div className="absolute w-[200%] h-64 bg-[#003c4c] transform -rotate-[30deg] top-[15%] -left-[50%]" />
                    <div className="absolute top-0 left-0 w-full h-[45%] bg-white" />
                  </div>

                  {/* Content Layer */}
                  <div className="absolute inset-0 z-10 flex flex-col">
                    <div className="relative flex-shrink-0 h-[45%]">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-200 rounded-full" />
                      <img
                        src={student.photoUrl}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="absolute top-12 left-6 w-32 h-32 object-cover rounded-md border-4 border-white shadow-lg"
                      />
                      <div className="absolute bottom-4 right-6 text-[#003c4c]">
                        <Building2 className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex-grow bg-[#ffc107] px-6 pb-4 flex flex-col justify-end">
                      <div className="space-y-1.5 text-sm text-[#003c4c]">
                        <div className="flex items-baseline">
                          <span className="w-24 font-medium">Id No:</span>
                          <span className="font-bold">{student.rollNumber}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-24 font-medium">Join Date:</span>
                          <span className="font-bold">{joinDate}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-24 font-medium">Expiry Date:</span>
                          <span className="font-bold">{expiryDate}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-24 font-medium">Email:</span>
                          <span className="font-bold truncate">{student.email}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-24 font-medium">Blood:</span>
                          <span className="font-bold">{student.bloodGroup || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t-2 border-[#003c4c]">
                        <p className="text-center text-xs font-bold text-[#003c4c]">Hostel Management System</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePrint(student.id)}
                  className="absolute top-3 right-3 bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Download or Print ID Card"
                >
                  <Download className="h-5 w-5" />
                </button>
              </motion.div>
            )
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCards;
