// App.jsx - Updated with better responsive handling
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout/Layout';
import Loader from './components/UI/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminInfo } from './reducer/authSlice';
// Lazy load pages with better loading states
const Login = lazy(() => import('./pages/Auth/Login'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Users = lazy(() => import('./pages/Dashboard/Users'));
const ActiveUsers = lazy(() => import('./pages/Dashboard/ActiveUsers'));
const InactiveUsers = lazy(() => import('./pages/Dashboard/InactiveUsers'));
const UserDetails = lazy(() => import('./pages/Dashboard/UserDetails'));
const Providers = lazy(() => import('./pages/Dashboard/Providers'));
const Games = lazy(() => import('./pages/Dashboard/Games'));
const AllPages = lazy(() => import('./pages/AllPages'));
const Recharge = lazy(() => import('./pages/Dashboard/Recharge'));
const RechargeHistory = lazy(() => import('./pages/Dashboard/RechargeHistory'));
const BetHistory = lazy(() => import('./pages/Dashboard/BetHistory'));
const TotalRecharge = lazy(() => import('./pages/Dashboard/TotalRecharge'));
const AddProvider  = lazy(() => import('./pages/Dashboard/AddProvider'));
const AdminPayment  = lazy(() => import('./pages/Dashboard/AdminPayment'));
const CricketProviderPage = lazy(() => import('./pages/Dashboard/CricketProviderPage'));  



// Enhanced Loader Component
const EnhancedLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, admin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !admin) {
      dispatch(getAdminInfo());
    }
  }, [isAuthenticated, admin, dispatch]);
  
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<EnhancedLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* User Management Routes */}
              <Route path="users" element={<Users />} />
              <Route path="active-users" element={<ActiveUsers />} />
              <Route path="inactive-users" element={<InactiveUsers />} />
              <Route path="user/:id" element={<UserDetails />} />
              <Route path='/admin/payment' element={<AdminPayment/>}/>
              
              {/* Game Management Routes */}
              <Route path="providers" element={<Providers />} />
              <Route path='addprovider' element={<AddProvider/>}/>
              <Route path="provider/:provider" element={<Games />} />
              <Route path="cricket-providers" element={<CricketProviderPage />} />
              <Route path="all-pages" element={<AllPages />} />

               {/* Financial Routes */}
               <Route path="recharge" element={<Recharge />} />
              <Route path="total-recharge" element={<TotalRecharge />} />
              <Route path="recharge-history" element={<RechargeHistory />} />
              <Route path="bet-history" element={<BetHistory />} />
              
              
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;