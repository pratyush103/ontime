/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { startOfMonth, endOfDay, endOfMonth } from "date-fns";
import { UserContext } from "@/context/UserContext";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

const StudentDetailsPage = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const router = useRouter();
  const { studentId } = router.query;
  interface Student {
    name: string;
    rollNumber: string;
    division: {
      id: string;
      name: string;
    };
  }

  const [student, setStudent] = useState<Student | null>(null);
  interface AttendanceRecord {
    date: Date;
    status: "Present" | "Absent";
  }

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  interface Division {
    id: string;
    name: string;
  }

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [editedStudent, setEditedStudent] = useState({
    name: "",
    rollNumber: "",
    divisionId: "",
  });

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
      fetchAttendance(dateRange.from, dateRange.to);
    }
  }, [studentId]);

  useEffect(() => {
    if (student) {
      setEditedStudent({
        name: student.name,
        rollNumber: student.rollNumber,
        divisionId: student.division.id,
      });
    }
  }, [student]);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`/api/students/${studentId}`);
      setStudent(response.data.student);
    } catch (error) {
      console.error("Error fetching student details", error);
    }
  };

  const fetchAttendance = async (startDate: Date, endDate: Date) => {
    try {
      const response = await axios.post(
        `/api/students/${studentId}/attendance`,
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      );
      const attendanceData = response.data.attendance.map(
        (record: { date: string | number | Date }) => ({
          ...record,
          date: new Date(record.date),
        })
      );
      console.log(attendanceData);
      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance records", error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await axios.get("/api/divisions");
      setDivisions(response.data.divisions);
    } catch (error) {
      console.error("Error fetching divisions", error);
    }
  };

  const handleDateRangeChange = (
    range: React.SetStateAction<{ from: Date; to: Date }>
  ) => {
    setDateRange(range);
    if (typeof range === "object" && range.from && range.to) {
      fetchAttendance(range.from, range.to);
    }
  };

  const handleMonthChange = (month: any) => {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    setDateRange({ from: startDate, to: endDate });
    fetchAttendance(startDate, endDate);
  };

  const handleDeleteStudent = async () => {
    try {
      await axios.delete(`/api/students/${studentId}`);
      toast({
        title: "Success",
        description: "Student deleted successfully",
        variant: "default",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error deleting student", error);
      toast({
        title: "Error",
        description: "Error deleting student",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.put(`/api/students/${studentId}`, editedStudent);
      await fetchStudentDetails();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Student information updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating student", error);
      toast({
        title: "Error",
        description: "Failed to update student information",
        variant: "destructive",
      });
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleDateClick = (date: Date) => {
    console.log("Date clicked:", date);
  };

  const presentCount = attendance.filter(
    (record) => record.status === "Present"
  ).length;
  const absentCount = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Details
          </h1>
          <p className="text-gray-600">View and manage student information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Info Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                <div className="space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdateStudent}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedStudent.name}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          name: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">{student.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Roll Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedStudent.rollNumber}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          rollNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">
                      {student.rollNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Division
                  </label>
                  {isEditing ? (
                    <select
                      value={editedStudent.divisionId}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          divisionId: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {divisions.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">
                      {student.division.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Summary Card */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Attendance Overview
              </h2>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <Calendar
                  selectedDates={attendance
                    .filter((record) => record.status === "Present")
                    .map((record) => record.date)}
                  absentDates={attendance
                    .filter((record) => record.status === "Absent")
                    .map((record) => record.date)}
                  onMonthChange={handleMonthChange}
                  onClickFn={handleDateClick}
                />
                <div className="bg-gray-50 p-6 rounded-lg w-full lg:w-64">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Monthly Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Present:</span>
                      <span className="text-sm font-medium text-green-600">
                        {presentCount} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absent:</span>
                      <span className="text-sm font-medium text-red-600">
                        {absentCount} days
                      </span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Attendance Rate:
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          {(
                            (presentCount / (presentCount + absentCount)) *
                              100 || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Delete Student
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this student? This
                        action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeleteStudent}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
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
  );
};

export default StudentDetailsPage;
