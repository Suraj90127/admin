import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllCricketProviders,
//   addCricketProvider,
//   updateCricketProvider,
//   deleteCricketProvider,
//   clearCricketState,
// } from "../redux/cricketProviderSlice";
import {
  getAllCricketProviders,
  addCricketProvider,
  updateCricketProvider,
  deleteCricketProvider, 
  clearCricketState,
} from "../../reducer/cricketProviderSlice";

const initialForm = {
  name: "",
  sport: "cricket",
  price: "",
  rating: "",
  gameCount: "",
  img: "",
  features: "",
};

const CricketProviderPage = () => {
  const dispatch = useDispatch();
  const { providers, loading } = useSelector(
    (state) => state.cricketProviders
  );

  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getAllCricketProviders());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      features: formData.features.split(",").map((f) => f.trim()),
    };

    if (editId) {
      dispatch(updateCricketProvider({ id: editId, providerData: payload }));
    } else {
      dispatch(addCricketProvider(payload));
    }

    setFormData(initialForm);
    setEditId(null);
  };

  const handleEdit = (provider) => {
    setEditId(provider._id);
    setFormData({
      ...provider,
      features: provider.features.join(", "),
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteCricketProvider(id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Cricket Providers Admin Panel
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Provider Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
            type="number"
            required
          />
          <input
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-2 rounded"
            type="number"
          />
          <input
            name="gameCount"
            placeholder="Game Count"
            value={formData.gameCount}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="img"
            placeholder="Image URL"
            value={formData.img}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
          <textarea
            name="features"
            placeholder="Features (comma separated)"
            value={formData.features}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editId ? "Update Provider" : "Add Provider"}
          </button>
        </form>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              {provider.img && (
                <img
                  src={provider.img}
                  alt={provider.name}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold text-blue-600">
                  {provider.name}
                </h2>
                <p className="text-gray-600">
                  ₹{provider.price} | ⭐ {provider.rating}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Games: {provider.gameCount}
                </p>

                <ul className="text-sm text-gray-700 mb-3 list-disc pl-5">
                  {provider.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(provider)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(provider._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CricketProviderPage;