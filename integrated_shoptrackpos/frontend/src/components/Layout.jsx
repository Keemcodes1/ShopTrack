import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '../lib/utils';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for development

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(true); // Force true for development
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Set to true by default for desktop
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define public routes that don't need the sidebar/header layout
  const publicRoutes = ['/login', '/register'];
  if (publicRoutes.includes(location.pathname)) {
    return (
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10"
        >
          <Outlet />
          <Toaster />
        </motion.main>
      </AnimatePresence>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuButtonClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
