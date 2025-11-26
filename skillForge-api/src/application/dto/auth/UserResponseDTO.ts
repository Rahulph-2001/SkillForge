export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  verification: {
    email_verified: boolean;
  };
  subscriptionPlan: string;
  avatarUrl: string | null;
}