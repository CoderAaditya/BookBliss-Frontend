import React, { Suspense, lazy } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home'; 
import BookDetail from './pages/BookDetail';
import NotFound from './pages/NotFound';

const LazyCart = lazy(() => import('./components/Cart'));

const { Content } = Layout;

// Layout without header for auth pages
const AuthLayout = ({ children }) => (
  <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Content className="flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </Content>
  </Layout>
);

// Layout with header for protected pages
const MainLayout = ({ children }) => (
  <Layout className="min-h-screen bg-gray-50">
    <Header />
    <Content className="bb-content-padding py-8">
      <div className="bb-container">
        {children}
      </div>
    </Content>
  </Layout>
);

function App() {
  // no-op: removed fetchMe hydration
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Auth routes without header */}
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        <Route path="/signup" element={
          <AuthLayout>
            <Signup />
          </AuthLayout>
        } />
        
        {/* Protected routes with header */}
        <Route path="/" element={
          <MainLayout>
            <ProtectedRoute><Home /></ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/book/:id" element={
          <MainLayout>
            <ProtectedRoute><BookDetail /></ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/cart" element={
          <MainLayout>
            <ProtectedRoute><LazyCart /></ProtectedRoute>
          </MainLayout>
        } />
        
        {/* NotFound page without header */}
        <Route path="*" element={
          <AuthLayout>
            <NotFound />
          </AuthLayout>
        } />
      </Routes>
    </Suspense>
  );
}

export default App;