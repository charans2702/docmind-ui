import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Upload, LogOut, FileText } from 'lucide-react';

// User Avatar Component
export const UserAvatar = ({ name, email, size = 'md' }) => {
  // Use first letter of name if available, otherwise use email
  const initial = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : 'U';
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold`}>
      {initial}
    </div>
  );
};

// Navigation Link Component
const NavLink = ({ href, icon: Icon, label, isActive }) => (
  <Link
    to={href}
    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="font-medium">{label}</span>
  </Link>
);

// Main Layout Component
export const AppLayout = ({ children }) => {
  const location = useLocation();
  const email = localStorage.getItem('userEmail');
  const name = localStorage.getItem('userName');
  
  // Only show navigation for authenticated routes
  const showNav = ['/upload', '/chat'].includes(location.pathname);
  
  if (!showNav) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">DocMind</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink 
            href="/upload" 
            icon={Upload} 
            label="Upload Document" 
            isActive={location.pathname === '/upload'} 
          />
          <NavLink 
            href="/chat" 
            icon={MessageCircle} 
            label="Chat Interface" 
            isActive={location.pathname === '/chat'} 
          />
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <UserAvatar name={name} email={email} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userName');
              window.location.href = '/login';
            }}
            className="mt-4 flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Page Header Component
export const PageHeader = ({ title, subtitle }) => (
  <div className="bg-white border-b border-gray-200">
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  </div>
);