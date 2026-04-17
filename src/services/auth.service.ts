import api from "./api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  User,
  ApiResponse,
} from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  // register agora retorna apenas uma mensagem
  async register(credentials: RegisterCredentials): Promise<{ message: string }> {
    const response = await api.post<{ status: string; message: string }>(
      '/auth/register',
      credentials
    );
    return { message: response.data.message };
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.get<{ status: string; message: string }>(
      `/auth/verify-email?token=${token}`
    );
    return { message: response.data.message };
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};