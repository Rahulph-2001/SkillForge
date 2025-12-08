import { injectable } from 'inversify';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
import { BrowseSkillDTO } from '../dto/skill/BrowseSkillsResponseDTO';
import { IBrowseSkillMapper } from './interfaces/IBrowseSkillMapper';

@injectable()
export class BrowseSkillMapper implements IBrowseSkillMapper {
  public toDTO(skill: Skill, provider: User, availability?: any): BrowseSkillDTO {
    let availableDays: string[] = [];

    if (availability && availability.weeklySchedule) {
      availableDays = Object.entries(availability.weeklySchedule)
        .filter(([_, schedule]: [string, any]) => schedule.enabled)
        .map(([day, schedule]: [string, any]) => {
          if (schedule.slots && schedule.slots.length > 0) {
            const slot = schedule.slots[0];
            const formatTime = (time: string) => {
              const [h, m] = time.split(':');
              const hour = parseInt(h);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const hour12 = hour % 12 || 12;
              return `${hour12}:${m} ${ampm}`;
            };
            return `${day} (${formatTime(slot.start)} - ${formatTime(slot.end)})`;
          }
          return day;
        });
    }

    return {
      id: skill.id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      durationHours: skill.durationHours,
      creditsPerHour: skill.creditsPerHour,
      imageUrl: skill.imageUrl,
      tags: skill.tags,
      rating: skill.rating,
      totalSessions: skill.totalSessions,
      provider: {
        id: provider.id,
        name: provider.name,
        email: provider.email.value,
      },
      availableDays
    };
  }
}
