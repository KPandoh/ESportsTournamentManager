import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { Trophy } from 'lucide-react';

const Tournaments = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tournaments')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  const headers = [
    { label: 'Event Name', key: 'tournament_name' },
    { label: 'Season', key: 'season' },
    { label: 'Location', key: 'location' },
    { label: 'Start Date', key: 'start_date' },
    { label: 'End Date', key: 'end_date' }
  ];

  const formattedData = data.map(d => ({
    ...d,
    start_date: new Date(d.start_date).toLocaleDateString(),
    end_date: new Date(d.end_date).toLocaleDateString()
  }));

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex items-center gap-3 mb-8 border-b border-primary/20 pb-4">
        <Trophy className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-cinematic tracking-widest text-glow">ACTIVE TOURNAMENTS</h1>
      </div>
      <div className="glass-card p-6">
        <Table headers={headers} data={formattedData} idKey="tournament_id" />
      </div>
    </div>
  );
};

export default Tournaments;
