import { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const BetHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  const betHistory = [
    { id: 5001, userId: 'U001', userName: 'John Doe', game: 'Limbo', betAmount: 100, winAmount: 200, result: 'win', date: '2024-03-15 14:35', odds: '2.0x' },
    { id: 5002, userId: 'U001', userName: 'John Doe', game: 'Crash', betAmount: 50, winAmount: 0, result: 'loss', date: '2024-03-15 14:20', odds: '1.5x' },
    { id: 5003, userId: 'U003', userName: 'Bob Johnson', game: 'Blackjack', betAmount: 200, winAmount: 350, result: 'win', date: '2024-03-14 11:05', odds: '1.75x' },
    { id: 5004, userId: 'U003', userName: 'Bob Johnson', game: 'Roulette', betAmount: 75, winAmount: 150, result: 'win', date: '2024-03-14 10:30', odds: '2.0x' },
  ];

  const filteredBets = betHistory.filter(bet => {
    const matchesSearch = 
      bet.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || bet.game === gameFilter;
    const matchesResult = resultFilter === 'all' || bet.result === resultFilter;
    return matchesSearch && matchesGame && matchesResult;
  });

  const totalStats = {
    totalBets: betHistory.length,
    totalWagered: betHistory.reduce((sum, bet) => sum + bet.betAmount, 0),
    totalWon: betHistory.reduce((sum, bet) => sum + bet.winAmount, 0),
    netProfit: betHistory.reduce((sum, bet) => sum + (bet.winAmount - bet.betAmount), 0),
  };

  const games = ['all', ...new Set(betHistory.map(bet => bet.game))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-silver">
            Bet History
          </h1>
          <p className="text-gray-400 mt-2">
            Track all betting activities and outcomes
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-br from-gray-800 to-black border border-gray-700 text-white rounded-lg hover:shadow-glow transition-all duration-300 flex items-center">
          <FiDownload className="mr-2" />
          Export Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: totalStats.totalBets, label: 'Total Bets' },
          { value: `$${totalStats.totalWagered.toLocaleString()}`, label: 'Total Wagered' },
          { value: `$${totalStats.totalWon.toLocaleString()}`, label: 'Total Won' },
          { 
            value: `$${totalStats.netProfit.toLocaleString()}`, 
            label: 'Net Profit',
            color: totalStats.netProfit >= 0 ? 'text-gray-300' : 'text-gray-400'
          },
        ].map((stat, index) => (
          <div key={index} className="glass border border-gray-800 rounded-xl p-6">
            <div className={`text-2xl md:text-3xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or game..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Game
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
            >
              {games.map(game => (
                <option key={game} value={game} className="bg-gray-900">
                  {game === 'all' ? 'All Games' : game}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Result
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all backdrop-blur-sm"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              <option value="all" className="bg-gray-900">All Results</option>
              <option value="win" className="bg-gray-900">Win</option>
              <option value="loss" className="bg-gray-900">Loss</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bet History Table */}
      <div className="glass border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Game</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bet Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Win Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Result</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Odds</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-300 font-mono">#{bet.id}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-white">{bet.userName}</div>
                      <div className="text-sm text-gray-400">{bet.userId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-white">{bet.game}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-400">-${bet.betAmount}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`font-bold ${bet.winAmount > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
                      {bet.winAmount > 0 ? `+$${bet.winAmount}` : '$0'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {bet.result === 'win' ? (
                        <>
                          <FiTrendingUp className="text-gray-300 mr-1" />
                          <span className="text-gray-300 font-medium">WIN</span>
                        </>
                      ) : (
                        <>
                          <FiTrendingDown className="text-gray-400 mr-1" />
                          <span className="text-gray-400 font-medium">LOSS</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                      {bet.odds}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-300">{bet.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BetHistory;