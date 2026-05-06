import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Trophy, Crosshair, Users, Swords, TrendingUp, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const NumberTicker = ({ value }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin shadow-[0_0_15px_#ff2e2e]" />
        <p className="font-cinematic tracking-[0.2em] text-primary animate-pulse">INITIALIZING ESPORTS SYSTEM...</p>
      </div>
    );
  }

  if (!data) return <div className="text-center mt-20">Failed to load dashboard data.</div>;

  const statCards = [
    { title: 'Total Teams', value: data.stats.totalTeams, icon: Users },
    { title: 'Total Players', value: data.stats.totalPlayers, icon: Crosshair },
    { title: 'Tournaments', value: data.stats.totalTournaments, icon: Trophy },
    { title: 'Matches', value: data.stats.totalMatches, icon: Swords },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8 border-b border-primary/20 pb-4"
      >
        <TrendingUp className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-cinematic tracking-widest text-glow">COMMAND CENTER</h1>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <stat.icon className="w-16 h-16 text-primary" />
            </div>
            <span className="text-gray-400 font-cinematic uppercase tracking-wider text-sm mb-2 z-10">{stat.title}</span>
            <span className="text-4xl font-bold text-white z-10">
              <NumberTicker value={stat.value} />
            </span>
            <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Highlights & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-l-4 border-l-primary flex gap-4 items-center">
          <div className="p-4 bg-primary/20 rounded-full">
            <Crosshair className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-cinematic uppercase tracking-widest mb-1">Top Fragger (K/D)</p>
            <p className="text-xl font-bold">{data.topPlayer?.player_name || 'N/A'}</p>
            <p className="text-sm text-primary">{data.topPlayer?.kd_ratio} KD</p>
          </div>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-l-accent flex gap-4 items-center">
          <div className="p-4 bg-accent/20 rounded-full">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-cinematic uppercase tracking-widest mb-1">Most Dominant Team</p>
            <p className="text-xl font-bold">{data.topTeam?.team_name || 'N/A'}</p>
            <p className="text-sm text-accent">{data.topTeam?.wins} Wins</p>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Cpu className="w-24 h-24 text-primary" />
          </div>
          <p className="text-xs text-primary font-cinematic uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Smart Insight
          </p>
          <p className="text-sm text-gray-300 italic z-10">
            "Based on recent data, {data.topPlayer?.player_name} is performing at an elite level. Teams facing {data.topTeam?.team_name} should prioritize map control."
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-cinematic uppercase tracking-widest mb-6 border-l-2 border-primary pl-3">Matches Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.graphs.matchesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{fill: '#999', fontSize: 12}} />
                <YAxis stroke="#666" tick={{fill: '#999', fontSize: 12}} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: '#ff2e2e', color: '#fff' }}
                  itemStyle={{ color: '#ff2e2e' }}
                />
                <Line type="monotone" dataKey="count" stroke="#ff2e2e" strokeWidth={3} dot={{r: 4, fill: '#ff2e2e'}} activeDot={{r: 6, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-cinematic uppercase tracking-widest mb-6 border-l-2 border-primary pl-3">Top 5 Players (K/D)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.graphs.topPlayers} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#666" tick={{fill: '#999'}} domain={[0, 'dataMax + 0.5']} />
                <YAxis dataKey="player_name" type="category" stroke="#666" tick={{fill: '#ccc', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,46,46,0.1)'}}
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: '#ff2e2e' }}
                />
                <Bar dataKey="kd_ratio" fill="#ff2e2e" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.graphs.topPlayers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ff4d4d' : '#991b1b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
