import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiPackage,
  FiUser,
  FiClock,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getTotalRechargeData } from "../../reducer/rechargeAdminSlice";


import {
  getUserById,
  deleteUser,
  toggleUserStatus,
  clearError,
  clearSuccess,
} from "../../reducer/userAdminSlice";


import {
  fetchUserProviderAccess,
  resetUserProviderAccess,
} from "../../reducer/userProviderAccessSlice";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recharges, loading } = useSelector((state) => state.recharge);
  const {
    loading: accessLoading,
    access: providerAccess,
    error: accessError,
  } = useSelector((state) => state.userProviderAccess);
  
     const { games } = useSelector((state) => state.games);


  const {
    selectedUser: user,
    actionLoading,
    success,
    error,
  } = useSelector((state) => state.userAdmin);

  /* ================= MOCK DATA (can replace with API later) ================= */


  const rechargeHistory = recharges?.filter(
    (item) => item.userId?._id === id
  );

  const betHistory = [
    { id: 1, date: "2024-03-15 14:35", game: "Crash", bet: 100, win: 200, result: "win" },
    { id: 2, date: "2024-03-15 14:20", game: "Limbo", bet: 50, win: 0, result: "loss" },
    { id: 3, date: "2024-03-14 11:05", game: "Roulette", bet: 200, win: 350, result: "win" },
  ];

  /* ================= FETCH USER ================= */
  useEffect(() => {
    if (id) dispatch(getUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getTotalRechargeData());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProviderAccess(id));
    }

    return () => {
      dispatch(resetUserProviderAccess());
    };
  }, [dispatch, id]);


  /* ================= TOAST ================= */
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  if (actionLoading && !user) {
    return <div className="text-center py-20 text-gray-400">Loading user details...</div>;
  }

  if (!user) return null;

  /* ================= SAFE DATA ================= */
  const favoriteProviders = Array.isArray(user?.favoriteProviders)
    ? user?.favoriteProviders
    : [];

  const userGames = games
    .filter((g) => favoriteProviders.includes(g.provider))
    .slice(0, 10);

  /* ================= ACTIONS ================= */
  const handleDelete = async () => {
    if (!window.confirm("Delete this user permanently?")) return;
    await dispatch(deleteUser(user?._id));
    navigate(-1);
  };

  const handleToggleStatus = () => {
    dispatch(toggleUserStatus(user?._id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-lg">
            <FiArrowLeft className="text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-gray-400">User ID: {id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center"
          >
            <FiEdit className="mr-2" />
            {user?.isActive === 1 ? "Deactivate" : "Activate"}
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-red-400 rounded-lg flex items-center"
          >
            <FiTrash2 className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* USER INFO */}
          <div className="glass border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><FiUser className="inline mr-2" /> {user?.name}</div>
              <div><FiMail className="inline mr-2" /> {user?.email}</div>
              <div>Phone: {user?.phone}</div>
              <div>Role: {user?.role}</div>
              <div>
                <FiCalendar className="inline mr-2" />
                {new Date(user?.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* RECHARGE HISTORY */}
          <div className="glass border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FiDollarSign className="mr-2" /> Recharge History
            </h3>

            <div className="w-full">
              {/* ================= DESKTOP TABLE ================= */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800 text-sm">
                  <thead className="bg-gray-900">
                    <tr className="text-gray-400">
                      <th className="text-left py-2 px-2">Created</th>
                      <th className="text-left py-2 px-2">Completed</th>
                      <th className="text-left py-2 px-2">Order ID</th>
                      <th className="text-left py-2 px-2">Email</th>
                      <th className="text-left py-2 px-2">Phone</th>
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-left py-2 px-2">Method</th>
                      <th className="text-left py-2 px-2">Amount</th>
                      <th className="text-left py-2 px-2">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800">
                    {rechargeHistory.map((r) => (
                      <tr key={r.id_order} className="text-gray-200">
                        <td className="py-2 px-2">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>

                        <td className="py-2 px-2">
                          {r.completedAt
                            ? new Date(r.completedAt).toLocaleString()
                            : "-"}
                        </td>

                        <td className="py-2 px-2">{r.id_order}</td>
                        <td className="py-2 px-2">{r.email}</td>
                        <td className="py-2 px-2">{r.phone}</td>
                        <td className="py-2 px-2 capitalize">{r.type}</td>
                        <td className="py-2 px-2 uppercase">{r.method}</td>

                        <td className="py-2 px-2 font-bold text-green-400">
                          ₹{r.money}
                        </td>

                        <td className="py-2 px-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${r.status === 1
                              ? "bg-green-600/20 text-green-400"
                              : "bg-yellow-600/20 text-yellow-400"
                              }`}
                          >
                            {r.status === 1 ? "Success" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ================= MOBILE CARDS ================= */}
              <div className="md:hidden space-y-4">
                {rechargeHistory.map((r) => (
                  <div
                    key={r.id_order}
                    className="border border-gray-800 rounded-xl p-4 bg-gray-900/40"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">
                        {new Date(r?.createdAt).toLocaleString()}
                      </span>

                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${r?.status === 1
                          ? "bg-green-600/20 text-green-400"
                          : "bg-yellow-600/20 text-yellow-400"
                          }`}
                      >
                        {r?.status === 1 ? "Success" : "Pending"}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-200">
                      <p>
                        <span className="text-gray-400">Order ID:</span>{" "}
                        <span className="break-all">{r?.id_order}</span>
                      </p>

                      <p>
                        <span className="text-gray-400">Email:</span> {r?.email}
                      </p>

                      <p>
                        <span className="text-gray-400">Phone:</span> {r?.phone}
                      </p>

                      <p>
                        <span className="text-gray-400">Type:</span>{" "}
                        <span className="capitalize">{r?.type}</span>
                      </p>

                      <p>
                        <span className="text-gray-400">Method:</span>{" "}
                        <span className="uppercase">{r?.method}</span>
                      </p>

                      <p className="text-green-400 font-bold text-lg">
                        ₹{r?.money}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BET HISTORY */}
          <div className="glass border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FiActivity className="mr-2" /> Bet History
            </h3>

            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Game</th>
                  <th className="text-left py-2">Bet</th>
                  <th className="text-left py-2">Win</th>
                  <th className="text-left py-2">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {betHistory.map((b) => (
                  <tr key={b?.id}>
                    <td className="py-2">{b?.date}</td>
                    <td className="py-2">{b?.game}</td>
                    <td className="py-2">₹{b?.bet}</td>
                    <td className="py-2">{b?.win > 0 ? `₹${b?.win}` : "-"}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {b?.result.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* USER PROVIDER ACCESS */}
          <div className="glass border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FiPackage className="mr-2" /> User Provider Access
            </h3>

            {accessLoading && (
              <p className="text-gray-400 text-sm">Loading provider access...</p>
            )}

            {!accessLoading && !providerAccess && (
              <p className="text-gray-500 text-sm">No provider access found</p>
            )}

            {providerAccess && (
              <div className="space-y-4 text-sm">
                {/* BASIC INFO */}
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Access ID</span>
                    <span className="text-gray-400 break-all">
                      {providerAccess?._id || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>User</span>
                    <span className="text-gray-400 break-all">
                      {providerAccess.userId?.name ||
                        providerAccess.userId?.email ||
                        providerAccess.userId?._id ||
                        "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-semibold text-green-400">
                      ₹{providerAccess?.totalAmount ?? 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Paid</span>
                    <span className="font-semibold text-yellow-400">
                      ₹{providerAccess?.totalPayAmount ?? 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Granted At</span>
                    <span>
                      {providerAccess?.grantedAt
                        ? new Date(providerAccess.grantedAt).toLocaleString()
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Created At</span>
                    <span>
                      {providerAccess?.createdAt
                        ? new Date(providerAccess?.createdAt).toLocaleString()
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Updated At</span>
                    <span>
                      {providerAccess?.updatedAt
                        ? new Date(providerAccess.updatedAt).toLocaleString()
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* PROVIDERS LIST */}
                <div className="border-t border-gray-800 pt-3">
                  <p className="text-gray-400 mb-2 flex items-center">
                    <FiClock className="mr-2" />
                    Providers ({providerAccess.providers?.length || 0})
                  </p>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {providerAccess.providers?.length > 0 ? (
                      providerAccess.providers.map((p, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-800/50 rounded px-3 py-2 gap-3"
                        >
                          {/* LEFT: IMAGE + NAME */}
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p?.img || "/placeholder.png"}
                              alt={p?.name || "Provider"}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                              }}
                            />

                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {p?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                Path: {p?.path || "-"}
                              </p>
                            </div>
                          </div>

                          {/* RIGHT: STATUS */}
                          <span
                            className={`text-xs px-2 py-1 rounded shrink-0 ${p?.status === 1
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                              }`}
                          >
                            {p?.status === 1 ? "ACTIVE" : "DISABLED"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-xs">No providers assigned</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GAMES */}
          <div className="glass border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Favorite Games</h3>
            {userGames.map((g) => (
              <div key={g?.id} className="p-2 bg-gray-800/50 rounded mb-2">
                {g?.game_name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;