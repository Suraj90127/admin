import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* ================= GET ALL CRICKET PROVIDERS ================= */
export const getAllCricketProviders = createAsyncThunk(
  "cricket/getAllProviders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/get-cricket/providers");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cricket providers"
      );
    }
  }
);

/* ================= ADD CRICKET PROVIDER ================= */
export const addCricketProvider = createAsyncThunk(
  "cricket/addProvider",
  async (providerData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/create-cricket/provider",
        providerData
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add cricket provider"
      );
    }
  }
);

/* ================= UPDATE CRICKET PROVIDER ================= */
export const updateCricketProvider = createAsyncThunk(
  "cricket/updateProvider",
  async ({ id, providerData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/update-cricket/provider/${id}`,
        providerData
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update cricket provider"
      );
    }
  }
);

/* ================= DELETE CRICKET PROVIDER ================= */
export const deleteCricketProvider = createAsyncThunk(
  "cricket/deleteProvider",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-cricket/provider/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete cricket provider"
      );
    }
  }
);

/* ================= SLICE ================= */

const cricketProviderSlice = createSlice({
  name: "cricketProviders",

  initialState: {
    providers: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearCricketState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- GET ALL ---------- */
      .addCase(getAllCricketProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCricketProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(getAllCricketProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- ADD ---------- */
      .addCase(addCricketProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCricketProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.providers.unshift(action.payload);
      })
      .addCase(addCricketProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateCricketProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCricketProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.providers = state.providers.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(updateCricketProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteCricketProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCricketProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.providers = state.providers.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deleteCricketProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCricketState } = cricketProviderSlice.actions;
export default cricketProviderSlice.reducer;