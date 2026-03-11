import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProviders, updateProviderStatus } from '../../reducer/providerSlice'
import ProviderCard from '../../components/UI/ProviderCard';

const Providers = () => {
  const dispatch = useDispatch();
  const { providers, loading, error } = useSelector((state) => state.providers);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all'); 

  useEffect(() => {
    // Load all providers
    dispatch(getAllProviders());
  }, [dispatch]);

  // Handle provider status toggle
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    dispatch(updateProviderStatus({ id, status: newStatus }));
  };

  console.log("providersprovidersproviders",providers);
  

  // Filter providers based on search and status
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.game_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.provider?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && provider.status === 1) ||
      (filterStatus === 'inactive' && provider.status === 0);
    
    return matchesSearch && matchesStatus;
  }).map(provider => {
    // Calculate games count for each provider
    const gamesCount = 0; // You'll need to implement this from games API
    return { ...provider, gamesCount };
  });

  if (loading && providers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient-silver">
            Game Providers
          </h1>
          <p className="text-gray-400 mt-2">
            Browse through {providers.length} game providers
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all" className="bg-gray-900">All Status</option>
            <option value="active" className="bg-gray-900">Active</option>
            <option value="inactive" className="bg-gray-900">Inactive</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
            >
              <FiGrid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
            >
              <FiList className={`w-4 h-4 ${viewMode === 'list' ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
            <FiFilter className="w-4 h-4 text-gray-300" />
            <span className="text-gray-300 text-sm">Filter</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Providers Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProviders.map((provider) => (
            <div key={provider._id || provider.id}>
             
                <ProviderCard 
                  provider={provider} 
                  gameCount={provider.gamesCount}
                  // status={provider.status}
                  // onToggleStatus={() => handleToggleStatus(provider.id, provider.status)}
                />
           
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProviders.map((provider) => (
            <div key={provider._id || provider.id} className="group">
              <Link to={`/provider/${provider.provider}`}>
                <div className="glass border border-gray-800 rounded-xl p-4 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-black border border-gray-700 p-0.5">
                        {provider.img ? (
                          <img 
                            src={provider?.img} 
                            alt={provider.game_name} 
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black rounded flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {provider.game_name?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{provider.game_name}</h3>
                        <p className="text-gray-400 text-sm">{provider.game_type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded ${provider.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {provider.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {provider.gamesCount}
                      </div>
                      <div className="text-gray-400 text-sm">Games</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProviders.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-5xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-white mb-2">No providers found</h3>
          <p className="text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default Providers; 