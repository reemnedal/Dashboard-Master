import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Users, Camera, Calendar, Clock, BarChart2, 
  Package, LogOut, Menu, BookOpen, CheckSquare, 
  Settings 
} from 'lucide-react';
import { useState } from 'react';
import TablePho from '../pages/phoTable';
import Tableuser from '../pages/TableUSer';
import CardSession from '../pages/sessions';
import BookedSessions from '../pages/booked_Sessions';
import AcceptPhotographers from '../pages/Accept_Photographers';
import AddProduct from '../pages/products';
import Statistics from '../pages/statistics';

const Nav = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');
  };

  const MenuItem = ({ icon: Icon, text, id }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center p-3 rounded-lg transition-colors
        ${activeTab === id ? 'bg-[#704e81] text-white' : 'text-[#704e81] hover:bg-gray-100'}
      `}
    >
      <Icon size={24} />
      {!isCollapsed && <span className="ml-3 whitespace-nowrap">{text}</span>}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <Statistics/>;
      case 'users':
        return  <Tableuser/>;
      case 'photographers':
        return <TablePho/>;
      case 'sessions':
        return <CardSession/>;
      case 'bookedSessions':
        return  <BookedSessions/>;
      case 'AcceptPhotographers':
        return  <AcceptPhotographers/>;
      // case 'statistics':
      //   return <Statistics/>;
      case 'products':
        return  <AddProduct/>;
      default:
        return <div className="p-6"><h2 className="text-2xl font-bold text-[#704e81]">Welcome to Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen p-4 transition-all duration-300`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="w-full mb-6 p-2 text-[#704e81] hover:bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <Menu size={24} />
        </button>

        {/* Logo/Brand */}
        <div className="mb-8 text-center text-[#704e81]">
          {isCollapsed ? (
            <span className="text-2xl font-bold">S</span>
          ) : (
            <span className="text-2xl font-bold">Sessionat</span>
          )}
        </div>

        {/* Navigation Links */}
        <div className="space-y-2">
          {/* <MenuItem icon={Home} text="Dashboard" id="dashboard" />
          
          */}


<MenuItem icon={BarChart2} text="Statistics" id="statistics" />
          <MenuItem icon={Users} text="Users" id="users" />
          <MenuItem icon={Camera} text="Photographers" id="photographers" />
          <MenuItem icon={Calendar} text="Sessions" id="sessions" />
          <MenuItem icon={BookOpen} text="Booked Sessions" id="bookedSessions" />
          <MenuItem icon={CheckSquare} text="Accept Photographers" id="AcceptPhotographers" />
       
          <MenuItem icon={Package} text="Products" id="products" />
          {/* <MenuItem icon={Settings} text="Settings" id="settings" /> */}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-4 w-[calc(100%-2rem)] flex items-center p-3 text-[#704e81]   rounded-lg transition-colors"
        >
          <LogOut size={24} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#704e81]">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            {/* <div className="flex items-center space-x-4">
              <button className="p-2 text-[#704e81] hover:bg-gray-100 rounded-full">
                <Settings size={20} />
              </button>
            </div> */}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Nav;