export interface Professor {
  id: number;
  username: string;
  password: string;
  name: string;       
  department: string;
  isHOD: boolean;
  divisions: Division[];
}

export interface Division {
  id: number;
  name: string;
  students: Student[];
  professors: Professor[];
}

export interface Student {
  id: number;
  name: string;
  divisionId: number;
  attendance: Attendance[];
}

export interface Attendance {
  id: number;
  date: Date;
  status: 'Present' | 'Absent';
  studentId: number;
}

export interface AttendanceSummary {
  studentName: string;
  present: number;
  absent: number;
}