import { personalInfo } from "../../data/portfolio";

interface ProfileImageProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function ProfileImage({ className = "", style }: ProfileImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Ambient glow behind image */}
      <div className="absolute -inset-8 rounded-full blur-3xl bg-electric/10" />
      <div className="absolute -inset-4 rounded-full blur-2xl bg-violet/5" />

      {/* Image container */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-electric/20">
        <img
          src={personalInfo.profileImage}
          alt={personalInfo.name}
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-void/30 via-transparent to-transparent" />
      </div>

      {/* Ring accent */}
      <div className="absolute inset-0 rounded-full border border-electric/10" />
    </div>
  );
}
