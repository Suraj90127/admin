import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiFilter, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getGames, getGameTypes, getGameProviders } from '../reducer/gameSlice';
import { getAllProviders } from '../reducer/providerSlice';
import GameCard from '../components/UI/GameCard';

const AllPages = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { 
    games, 
    totalGames, 
    currentPage, 
    perPage, 
    gameTypes, 
    providers: gameProviders,
    loading 
  } = useSelector((state) => state.games);
  
  const { providers: allProviders } = useSelector((state) => state.providers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [localFilteredGames, setLocalFilteredGames] = useState([]);

  // Initial data loading
  useEffect(() => {
    // Load all games
    dispatch(getGames({ page: 1, size: 1000 }));
    
    // Load game types
    dispatch(getGameTypes());
    
    // Load game providers
    dispatch(getGameProviders());
    
    // Load all providers
    dispatch(getAllProviders());
  }, [dispatch]);

  // Filter and sort games locally
  useEffect(() => {
    if (games.length > 0) {
      let filtered = [...games];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(game => 
          game.game_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply provider filter
      if (selectedProvider !== 'all') {
        filtered = filtered.filter(game => 
          game.provider === selectedProvider
        );
      }
      
      // Apply type filter
      if (selectedType !== 'all') {
        filtered = filtered.filter(game => 
          game.game_type === selectedType
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch(sortBy) {
          case 'name': 
            return (a.game_name || '').localeCompare(b.game_name || '');
          case 'provider': 
            return (a.provider || '').localeCompare(b.provider || '');
          default: 
            return 0;
        }
      });
      
      setLocalFilteredGames(filtered);
    }
  }, [games, searchTerm, selectedProvider, selectedType, sortBy]);

  // Get paginated games
  const getPaginatedGames = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return localFilteredGames.slice(startIndex, endIndex);
  };

  // Calculate pagination values
  const totalPages = Math.ceil(localFilteredGames.length / itemsPerPage);
  const paginatedGames = getPaginatedGames();

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setPage(1); // Reset to first page when changing items per page
  };

  // Get provider name from provider ID
  const getProviderName = (providerId) => {
    const provider = allProviders.find(p => p.provider === providerId);
    return provider?.game_name || providerId;
  };

  // Get provider options for filter
  const providerOptions = ['all', ...gameProviders];

  // Get game type options for filter
  const gameTypeOptions = ['all', ...gameTypes];

  if (loading && games.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 p-6 md:p-8">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-silver mb-2">All Games Collection</h1>
          <p className="text-gray-300">
            Browse through our entire collection of {totalGames} games
          </p>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: totalGames, label: 'Total Games' },
          { value: gameProviders.length, label: 'Providers' },
          { value: gameTypes.length, label: 'Game Types' },
          { value: localFilteredGames.length, label: 'Showing' },
        ].map((stat, index) => (
          <div key={index} className="glass border border-gray-800 rounded-xl p-4">
            <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Games
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by game name..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Provider
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              {providerOptions.map(provider => (
                <option key={provider} value={provider} className="bg-gray-900">
                  {provider === 'all' ? 'All Providers' : getProviderName(provider)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Type
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {gameTypeOptions.map(type => (
                <option key={type} value={type} className="bg-gray-900">
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name" className="bg-gray-900">Name (A-Z)</option>
              <option value="provider" className="bg-gray-900">Provider</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Items Per Page
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
            >
              <option value={12} className="bg-gray-900">12</option>
              <option value={24} className="bg-gray-900">24</option>
              <option value={48} className="bg-gray-900">48</option>
              <option value={96} className="bg-gray-900">96</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6">
          <div className="text-sm text-gray-400">
            Showing {paginatedGames.length} of {localFilteredGames.length} games 
            {searchTerm || selectedProvider !== 'all' || selectedType !== 'all' ? ' (filtered)' : ''}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">View:</span>
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
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
              <FiFilter className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300">Advanced Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Games - Only show when no filters applied */}
      {selectedProvider === 'all' && selectedType === 'all' && !searchTerm && games.length > 0 && (
        <div className="glass border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FiStar className="mr-2 text-gray-300" />
              Featured Games
            </h2>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              View Dashboard
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {games.slice(0, 5).map((game, index) => (
              <GameCard key={game._id || index} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Games Display */}
      {paginatedGames.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {paginatedGames.map((game) => (
                <GameCard key={game._id || game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedGames.map((game) => (
                <div
                  key={game._id || game.id}
                  className="glass border border-gray-800 rounded-xl p-4 hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={game.icon}
                        alt={game.game_name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-white">{game.game_name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-xs">
                              {game.provider?.charAt(0) || 'P'}
                            </div>
                            <span className="text-sm text-gray-400">{getProviderName(game.provider)}</span>
                          </div>
                          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                            {game.game_type}
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                            ID: {game.game_uid?.substring(0, 8) || game._id?.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-br from-gray-800 to-black border border-gray-700 text-white rounded-lg hover:shadow-glow transition-all duration-300">
                      Play Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
              <div className="text-sm text-gray-400">
                Page {page} of {totalPages} • Showing {paginatedGames.length} games
              </div>
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-4 py-2 border border-gray-700 rounded-lg transition-all ${
                    page === 1 
                      ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:shadow-glow'
                  }`}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          page === pageNum
                            ? 'bg-gradient-to-br from-gray-800 to-black text-white shadow-glow'
                            : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Ellipsis for many pages */}
                  {totalPages > 5 && page < totalPages - 2 && (
                    <>
                      <span className="px-1 text-gray-400">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          page === totalPages
                            ? 'bg-gradient-to-br from-gray-800 to-black text-white shadow-glow'
                            : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`flex items-center gap-1 px-4 py-2 border border-gray-700 rounded-lg transition-all ${
                    page === totalPages 
                      ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:shadow-glow'
                  }`}
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="text-gray-500 text-5xl mb-4">🎲</div>
          <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
          <p className="text-gray-400">
            {searchTerm || selectedProvider !== 'all' || selectedType !== 'all' 
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Loading games..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AllPages;