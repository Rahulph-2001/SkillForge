export interface UpdateUserProfileDTO {
  userId: string;
  name?: string;
  bio?: string;
  location?: string;
  avatarFile?: { buffer: Buffer; originalname: string; mimetype: string };
}

export interface UpdatedProfileResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
}

export interface IUpdateUserProfileUseCase {
  execute(dto: UpdateUserProfileDTO): Promise<UpdatedProfileResponse>;
}

