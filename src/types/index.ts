export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  course: string;
  year: string;
  rollNumber: string;
  roomId?: string;
  admissionDate: string;
  photoUrl?: string;
  bloodGroup?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupiedBeds: number;
  type: 'Single' | 'Double' | 'Triple' | 'Quad';
  status: 'Available' | 'Occupied' | 'Full' | 'Maintenance';
  students: string[];
  amenities: string[];
}

export interface Admin {
  username: string;
  password: string;
  name: string;
}


