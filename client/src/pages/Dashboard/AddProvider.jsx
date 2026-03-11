// src/pages/admin/AddProvider.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProvider, clearProviderState } from "../../reducer/providerSlice";
import toast from "react-hot-toast";

const AddProvider = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.providers
  );

  const [formData, setFormData] = useState({
    provider: "",
    img: "",
    price: "",
    path: "",
    status: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProvider(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Provider added successfully 🚀");

      setFormData({
        provider: "",
        img: "",
        price: "",
        path: "",
        status: 1,
      });

      dispatch(clearProviderState());
    }

    if (error) {
      toast.error(error || "Something went wrong ❌");
      dispatch(clearProviderState());
    }
  }, [success, error, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-6 max-w-xl w-full bg-white rounded shadow text-black">
        <h2 className="text-xl font-bold mb-4">Add Provider</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="provider"
            placeholder="Provider Name"
            value={formData.provider}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded text-black"
          />

          <input
            type="text"
            name="img"
            placeholder="Image URL"
            value={formData.img}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />

          <input
            type="text"
            name="path"
            placeholder="Path"
            value={formData.path}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Provider"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProvider;