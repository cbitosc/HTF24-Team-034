// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Bell, Heart, LineChart, BookOpen, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Mock user data
  const userData = {
    nextPeriod: "November 15, 2024",
    cycleLength: 28,
    lastPeriod: "October 18, 2024",
    symptoms: ["Cramps", "Headache", "Fatigue"]
  };

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                CycleCare
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.displayName || user.email}
              </span>
              <button className="text-gray-600 hover:text-pink-500">
                <Bell className="h-6 w-6" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-pink-500"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-pink-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Next Period</p>
                <p className="text-lg font-semibold">{userData.nextPeriod}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Cycle Length</p>
                <p className="text-lg font-semibold">{userData.cycleLength} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Last Period</p>
                <p className="text-lg font-semibold">{userData.lastPeriod}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {['calendar', 'symptoms', 'insights', 'education'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize ${
                activeTab === tab
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-pink-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'calendar' && (
            <div className="text-center p-8">
              <p className="text-gray-500">Calendar View Coming Soon</p>
            </div>
          )}
          
          {activeTab === 'symptoms' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Recent Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {userData.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div className="text-center p-8">
              <p className="text-gray-500">Insights Coming Soon</p>
            </div>
          )}
          
          {activeTab === 'education' && (
            <div className="text-center p-8">
              <p className="text-gray-500">Educational Content Coming Soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;