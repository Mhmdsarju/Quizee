import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {signupApi,loginApi,refreshApi,otpVerify,verifyForgotOtpApi,forgotPasswordApi,resetPasswordApi,resendForgotOtpApi,} from "../api/authApi";
import api from "../api/axios";

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

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data;
    } catch (error) {
      if (error.response?.data?.code === "ACCOUNT_BLOCKED") {
        return rejectWithValue({
          type: "BLOCKED",
          message: error.response.data.message,
        });
      }

      return rejectWithValue({
        type: "ERROR",
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);


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

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, thunkApi) => {
    try {
      const res = await forgotPasswordApi(data);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyForgotOtp = createAsyncThunk(
  "auth/verifyForgotOtp",
  async (data, thunkApi) => {
    try {
      const res = await verifyForgotOtpApi(data);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, thunkApi) => {
    try {
      const res = await resetPasswordApi(data);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

export const resendForgotOtp = createAsyncThunk(
  "auth/resendForgotOtp",
  async (data, thunkApi) => {
    try {
      const res = await resendForgotOtpApi(data);
      return res.data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    authChecked: false,
    blocked: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
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

  if (action.payload?.type === "BLOCKED") {
    state.blocked = true;
    state.error = action.payload.message;
  } else {
    state.error = action.payload?.message;
  }
})
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
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
  state.loading = true;
})
.addCase(refreshToken.fulfilled, (state, action) => {
  state.loading = false;
  state.accessToken = action.payload.accessToken;
  state.user = action.payload.user;
  state.authChecked = true; // ✅
})
.addCase(refreshToken.rejected, (state) => {
  state.loading = false;
  state.authChecked = true; // ✅ EVEN FAIL
})

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyForgotOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgotOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyForgotOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendForgotOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendForgotOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendForgotOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateUser, setCredentials } = authSlice.actions;
export default authSlice.reducer;
