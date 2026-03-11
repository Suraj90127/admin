import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getAllUsers } from "../../reducer/userAdminSlice";

const ActiveUsers = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const { users = [], loading } = useSelector(
    (state) => state.userAdmin
  );

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ================= ONLY ACTIVE USERS ================= */
  const activeUsers = users.filter(
    (user) => user?.isActive === 1
  );

  /* ================= SEARCH ================= */
  const filteredUsers = activeUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(user.phone).includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Active Users</h1>
        <p className="text-gray-400">
          Total Active Users: {activeUsers.length}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="glass border border-gray-800 rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Name</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Email</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Phone</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Role</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Balance</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Cricket Bal</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Today GGR</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Total GGR</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Demo</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-400">
                  No active users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-white">{user.name}</td>
                  <td className="px-4 py-3 text-gray-300">{user.email}</td>
                  <td className="px-4 py-3 text-gray-300">{user.phone}</td>
                  <td className="px-4 py-3 text-gray-300">{user.role}</td>
                  <td className="px-4 py-3 text-green-400 font-semibold">
                    ₹{user.balance}
                  </td>
                  <td className="px-4 py-3 text-blue-400">
                    ₹{user.cricketBalence}
                  </td>
                  <td className="px-4 py-3 text-yellow-400">
                    ₹{user.todayggr}
                  </td>
                  <td className="px-4 py-3 text-purple-400">
                    ₹{user.totalggr}
                  </td>
                  <td className="px-4 py-3">
                    {user.isdemo === 1 ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/user/${user._id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <FiEye className="mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveUsers;