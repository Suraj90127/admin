import { useEffect, useMemo } from "react";
import { FiBarChart2 } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  getTotalRechargeData,
  rechargeDuet,
} from "../../reducer/rechargeAdminSlice";

const COLORS = ["#22c55e", "#facc15", "#ef4444", "#6b7280"];

const TotalRecharge = () => {
  const dispatch = useDispatch();
  const { recharges = [], loading } = useSelector(
    (state) => state.recharge
  );

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getTotalRechargeData());
  }, [dispatch]);

  const allRecharges = recharges || [];

  /* ================= ACTION ================= */
  const handleStatusChange = async (id, status) => {
    const actionText = status === 1 ? "Approving" : "Rejecting";
    const successText =
      status === 1
        ? "Recharge approved successfully ✅"
        : "Recharge rejected ❌";

    const toastId = toast.loading(`${actionText} recharge...`);

    try {
      await dispatch(rechargeDuet({ id, status })).unwrap();

      toast.dismiss(toastId);
      toast.success(successText);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err || "Action failed ❌");
    }
  };
  /* ================= STATS ================= */
  const totalAmount = allRecharges.reduce(
    (sum, r) => sum + Number(r.money || 0),
    0
  );

  const todayAmount = allRecharges
    .filter(
      (r) =>
        new Date(r.createdAt).toDateString() ===
        new Date().toDateString()
    )
    .reduce((sum, r) => sum + Number(r.money || 0), 0);

  const transactions = allRecharges.length;
  const avgAmount =
    transactions > 0 ? Math.round(totalAmount / transactions) : 0;

  /* ================= MONTHLY DATA ================= */
  const monthlyData = useMemo(() => {
    const map = {};
    allRecharges.forEach((r) => {
      const month = new Date(r.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!map[month]) {
        map[month] = { month, amount: 0, users: 0 };
      }

      map[month].amount += Number(r.money || 0);
      map[month].users += 1;
    });

    return Object.values(map);
  }, [allRecharges]);

  /* ================= METHOD PIE ================= */
  const methodData = useMemo(() => {
    const map = {};
    allRecharges.forEach((r) => {
      const key = r.method || "unknown";
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [allRecharges]);

  /* ================= STATUS PIE ================= */
  const statusDuet = useMemo(() => {
    const map = {
      1: { status: "Success", count: 0 },
      0: { status: "Pending", count: 0 },
      2: { status: "Failed", count: 0 },
    };

    allRecharges.forEach((r) => {
      const s = Number(r.status);
      if (map[s]) map[s].count += 1;
    });

    return Object.values(map);
  }, [allRecharges]);

  /* ================= TOP USERS ================= */
  const topUsers = useMemo(() => {
    return [...allRecharges]
      .sort((a, b) => Number(b.money) - Number(a.money))
      .map((r) => ({
        _id: r._id,
        email: r.email,
        phone: r.phone,
        amount: Number(r.money),
        status: r.status,
        method: r.method,
        utr: r.utr,
        txHash: r.txHash,
      }));
  }, [allRecharges]);

  /* ================= UI ================= */
  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold text-white">
        Total Recharge Analytics
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat value={`₹${totalAmount.toLocaleString()}`} label="Total Recharge" />
        <Stat value={`₹${todayAmount.toLocaleString()}`} label="Today" />
        <Stat value={`₹${avgAmount}`} label="Avg / Tx" />
        <Stat value={transactions} label="Transactions" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MONTHLY LINE */}
        <div className="glass border border-gray-800 rounded-xl p-4 sm:p-6 h-[260px] sm:h-[320px] lg:h-80 lg:col-span-2">
          <h3 className="text-white mb-3 flex items-center">
            <FiBarChart2 className="mr-2" /> Monthly Trend
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line dataKey="amount" stroke="#22c55e" strokeWidth={2} />
              <Line dataKey="users" stroke="#facc15" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* STATUS PIE */}
        <div className="glass border border-gray-800 rounded-xl p-4 sm:p-6 h-[260px] sm:h-[320px]">
          <h3 className="text-white mb-3">Recharge Status</h3>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDuet}
                dataKey="count"
                nameKey="status"
                outerRadius={80}
                label
              >
                {statusDuet.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PAYMENT METHOD */}
      <div className="glass border border-gray-800 rounded-xl p-4 sm:p-6 h-[260px] sm:h-[320px]">
        <h3 className="text-white mb-3">Payment Methods</h3>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={methodData} dataKey="value" outerRadius={90} label>
              {methodData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* TOP RECHARGES TABLE */}
      <div className="glass border border-gray-800 rounded-xl p-4 sm:p-6 overflow-x-auto">
        <h3 className="text-white mb-4">Top Recharges</h3>

        <table className="min-w-[900px] w-full divide-y divide-gray-800">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {topUsers.map((u, i) => (
              <tr key={u._id} className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-white">#{i + 1}</td>

                <td className="px-4 py-3 text-white">
                  {u.email || "—"}
                  <div className="text-xs text-gray-500">{u.phone || "—"}</div>
                </td>

                <td className="px-4 py-3 text-white">
                  {u.method === "USDT" ? "$" : "₹"}
                  {u.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {u.method}
                </td>

                {/* UTR / TxHash */}
                <td className="px-4 py-3 text-sm">
                  {u.method === "UPI" && (
                    <span className="text-purple-400">
                      {u.utr || "—"}
                    </span>
                  )}
                  {u.method === "USDT" && (
                    <span className="text-blue-400 break-all">
                      {u.txHash || "—"}
                    </span>
                  )}
                  {u.method !== "UPI" && u.method !== "USDT" && (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                <td className="px-4 py-3 text-sm font-medium">
                  {u.status === 1 && <span className="text-green-400">Success</span>}
                  {u.status === 0 && <span className="text-yellow-400">Pending</span>}
                  {u.status === 2 && <span className="text-red-400">Failed</span>}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(u._id, 1)}
                      className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(u._id, 2)}
                      className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center text-gray-400">
          Loading analytics...
        </div>
      )}
    </div>
  );
};

/* ===== STAT CARD ===== */
const Stat = ({ value, label }) => (
  <div className="glass border border-gray-800 rounded-xl p-4 sm:p-6">
    <div className="text-xl sm:text-2xl font-bold text-white">
      {value}
    </div>
    <div className="text-gray-400 text-xs sm:text-sm mt-1">
      {label}
    </div>
  </div>
);

export default TotalRecharge;