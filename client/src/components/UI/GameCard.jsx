import { useState, useRef, useEffect } from 'react';
import { FiPlay, FiStar, FiInfo } from 'react-icons/fi';

const GameCard = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [rating, setRating] = useState(4.8); // Default rating
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  // Extract game ID from API response
  const getGameId = () => {
    if (game._id) return game._id.substring(0, 6);
    if (game.game_uid) return game.game_uid.substring(0, 6);
    if (game.id) return String(game.id).substring(0, 6);
    return 'N/A';
  };

  // Get display name
  const getDisplayName = () => {
    return game.game_name || 'Unknown Game';
  };

  // Get game type
  const getGameType = () => {
    return game.game_type || 'Unknown Type';
  };

  // Get provider
  const getProvider = () => {
    return game.provider || 'Unknown Provider';
  };

  // Get image URL
  const getImageUrl = () => {
    return game.icon || game.img || 'https://via.placeholder.com/300x200?text=No+Image';
  };

  // Get numeric ID for badge
  const getNumericId = () => {
    if (game._id) return game._id.substring(0, 2);
    if (game.id) return String(game.id).substring(0, 2);
    return '##';
  };

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 transition-all duration-500 hover:shadow-glow-lg hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-900">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <img
            ref={imgRef}
            src={getImageUrl()}
            alt={getDisplayName()}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              setImageLoaded(true);
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium rounded bg-gray-900/90 text-white backdrop-blur-sm">
              {getGameType()}
            </span>
          </div>
          
          {/* Provider Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium rounded bg-black/80 text-white backdrop-blur-sm">
              {getProvider()}
            </span>
          </div>
          
         
        </div>
        
        {/* Game Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-white truncate">
              {getDisplayName()}
            </h3>
            <div className="flex items-center space-x-1">
              <FiStar className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-300">{rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold">
                #{getNumericId()}
              </div>
              <span className="text-gray-400">ID: {getGameId()}...</span>
            </div>
            
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <FiInfo />
            </button>
          </div>
          
          {/* Hover Details */}
          <div className={`mt-3 pt-3 border-t border-gray-800 transition-all duration-300 ${
            isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Provider</span>
              <span className="font-medium text-white">{getProvider()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400">Type</span>
              <span className="font-medium text-white">{getGameType()}</span>
            </div>
            {/* Add UID if available */}
            {game.game_uid && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">UID</span>
                <span className="font-medium text-white text-xs truncate ml-2">
                  {game.game_uid.substring(0, 8)}...
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
      </div>
      
      {/* Glowing Shadow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
    </div>
  );
};

export default GameCard;