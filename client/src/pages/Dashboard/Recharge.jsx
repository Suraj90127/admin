import { useState, useEffect, useMemo } from "react";
import { 
  FiSearch, FiPlus, FiEye, FiX, FiCheck, FiStar, FiPackage, 
  FiCalendar, FiUser, /* FiDollarSign, */ FiHash, FiCopy, FiClock,
  FiCheckCircle, FiXCircle, FiMail, FiPhone, FiCreditCard,
  FiTag, FiGrid, FiAward, FiTrendingUp, FiUsers, FiList,
  FiChevronRight, FiChevronLeft, FiMoreHorizontal, FiBox,
  FiGlobe, FiCpu, FiZap, FiBookmark, FiThumbsUp, FiThumbsDown,
  FiAlertCircle, FiInfo, FiRefreshCw, FiFilter, FiDownload,
  FiUpload, FiSettings, FiHeart, FiStar as FiStarOutline
} from "react-icons/fi";
import { 
  SiBitcoin 
} from "react-icons/si";
import { 
  GiCricketBat, GiSoccerBall, GiTennisRacket 
} from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  getTotalRechargeData,
  rechargeDuet,
} from "../../reducer/rechargeAdminSlice";

// Helper function to show INR symbol
const INRIcon = ({ size = 14, className = "" }) => (
  <span style={{ fontFamily: "inherit", verticalAlign: "middle", display: "inline-block", fontWeight: 700, fontSize: size, color: "inherit" }} className={className}>₹</span>
);

const Recharge = () => {
  const dispatch = useDispatch();

  const { recharges = [], loading } = useSelector(
    (state) => state.recharge
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecharge, setSelectedRecharge] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateAction, setUpdateAction] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Add loading state for update

  const [newRecharge, setNewRecharge] = useState({
    userId: "",
    money: "",
    method: "zilpay",
    notes: "",
  });


  

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getTotalRechargeData());
  }, [dispatch]);

  const allRecharges = recharges || [];

  /* ================= STATUS HELPERS ================= */
  const getStatusText = (status) => {
    if (status === 0) return "pending";
    if (status === 1) return "approved";
    if (status === 2) return "rejected";
    return "unknown";
  };

  const getStatusColor = (status) => {
    if (status === 1) return "bg-green-700/20 text-green-400 border border-green-700/30";
    if (status === 0) return "bg-yellow-700/20 text-yellow-400 border border-yellow-700/30";
    if (status === 2) return "bg-red-700/20 text-red-400 border border-red-700/30";
    return "bg-gray-700 text-gray-300";
  };

  const getStatusIcon = (status) => {
    if (status === 1) return <FiCheckCircle className="text-green-400" size={14} />;
    if (status === 0) return <FiClock className="text-yellow-400" size={14} />;
    if (status === 2) return <FiXCircle className="text-red-400" size={14} />;
    return <FiAlertCircle className="text-gray-400" size={14} />;
  };

  /* ================= TYPE HELPERS ================= */
  const getTypeIcon = (type) => {
    if (type?.toLowerCase() === 'cricket') return <GiCricketBat className="text-blue-400" size={16} />;
  
    return <FiGrid className="text-gray-400" size={16} />;
  };

  /* ================= METHOD ICON ================= */
  const getMethodIcon = (method) => {
    if (method?.toLowerCase() === 'zilpay') return <FiZap className="text-purple-400" size={14} />;
    if (method?.toLowerCase() === 'usdt') return <SiBitcoin className="text-orange-400" size={14} />;
    if (method?.toLowerCase() === 'upi') return <FiUpload className="text-blue-400" size={14} />;
    return <FiCreditCard className="text-gray-400" size={14} />;
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return allRecharges.filter((item) => {
      const matchesSearch =
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.phone || "").includes(searchTerm) ||
        item._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id_order?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        getStatusText(item.status) === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allRecharges, searchTerm, statusFilter, typeFilter]);

  /* ================= UNIQUE TYPES FOR FILTER ================= */
  const uniqueTypes = useMemo(() => {
    const types = new Set(allRecharges.map(item => item.type).filter(Boolean));
    return Array.from(types);
  }, [allRecharges]);

  /* ================= MODAL HANDLERS ================= */
  const handleViewDetails = (recharge) => {
    setSelectedRecharge(recharge);
    setShowDetailsModal(true);
  };

  // Updated: Don't close view modal when opening update modal
  const handleUpdateClick = (recharge, action) => {
    setSelectedRecharge(recharge);
    setUpdateAction(action);
    setShowUpdateModal(true);
    // Keep showDetailsModal true - don't close it
  };

  // Updated: Handle update confirmation without closing view modal until complete
  const handleUpdateConfirm = async () => {
    if (!selectedRecharge || !updateAction || isUpdating) return;

    setIsUpdating(true);
    const status = updateAction === 'approve' ? 1 : 2;
    const actionText = updateAction === 'approve' ? "Approving" : "Rejecting";
    const successText = updateAction === 'approve' 
      ? "Recharge approved successfully" 
      : "Recharge rejected";

    const toastId = toast.loading(`${actionText} recharge...`);

    try {
      await dispatch(rechargeDuet({ 
        id: selectedRecharge._id, 
        status 
      })).unwrap();

      toast.dismiss(toastId);
      toast.success(successText, {
        icon: updateAction === 'approve' ? '✅' : '❌'
      });
      
      // Close both modals after successful update
      setShowUpdateModal(false);
      setShowDetailsModal(false);
      setSelectedRecharge(null);
      setUpdateAction(null);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err || "Action failed");
    } finally {
      setIsUpdating(false);
    }
  };

  // Updated: Handle update modal close without closing view modal
  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setUpdateAction(null);
    // Keep showDetailsModal true
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard!', {
      icon: '📋'
    });
  };

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    let pending = 0,
      approved = 0,
      rejected = 0,
      cricketCount = 0,
      soccerCount = 0,
      tennisCount = 0;

    allRecharges.forEach((r) => {
      if (r.status === 0) pending += r.money;
      if (r.status === 1) approved += r.money;
      if (r.status === 2) rejected += r.money;
      if (r.type?.toLowerCase() === 'cricket') cricketCount++;
     
    });

    return { 
      pending, 
      approved, 
      rejected,
      cricketCount,
      
      total: pending + approved + rejected 
    };
  }, [allRecharges]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <FiRefreshCw className="animate-spin inline-block w-8 h-8 text-blue-500 mb-4" />
        <div>Loading recharge requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-blue-600/20 p-2 rounded-lg">
              <FiPackage className="text-blue-400" size={24} />
            </span>
            Recharge Management
          </h1>
          <p className="text-gray-400 flex items-center gap-1">
            <FiInfo size={14} />
            Manage recharge requests and provider access
          </p>
        </div>

        {/* <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <FiPlus size={18} />
          Add Recharge
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Pending Amount" 
          value={stats.pending} 
          icon={<FiClock className="text-yellow-400" size={24} />}
          color="yellow"
        />
        <StatCard 
          label="Approved Amount" 
          value={stats.approved} 
          icon={<FiCheckCircle className="text-green-400" size={24} />}
          color="green"
        />
        <StatCard 
          label="Rejected Amount" 
          value={stats.rejected} 
          icon={<FiXCircle className="text-red-400" size={24} />}
          color="red"
        />
        <StatCard
          label="Total Requests"
          value={stats.total}
          icon={<FiList className="text-blue-400" size={24} />}
          color="blue"
          isCount={true}
        />
      </div>

      {/* Type Stats */}
      {/* <div className="grid grid-cols-1">
        <TypeStatCard
          label="Cricket"
          count={stats.cricketCount}
          icon={<GiCricketBat className="text-blue-400" size={20} />}
          color="blue"
        />
        
      </div> */}

      {/* Filters */}
      <div className="glass border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            placeholder="Search email, phone, order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer min-w-[140px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer min-w-[140px]"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass border border-gray-800 rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800/50">
            <tr>
              {[
                "User", "Amount", "Type", "Order ID", "Providers", "Status", "Date", "Actions"
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs text-gray-400 uppercase tracking-wider font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {filteredData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-800/30 transition-colors group">
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <FiUser className="text-blue-400" size={14} />
                    </div>
                    <div>
                      <div className="text-white font-medium flex items-center gap-1">
                        {item.email || "—"}
                        {item.email && <FiMail className="text-gray-500" size={12} />}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <FiPhone size={10} />
                        {item.phone || "—"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-4 py-3">
                  <div className="text-white font-semibold flex items-center gap-1">
                    <INRIcon size={14} className="text-gray-400" />
                    {item.money?.toLocaleString()}
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 rounded-lg w-fit">
                    {getTypeIcon(item.type)}
                    <span className="text-sm text-gray-300">{item.type || "—"}</span>
                  </div>
                </td>

                {/* Order ID */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 font-mono text-sm">
                      {item.id_order?.slice(-8) || "—"}
                    </span>
                    {item.id_order && (
                      <button
                        onClick={() => handleCopy(item.id_order, `order-${item._id}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy Order ID"
                      >
                        <FiCopy size={14} className="text-gray-500 hover:text-gray-300" />
                      </button>
                    )}
                  </div>
                </td>

                {/* Providers */}
                <td className="px-4 py-3">
                  {item.providers && item.providers.length > 0 ? (
                    <div className="flex -space-x-2">
                      {item.providers.slice(0, 3).map((provider, idx) => (
                        <div
                          key={provider._id}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-gray-900 flex items-center justify-center text-xs text-white font-medium hover:scale-110 transition-transform cursor-default"
                          title={provider.name}
                        >
                          {provider.name.charAt(0)}
                        </div>
                      ))}
                      {item.providers.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-300">
                          +{item.providers.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    {getStatusText(item.status)}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-300 text-sm">
                    <FiCalendar size={12} className="text-gray-500" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 ml-5">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                    title="View Details"
                  >
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto text-4xl text-gray-600 mb-3" />
            <p className="text-gray-400">No recharge requests found</p>
          </div>
        )}
      </div>

      {/* Modals - Note the order and conditional rendering */}
      {showDetailsModal && selectedRecharge && (
        <DetailsModal
          recharge={selectedRecharge}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRecharge(null);
          }}
          onUpdate={handleUpdateClick}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getStatusIcon={getStatusIcon}
          getTypeIcon={getTypeIcon}
          getMethodIcon={getMethodIcon}
          onCopy={handleCopy}
          copiedId={copiedId}
          showUpdateModal={showUpdateModal} // Pass this to conditionally show update modal
        />
      )}

      {/* Update Modal - Rendered separately but controlled by state */}
      {showUpdateModal && selectedRecharge && updateAction && (
        <UpdateModal
          recharge={selectedRecharge}
          action={updateAction}
          onConfirm={handleUpdateConfirm}
          onClose={handleUpdateModalClose}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

/* ================= DETAILS MODAL ================= */
const DetailsModal = ({ 
  recharge, 
  onClose, 
  onUpdate, 
  getStatusColor, 
  getStatusText, 
  getStatusIcon, 
  getTypeIcon, 
  getMethodIcon, 
  onCopy, 
  copiedId,
  showUpdateModal // New prop to know if update modal is open
}) => {
  if (!recharge) return null;

  // Handle update button click without closing details modal
  const handleUpdateButtonClick = (action) => {
    onUpdate(recharge, action);
    // Don't close details modal
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                {getTypeIcon(recharge.type)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Recharge Details</h2>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <FiHash size={12} />
                  Order ID: {recharge.id_order}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled={showUpdateModal} // Disable close button when update modal is open
            >
              <FiX size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-end">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                recharge.status
              )}`}
            >
              {getStatusIcon(recharge.status)}
              {getStatusText(recharge.status)}
            </span>
          </div>

          {/* User Information Card */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <FiUser className="text-blue-400" size={16} />
              User Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailItem 
                label="User ID" 
                value={recharge.userId} 
                icon={<FiHash size={14} />} 
              />
              <DetailItem 
                label="Email" 
                value={recharge.email} 
                icon={<FiMail size={14} />} 
              />
              <DetailItem 
                label="Phone" 
                value={recharge.phone} 
                icon={<FiPhone size={14} />} 
              />
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <FiPackage className="text-purple-400" size={16} />
              Transaction Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailItem 
                label="Amount" 
                value={<><INRIcon size={14} className="text-gray-400" />{recharge.money?.toLocaleString()}</>} 
                icon={<INRIcon size={14} className="text-gray-400" />} 
              />
              <DetailItem 
                label="Method" 
                value={
                  <div className="flex items-center gap-1">
                    {getMethodIcon(recharge.method)}
                    {recharge.method}
                  </div>
                } 
                icon={<FiCreditCard size={14} />} 
              />
              <DetailItem 
                label="Type" 
                value={
                  <div className="flex items-center gap-1">
                    {getTypeIcon(recharge.type)}
                    {recharge.type}
                  </div>
                } 
                icon={<FiTag size={14} />} 
              />
              <DetailItem 
                label="Date" 
                value={new Date(recharge.createdAt).toLocaleString()} 
                icon={<FiCalendar size={14} />}
              />
            </div>
          </div>

          {/* Months Details */}
          {typeof recharge.months === "number" && (
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <FiCalendar className="text-blue-400" size={16} />
                Remaining Months
              </h3>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                <span className="text-gray-400 flex items-center gap-1">
                  <FiStarOutline size={12} />
                  Months:
                </span>
                <span className="text-blue-400 font-mono">{recharge.months}</span>
              </div>
            </div>
          )}

          {/* Providers Section */}
          {recharge.providers && recharge.providers.length > 0 && (
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <FiPackage className="text-green-400" size={16} />
                Providers Access ({recharge.providers.length})
              </h3>
              <div className="grid gap-3">
                {recharge.providers.map((provider) => (
                  <ProviderCard key={provider._id} provider={provider} />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {recharge.notes && (
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <FiBookmark className="text-yellow-400" size={16} />
                Notes
              </h3>
              <p className="text-gray-300">{recharge.notes}</p>
            </div>
          )}

          {/* Admin Actions for Pending */}
          {recharge.status === 0 && (
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleUpdateButtonClick('approve')}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={showUpdateModal} // Disable when update modal is open
              >
                <FiCheckCircle size={18} />
                Approve Recharge
              </button>
              <button
                onClick={() => handleUpdateButtonClick('reject')}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={showUpdateModal} // Disable when update modal is open
              >
                <FiXCircle size={18} />
                Reject Recharge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= PROVIDER CARD COMPONENT ================= */
const ProviderCard = ({ provider }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const displayedFeatures = showAllFeatures ? provider.features : provider.features?.slice(0, 3);

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500/30 transition-all">
      <div className="flex items-start gap-3">
        <img 
          src={provider.img} 
          alt={provider.name}
          className="w-16 h-16 rounded-lg object-cover bg-gray-700"
          onError={(e) => e.target.src = 'https://via.placeholder.com/64?text=API'}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold flex items-center gap-1">
              <FiAward className="text-yellow-400" size={16} />
              {provider.name}
            </h4>
            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs flex items-center gap-1">
              <FiTrendingUp size={12} />
              {provider.sport}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <FiStar className="fill-yellow-400" size={14} />
              <span>{provider.rating}</span>
            </div>
            <div className="text-gray-400 flex items-center gap-1">
              <INRIcon size={12} className="text-gray-400" />
              {provider.price}
            </div>
            <div className="text-gray-400 flex items-center gap-1">
              <FiPackage size={12} />
              {provider.gameCount}
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <FiList size={12} />
              Features:
            </div>
            <div className="flex flex-wrap gap-1">
              {displayedFeatures?.map((feature, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-700 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                  <FiCheck size={10} className="text-green-400" />
                  {feature}
                </span>
              ))}
              {provider.features?.length > 3 && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="px-2 py-1 bg-gray-700 rounded-lg text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1"
                >
                  {showAllFeatures ? (
                    <>Show Less <FiChevronLeft size={12} /></>
                  ) : (
                    <>+{provider.features.length - 3} more <FiChevronRight size={12} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= UPDATE MODAL ================= */
const UpdateModal = ({ recharge, action, onConfirm, onClose, isUpdating }) => {
  const isApprove = action === 'approve';
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full ${
              isApprove ? 'bg-green-600/20' : 'bg-red-600/20'
            }`}>
              {isApprove ? 
                <FiCheckCircle size={32} className="text-green-400" /> : 
                <FiXCircle size={32} className="text-red-400" />
              }
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white text-center mb-2">
            {isApprove ? 'Approve Recharge' : 'Reject Recharge'}
          </h3>
          
          <p className="text-gray-400 text-center mb-6">
            Are you sure you want to {isApprove ? 'approve' : 'reject'} this recharge?
          </p>

          <div className="bg-gray-800/30 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1">
                <INRIcon size={14} className="text-gray-400" />
                Amount:
              </span>
              <span className="text-white font-semibold"><INRIcon size={14} className="text-gray-400" />{recharge.money?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1">
                <FiUser size={14} />
                User:
              </span>
              <span className="text-white">{recharge.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1">
                <FiTag size={14} />
                Type:
              </span>
              <span className="text-white">{recharge.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1">
                <FiHash size={14} />
                Order ID:
              </span>
              <span className="text-white font-mono text-sm">{recharge.id_order}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              <FiX size={18} />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isApprove 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
              }`}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <FiRefreshCw size={18} className="animate-spin" />
              ) : isApprove ? (
                <FiCheckCircle size={18} />
              ) : (
                <FiXCircle size={18} />
              )}
              {isUpdating ? 'Processing...' : `Confirm ${isApprove ? 'Approve' : 'Reject'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= DETAIL ITEM ================= */
const DetailItem = ({ label, value, icon }) => (
  <div>
    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
      {icon}  {label}
    </div>
    <div className="text-white font-medium ">{value || "—"}</div>
  </div>
);

/* ================= STAT CARD ================= */
const StatCard = ({ label, value, icon, color, isCount = false }) => {
  const colors = {
    yellow: 'from-yellow-600/20 to-yellow-700/20 border-yellow-700/30',
    green: 'from-green-600/20 to-green-700/20 border-green-700/30',
    red: 'from-red-600/20 to-red-700/20 border-red-700/30',
    blue: 'from-blue-600/20 to-purple-600/20 border-blue-700/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-white">
            {isCount ? value : <><INRIcon size={18} className="text-gray-400" />{value.toLocaleString()}</>}
          </div>
          <div className="text-gray-400 text-sm mt-1 flex items-center gap-1">
            {icon}
            {label}
          </div>
        </div>
        <div className="text-3xl opacity-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

/* ================= TYPE STAT CARD ================= */
const TypeStatCard = ({ label, count, icon, color }) => {
  const colors = {
    blue: 'bg-blue-600/20 border-blue-700/30',
    green: 'bg-green-600/20 border-green-700/30',
    yellow: 'bg-yellow-600/20 border-yellow-700/30'
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4 backdrop-blur-sm flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-gray-300">{label}</span>
      </div>
      <span className="text-white font-bold">{count}</span>
    </div>
  );
};

export default Recharge;


