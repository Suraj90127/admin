import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiUser,
  FiDownload,
  FiEdit,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedUser,
  getAllUsers,
  getUserById,
} from "../../reducer/userAdminSlice";
import EditUserModal from "./EditUserModal";

const Users = () => {
  const dispatch = useDispatch();

  const { users, loading, selectedUser } = useSelector(
    (state) => state.userAdmin
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openEdit, setOpenEdit] = useState(false);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    if (openEdit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openEdit]);

  /* ================= OPEN / CLOSE MODAL ================= */
  const openEditPopup = (id) => {
    dispatch(getUserById(id));
    setOpenEdit(true);
  };

  const closePopup = () => {
    setOpenEdit(false);
    dispatch(clearSelectedUser());
  };

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive === 1) ||
      (statusFilter === "inactive" && user.isActive === 0);

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive) =>
    isActive === 1
      ? "bg-gray-700 text-white"
      : "bg-gray-600 text-gray-300";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            All Users
          </h1>
          <p className="text-gray-400 mt-1">
            Manage all registered users ({users.length})
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gradient-to-br from-gray-800 to-black border border-gray-700 text-white rounded-lg flex items-center">
            <FiUser className="mr-2" />
            Add User
          </button>

          <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg flex items-center">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Status
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-400">User</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Phone</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Role</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Balance</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Cricket</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Today GGR</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Total GGR</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Demo</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan="10" className="py-6 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-6 text-center text-gray-400">
                  No users found
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

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${user.isActive === 1
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      {user.isActive === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* BALANCE */}
                  <td className="px-4 py-3 text-green-400 font-semibold">
                    ₹{Number(user.balance || 0).toLocaleString()}
                  </td>

                  {/* CRICKET BALANCE */}
                  <td className="px-4 py-3 text-blue-400">
                    ₹{Number(user.cricketBalence || 0).toLocaleString()}
                  </td>

                  {/* TODAY GGR */}
                  <td className="px-4 py-3 text-yellow-400">
                    ₹{Number(user.todayggr || 0).toLocaleString()}
                  </td>

                  {/* TOTAL GGR */}
                  <td className="px-4 py-3 text-purple-400">
                    ₹{Number(user.totalggr || 0).toLocaleString()}
                  </td>

                  {/* DEMO */}
                  <td className="px-4 py-3 text-gray-300">
                    {user.isdemo === 1 ? "Yes" : "No"}
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

                    <button
                      onClick={() => openEditPopup(user._id)}
                      className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center"
                    >
                      <FiEdit className="mr-2" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {openEdit && selectedUser && (
        <EditUserModal user={selectedUser} onClose={closePopup} />
      )}
    </div>
  );
};

export default Users;