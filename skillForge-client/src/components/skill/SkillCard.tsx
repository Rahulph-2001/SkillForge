import { Clock, Users, Star, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    durationHours: number;
    creditsHour: number;
    status: string;
    sessions?: number;
    image?: string;
    totalSessions?: number;
    creditsPerHour?: number;
    imageUrl?: string;
    templateId?: string;
    isBlocked?: boolean;
    isAdminBlocked?: boolean;
    blockedReason?: string;
  };
  onEdit?: (skill: any) => void;
  onToggleBlock?: (skill: any) => void;
}

export default function SkillCard({ skill, onEdit, onToggleBlock }: SkillCardProps) {
  const navigate = useNavigate();

  const statusColors = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'in-review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    blocked: 'bg-black text-white dark:bg-gray-800 dark:text-gray-200',
    adminBlocked: 'bg-red-600 text-white',
  };

  // Show blocked status if skill is blocked
  let displayStatus = skill.status;
  if (skill.isAdminBlocked) {
    displayStatus = 'adminBlocked';
  } else if (skill.isBlocked) {
    displayStatus = 'blocked';
  }

  const statusColor = statusColors[displayStatus as keyof typeof statusColors] || 'bg-muted text-muted-foreground';

  const handleAttendMCQ = () => {
    navigate(`/mcq-test/${skill.id}`);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Skill Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {skill.imageUrl ? (
          <img
            src={skill.imageUrl}
            alt={skill.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <span class="text-4xl font-bold text-blue-300 dark:text-blue-500">${skill.title.charAt(0).toUpperCase()}</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <span className="text-4xl font-bold text-blue-300 dark:text-blue-500">
              {skill.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute right-2 top-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
            {skill.isAdminBlocked ? '🚫 Blocked by Admin' :
              skill.isBlocked ? '🚫 Blocked' :
                (skill.status.charAt(0).toUpperCase() + skill.status.slice(1))}
          </span>
        </div>
      </div>

      {/* Skill Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-1">
          {skill.title}
        </h3>

        {/* Description */}
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {skill.description}
        </p>

        {/* Category & Level */}
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
            {skill.category}
          </span>
          <span className="rounded-full bg-purple-50 dark:bg-purple-900/30 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
            {skill.level}
          </span>
        </div>

        {/* Blocked Warning */}
        {(skill.isBlocked || skill.isAdminBlocked) && skill.blockedReason && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
              {skill.isAdminBlocked ? '⚠️ Blocked by Admin' : '⚠️ Skill Blocked'}
            </p>
            <p className="text-xs text-red-700 dark:text-red-400">{skill.blockedReason}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{skill.durationHours} hour{skill.durationHours !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{skill.sessions || skill.totalSessions || 0} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-primary">
              {skill.creditsHour || skill.creditsPerHour || 0}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 border-t border-border pt-3">
          {skill.status === 'pending' && skill.templateId && !skill.isBlocked && !skill.isAdminBlocked ? (
            <button
              onClick={handleAttendMCQ}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-3 rounded-lg transition-colors text-sm"
            >
              <FileText className="h-4 w-4" />
              Attend MCQ
            </button>
          ) : (
            <button
              onClick={() => onEdit?.(skill)}
              disabled={skill.isAdminBlocked}
              className={`flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors
                ${skill.isAdminBlocked
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-card text-foreground hover:bg-muted hover:text-primary'}`}
              title={skill.isAdminBlocked ? "Cannot edit admin-blocked skill" : "Edit Skill"}
            >
              Edit
            </button>
          )}

          <button
            onClick={() => onToggleBlock?.(skill)}
            disabled={skill.isAdminBlocked}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors 
              ${skill.isAdminBlocked
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : skill.isBlocked
                  ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
              }`}
            title={skill.isAdminBlocked ? "Cannot unblock admin-blocked skill" : (skill.isBlocked ? "Unblock Skill" : "Block Skill")}
          >
            {skill.isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </div>
    </div>
  );
}
