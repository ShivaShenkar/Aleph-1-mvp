interface User {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string;
    createdAt: Date;
}

interface Tutor extends User {
    bio: string;
    subjects: string[];
    profilePictureUrl: string;
}
type Student = User;

interface LessonType{
    LessonId: string;
    tutorId: string;
    title: string;
    maxStudents: number;
    durationMinutes: number;
    price: number;
    location:"online" | "in-person";
}

interface Booking {
    id: string;
    title:string;
    tutorId: string;
    tutorFirstName: string;
    tutorLastName: string;
    subject: string;
    maxStudents: number;
    bookedStudents: number;
    durationMinutes: number;
    location:"online" | "in-person";
    price: number;
    startTime: Date;
    endTime: Date;
    tutorLatencyMinutes: number;
    createdAt: Date;
}

interface StudentSlot{
    bookingId: string;
    title:string;
    tutorId:string;
    tutorFirstName:string;
    tutorLastName:string;
    subject: string;
    maxStudents: number;
    durationMinutes: number;
    location:"online" | "in-person";
    price: number;
    startTime: Date;
    endTime: Date;
    tutorLatencyMinutes: number;
    studentId: string;
    isPayed: boolean;
    isCanceled: boolean;
    createdAt: Date;
}


export type { User, Tutor, Student,Booking,StudentSlot,LessonType };