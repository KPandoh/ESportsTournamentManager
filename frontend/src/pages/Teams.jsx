import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import { Users, Plus, Search, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Teams = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const fetchTeams = () => {
    axios.get('http://localhost:5000/api/teams')
      .then(res => setData(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/teams/${id}`);
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete team');
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTeam) {
        await axios.put(`http://localhost:5000/api/teams/${editingTeam.team_id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/teams', formData);
      }
      setIsModalOpen(false);
      setEditingTeam(null);
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save team');
    }
  };

  const formFields = [
    { name: 'team_name', label: 'Team Name' },
    { name: 'region', label: 'Region' },
    { name: 'coach_name', label: 'Coach' }
  ];

  const headers = [
    { 
      label: 'Team Name', 
      key: 'team_name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.logo_url || '/logos/default.png'} alt={row.team_name} className="w-8 h-8 object-contain" />
          <span>{row.team_name}</span>
        </div>
      )
    },
    { label: 'Region', key: 'region' },
    { label: 'Coach', key: 'coach_name' }
  ];

  const filteredData = data.filter(team => 
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.region && team.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (team.coach_name && team.coach_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-primary/20 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-cinematic tracking-widest text-glow">TEAMS DATABASE</h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
            />
          </div>
          
          
          {isAdmin ? (
            <button 
              onClick={() => { setEditingTeam(null); setIsModalOpen(true); }}
              className="btn-glow flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Team
            </button>
          ) : (
            <button 
              disabled
              className="px-4 py-2 bg-gray-800 text-gray-500 rounded border border-gray-700 flex items-center gap-2 text-sm whitespace-nowrap cursor-not-allowed"
              title="Admin access required"
            >
              <Lock className="w-4 h-4" /> Add Team
            </button>
          )}
        </div>
      </div>
      <div className="glass-card p-6">
        <Table headers={headers} data={filteredData} idKey="team_id" onEdit={isAdmin ? handleEdit : undefined} onDelete={isAdmin ? handleDelete : undefined} />
      </div>
      <FormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTeam(null); }}
        title={editingTeam ? 'Edit Team' : 'Register New Team'}
        fields={formFields}
        onSubmit={handleSubmit}
        initialData={editingTeam}
      />
    </div>
  );
};

export default Teams;
