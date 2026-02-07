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
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    'in-review': 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    blocked: 'bg-black text-white',
    adminBlocked: 'bg-red-600 text-white',
  };

  // Show blocked status if skill is blocked
  let displayStatus = skill.status;
  if (skill.isAdminBlocked) {
    displayStatus = 'adminBlocked';
  } else if (skill.isBlocked) {
    displayStatus = 'blocked';
  }

  const statusColor = statusColors[displayStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

  const handleAttendMCQ = () => {
    navigate(`/mcq-test/${skill.id}`);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Skill Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
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
                  <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <span class="text-4xl font-bold text-blue-300">${skill.title.charAt(0).toUpperCase()}</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <span className="text-4xl font-bold text-blue-300">
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
        <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">
          {skill.title}
        </h3>

        {/* Description */}
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {skill.description}
        </p>

        {/* Category & Level */}
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {skill.category}
          </span>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
            {skill.level}
          </span>
        </div>

        {/* Blocked Warning */}
        {(skill.isBlocked || skill.isAdminBlocked) && skill.blockedReason && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-900 mb-1">
              {skill.isAdminBlocked ? '⚠️ Blocked by Admin' : '⚠️ Skill Blocked'}
            </p>
            <p className="text-xs text-red-700">{skill.blockedReason}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-600">
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
            <span className="font-semibold text-blue-600">
              {skill.creditsHour || skill.creditsPerHour || 0}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
          {skill.status === 'pending' && skill.templateId && !skill.isBlocked && !skill.isAdminBlocked ? (
            <button
              onClick={handleAttendMCQ}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
            >
              <FileText className="h-4 w-4" />
              Attend MCQ
            </button>
          ) : (
            <button
              onClick={() => onEdit?.(skill)}
              disabled={skill.isAdminBlocked}
              className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition-colors
                ${skill.isAdminBlocked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
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
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : skill.isBlocked
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
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
