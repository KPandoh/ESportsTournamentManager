import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Background from './components/Background';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Tournaments from './pages/Tournaments';
import Leaderboard from './pages/Leaderboard';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(10px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, filter: 'blur(10px)' }}
    transition={{ duration: 0.4 }}
    className="w-full h-full flex flex-col"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/teams" element={<PageWrapper><Teams /></PageWrapper>} />
        <Route path="/players" element={<PageWrapper><Players /></PageWrapper>} />
        <Route path="/matches" element={<PageWrapper><Matches /></PageWrapper>} />
        <Route path="/tournaments" element={<PageWrapper><Tournaments /></PageWrapper>} />
        <Route path="/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-white flex flex-col selection:bg-primary/50">
          <Background />
          <Navbar />
          <main className="flex-1 flex flex-col relative z-10">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
