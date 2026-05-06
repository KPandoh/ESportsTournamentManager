import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Users, Trophy, Crosshair } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center relative px-6 py-12">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10 w-fit text-sm font-semibold tracking-wide text-primary shadow-[0_0_10px_rgba(255,46,46,0.2)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            SYSTEM ONLINE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-cinematic font-bold leading-tight tracking-wide text-glow">
            VALORANT <br/>
            <span className="text-primary">TOURNAMENT</span> <br/>
            MANAGER
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-lg border-l-2 border-primary pl-4 tracking-wide font-light">
            High-end esports analytics and administration system. Monitor matches, players, and real-time statistics with cinematic precision.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link to="/dashboard" className="btn-glow inline-flex items-center gap-2">
              <Target className="w-5 h-5" />
              View Dashboard
            </Link>
            <Link to="/leaderboard" className="px-6 py-3 border border-gray-600 hover:border-primary hover:text-primary transition-all uppercase font-cinematic tracking-widest bg-black/50 backdrop-blur-sm">
              Leaderboard
            </Link>
          </div>
        </motion.div>

        {/* Right Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { label: 'Active Teams', icon: Users, delay: 0.3 },
            { label: 'Registered Players', icon: Crosshair, delay: 0.4 },
            { label: 'Live Tournaments', icon: Trophy, delay: 0.5 },
            { label: 'Matches Played', icon: Target, delay: 0.6 }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              className="glass-card p-6 flex flex-col gap-4 items-center justify-center text-center group cursor-default"
            >
              <stat.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="h-0.5 w-8 bg-primary/50 group-hover:w-16 transition-all duration-300" />
              <span className="uppercase tracking-widest text-sm text-gray-400 font-cinematic">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;
