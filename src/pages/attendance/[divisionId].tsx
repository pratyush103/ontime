/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';
import { useToast } from '@/components/ui/use-toast';

const AttendancePage = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const router = useRouter();
  const { divisionId } = router.query;
  const [students, setStudents] = useState<{ id: number; name: string; rollNumber: string }[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const [isProfessorHod, setIsProfessorHod] = useState(false);

  useEffect(() => {
    if (divisionId) {
      fetchStudents();
    }
  }, [divisionId]);

  useEffect(() => {
    async function fetchProfessor() {
      try {
        if (!user) {
          console.error('User is not defined');
          return;
        }
        const response = await axios.get(`/api/professors/${user.id}`);
        setIsProfessorHod(response.data.professor.isHOD);
      } catch (error) {
        console.error('Error fetching professor details', error);
      }
    }

    if (user?.id) {
      fetchProfessor();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`/api/divisions/${divisionId}`);
      setStudents(response.data.division.students);
      const initialAttendance = response.data.division.students.reduce((acc: { [key: number]: string }, student: { id: number }) => {
        acc[student.id] = 'Absent';
        return acc;
      }, {});
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };

  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const handleConfirmAttendance = async () => {
    try {
      const attendanceRecords = Object.keys(attendance).map((studentId) => ({
        studentId: parseInt(studentId),
        status: attendance[studentId],
      }));
      await axios.post('/api/attendance/mark', { attendance: attendanceRecords });
      setShowModal(false);
      toast({
        title: "Success",
        description: "Attendance marked successfully",
        variant: "default",
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error marking attendance', error);
    }
  };

  const presentStudents = Object.keys(attendance).filter((studentId) => attendance[studentId] === 'Present');
  const absentStudents = Object.keys(attendance).filter((studentId) => attendance[studentId] === 'Absent');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Take Attendance</h1>
          <p className="text-gray-600">Mark attendance for your class</p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {isProfessorHod ? (
                        <span>
                          No students found in this Division. Head to{' '}
                          <Link href={`/division/${divisionId}`} className="text-blue-600 hover:text-blue-800">
                          the division&apos;s page
                          </Link>{' '}
                          to add students to this division.
                        </span>
                        ) : (
                        'No students in this division. Contact your department HOD to add students here.'
                        )}
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/students/${student.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {student.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          value="Present"
                          checked={attendance[student.id] === 'Present'}
                          onChange={() => handleAttendanceChange(student.id, 'Present')}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          value="Absent"
                          checked={attendance[student.id] === 'Absent'}
                          onChange={() => handleAttendanceChange(student.id, 'Absent')}
                          className="form-radio h-4 w-4 text-red-600"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Attendance
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-4">Attendance Summary</h2>
                      <div className="mt-2 space-y-3">
                        <div className="bg-green-50 p-3 rounded-md">
                          <p className="text-sm text-green-700">Present Students: {presentStudents.length}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-md">
                          <p className="text-sm text-red-700">Absent Students: {absentStudents.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmAttendance}
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
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
        )}
      </div>
    </div>
  );
};

export default AttendancePage;