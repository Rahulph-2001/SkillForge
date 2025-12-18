export interface CreateCommunityDTO {
  name: string;
  description: string;
  category: string;
  creditsCost?: number;
  creditsPeriod?: string;
}