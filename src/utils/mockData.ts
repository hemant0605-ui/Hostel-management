import { Room, Student } from '../types';
import { faker } from '@faker-js/faker';

export const generateMockData = (): { students: Student[]; rooms: Room[] } => {
  const rooms: Room[] = [];
  const students: Student[] = [];

  // ---------------------------------------------------------
  // 1. GENERATE 200 ROOMS (Sequential 1 to 200)
  //    10 Floors with 20 Rooms per floor
  // ---------------------------------------------------------
  let roomCounter = 1;

  for (let floor = 1; floor <= 10; floor++) {
    // 20 Rooms per floor
    for (let r = 1; r <= 20; r++) {
      const roomNum = roomCounter.toString(); // "1", "2", ... "200"
      
      // Randomize capacity
      let capacity = 2;
      if (roomCounter % 5 === 0) capacity = 3; // Every 5th room is Triple
      if (roomCounter % 8 === 0) capacity = 1; // Every 8th room is Single

      const type = capacity === 1 ? 'Single' : (capacity === 2 ? 'Double' : 'Triple');

      rooms.push({
        id: `room-${roomCounter}`,
        roomNumber: roomNum,    // Shows "1", "2", "199", "200"
        floor: floor,           // Floor 1 to 10
        capacity: capacity,
        occupiedBeds: 0,
        type: type as 'Single' | 'Double' | 'Triple',
        status: 'Available',
        students: [],
        amenities: ['WiFi', 'AC', 'Study Table', 'Cupboard']
      });

      roomCounter++;
    }
  }

  // ---------------------------------------------------------
  // 2. GENERATE 50 DUMMY STUDENTS
  // ---------------------------------------------------------
  for (let i = 0; i < 50; i++) {
    const gender = i % 2 === 0 ? 'Male' : 'Female';
    const firstName = faker.person.firstName(gender === 'Male' ? 'male' : 'female');
    const lastName = faker.person.lastName();

    students.push({
      id: `student-${i + 1}`,
      SID: `STU${2024000 + i}`,
      password: 'password123',
      firstName: firstName,
      lastName: lastName,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 25, mode: 'age' }).toISOString().split('T')[0],
      gender: gender,
      address: faker.location.streetAddress(),
      course: 'B.Tech',
      year: ['1st Year', '2nd Year', '3rd Year', '4th Year'][Math.floor(Math.random() * 4)],
      rollNumber: `RN-${100 + i}`,
      admissionDate: new Date().toISOString(),
      photoUrl: gender === 'Male' 
        ? `https://randomuser.me/api/portraits/men/${i % 99}.jpg`
        : `https://randomuser.me/api/portraits/women/${i % 99}.jpg`,
      bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
      roomId: undefined 
    });
  }

  return { students, rooms };
};