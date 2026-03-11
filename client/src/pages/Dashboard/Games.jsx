import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiGrid, FiList, FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getGames, getGameTypes } from '../../reducer/gameSlice';
import GameCard from '../../components/UI/GameCard';
import { updateProvider } from '../../reducer/providerSlice';

const Games = () => {
  const { provider } = useParams();
  const dispatch = useDispatch();
  
  const { games, gameTypes, loading } = useSelector((state) => state.games);
  const { providers } = useSelector((state) => state.providers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [gameType, setGameType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(24);
  const [isEditOpen, setIsEditOpen] = useState(false);

    const [formData, setFormData] = useState({
      id: "",
      provider: "",
      img: "",
      price: "",
      path: "",
      status: 1,
    });

  useEffect(() => {
    // Load games for specific provider
    dispatch(getGames({ provider, page, size: perPage }));
    
    // Load game types
    dispatch(getGameTypes());
  }, [dispatch, provider, page, perPage]);

  const providerInfo = providers.find(p => p.provider === provider);

  // console.log("providerInfo",providerInfo);
  
  
  // Get available game types from API data
  const availableGameTypes = ['all', ...gameTypes];
  
  // Filter games
  const filteredGames = games.filter(game => {
    const matchesSearch = game.game_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = gameType === 'all' || game.game_type === gameType;
    return matchesSearch && matchesType;
  });

  // Pagination functions
  const handleNextPage = () => {
    if (filteredGames.length === perPage) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  useEffect(() => {
  if (providerInfo) {
    setFormData({
      id: providerInfo.id,
      provider: providerInfo.provider || "",
      img: providerInfo.img || "",
      price: providerInfo.price || "",
      path: providerInfo.path || "",
      status: providerInfo.status ?? 1,
    });
  }
}, [providerInfo]);


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleUpdate = async (e) => {
  e.preventDefault();

  const result = await dispatch(updateProvider(formData));

  if (result.meta.requestStatus === "fulfilled") {
    alert("Provider Updated Successfully ✅");
    setIsEditOpen(false);
  } else {
    alert("Update Failed ❌");
  }
};

  if (loading && games.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/providers"
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
      >
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Providers
      </Link>

      {/* Provider Header */}
      <div className="glass border border-gray-800 rounded-xl p-6">
    

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 p-2 flex items-center justify-center">
            {providerInfo?.icon ? (
              <img
                src={providerInfo.icon}
                alt={providerInfo.game_name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-white">
                {providerInfo?.game_name?.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{providerInfo?.game_name || provider}</h1>
            <p className="text-gray-400 mt-2">{filteredGames.length} Games Available</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                {providerInfo?.game_type || 'Multiple Types'}
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                Provider: {provider}
              </span>
              {providerInfo?.status !== undefined && (
                <span className={`px-3 py-1 rounded-full text-sm ${providerInfo.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {providerInfo.status === 1 ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
          </div>
           <div>
        <button
          onClick={() => setIsEditOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 
          text-black font-semibold rounded-lg shadow-md 
          hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          ✏ Edit Provider
        </button>

        </div>
        </div>
       
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Available Games</h2>
          <p className="text-gray-400">
            Browse games from {providerInfo?.game_name}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Game Type Filter */}
          <select
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
          >
            {availableGameTypes.map((type) => (
              <option key={type} value={type} className="bg-gray-900">
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Items Per Page */}
          <select
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            <option value={12} className="bg-gray-900">12 per page</option>
            <option value={24} className="bg-gray-900">24 per page</option>
            <option value={48} className="bg-gray-900">48 per page</option>
            <option value={100} className="bg-gray-900">100 per page</option>
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
        </div>
      </div>

      {/* Games Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredGames.map((game) => (
            <GameCard key={game._id || game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGames.map((game) => (
            <div
              key={game._id || game.id}
              className="glass border border-gray-800 rounded-xl p-4 hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={game.icon}
                    alt={game.game_name}
                    className="w-20 h-20 rounded-lg object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-white">{game.game_name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                        {game.game_type}
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                        ID: {game.game_uid || game._id}
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                        Provider: {game.provider}
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
      {filteredGames.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <div className="text-sm text-gray-400">
            Page {page} • Showing {filteredGames.length} games
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-4 py-2 border border-gray-700 rounded-lg transition-colors ${page === 1 ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`}
            >
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-br from-gray-800 to-black text-white rounded-lg hover:shadow-glow">
              {page}
            </button>
            {filteredGames.length === perPage && (
              <button 
                onClick={handleNextPage}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {page + 1}
              </button>
            )}
            <button 
              onClick={handleNextPage}
              disabled={filteredGames.length < perPage}
              className={`px-4 py-2 border border-gray-700 rounded-lg transition-colors ${filteredGames.length < perPage ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredGames.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
          <p className="text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {isEditOpen && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
    
    <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg p-6 relative animate-fade-in">
      
      <button
        onClick={() => setIsEditOpen(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold text-white mb-6">
        Edit Provider
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          type="text"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          placeholder="Provider Name"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />

        <input
          type="text"
          name="img"
          value={formData.img}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />

        <input
          type="text"
          name="path"
          value={formData.path}
          onChange={handleChange}
          placeholder="Path"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 
          text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
        >
          Update Provider
        </button>

      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Games;