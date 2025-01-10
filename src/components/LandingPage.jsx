import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Upload, Shield } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: 'Easy Document Upload',
      description: 'Upload your documents in various formats including PDF, DOCX, and PPTX'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'AI-Powered Chat',
      description: 'Interact with your documents through natural conversation'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Private',
      description: 'Your documents are encrypted and stored securely'
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      <div className="h-full flex flex-col">
        <nav className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">DocMind</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
              Your AI Document Assistant
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Upload your documents and instantly start conversations with them. Get answers, insights, and analysis powered by advanced AI.
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                Get Started
              </Link>
              <Link to="/login" className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors">
                Login
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-7xl w-full px-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}