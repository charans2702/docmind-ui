import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { UploadForm } from './components/document/UploadForm';
import { ChatInterface } from './components/chat/ChatInterface';
import { LandingPage } from './components/LandingPage';
import { AppLayout, PageHeader } from './components/layout/LayoutComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import EnhancedAuthLayout from './components/auth/EnhancedAuthLayout';

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function AuthLayout({ children, title, subtitle }) {
  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={
              <EnhancedAuthLayout 
                title="Welcome Back" 
                subtitle="Enter your credentials to access your account"
              >
                <LoginForm />
                <p className="mt-4 text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign up
                  </Link>
                </p>
              </EnhancedAuthLayout>
            } />

            <Route path="/signup" element={
              <EnhancedAuthLayout 
                title="Create Your Account" 
                subtitle="Join thousands of users managing their documents with AI"
              >
                <SignupForm />
                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Log in
                  </Link>
                </p>
              </EnhancedAuthLayout>
            } />
          
          <Route path="/upload" element={
            <PrivateRoute>
              <AppLayout>
                <PageHeader 
                  title="Upload Document" 
                  subtitle="Supported formats: PDF, DOCX, PPTX" 
                />
                <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                  <UploadForm />
                </div>
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/chat" element={
            <PrivateRoute>
              <AppLayout>
                <ChatInterface />
              </AppLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}