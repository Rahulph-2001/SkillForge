import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  authService,
  type SignupRequest,
  type SignupResponse,
  type LoginRequest,
  type LoginResponse,
  type VerifyOtpResponse,
} from '../../services/authService';
import { type ApiErrorPayload, getErrorMessage, extractRejectedMessage } from '../../utils/errorUtils';

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
    avatar?: string | null;
    subscriptionPlan?: string;
    verification: {
      email_verified: boolean;
    };
  } | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  pendingVerificationEmail: string | null;
  otpResending: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
  pendingVerificationEmail: null,
  otpResending: false,
};


export const signup = createAsyncThunk<
  SignupResponse,
  SignupRequest,
  { rejectValue: ApiErrorPayload }
>(
  'auth/signup',
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(signupData);
      return response;
    } catch (error: unknown) {
      console.error('Signup error:', error);
      const axiosLike = error as { code?: string; response?: { data?: ApiErrorPayload } };
      if (axiosLike.code === 'ERR_NETWORK') {
        return rejectWithValue({
          success: false,
          error: 'Cannot connect to server. Please check if the backend is running.',
        });
      }
      return rejectWithValue(
        axiosLike.response?.data ?? { success: false, error: getErrorMessage(error) }
      );
    }
  }
);


export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: ApiErrorPayload }
>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      return response;
    } catch (error: unknown) {
      console.error('Login error:', error);
      const axiosLike = error as { code?: string; response?: { data?: ApiErrorPayload } };
      if (axiosLike.code === 'ERR_NETWORK') {
        return rejectWithValue({
          success: false,
          error: 'Cannot connect to server. Please check if the backend is running.',
        });
      }
      if (axiosLike.code === 'ECONNABORTED') {
        return rejectWithValue({
          success: false,
          error: 'Request timeout. Please try again.',
        });
      }
      return rejectWithValue(
        axiosLike.response?.data ?? { success: false, error: getErrorMessage(error) }
      );
    }
  }
);

// Async thunk for admin login
export const adminLogin = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: ApiErrorPayload }
>(
  'auth/adminLogin',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.adminLogin(loginData);
      return response;
    } catch (error: unknown) {
      const axiosLike = error as { response?: { data?: ApiErrorPayload } };
      return rejectWithValue(
        axiosLike.response?.data ?? { success: false, error: getErrorMessage(error) }
      );
    }
  }
);

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse,
  { email: string; code: string },
  { rejectValue: ApiErrorPayload }
>(
  'auth/verifyOtp',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(email, code);
      return response;
    } catch (error: unknown) {
      const axiosLike = error as { response?: { data?: ApiErrorPayload } };
      return rejectWithValue(
        axiosLike.response?.data ?? { success: false, error: getErrorMessage(error) }
      );
    }
  }
);

// Async thunk for resend OTP
export const resendOtp = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: ApiErrorPayload }
>(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(email);
      return response;
    } catch (error: unknown) {
      const axiosLike = error as { response?: { data?: ApiErrorPayload } };
      return rejectWithValue(
        axiosLike.response?.data ?? { success: false, error: getErrorMessage(error) }
      );
    }
  }
);

// Async thunk for Google OAuth callback
export const googleAuth = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: ApiErrorPayload }
>(
  'auth/googleAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.googleAuthCallback();
      return response;
    } catch (error: unknown) {
      const axiosLike = error as { response?: { data?: ApiErrorPayload } };
      return rejectWithValue(
        axiosLike.response?.data ?? { success: false, error: getErrorMessage(error) }
      );
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiErrorPayload }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: unknown) {
      const axiosLike = error as { response?: { data?: ApiErrorPayload } };
      return rejectWithValue(
        axiosLike.response?.data ?? { success: false, error: getErrorMessage(error) }
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    resetAuth: (state) => {
      state.user = null
      state.loading = false
      state.error = null
      state.successMessage = null
      state.pendingVerificationEmail = null
    },
    // Reset transient UI states (called after rehydration)
    resetTransientStates: (state) => {
      state.loading = false
      state.error = null
      state.successMessage = null
      state.otpResending = false
    },
    // Handle 401 errors - clear user data
    handleUnauthorized: (state) => {
      state.user = null
      state.error = 'Session expired. Please login again.'
      state.loading = false
    },
    // Update user avatar after profile update
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload
      }
    },
    // Update user subscription after successful payment
    updateSubscription: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.subscriptionPlan = action.payload
      }
    },
    // Update user balance (credits and wallet) from WebSocket events
    updateUserBalance: (state, action: PayloadAction<{ credits: number; walletBalance?: number }>) => {
      if (state.user) {
        state.user.credits = action.payload.credits
        console.log('[Redux] User balance updated:', action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<SignupResponse>) => {
        state.loading = false
        state.successMessage = action.payload.data.message
        state.pendingVerificationEmail = action.payload.data.email
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = extractRejectedMessage(action.payload, 'Registration failed');
        state.successMessage = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = extractRejectedMessage(action.payload, 'Login failed');
        state.successMessage = null;
      })
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = extractRejectedMessage(action.payload, 'Admin login failed');
        state.successMessage = null;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<VerifyOtpResponse>) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.successMessage = action.payload.data.message;
        state.pendingVerificationEmail = null;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = extractRejectedMessage(action.payload, 'OTP verification failed');
      })
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.otpResending = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.otpResending = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.otpResending = false;
        state.error = extractRejectedMessage(action.payload, 'Failed to resend OTP');
      })
      // Google Auth
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.error = null;
        state.successMessage = 'Successfully signed in with Google!';
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = extractRejectedMessage(action.payload, 'Google authentication failed');
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.successMessage = null;
        state.pendingVerificationEmail = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Even if logout fails, clear user data
        state.user = null;
        state.error = null;
        state.successMessage = null;
        state.pendingVerificationEmail = null;
      });
  },
});

export const { clearError, clearSuccessMessage, resetAuth, resetTransientStates, handleUnauthorized, updateUserAvatar, updateSubscription, updateUserBalance } = authSlice.actions
export default authSlice.reducer
