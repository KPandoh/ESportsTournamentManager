import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaderboard')
      .then(res => {
        setPlayers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-20 font-cinematic tracking-widest text-primary animate-pulse">LOADING STANDINGS...</div>;

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  const getRankTheme = (idx) => {
    if (idx === 0) return { color: 'text-yellow-400', border: 'border-yellow-400/50', shadow: 'shadow-[0_0_30px_rgba(250,204,21,0.2)]' };
    if (idx === 1) return { color: 'text-gray-300', border: 'border-gray-300/50', shadow: 'shadow-[0_0_30px_rgba(209,213,219,0.2)]' };
    return { color: 'text-amber-600', border: 'border-amber-600/50', shadow: 'shadow-[0_0_30px_rgba(217,119,6,0.2)]' };
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-cinematic font-bold tracking-widest text-glow mb-4">
          HALL OF FAME
        </h1>
        <p className="text-primary font-bold tracking-[0.3em] uppercase">Global Rankings by K/D</p>
      </div>

      {/* Top 3 Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
        {[top3[1], top3[0], top3[2]].map((player, renderIdx) => {
          if (!player) return null;
          // Re-map the correct index for rank (1st is center, 2nd is left, 3rd is right)
          const rank = renderIdx === 1 ? 0 : renderIdx === 0 ? 1 : 2;
          const theme = getRankTheme(rank);
          const heightClass = rank === 0 ? 'h-96' : 'h-80';

          return (
            <motion.div 
              key={player.player_id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rank * 0.2 }}
              className={`relative glass rounded-xl border-t-4 ${theme.border} ${theme.shadow} overflow-hidden group ${heightClass} flex flex-col justify-end p-6`}
            >
              <img src={player.agent_image} alt={player.agent_name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              
              <div className="relative z-10 w-full text-center">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <img src={player.logo_url} className="w-16 h-16 object-contain opacity-80" alt="Team Logo" />
                </div>
                <h2 className={`font-cinematic text-5xl mb-1 ${theme.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
                  #{rank + 1}
                </h2>
                <h3 className="text-3xl font-bold text-white mb-2">{player.player_name}</h3>
                <p className="text-gray-400 font-cinematic tracking-widest uppercase text-sm mb-4">
                  {player.team_name || 'Free Agent'} • {player.agent_name}
                </p>
                
                <div className="flex justify-center gap-6 border-t border-white/20 pt-4">
                  <div>
                    <p className="text-xs text-gray-500 font-cinematic">KILLS</p>
                    <p className="text-xl font-bold">{player.kills}</p>
                  </div>
                  <div className="bg-primary/20 px-4 py-1 rounded border border-primary/50">
                    <p className="text-[10px] text-primary font-cinematic uppercase">K/D</p>
                    <p className="text-2xl font-bold text-white">{player.kd_ratio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-cinematic">DEATHS</p>
                    <p className="text-xl font-bold">{player.deaths}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of the players list */}
      <div className="glass-card overflow-hidden">
        {rest.map((player, idx) => (
          <motion.div 
            key={player.player_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-4 px-8 border-b border-white/5 hover:bg-white/5 transition-colors group relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-8 relative z-10 w-full">
              <div className="w-8 text-center font-cinematic text-xl text-gray-500">#{idx + 4}</div>
              <img src={player.agent_image} className="w-12 h-12 rounded-full object-cover border border-primary/50" alt="Agent" />
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{player.player_name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <img src={player.logo_url} className="w-4 h-4 object-contain" alt="logo" />
                  <span className="text-primary tracking-wider font-cinematic text-xs">{player.team_name || 'Free Agent'}</span>
                </div>
              </div>
              
              <div className="flex gap-8 text-right font-cinematic items-center">
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Kills</p>
                  <p className="text-lg">{player.kills}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Deaths</p>
                  <p className="text-lg">{player.deaths}</p>
                </div>
                <div className="bg-black/50 px-4 py-2 rounded border border-white/10 w-24 text-center group-hover:border-primary/50 transition-colors">
                  <p className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{player.kd_ratio}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
