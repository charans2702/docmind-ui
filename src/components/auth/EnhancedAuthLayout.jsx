import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const EnhancedAuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="fixed top-0 left-0 right-0 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            <span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Back to Home</span>
          </Link>
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">DocMind</span>
          </Link>
        </div>
      </div>
      
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthLayout;