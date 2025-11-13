import { Room, Student } from "../types";

export function generateMockData() {
  // ---------------------------
  // GENERATE 200 ROOMS
  // ---------------------------
  const roomTypes: Room["type"][] = ["Single", "Double", "Triple", "Quad"];
  const statuses: Room["status"][] = ["Available", "Occupied", "Full", "Maintenance"];
  const amenityList = ["WiFi", "Fan", "Table", "Chair", "Light", "Charging Point"];

  const rooms: Room[] = Array.from({ length: 200 }, (_, i) => {
    const floor = Math.floor(i / 20) + 1;  // 20 rooms per floor
    const type = roomTypes[i % 4];
    const capacity =
      type === "Single" ? 1 :
      type === "Double" ? 2 :
      type === "Triple" ? 3 : 4;

    return {
      id: String(i + 1),
      roomNumber: String(i + 1),
      floor: floor,
      capacity: capacity,
      occupiedBeds: 0,
      type: type,
      status: "Available",
      students: [],
      amenities: amenityList.slice(0, Math.floor(Math.random() * amenityList.length) + 1),
    };
  });

  // ---------------------------
  // GENERATE 30 STUDENTS
  // ---------------------------
  const students: Student[] = Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    firstName: "Student",
    lastName: String(i + 1),
    email: `student${i + 1}@gmail.com`,
    phone: "9876543210",
    dateOfBirth: "2004-01-01",
    gender: "Male",
    address: "Hostel Road, City",
    emergencyContact: "Parent",
    emergencyPhone: "9876543210",
    course: ["B.Tech", "B.Sc", "MBA", "M.Tech"][i % 4],
    year: String((i % 4) + 1),
    rollNumber: `RN${1000 + i}`,
    roomId: undefined,
    admissionDate: "2023-01-01",
    photoUrl: "",
    bloodGroup: ["A+", "B+", "O+", "AB+"][i % 4],
  }));

  return { students, rooms };
}
