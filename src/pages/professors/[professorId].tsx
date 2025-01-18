/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';

const ProfessorProfilePage = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const router = useRouter();
  const { professorId } = router.query;
  const [professor, setProfessor] = useState<{ name: string; username: string; department: string; divisions: { division: { id: string; name: string; studentCount: number; attendanceTaken: boolean; } }[] } | null>(null);

  useEffect(() => {
    if (professorId) {
      fetchProfessorDetails();
    }
  }, [professorId]);

  const fetchProfessorDetails = async () => {
    try {
      const response = await axios.get(`/api/professors/${professorId}`);
      setProfessor(response.data.professor);
    } catch (error) {
      console.error('Error fetching professor details', error);
    }
  };

  if (!professor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                {professor.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{professor.name}</h1>
                <p className="text-sm text-gray-600">@{professor.username}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-lg text-gray-900">{professor.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Divisions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {professor.divisions.map((division) => (
                    <div
                      key={division.division.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {division.division.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {division.division.studentCount} students
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                division.division.attendanceTaken
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}
                            ></div>
                            <p className="text-sm text-gray-600">
                              Attendance Status: {division.division.attendanceTaken ? 'Taken' : 'Pending'}
                            </p>
                          </div>
                          <Link href={`/division/${division.division.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            
                              View Division
                            
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfilePage;