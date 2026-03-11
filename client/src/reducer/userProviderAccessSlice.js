// redux/slices/userProviderAccessSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

// 🔹 thunk
export const fetchUserProviderAccess = createAsyncThunk(
  "userProviderAccess/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/user/${userId}`
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch provider access"
      );
    }
  }
);

const userProviderAccessSlice = createSlice({
  name: "userProviderAccess",
  initialState: {
    loading: false,
    access: null,
    error: null,
  },
  reducers: {
    resetUserProviderAccess: (state) => {
      state.loading = false;
      state.access = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProviderAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProviderAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload;
      })
      .addCase(fetchUserProviderAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserProviderAccess } =
  userProviderAccessSlice.actions;

export default userProviderAccessSlice.reducer;