import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import { Crosshair, Plus, Search, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Players = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const fetchPlayers = () => {
    axios.get('http://localhost:5000/api/players')
      .then(res => setData(res.data))
      .catch(console.error);
  };

  const fetchTeams = () => {
    axios.get('http://localhost:5000/api/teams')
      .then(res => setTeams(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/players/${id}`);
      fetchPlayers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete player');
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPlayer) {
        await axios.put(`http://localhost:5000/api/players/${editingPlayer.player_id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/players', formData);
      }
      setIsModalOpen(false);
      setEditingPlayer(null);
      fetchPlayers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save player');
    }
  };

  const formFields = [
    { name: 'player_name', label: 'Alias / In-Game Name' },
    { name: 'real_name', label: 'Real Name' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'country', label: 'Country' },
    { 
      name: 'team_id', 
      label: 'Team', 
      type: 'select', 
      options: teams.map(t => ({ label: t.team_name, value: t.team_id })) 
    }
  ];

  const headers = [
    { 
      label: 'Alias', 
      key: 'player_name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.agent_image || '/agents/default.png'} alt={row.agent_name} className="w-8 h-8 rounded-full border border-primary/50 object-cover" />
          <span>{row.player_name}</span>
        </div>
      )
    },
    { label: 'Real Name', key: 'real_name' },
    { label: 'Age', key: 'age' },
    { label: 'Country', key: 'country' },
    { 
      label: 'Team', 
      key: 'team_name',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.logo_url && <img src={row.logo_url} className="w-5 h-5 object-contain" alt="logo" />}
          <span className="text-primary tracking-wider font-cinematic text-xs">{row.team_name || 'Free Agent'}</span>
        </div>
      )
    }
  ];

  const filteredData = data.filter(player => 
    player.player_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (player.real_name && player.real_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (player.team_name && player.team_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-primary/20 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Crosshair className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-cinematic tracking-widest text-glow">PLAYER ROSTER</h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search players..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
            />
          </div>

          {isAdmin ? (
            <button 
              onClick={() => { setEditingPlayer(null); setIsModalOpen(true); }}
              className="btn-glow flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Player
            </button>
          ) : (
            <button 
              disabled
              className="px-4 py-2 bg-gray-800 text-gray-500 rounded border border-gray-700 flex items-center gap-2 text-sm whitespace-nowrap cursor-not-allowed"
              title="Admin access required"
            >
              <Lock className="w-4 h-4" /> Add Player
            </button>
          )}
        </div>
      </div>
      <div className="glass-card p-6">
        <Table headers={headers} data={filteredData} idKey="player_id" onEdit={isAdmin ? handleEdit : undefined} onDelete={isAdmin ? handleDelete : undefined} />
      </div>
      <FormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPlayer(null); }}
        title={editingPlayer ? 'Edit Player' : 'Recruit Player'}
        fields={formFields}
        onSubmit={handleSubmit}
        initialData={editingPlayer}
      />
    </div>
  );
};

export default Players;
