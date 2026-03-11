import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector(
    (state) => state.auth
  );

  // 🔒 Not logged in
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return children;
};

export default PrivateRoute;
