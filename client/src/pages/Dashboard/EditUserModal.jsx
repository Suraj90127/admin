import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, clearSuccess } from "../../reducer/userAdminSlice";

/* ---------- LABEL COMPONENT ---------- */
const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-400 mb-1">
    {children}
  </label>
);

const EditUserModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, success } = useSelector(
    (state) => state.userAdmin
  );

  const [form, setForm] = useState({
    name: "",
    role: "user",
    balance: 0,
    cricketBalence: 0,
    ipv4_address: "",
    ggr_coust:"",
    domain: "",
    isActive: 1,
  });

  /* ---------- PREFILL DATA ---------- */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        role: user.role || "user",
        balance: user.balance || 0,
        ggr_coust:user.ggr_coust ||0,
        cricketBalence: user.cricketBalence || 0,
        ipv4_address: user.ipv4_address?.join(", ") || "",
        domain: user.domain || "",
        isActive: user.isActive ?? 1,
      });
    }
  }, [user]);

  /* ---------- CLOSE ON SUCCESS ---------- */
  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      onClose();
    }
  }, [success, dispatch, onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(
      updateUser({
        id: user._id,
        data: {
          name: form.name,
          role: form.role,
          ipv4_address: form.ipv4_address,
          domain: form.domain,
          balance: Number(form.balance),
          ggr_coust:Number(form.ggr_coust),
          cricketBalence: Number(form.cricketBalence),
          isActive: Number(form.isActive),
        },
      })
    );
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-fade-in">

        <h2 className="text-xl font-bold text-white mb-6">
          Edit User Details
        </h2>

        {/* ---------- READ ONLY DETAILS ---------- */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Email</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white">
              {user.email}
            </div>
          </div>

          <div>
            <Label>Phone</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white">
              {user.phone}
            </div>
          </div>

          <div>
            <Label>User ID</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white text-xs break-all">
              {user._id}
            </div>
          </div>

          <div>
            <Label>Security Key</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white break-all">
              {user.key}
            </div>
          </div>

          <div>
            <Label>Total GGR</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white">
              {user.totalggr}
            </div>
          </div>

          <div>
            <Label>Today GGR</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white">
              {user.todayggr}
            </div>
          </div>

          <div>
            <Label>Native TGGR</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white">
              {user.nativetggr}
            </div>
          </div>

          <div>
            <Label>Plan Password</Label>
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-white">
              {user.planpassword}
            </div>
          </div>
        </div>

        {/* ---------- EDITABLE FIELDS ---------- */}
        <div className="mb-4">
          <Label>Name</Label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="mb-4">
          <Label>Role</Label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <Label>Main Balance</Label>
          <input
            type="number"
            name="balance"
            value={form.balance}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="mb-4">
          <Label>IPv4 Address</Label>
          <input
            type="text"
            name="ipv4_address"
            value={form.ipv4_address}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>
        <div className="mb-4">
          <Label>Update user GGR coust in %</Label>
          <input
            type="number"
            name="ggr_coust"
            value={form.ggr_coust}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

          <div className="mb-4">
          <Label>Domain</Label>
          <input
            type="text"
            name="domain"
            value={form.domain}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="mb-4">
          <Label>Cricket Balance</Label>
          <input
            type="number"
            name="cricketBalence"
            value={form.cricketBalence}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="mb-6">
          <Label>Status</Label>
          <select
            name="isActive"
            value={form.isActive}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        {/* ---------- ACTION BUTTONS ---------- */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={actionLoading}
            className="px-4 py-2 bg-gradient-to-br from-gray-700 to-black border border-gray-700 text-white rounded-lg"
          >
            {actionLoading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditUserModal;