import { CheckCircle } from 'lucide-react';

interface AboutTabProps {
  profile: {
    name: string;
    bio: string | null;
    skillsOffered: string[];
    verification: {
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      isIdentityVerified: boolean;
    };
    memberSince: string;
  };
}

export default function AboutTab({ profile }: AboutTabProps) {
  const formatVerificationDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="max-w-3xl space-y-12">
      {/* About Section */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">About {profile.name}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {profile.bio || 'No bio available'}
        </p>
      </div>

      {/* Skills Expertise */}
      {profile.skillsOffered && profile.skillsOffered.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Skills Expertise</h3>
          <div className="flex gap-3 flex-wrap">
            {profile.skillsOffered.map((skill, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md font-medium hover:bg-muted/80 transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verification */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Verification</h3>
        <div className="space-y-4">
          {profile.verification.isIdentityVerified && (
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-primary fill-current" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Identity Verified</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Profile verified on {formatVerificationDate(profile.memberSince)}
                </p>
              </div>
            </div>
          )}

          {profile.verification.isEmailVerified && (
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600 fill-current" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Email Verified</p>
                <p className="text-sm text-muted-foreground mt-1">Email address confirmed</p>
              </div>
            </div>
          )}

          {profile.verification.isPhoneVerified && (
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600 fill-current" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Phone Verified</p>
                <p className="text-sm text-muted-foreground mt-1">Phone number confirmed</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
