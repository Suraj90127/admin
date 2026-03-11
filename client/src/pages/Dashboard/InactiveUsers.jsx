import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiEye, FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getAllUsers } from "../../reducer/userAdminSlice";

const InactiveUsers = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const { users = [], loading } = useSelector(
    (state) => state.userAdmin
  );

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ================= ONLY INACTIVE USERS ================= */
  const inactiveUsers = users.filter(
    (user) => user?.isActive === 0
  );

  /* ================= SEARCH ================= */
  const filteredUsers = inactiveUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(user.phone).includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Inactive Users
          </h1>
          <p className="text-gray-400 mt-2">
            Total Inactive Users: {inactiveUsers.length}
          </p>
        </div>

        <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg flex items-center">
          <FiSend className="mr-2" />
          Send Reminder
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search inactive users..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-400">User</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Phone</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Role</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Balance</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Cricket</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Demo</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-400">
                  No inactive users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800/40">
                  {/* USER */}
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </td>

                  {/* PHONE */}
                  <td className="px-4 py-3 text-gray-300">
                    {user.phone}
                  </td>

                  {/* ROLE */}
                  <td className="px-4 py-3 text-gray-300 capitalize">
                    {user.role}
                  </td>

                  {/* BALANCE */}
                  <td className="px-4 py-3 text-green-400 font-semibold">
                    ₹{Number(user.balance || 0).toLocaleString()}
                  </td>

                  {/* CRICKET */}
                  <td className="px-4 py-3 text-blue-400">
                    ₹{Number(user.cricketBalence || 0).toLocaleString()}
                  </td>

                  {/* DEMO */}
                  <td className="px-4 py-3 text-gray-300">
                    {user.isdemo === 1 ? "Yes" : "No"}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-400">
                      Inactive
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 flex gap-2">
                    <Link
                      to={`/user/${user._id}`}
                      className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center"
                    >
                      <FiEye className="mr-2" />
                      View
                    </Link>

                    <button className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-300 flex items-center">
                      <FiSend className="mr-2" />
                      Remind
                    </button>
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

export default InactiveUsers;