export interface UserAdminDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  isActive: boolean;
  isDeleted: boolean;
  emailVerified: boolean;
}
