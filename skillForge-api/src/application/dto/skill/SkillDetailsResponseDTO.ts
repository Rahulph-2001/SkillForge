export interface SkillDetailsDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  imageUrl: string | null;
  tags: string[];
  rating: number;
  totalSessions: number;
  provider: {
    id: string;
    name: string;
    email: string;
    rating: number;
    reviewCount: number;
  };
  availability: {
    weeklySchedule: Record<string, { enabled: boolean; slots: { start: string; end: string }[] }>;
    blockedDates: { date: Date; reason?: string }[];
    timezone: string;
    bookedSlots?: { id: string; title: string; date: string; startTime: string; endTime: string }[];
  } | null;
}
