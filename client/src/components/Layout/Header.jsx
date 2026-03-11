import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiMenu, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { HiOutlineDesktopComputer, HiOutlineSearch } from 'react-icons/hi';
import { RiDashboardLine } from 'react-icons/ri';
import { useTheme } from '../../contexts/ThemeContext';
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from '../../reducer/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";



const Header = ({ toggleSidebar, isMobile }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { admin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-dropdown') && !event.target.closest('.user-menu-button')) {
        setUserMenuOpen(false);
      }
      if (!event.target.closest('.notifications-dropdown') && !event.target.closest('.notifications-button')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await dispatch(adminLogout()).unwrap();

      toast.dismiss(toastId);
      toast.success("Logged out successfully 👋");

      navigate("/login");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Logout failed ❌");
    }
  };

  const themes = [
    { name: 'light', icon: <FiSun className="w-4 h-4" />, label: 'Light' },
    { name: 'dark', icon: <FiMoon className="w-4 h-4" />, label: 'Dark' },
  ];

  const notifications = [
    { id: 1, text: 'New user registered', time: '2 min ago', unread: true },
    { id: 2, text: 'System update completed', time: '1 hour ago', unread: true },
    { id: 3, text: 'Monthly report ready', time: '2 hours ago', unread: false },
  ];

  const UserMenuDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-gray-900 rounded-xl shadow-lg border border-gray-800 py-2 z-50 animate-fade-in user-menu-dropdown">
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="font-semibold text-white text-sm sm:text-base">
          {admin?.name || "Admin"}
        </p>
        <p className="text-xs sm:text-sm text-gray-400 truncate">
          {admin?.email}
        </p>

      </div>

      <div className="py-1">
        <button className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-800 transition-colors flex items-center space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base">
          <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>My Profile</span>
        </button>
        <button className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-800 transition-colors flex items-center space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base">
          <FiSettings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Settings</span>
        </button>
        <div className="border-t border-gray-800 my-1"></div>
        <button
          onClick={handleLogout}
          className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-800 transition-colors flex items-center space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base"
        >
          <FiLogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const NotificationsDropdown = () => (
    <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-gray-900 rounded-xl shadow-lg border border-gray-800 py-2 z-50 notifications-dropdown">
      <div className="px-4 py-2 border-b border-gray-800">
        <h3 className="font-semibold text-white text-sm sm:text-base">Notifications</h3>
      </div>
      <div className="max-h-64 sm:max-h-72 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-800 transition-colors ${notification.unread ? 'bg-gray-800/50' : ''
              }`}
          >
            <p className="text-xs sm:text-sm text-white">{notification.text}</p>
            <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">{notification.time}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-gray-800">
        <button className="text-xs sm:text-sm text-gray-300 hover:text-white">
          View all notifications →
        </button>
      </div>
    </div>
  );

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-40 
      transition-all duration-300
      ${scrolled
        ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-800'
        : 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800/50'
      }
    `}>
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={toggleSidebar}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700">
                <RiDashboardLine className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">
                  GameDashboard
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Center Search - Desktop */}
          {/* {!isMobile && (
            <div className="flex-1 max-w-xl mx-3 md:mx-4 hidden lg:block">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search users, games, reports..."
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-800/50 rounded-xl border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-300 text-white placeholder-gray-500"
                />
              </div>
            </div>
          )} */}

          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Mobile Search Toggle */}
            {/* {isMobile && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                aria-label="Search"
              >
                <HiOutlineSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              </button>
            )} */}

            {/* Theme Toggle - Desktop */}
            {/* <div className="hidden sm:flex items-center space-x-1 bg-gray-800 rounded-lg sm:rounded-xl p-1">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => toggleTheme(t.name)}
                  className={`
                    p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors duration-300
                    ${theme === t.name
                      ? 'bg-gray-700 border border-gray-600'
                      : 'hover:bg-gray-700/50'
                    }
                  `}
                  title={t.label}
                >
                  <span className={`
                    ${theme === t.name 
                      ? 'text-white' 
                      : 'text-gray-400'
                    }
                  `}>
                    {t.icon}
                  </span>
                </button>
              ))}
            </div> */}

            {/* Mobile Theme Toggle */}
            {/* <button
              onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
              className="sm:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              ) : (
                <FiMoon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              )}
            </button> */}

            {/* Help - Desktop */}
            <button
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 hidden md:block"
              aria-label="Help"
            >
              <FiHelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 relative notifications-button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                aria-label="Notifications"
              >
                <FiBell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
              </button>

              {notificationsOpen && <NotificationsDropdown />}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 user-menu-button"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center">
                    <FiUser className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                </div>
                {!isMobile && (
                  <div className="text-left hidden lg:block">
                    <p className="text-xs sm:text-sm font-semibold text-gray-300">{admin?.name}</p>
                  </div>
                )}
              </button>

              {userMenuOpen && <UserMenuDropdown />}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {/* {searchOpen && isMobile && (
          <div className="mt-2 animate-fade-in">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-800/50 rounded-xl border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600 text-white placeholder-gray-500"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Header;