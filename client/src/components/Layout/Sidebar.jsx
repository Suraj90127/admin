import { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiUserCheck, FiUserX, FiPackage,
  FiGrid, FiDollarSign, FiActivity, FiBarChart2,
  FiChevronDown, FiChevronRight, FiX, FiTrendingUp,
  FiDatabase, FiCreditCard, FiShield,
  FiPlus
} from 'react-icons/fi';
import { HiOutlineChartBar } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isMobile }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    users: false,
    games: false,
    finance: false
  });

  const { admin } = useSelector((state) => state.auth);




  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/users') || path.includes('/active-users') || path.includes('/inactive-users')) {
      setExpandedSections(prev => ({ ...prev, users: true }));
      setActiveSection('users');
    } else if (path.includes('/providers') || path.includes('/all-pages')) {
      setExpandedSections(prev => ({ ...prev, games: true }));
      setActiveSection('games');
    } else if (path.includes('/recharge') || path.includes('/bet-history')) {
      setExpandedSections(prev => ({ ...prev, finance: true }));
      setActiveSection('finance');
    } else if (path === '/dashboard') {
      setActiveSection('dashboard');
    }
    else if (path === '/addprovider') {
      setActiveSection('Addprovider');
    }
  }, [location.pathname]);

  const stats = useMemo(() => [
    {
      label: 'Total Users',
      value: '1.2K',
      change: '+12%',
      icon: <FiUsers className="text-gray-300" />,
      color: 'from-gray-800 to-gray-900'
    },
    {
      label: 'Active Users',
      value: '892',
      change: '+5%',
      icon: <FiUserCheck className="text-white" />,
      color: 'from-gray-700 to-gray-800'
    },
    {
      label: 'Total Providers',
      value: '67',
      change: '+2%',
      icon: <FiPackage className="text-gray-300" />,
      color: 'from-gray-800 to-gray-900'
    },
    {
      label: 'Total Games',
      value: '2.4K',
      change: '+8%',
      icon: <FiGrid className="text-white" />,
      color: 'from-gray-700 to-gray-800'
    },
  ], []);

  const navSections = useMemo(() => [
    {
      id: 'dashboard',
      icon: <FiHome />,
      label: 'Dashboard',
      to: '/dashboard',
      single: true,
      badge: null
    },
    {
      id: 'providers',
      icon: <FiPackage />,
      label: 'Providers',
      to: '/providers',
      single: true,
      badge: null
    },
      {
        id: 'addprovider',
        icon: <FiPlus />,
        label: 'Add Provider',
        to: '/addprovider',
        single: true,
        badge: null
      },
    {
      id: 'cricketProviders',
      icon: <FiShield />,
      label: 'Cricket Providers',
      to: '/cricket-providers',
      single: true,
      badge: null
    },
    {
      id: 'adminPayment',
      icon: <FiDollarSign />,
      label: 'Payment Settings',
      to: '/admin/payment',
      single: true,
      badge: null
    },
    {
      id: 'allGames',
      icon: <FiGrid />,
      label: 'All Games',
      to: '/all-pages',
      single: true,
      badge: null
    },
    /* --- DROPDOWN ONLY FOR USERS --- */
    {
      id: 'users',
      icon: <FiUsers />,
      label: 'User Management',
      single: false,
      badge: '3',
      children: [
        { to: '/users', icon: <FiUsers />, label: 'All Users' },
        { to: '/active-users', icon: <FiUserCheck />, label: 'Active Users' },
        { to: '/inactive-users', icon: <FiUserX />, label: 'Inactive Users' },
      ]
    },
    /* --- FINANCIAL ITEMS AS SINGLE LINKS --- */
    {
      id: 'recharge',
      icon: <FiCreditCard />,
      label: 'Recharge',
      to: '/recharge',
      single: true,
      badge: null
    },
    {
      id: 'totalRecharge',
      icon: <FiBarChart2 />,
      label: 'Total Recharge',
      to: '/total-recharge',
      single: true,
      badge: null
    },
    {
      id: 'rechargeHistory',
      icon: <FiActivity />,
      label: 'Recharge History',
      to: '/recharge-history',
      single: true,
      badge: null
    },
    {
      id: 'betHistory',
      icon: <FiTrendingUp />,
      label: 'Bet History',
      to: '/bet-history',
      single: true,
      badge: null
    }

  ], []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
    setActiveSection(sectionId);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-40 lg:z-30 w-64 lg:w-72
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        border-r border-gray-800 
        bg-gray-900 backdrop-blur-lg
        overflow-y-auto
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      `}>
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700">
                <HiOutlineChartBar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  GameDashboard
                </h2>
                <p className="text-xs text-gray-500">Navigation</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ">


            {/* Navigation */}
            <nav className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Navigation
              </h3>

              {navSections.map((section) => (
                <div key={section.id} className="mb-1">
                  {section.single ? (
                    <NavLink
                      to={section.to}
                      onClick={() => {
                        if (isMobile) setIsMobileOpen(false);
                        setActiveSection(section.id);
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                          ? 'bg-gradient-to-r from-gray-800 to-black text-white border border-gray-700'
                          : 'hover:bg-gray-800/50 text-gray-300'
                        }`
                      }
                      end
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {section.icon}
                        </span>
                        <span className="font-medium">{section.label}</span>
                      </div>
                    </NavLink>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`
                          flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 group
                          ${activeSection === section.id
                            ? 'bg-gray-800/50 text-white border border-gray-700'
                            : 'hover:bg-gray-800/50 text-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {section.icon}
                          </span>
                          <span className="font-medium">{section.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {section.badge && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-800 text-white">
                              {section.badge}
                            </span>
                          )}
                          {expandedSections[section.id] ? (
                            <FiChevronDown className="w-4 h-4" />
                          ) : (
                            <FiChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Submenu */}
                      <div className={`
                        overflow-hidden transition-all duration-200 ml-4
                        ${expandedSections[section.id]
                          ? 'max-h-96 opacity-100 mt-2'
                          : 'max-h-0 opacity-0'
                        }
                      `}>
                        <div className="space-y-1 border-l-2 border-gray-800 pl-4 py-1">
                          {section.children.map((child) => (
                            <NavLink
                              key={child.to}
                              to={child.to}
                              onClick={() => {
                                if (isMobile) setIsMobileOpen(false);
                              }}
                              className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
                                  ? 'bg-gray-800/50 text-white'
                                  : 'hover:bg-gray-800/50 text-gray-400'
                                }`
                              }
                              end
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-base">
                                  {child.icon}
                                </span>
                                <p className="text-sm font-medium">{child.label}</p>
                              </div>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </nav>


            {/* Quick Stats */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <FiDatabase className="mr-2" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-xl border border-gray-800 
                      bg-gradient-to-br ${stat.color}
                      hover:shadow-lg transition-all duration-300
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {stat.icon}
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-white font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-black border border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <FiShield className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm font-semibold text-white">System Status</p>
                  <p className="text-xs text-gray-400">All systems operational</p>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-gray-300 to-white h-1.5 rounded-full w-3/4"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">user </p>
                <p className="text-sm font-medium text-white">{admin?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;