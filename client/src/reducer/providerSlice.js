import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* ================= GET ALL PROVIDERS ================= */
export const getAllProviders = createAsyncThunk(
  "providers/getAllProviders",
  async (status, { rejectWithValue }) => {
    try {
      const params = {};
      if (status !== undefined) params.status = status;

      const { data } = await api.get("/provider", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch providers"
      );
    }
  }
);

/* ================= ADD PROVIDER ================= */
export const addProvider = createAsyncThunk(
  "providers/addProvider",
  async (providerData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/add-provider", providerData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add provider"
      );
    }
  }
);
export const updateProvider = createAsyncThunk(
  "providers/updateProvider",
  async (providerData, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/update-provider/${providerData.id}`, providerData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add provider"
      );
    }
  }
);

/* ================= UPDATE STATUS ================= */
export const updateProviderStatus = createAsyncThunk(
  "providers/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/active-unactive/provider/${id}`,
        { status }
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

/* ================= SLICE ================= */
const providerSlice = createSlice({
  name: "providers",

  initialState: {
    providers: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearProviderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- GET PROVIDERS ---------- */
      .addCase(getAllProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(getAllProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- ADD PROVIDER ---------- */
      .addCase(addProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.providers.unshift(action.payload); // 👈 instantly show in list
      })
      .addCase(addProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        state.loading = false;  
        state.success = true;
        state.providers = state.providers.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- UPDATE STATUS ---------- */
      .addCase(updateProviderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProviderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.providers = state.providers.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      });
  },
});

export const { clearProviderState } = providerSlice.actions;
export default providerSlice.reducer;