import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiFilter, FiDownload, FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  getTotalRechargeData,
  rechargeDuet,
} from "../../reducer/rechargeAdminSlice";

const RechargeHistory = () => {
  const dispatch = useDispatch();

  const { recharges = [], loading } = useSelector(
    (state) => state.recharge
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getTotalRechargeData());
  }, [dispatch]);

  const allRecharges = recharges || [];

  /* ================= STATUS HELPERS ================= */
  const getStatusText = (status) => {
    if (status === 0) return "pending";
    if (status === 1) return "completed";
    if (status === 2) return "failed";
    return "unknown";
  };

  const getStatusColor = (status) => {
    if (status === 1) return "bg-green-700/20 text-green-400";
    if (status === 0) return "bg-yellow-700/20 text-yellow-400";
    if (status === 2) return "bg-red-700/20 text-red-400";
    return "bg-gray-700 text-gray-300";
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return allRecharges.filter((item) => {
      const matchesSearch =
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.phone || "").includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        getStatusText(item.status) === statusFilter;

      const rechargeDate = item.createdAt?.slice(0, 10);

      const matchesDate =
        (!dateFrom || rechargeDate >= dateFrom) &&
        (!dateTo || rechargeDate <= dateTo);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [allRecharges, searchTerm, statusFilter, dateFrom, dateTo]);

  /* ================= ACTION ================= */
  const handleStatusChange = async (id, status) => {
    const actionText = status === 1 ? "Approving" : "Rejecting";
    const successText =
      status === 1
        ? "Recharge completed successfully ✅"
        : "Recharge marked as failed ❌";

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

  const exportToCSV = () => {
    alert("CSV export coming soon");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading recharge history...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Recharge History
          </h1>
          <p className="text-gray-400 text-sm">
            Complete recharge transactions
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white flex items-center"
        >
          <FiDownload className="mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="glass border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Search
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="Email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Date From
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Date To
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between mt-4 text-sm text-gray-400">
          Showing {filteredData.length} of {allRecharges.length}
          <button className="flex items-center gap-2">
            <FiFilter /> Advanced
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass border border-gray-800 rounded-xl overflow-x-auto">
        <table className="min-w-[1200px] divide-y divide-gray-800">
          <thead className="bg-gray-800/50">
            <tr>
              {[
                "Order ID",
                "User",
                "Amount",
                "Method",
                "Reference",
                "Type",
                "Status",
                "Created",
                "Completed",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs text-gray-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {filteredData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-800/40">
                <td className="px-4 py-3 text-gray-300 font-mono">
                  {item.id_order}
                </td>

                <td className="px-4 py-3">
                  <div className="text-white">{item.email || "—"}</div>
                  <div className="text-sm text-gray-400">
                    {item.phone || "—"}
                  </div>
                </td>

                <td className="px-4 py-3 text-white">
                  {item.method === "USDT" ? "$" : "₹"}
                  {item.money.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {item.method}
                </td>

                {/* UTR / TxHash */}
                <td className="px-4 py-3 text-sm">
                  {item.method === "UPI" && (
                    <span className="text-purple-400">
                      {item.utr || "—"}
                    </span>
                  )}
                  {item.method === "USDT" && (
                    <span className="text-blue-400 break-all">
                      {item.txHash || "—"}
                    </span>
                  )}
                  {item.method !== "UPI" &&
                    item.method !== "USDT" && (
                      <span className="text-gray-500">—</span>
                    )}
                </td>

                <td className="px-4 py-3 text-gray-300">
                  {item.type}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusText(item.status)}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-300">
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-gray-300">
                  {item.completedAt
                    ? new Date(item.completedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3 flex gap-2">
                  {item.status === 0 && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(item._id, 1)
                        }
                        className="px-2 py-1 text-xs bg-green-700 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(item._id, 2)
                        }
                        className="px-2 py-1 text-xs bg-red-700 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button className="p-2 text-gray-300">
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RechargeHistory;