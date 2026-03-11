import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAdminPayment,
  clearSuccess,
} from "../../reducer/userAdminSlice";
import { FiSave, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminPayment = () => {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    usdtAddress: "",
    upi: "",
  });

  const [usdtImage, setUsdtImage] = useState(null);

  /* =====================
     Input Handlers
  ====================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setUsdtImage(e.target.files[0]);
  };

  /* =====================
     Submit
  ====================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("usdtAddress", formData.usdtAddress);
    data.append("upi", formData.upi);

    if (usdtImage) {
      data.append("usdtImage", usdtImage); // 🔑 backend field name
    }

    dispatch(updateAdminPayment(data));
  };

  /* =====================
     Toast Handling
  ====================== */
  useEffect(() => {
    if (success) {
      toast.success("Payment details updated successfully 💰");
      dispatch(clearSuccess());
    }

    if (error) {
      toast.error(error || "Failed to update payment details ❌");
    }
  }, [success, error, dispatch]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-black text-center">
        Admin Payment Settings
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-5 space-y-4"
      >
        {/* USDT Address */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black text-center">
            USDT Address (TRC20)
          </label>
          <input
            type="text"
            name="usdtAddress"
            value={formData.usdtAddress}
            onChange={handleChange}
            placeholder="Enter USDT address"
            className="w-full border rounded px-3 py-2 text-center text-black focus:outline-none focus:ring"
          />
        </div>

        {/* UPI */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black text-center">
            UPI ID
          </label>
          <input
            type="text"
            name="upi"
            value={formData.upi}
            onChange={handleChange}
            placeholder="admin@upi"
            className="w-full border rounded px-3 py-2 text-center text-black focus:outline-none focus:ring"
          />
        </div>

        {/* USDT Image */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black text-center">
            USDT QR Image
          </label>

          <div className="flex items-center gap-2 justify-center">
            <FiImage className="text-gray-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          {usdtImage && (
            <p className="text-xs text-center mt-1 text-gray-600">
              Selected: {usdtImage.name}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          <FiSave />
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default AdminPayment;