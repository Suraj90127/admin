import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPackage,
  FiGrid,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "../../components/UI/SearchBar";
import ProviderCard from "../../components/UI/ProviderCard";

import { getAllProviders } from "../../reducer/providerSlice";
import { getTotalRechargeData } from "../../reducer/rechargeAdminSlice";
import { fetchTotalManager } from "../../reducer/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  /* =======================
     REDUX STATES
  ======================= */
  const {
    dashboardLoading,
    totalUsers,
    totalActiveUsers,
    totalProviders,
    totalGames,
    totalSales,
    totalPendingRecharge,
  } = useSelector((state) => state.auth);

  const { providers = [], loading: providerLoading } = useSelector(
    (state) => state.providers
  );

  const { recharges = [], loading: rechargeLoading } = useSelector(
    (state) => state.recharge
  );

  /* =======================
     LOCAL STATES
  ======================= */
  const [activeProviders, setActiveProviders] = useState([]);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    dispatch(fetchTotalManager());
    dispatch(getTotalRechargeData());
    dispatch(getAllProviders());
  }, [dispatch]);

  /* =======================
     FILTER ACTIVE PROVIDERS
  ======================= */
  useEffect(() => {
    if (!providers.length) return;

    const active = providers
      .filter((p) => p.status === 1)
      .slice(0, 10);

    setActiveProviders(active);
  }, [providers]);

  /* =======================
     RECENT RECHARGES
  ======================= */
  const recentRecharges = [...recharges].reverse().slice(0, 3);

  /* =======================
     STATS CARDS
  ======================= */
  const statCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FiUsers className="w-7 h-7" />,
      link: "/users",
    },
    {
      title: "Active Users",
      value: totalActiveUsers,
      icon: <FiUsers className="w-7 h-7" />,
      link: "/active-users",
    },
    {
      title: "Total Providers",
      value: totalProviders,
      icon: <FiPackage className="w-7 h-7" />,
      link: "/providers",
    },
    {
      title: "Total Games",
      value: totalGames,
      icon: <FiGrid className="w-7 h-7" />,
      link: "/all-pages",
    },
    {
      title: "Total Sales",
      value: `₹ ${totalSales}`,
      icon: <FiTrendingUp className="w-7 h-7" />,
      link: "/recharge",
    },
    {
      title: "Pending Recharge",
      value: `₹ ${totalPendingRecharge}`,
      icon: <FiDollarSign className="w-7 h-7" />,
      link: "/total-recharge",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient-silver">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <SearchBar placeholder="Search users, providers..." />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <div className="glass border border-gray-800 rounded-xl p-6 hover:shadow-glow transition">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {dashboardLoading ? "..." : stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 text-white">
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PROVIDERS */}
      <div className="glass border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Active Providers
          </h2>
          <Link to="/providers" className="flex items-center text-gray-300">
            View All <FiArrowRight className="ml-2" />
          </Link>
        </div>

        {providerLoading ? (
          <p className="text-gray-400">Loading providers...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {activeProviders.map((provider) => (
                <ProviderCard provider={provider} />
            ))}
          </div>
        )}
      </div>

      {/* RECHARGE + BET */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RECENT RECHARGES */}
        <div className="glass border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Recent Recharges
            </h3>
            <Link
              to="/recharge-history"
              className="text-sm text-gray-300"
            >
              View All
            </Link>
          </div>

          {rechargeLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : recentRecharges.length === 0 ? (
            <p className="text-gray-400">No recharges found</p>
          ) : (
            recentRecharges.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center p-3 hover:bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">
                    {item.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-white font-bold">
                  ₹ {item.money}
                </p>
              </div>
            ))
          )}
        </div>

        {/* RECENT BETS (STATIC) */}
        <div className="glass border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Recent Bets
            </h3>
            <Link
              to="/bet-history"
              className="text-sm text-gray-300"
            >
              View All
            </Link>
          </div>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 hover:bg-gray-800/50 rounded-lg"
            >
              <div>
                <p className="text-white font-medium">
                  Game #{i}
                </p>
                <p className="text-xs text-gray-400">
                  User {i}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">
                  ₹ {i * 250}
                </p>
                <p
                  className={`text-xs ${
                    i % 2 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {i % 2 ? "Won" : "Lost"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;