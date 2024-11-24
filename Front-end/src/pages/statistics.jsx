import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Camera, ShieldCheck, Loader2 } from "lucide-react";
import DashboardStats from "./secondStatistic";
import BusinessDashboard from "./secondStatistic";

const Statistics = () => {
  const [usersByRole, setUsersByRole] = useState([]);
  const [usersByCity, setUsersByCity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleIcons = {
    admin: ShieldCheck,
    photographer: Camera,
    user: Users,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await fetch("http://localhost:3000/api/users/roles");
        const cityResponse = await fetch("http://localhost:3000/api/users/cities");
        
        const roleData = await roleResponse.json();
        const cityData = await cityResponse.json();
        
        setUsersByRole(roleData);
        setUsersByCity(cityData);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  

  const totalUsers = usersByRole.reduce((sum, item) => sum + Number(item.value), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#704e81]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8 ">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">User Statistics</h1>
        <p className="text-gray-600">Overview of user distribution and demographics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <Users className="w-4 h-4 text-[#704e81]" />
          </div>
          <div className="text-2xl font-bold text-[#704e81]">{totalUsers}</div>
          <p className="text-xs text-gray-500 mt-1">Active accounts</p>
        </div>

        {/* Role-based Cards */}
        {usersByRole.map((role) => {
          const IconComponent = roleIcons[role.name.toLowerCase()];
          return (
            <div 
              key={role.name}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">{role.name}s</h3>
                {IconComponent && (
                  <IconComponent className="w-4 h-4 text-[#704e81]" />
                )}
              </div>
              <div className="text-2xl font-bold text-[#704e81]">{role.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((role.value / totalUsers) * 100).toFixed(1)}% of total
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Geographic Distribution</h2>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usersByCity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="name"
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#eee' }}
              />
              <YAxis 
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#eee' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Bar 
                dataKey="users" 
                fill="#704e81" 
                name="Users"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="photographers" 
                fill="#9b8aa6" 
                name="Photographers"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

<BusinessDashboard/>
    </>
  );
};

export default Statistics;