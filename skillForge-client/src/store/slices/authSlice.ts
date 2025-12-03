import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  authService,
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  VerifyOtpResponse,
  ApiError
} from '../../services/authService';

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
    avatar?: string | null;
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

// Async thunk for signup
export const signup = createAsyncThunk<
  SignupResponse,
  SignupRequest,
  { rejectValue: ApiError }
>(
  'auth/signup',
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(signupData);
      return response;
    } catch (error: any) {
      console.error('Signup error:', error);
      // Handle network errors
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue({ 
          success: false, 
          error: 'Cannot connect to server. Please check if the backend is running.' 
        });
      }
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: ApiError }
>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle network errors
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue({ 
          success: false, 
          error: 'Cannot connect to server. Please check if the backend is running.' 
        });
      }
      // Handle timeout errors
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue({ 
          success: false, 
          error: 'Request timeout. Please try again.' 
        });
      }
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for admin login
export const adminLogin = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: ApiError }
>(
  'auth/adminLogin',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.adminLogin(loginData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse,
  { email: string; code: string },
  { rejectValue: ApiError }
>(
  'auth/verifyOtp',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(email, code);
      return response;
    } catch (error: any) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for resend OTP
export const resendOtp = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: ApiError }
>(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for Google OAuth callback
export const googleAuth = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: ApiError }
>(
  'auth/googleAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.googleAuthCallback();
      return response;
    } catch (error: any) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error as ApiError);
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
        // Don't set user yet - wait for OTP verification
        state.successMessage = action.payload.data.message
        state.pendingVerificationEmail = action.payload.data.email
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;

        // Extract error message - authService already extracts error.response?.data
        const error: any = action.payload || action.error;

        // Direct error property from API response - ensure it's a string
        if (error?.error) {
          state.error = typeof error.error === 'string' ? error.error : error.error?.message || 'Registration failed';
        } else if (error?.details && Array.isArray(error.details) && error.details.length > 0) {
          // Format validation errors
          state.error = error.details.map((detail: { field: string; message: string }) => detail.message).join(', ');
        } else if (error?.message) {
          state.error = error.message;
        } else {
          state.error = 'Registration failed';
        }

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
        const error: any = action.payload || action.error;

        if (error?.details && Array.isArray(error.details) && error.details.length > 0) {
          state.error = error.details.map((detail: { field: string; message: string }) => detail.message).join(', ');
        } else if (error?.error) {
          state.error = typeof error.error === 'string' ? error.error : error.error?.message || 'Login failed';
        } else if (error?.message) {
          state.error = error.message;
        } else {
          state.error = 'Login failed';
        }
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
        const error: any = action.payload || action.error;

        if (error?.details && Array.isArray(error.details) && error.details.length > 0) {
          state.error = error.details.map((detail: { field: string; message: string }) => detail.message).join(', ');
        } else if (error?.error) {
          state.error = typeof error.error === 'string' ? error.error : error.error?.message || 'Admin login failed';
        } else if (error?.message) {
          state.error = error.message;
        } else {
          state.error = 'Admin login failed';
        }
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
        const error: any = action.payload || action.error;

        if (error?.details && Array.isArray(error.details) && error.details.length > 0) {
          state.error = error.details.map((detail: { field: string; message: string }) => detail.message).join(', ');
        } else if (error?.error) {
          state.error = typeof error.error === 'string' ? error.error : error.error?.message || 'OTP verification failed';
        } else if (error?.message) {
          state.error = error.message;
        } else {
          state.error = 'OTP verification failed';
        }
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
        const error: any = action.payload || action.error;

        if (error?.error) {
          state.error = typeof error.error === 'string' ? error.error : error.error?.message || 'Failed to resend OTP';
        } else if (error?.message) {
          state.error = error.message;
        } else {
          state.error = 'Failed to resend OTP';
        }
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
        const error: any = action.payload || action.error;

        if (error?.error) {
          state.error = typeof error.error === 'string' ? error.error : error.error?.message || 'Google authentication failed';
        } else if (error?.message) {
          state.error = error.message;
        } else {
          state.error = 'Google authentication failed';
        }
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

export const { clearError, clearSuccessMessage, resetAuth, resetTransientStates, handleUnauthorized, updateUserAvatar } = authSlice.actions
export default authSlice.reducer
