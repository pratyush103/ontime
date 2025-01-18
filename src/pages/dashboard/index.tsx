/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

interface DivisionData {
  id: number;
  name: string;
  studentCount: number;
  attendanceTaken: boolean;
}

const Dashboard = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [allDivisions, setAllDivisions] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedDivisions, setSelectedDivisions] = useState<number[]>([]);
  const [newDivisionName, setNewDivisionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchAllDivisions();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `/api/dashboard?professorId=${user?.id}`
      );
      setDivisions(response.data.divisions);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const fetchAllDivisions = async () => {
    try {
      const response = await axios.get("/api/divisions");
      setAllDivisions(response.data.divisions);
    } catch (error) {
      console.error("Error fetching all divisions", error);
    }
  };

  const handleDivisionClick = (divisionId: number) => {
    window.location.href = `/division/${divisionId}`;
  };

  const handleTakeAttendance = (divisionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/attendance/${divisionId}`);
  };

  const handleDivisionSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedDivisions((prev) =>
      checked
        ? [...prev, Number(value)]
        : prev.filter((id) => id !== Number(value))
    );
  };

  const handleSaveDivisions = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/professors/updateDivisions", {
        professorId: user?.id,
        divisionIds: selectedDivisions,
      });
      toast({
        title: "Success",
        description: "Divisions updated successfully",
        variant: "default",
      });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating divisions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDivision = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/divisions", { name: newDivisionName });
      toast({
        title: "Success",
        description: "Division created successfully",
        variant: "default",
      });
      setNewDivisionName("");
      fetchAllDivisions();
      setShowModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error creating division",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage your divisions and attendance
          </p>
        </div>

        {user?.isHOD && (
          <div className="text-right mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Division
            </button>
          </div>
        )}

        {divisions.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Your Divisions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {divisions.map((division) => (
                <div
                  key={division.id}
                  onClick={() => handleDivisionClick(division.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {division.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {division.studentCount} students
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            division.attendanceTaken
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <p className="text-sm text-gray-600">
                          Attendance Status:{" "}
                          {division.attendanceTaken ? "Taken" : "Pending"}
                        </p>
                      </div>

                      {!division.attendanceTaken && (
                        <button
                          onClick={(e) => handleTakeAttendance(division.id, e)}
                          className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Take Attendance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No divisions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by selecting or creating a new division.
            </p>
          </div>
        )}

        {divisions.length === 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Select Divisions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDivisions.map((division) => (
                <div key={division.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`division-${division.id}`}
                    value={division.id}
                    onChange={handleDivisionSelection}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`division-${division.id}`}
                  >
                    {division.name}
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveDivisions}
              className="btn btn-primary mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Divisions"}
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                        Create New Division
                      </h2>
                      <div className="mt-2 space-y-3">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="newDivisionName"
                            placeholder="Division Name"
                            value={newDivisionName}
                            onChange={(e) => setNewDivisionName(e.target.value)}
                            disabled={isLoading}
                          />
                          <label htmlFor="newDivisionName">Division Name</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                      type="button"
                      onClick={handleCreateDivision}
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Division"}
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

export default Dashboard;
