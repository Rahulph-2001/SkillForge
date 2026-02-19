import { Mail, MapPin, Calendar, CheckCircle } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    memberSince: string;
    verification: {
      isIdentityVerified: boolean;
    };
  };
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const formatMemberSince = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="px-6 py-8 border-b border-border">
      <div className="flex gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary-foreground">
                {getInitials(profile.name)}
              </span>
            )}
          </div>
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
            {profile.verification.isIdentityVerified && (
              <CheckCircle className="w-5 h-5 text-primary fill-current" />
            )}
          </div>
          {profile.bio && (
            <p className="text-muted-foreground mb-2">{profile.bio}</p>
          )}
          <p className="text-muted-foreground text-sm mb-3">{profile.email}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatMemberSince(profile.memberSince)}</span>
            </div>
          </div>
        </div>

        {/* Message Button */}
        <div className="flex items-start">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-medium flex items-center gap-2 transition-colors">
            <Mail className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
