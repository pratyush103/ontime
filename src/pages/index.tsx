import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa';
import { SiNextdotjs, SiReact, SiPrisma, SiTailwindcss, SiTypescript, SiJsonwebtokens, SiSqlite } from 'react-icons/si';

const Home = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const logout = userContext?.logout;

  const features = [
    { icon: <FaUserGraduate className="w-8 h-8" />, title: 'Student Management', description: 'Add, view, and manage student records efficiently' },
    { icon: <FaChalkboardTeacher className="w-8 h-8" />, title: 'Division Management', description: 'Organize and manage divisions with ease' },
    { icon: <FaClipboardList className="w-8 h-8" />, title: 'Attendance Tracking', description: 'Mark and monitor attendance seamlessly' },
  ];

  const technologies = [
    { icon: <SiNextdotjs />, name: 'Next.js' },
    { icon: <SiReact />, name: 'React' },
    { icon: <SiPrisma />, name: 'Prisma' },
    { icon: <SiTailwindcss />, name: 'Tailwind CSS' },
    { icon: <SiTypescript />, name: 'TypeScript' },
    { icon: <SiJsonwebtokens />, name: 'JWT' },
    
    { icon: <SiSqlite />, name: 'SQLite' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Attendance Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive solution for educational institutions to manage attendance records efficiently and effectively.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Technologies Used</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                <div className="text-4xl text-gray-700 mb-2">{tech.icon}</div>
                <span className="text-gray-600">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2023 OnTime. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;