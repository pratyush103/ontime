/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { Calendar } from '@/components/ui/calendar';
import { startOfMonth, endOfMonth } from 'date-fns';

const DivisionPage = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const router = useRouter();
  const { divisionId } = router.query;
  interface Student {
    id: string;
    name: string;
    rollNumber: string;
  }
  
  interface Professor {
    professor: {
      id: string;
      name: string;
    };
  }
  
  interface Division {
    name: string;
    students: Student[];
    avgAttendance: number;
    professors: Professor[];
  }
  
  const [division, setDivision] = useState<Division | null>(null);
  interface AttendanceRecord {
    date: string;
    status: "Present" | "Absent";
  }

  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (divisionId) {
      fetchDivision();
      fetchAttendanceSummary(startOfMonth(new Date()), new Date());
    }
  }, [divisionId]);

  // useEffect(() => {
  //   async function fetchProfessor() {
  //     try {
  //       if (!user) return;
  //       const response = await axios.get(`/api/professors/${user.id}`);
  //       if (response.data.professor.isHOD) {
  //         user.isHOD = true;
  //       }
  //     } catch (error) {
  //       console.error('Error fetching professor details', error);
  //     }
  //   }

  //   if (user?.id) {
  //     fetchProfessor();
  //   }
  // }, [user]);

  const fetchDivision = async () => {
    try {
      const response = await axios.get(`/api/divisions/${divisionId}`);
      setDivision(response.data.division);
    } catch (error) {
      console.error('Error fetching division details', error);
    }
  };

  const fetchAttendanceSummary = async (startDate: Date, endDate: Date) => {
    try {
      const response = await axios.get(`/api/attendance/report`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          divisionId,
        },
      });
      setAttendanceSummary(response.data);
    } catch (error) {
      console.error('Error fetching attendance summary', error);
    }
  };

  const handleMonthChange = (month: any) => {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    fetchAttendanceSummary(startDate, endDate);
  };

  const handleAddStudent = async () => {
    try {
      await axios.post('/api/students', {
        name: studentName,
        rollNumber,
        divisionId,
      });
      setShowModal(false);
      setStudentName('');
      setRollNumber('');
      // Refresh the division data
      fetchDivision();
    } catch (error) {
      console.error('Error adding student', error);
    }
  };

  const filteredStudents = division?.students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!division) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{division?.name}</h1>
          <div className="flex justify-center space-x-4 text-gray-600">
            <p>Students: {division?.students.length}</p>
            <p>•</p>
            <p>Average Attendance: {(division?.avgAttendance * 100).toFixed(2)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Students List</h2>
              {user?.isHOD && (
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Student
                </button>
              )}
            </div>

            <div className="p-6">
              <input
                type="text"
                placeholder="Search by name or roll number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents?.map((student) => (
                      <tr 
                        key={student.id}
                        onClick={() => router.push(`/students/${student.id}`)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Professors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {division?.professors.map((prof) => (
                  <div key={prof.professor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{prof.professor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Attendance Summary</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
              <Calendar
                selectedDates={attendanceSummary
                  .filter((record) => record.status === "Present")
                  .map((record) => new Date(record.date))}
                absentDates={attendanceSummary
                  .filter((record) => record.status === "Absent")
                  .map((record) => new Date(record.date))}
                onMonthChange={handleMonthChange}
              />
              <div className="bg-gray-50 p-6 rounded-lg w-full lg:w-64">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Present:</span>
                    <span className="text-sm font-medium text-green-600">
                      {attendanceSummary.filter(record => record.status === "Present").length} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Absent:</span>
                    <span className="text-sm font-medium text-red-600">
                      {attendanceSummary.filter(record => record.status === "Absent").length} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <h2 className="text-lg font-semibold mb-4">Add New Student</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                      <button
                        onClick={handleAddStudent}
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                      >
                        Add Student
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionPage;