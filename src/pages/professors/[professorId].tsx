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
  const [professor, setProfessor] = useState<{ name: string; username: string; department: string; divisions: { division: { id: string; name: string; } }[] } | null>(null);

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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Professor Profile</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{professor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-lg text-gray-900">{professor.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-lg text-gray-900">{professor.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Divisions</label>
                <ul className="mt-1 text-lg text-gray-900">
                  {professor.divisions.map((division) => (
                    <li key={division.division.id}>
                      <Link href={`/division/${division.division.id}`} className="text-blue-600 hover:text-blue-800">
                        {division.division.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfilePage;