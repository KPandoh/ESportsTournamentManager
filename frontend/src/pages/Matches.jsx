import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Map, Trophy, X } from 'lucide-react';

const Matches = () => {
  const [data, setData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/matches')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex items-center gap-3 mb-8 border-b border-primary/20 pb-4">
        <Swords className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-cinematic tracking-widest text-glow">MATCH ARCHIVE</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((match, idx) => (
          <motion.div 
            key={match.match_id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedMatch(match)}
            className="glass-card p-6 cursor-pointer group overflow-hidden relative"
          >
            {/* Background Map Hint */}
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-30 transition-opacity">
              <Map className="w-32 h-32 text-primary" />
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-xs font-cinematic text-gray-400 uppercase tracking-widest">{new Date(match.match_date).toLocaleDateString()}</p>
              <p className="text-xs font-cinematic text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded border border-primary/30">
                {match.tournament_name}
              </p>
            </div>

            <div className="flex justify-between items-center relative z-10">
              <div className="text-center w-1/3">
                <img src={match.team1_logo} alt={match.team1_name} className="w-12 h-12 mx-auto mb-2 object-contain" />
                <p className="font-bold text-sm truncate">{match.team1_name}</p>
              </div>

              <div className="text-center w-1/3">
                <p className="text-2xl font-cinematic font-bold text-white tracking-widest">
                  {match.score_team1} - {match.score_team2}
                </p>
                <p className="text-xs text-gray-500 mt-1 uppercase">Final Score</p>
              </div>

              <div className="text-center w-1/3">
                <img src={match.team2_logo} alt={match.team2_name} className="w-12 h-12 mx-auto mb-2 object-contain" />
                <p className="font-bold text-sm truncate">{match.team2_name}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cinematic Match Details Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
              onClick={() => setSelectedMatch(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50 p-1 rounded-2xl bg-gradient-to-br from-primary/50 to-black overflow-hidden shadow-[0_0_50px_rgba(255,46,46,0.3)]"
            >
              <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden flex flex-col items-center justify-center">
                {/* Map Background */}
                <img 
                  src={`/maps/${selectedMatch.map_name?.toLowerCase() || 'default'}.png`} 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
                  alt="Map"
                />
                
                <button onClick={() => setSelectedMatch(null)} className="absolute top-4 right-4 text-white hover:text-primary z-50">
                  <X className="w-8 h-8" />
                </button>

                <div className="absolute top-6 left-6 flex items-center gap-2 text-primary font-cinematic uppercase tracking-[0.3em]">
                  <Map className="w-5 h-5" />
                  MAP: {selectedMatch.map_name || 'UNKNOWN'}
                </div>

                <div className="relative z-10 w-full flex items-center justify-between px-16">
                  {/* Team 1 */}
                  <div className={`text-center ${selectedMatch.winner_name === selectedMatch.team1_name ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,46,46,0.8)]' : 'opacity-50 grayscale'}`}>
                    <img src={selectedMatch.team1_logo} className="w-32 h-32 object-contain mx-auto mb-4" alt="Team 1" />
                    <h2 className="text-3xl font-cinematic tracking-wider">{selectedMatch.team1_name}</h2>
                  </div>

                  {/* Score */}
                  <div className="text-center bg-black/60 backdrop-blur-md px-12 py-6 rounded border border-white/10">
                    <p className="text-gray-400 font-cinematic tracking-widest text-sm mb-2 uppercase">Match Result</p>
                    <h1 className="text-6xl font-cinematic font-bold text-glow">
                      <span className={selectedMatch.winner_name === selectedMatch.team1_name ? 'text-primary' : 'text-white'}>{selectedMatch.score_team1}</span>
                      <span className="text-gray-600 mx-4">-</span>
                      <span className={selectedMatch.winner_name === selectedMatch.team2_name ? 'text-primary' : 'text-white'}>{selectedMatch.score_team2}</span>
                    </h1>
                  </div>

                  {/* Team 2 */}
                  <div className={`text-center ${selectedMatch.winner_name === selectedMatch.team2_name ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,46,46,0.8)]' : 'opacity-50 grayscale'}`}>
                    <img src={selectedMatch.team2_logo} className="w-32 h-32 object-contain mx-auto mb-4" alt="Team 2" />
                    <h2 className="text-3xl font-cinematic tracking-wider">{selectedMatch.team2_name}</h2>
                  </div>
                </div>

                {/* Winner Banner */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary/80 to-transparent pt-12 pb-6 text-center">
                  <Trophy className="w-12 h-12 text-white mx-auto mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <p className="text-2xl font-cinematic tracking-[0.3em] uppercase drop-shadow-md">
                    {selectedMatch.winner_name} WINS
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Matches;
