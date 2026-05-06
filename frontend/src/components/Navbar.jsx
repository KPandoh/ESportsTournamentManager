import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, LogOut, User } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const playHover = useSound('/sounds/hover.mp3', 0.1);
  const playClick = useSound('/sounds/click.mp3', 0.3);
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Teams', path: '/teams' },
    { name: 'Players', path: '/players' },
    { name: 'Matches', path: '/matches' },
    { name: 'Tournaments', path: '/tournaments' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-primary/30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          <img src="/logo.png" alt="V-SYNC Logo" className="w-10 h-10 object-contain group-hover:drop-shadow-[0_0_12px_rgba(255,46,46,0.9)] transition-all duration-300 rounded" />
          <span className="text-2xl font-cinematic font-bold tracking-widest text-glow glitch" data-text="V-SYNC">V-SYNC</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onMouseEnter={playHover}
              onClick={playClick}
              className={`uppercase font-cinematic tracking-wider text-sm transition-colors hover:text-primary ${
                location.pathname.startsWith(link.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-cinematic uppercase">
                <User className="w-4 h-4 text-primary" />
                <span className="text-gray-300">
                  {user.username} <span className="text-primary/70">[{user.role}]</span>
                </span>
              </div>
              <button 
                onClick={() => { playClick(); logout(); }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onMouseEnter={playHover}
              onClick={playClick}
              className="btn-glow text-xs px-4 py-2 uppercase font-cinematic"
            >
              System Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
