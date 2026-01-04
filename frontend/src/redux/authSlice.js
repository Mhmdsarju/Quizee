import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signupApi,
  loginApi,
  refreshApi,
  otpVerify
} from "../api/authApi";
import api from "../api/axios";

/* ================= SIGNUP ================= */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signupApi(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= REFRESH ================= */
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await refreshApi();
      return res.data;
    } catch {
      return rejectWithValue(null);
    }
  }
);

/* ================= VERIFY OTP ================= */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, thunkApi) => {
    try {
      const res = await otpVerify(data);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

/* ================= RESEND OTP ✅ ================= */
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, thunkApi) => {
    try {
      const res = await api.post("/auth/resend-otp", data);
      return res.data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    }
  },
  extraReducers: (builder) => {
    builder

      /* signup */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* login */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* refresh */
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })

      /* verify otp */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* resend otp */
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
