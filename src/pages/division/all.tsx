import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useToast } from '@/components/ui/use-toast';

const AllDivisionsPage = () => {
  const { user } = useContext(UserContext);
  const [divisions, setDivisions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDivisions();    
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('/api/divisions');
      setDivisions(response.data.divisions);
      console.log('Divisions:', divisions);
    } catch (error) {
      console.error('Error fetching divisions', error);
    }
  };

  const handleJoinDivision = async (divisionId) => {
    try {
      await axios.post('/api/professors/updateDivisions', {
        professorId: user.id,
        divisionId,
      });
      toast({
        title: "Success",
        description: "Joined division successfully",
        variant: "default",
      });
      fetchDivisions(); // Refresh the divisions list
    } catch (error) {
      console.error('Error joining division', error);
      toast({
        title: "Error",
        description: "Error joining division",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Divisions</h1>
          <p className="text-gray-600">View and join divisions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {divisions.map((division) => (
            <div key={division.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{division.name}</h2>
                <p className="text-gray-600 mb-4">Number of Students: {division.students.length}</p>
                {division.professors && division.professors.includes(user.id) ? (
                  <p className="text-green-600">You are already a member of this division</p>
                ) : (
                  <button
                    onClick={() => handleJoinDivision(division.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Join Division
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllDivisionsPage;