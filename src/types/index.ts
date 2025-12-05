// src/types.ts
export interface Student {
  id: string;
  SID?: string;              // student code / login id
  password?: string;        // student password (stored locally for demo)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  course: string;
  year: string;
  rollNumber?: string;
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
