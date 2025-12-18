import api from './api'

export interface SignupRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignupResponse {
  success: boolean
  data: {
    email: string
    expiresAt: string
    message: string
  }
}

export interface ApiError {
  success: false;
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
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
    };
    token?: string;
    refreshToken?: string;
  };
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  data: {
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
    };
    token: string;
    refreshToken: string;
    message: string;
  };
}

export const authService = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    try {
      const response = await api.post<SignupResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      // Re-throw the error with axios response data
      throw error.response?.data || error;
    }
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      // Tokens are stored in HTTP-only cookies by the backend
      // No need to store in localStorage
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  verifyOtp: async (email: string, code: string): Promise<VerifyOtpResponse> => {
    try {
      const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', { email, otpCode: code });
      // Tokens are stored in HTTP-only cookies by the backend
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  resendOtp: async (email: string): Promise<{ success: boolean; message: string; data?: { expiresAt: string | null } }> => {
    try {
      const response = await api.post<{ success: boolean; message: string; data?: { expiresAt: string | null } }>('/auth/resend-otp', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  googleAuthCallback: async (): Promise<LoginResponse> => {
    try {
      // Tokens are in HTTP-only cookies, just fetch user data
      const response = await api.get<LoginResponse>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  adminLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/admin/login', data);
      // Tokens are stored in HTTP-only cookies by the backend
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Call backend logout endpoint to clear cookies
      await api.post('/auth/logout');
      // Cookies are cleared by the backend
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; data?: { expiresAt: string } }> => {
    try {
      const response = await api.post<{ success: boolean; message: string; data?: { expiresAt: string } }>('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  verifyForgotPasswordOtp: async (email: string, otpCode: string): Promise<{ success: boolean; message: string; data?: { verified: boolean } }> => {
    try {
      const response = await api.post<{ success: boolean; message: string; data?: { verified: boolean } }>('/auth/verify-forgot-password-otp', { email, otpCode });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  resetPassword: async (email: string, otpCode: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/reset-password', {
        email,
        otpCode,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  validateUserStatus: async (): Promise<{ success: boolean; data: { isActive: boolean } }> => {
    try {
      const response = await api.get<{ success: boolean; data: { isActive: boolean } }>('/auth/validate-status');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};

