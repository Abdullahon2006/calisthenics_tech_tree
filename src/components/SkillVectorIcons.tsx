import React from 'react';

interface SkillVectorIconProps {
  id?: string;
  iconKey?: string;
  className?: string;
  color?: string;
}

const YD_YELLOW = '#FACC15';      // Iconic Calisthenics Yellow
const APPARATUS_COLOR = '#94A3B8'; // Steel Gray

/**
 * Authentic "Yellow Dude" Calisthenics Vector Art Engine
 * Direct 1:1 ID mapping covering all 63 exercises with distinct anatomical poses.
 */
export const SkillVectorIcon: React.FC<SkillVectorIconProps> = ({
  id = '',
  iconKey = '',
  className = 'w-12 h-12',
  color,
}) => {
  const fig = color || YD_YELLOW;
  const app = APPARATUS_COLOR;
  const key = id || iconKey;

  // ==========================================
  // 1. PUSH BRANCH (18 EXERCISES)
  // ==========================================

  // 1. Wall Push-ups
  if (key === 'push_wall' || key === 'pushup_wall') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="10" y1="6" x2="10" y2="46" stroke={app} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <line x1="6" y1="46" x2="44" y2="46" stroke={app} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <circle cx="23" cy="18" r="4.2" fill={fig} />
        <path d="M25 22 L33 34 L39 46" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 24 L10 24" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 2. Knee Push-ups
  if (key === 'push_knee' || key === 'pushup_knee') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="4" y1="42" x2="48" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="14" cy="22" r="4.2" fill={fig} />
        <path d="M17 25 L32 34 L36 42" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 28 L20 36 L15 42" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 42 L42 35" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. Standard Push-up
  if (key === 'push_standard' || key === 'pushup') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="4" y1="42" x2="48" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="13" cy="23" r="4.2" fill={fig} />
        <path d="M16 26 L32 32 L44 42" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 27 L20 36 L15 42" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="42" r="2.2" fill={fig} />
      </svg>
    );
  }

  // 4. Diamond Push-ups
  if (key === 'push_diamond' || key === 'pushup_diamond') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="4" y1="42" x2="48" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="13" cy="21" r="4.2" fill={fig} />
        <path d="M16 24 L31 31 L43 42" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 26 L23 35 L19 42" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="19,40 21,42 19,44 17,42" fill={app} />
      </svg>
    );
  }

  // 5. Archer Push-ups
  if (key === 'push_archer' || key === 'pushup_archer') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="4" y1="42" x2="48" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="16" cy="21" r="4.2" fill={fig} />
        <path d="M19 24 L33 32 L44 42" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 26 L16 34 L18 42" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 26 L38 35 L40 42" stroke={fig} strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
      </svg>
    );
  }

  // 6. One-Arm Push-up
  if (key === 'push_one_arm' || key === 'pushup_one_arm') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="4" y1="42" x2="48" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="14" cy="20" r="4.2" fill={fig} />
        <path d="M17 23 L31 30 L43 42" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 26 L17 35 L19 42" stroke={fig} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 27 L30 25" stroke={fig} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      </svg>
    );
  }

  // 7. Bench Dips
  if (key === 'dip_bench') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <rect x="8" y="28" width="16" height="6" rx="2" fill={app} opacity="0.5" />
        <line x1="12" y1="34" x2="12" y2="46" stroke={app} strokeWidth="2" />
        <line x1="20" y1="34" x2="20" y2="46" stroke={app} strokeWidth="2" />
        <line x1="4" y1="46" x2="48" y2="46" stroke={app} strokeWidth="2" opacity="0.4" />
        <circle cx="20" cy="15" r="4.2" fill={fig} />
        <path d="M21 19 L21 33" stroke={fig} strokeWidth="4.8" strokeLinecap="round" />
        <path d="M20 22 L16 25 L16 28" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M21 33 L32 37 L42 46" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 8. Parallel Bar Dips
  if (key === 'dip_parallel' || key === 'dip') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="26" x2="44" y2="26" stroke={app} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <line x1="10" y1="26" x2="10" y2="48" stroke={app} strokeWidth="2" opacity="0.35" />
        <line x1="42" y1="26" x2="42" y2="48" stroke={app} strokeWidth="2" opacity="0.35" />
        <circle cx="26" cy="11" r="4.2" fill={fig} />
        <path d="M26 15 L26 29" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M14 26 L19 21 L24 18" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 26 L33 21 L28 18" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 29 L24 39 L30 43" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 9. Straight Bar Dips
  if (key === 'dip_straight_bar') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="28" x2="46" y2="28" stroke={app} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
        <circle cx="26" cy="10" r="4.2" fill={fig} />
        <path d="M26 14 L26 28" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M21 28 L23 20 L25 16" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31 28 L29 20 L27 16" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 28 L24 40 L28 44" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 10. Gymnastic Ring Dips
  if (key === 'dip_ring') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="14" y1="4" x2="14" y2="23" stroke={app} strokeWidth="1.5" opacity="0.6" />
        <line x1="38" y1="4" x2="38" y2="23" stroke={app} strokeWidth="1.5" opacity="0.6" />
        <circle cx="14" cy="27" r="4" stroke={app} strokeWidth="2.2" />
        <circle cx="38" cy="27" r="4" stroke={app} strokeWidth="2.2" />
        <circle cx="26" cy="11" r="4.2" fill={fig} />
        <path d="M26 15 L26 29" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M14 27 L19 22 L24 18" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M38 27 L33 22 L28 18" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M26 29 L24 39 L30 44" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 11. Weighted Dips
  if (key === 'dip_weighted') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="24" x2="44" y2="24" stroke={app} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <circle cx="26" cy="10" r="4.2" fill={fig} />
        <path d="M26 14 L26 27" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M14 24 L24 17" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M38 24 L28 17" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M26 27 L24 38" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M26 27 L28 38" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <line x1="26" y1="26" x2="26" y2="38" stroke={app} strokeWidth="1.5" />
        <circle cx="26" cy="42" r="5" fill="#334155" stroke={app} strokeWidth="1.5" />
        <circle cx="26" cy="42" r="1.5" fill="#0f172a" />
      </svg>
    );
  }

  // 12. Pike Push-ups
  if (key === 'push_pike') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="4" y1="44" x2="48" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="16" cy="36" r="4" fill={fig} />
        <path d="M17 33 L26 18 L38 44" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 33 L14 44" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 13. Elevated Pike Push-up
  if (key === 'push_elevated_pike') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="4" y1="44" x2="48" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <rect x="34" y="32" width="12" height="12" rx="2" fill={app} opacity="0.5" />
        <circle cx="14" cy="35" r="4" fill={fig} />
        <path d="M15 32 L24 16 L36 32" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 32 L14 44" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 14. Wall Handstand Hold
  if (key === 'hs_wall') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="12" y1="46" x2="40" y2="46" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="38" y1="6" x2="38" y2="46" stroke={app} strokeWidth="2" strokeDasharray="3 3" opacity="0.55" />
        <circle cx="25" cy="36" r="4.2" fill={fig} />
        <path d="M25 32 L26 18" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M18 46 L20 37 L23 30" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M32 46 L30 37 L27 30" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M26 18 L36 7" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 15. Freestanding Handstand
  if (key === 'hs_freestanding' || key === 'handstand') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="12" y1="46" x2="40" y2="46" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="26" cy="36" r="4.2" fill={fig} />
        <path d="M26 32 L26 18" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M19 46 L21 37 L24 30" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M33 46 L31 37 L28 30" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M26 18 L26 6" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 16. Wall Handstand Push-up
  if (key === 'hspu_wall') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="12" y1="46" x2="40" y2="46" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="38" y1="6" x2="38" y2="46" stroke={app} strokeWidth="2" strokeDasharray="3 3" opacity="0.55" />
        <circle cx="25" cy="40" r="4" fill={fig} />
        <path d="M25 36 L26 22" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M16 46 L17 38 L22 34" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 46 L33 38 L28 34" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 22 L36 9" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 17. Freestanding HSPU
  if (key === 'hspu_freestanding' || key === 'hspu') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="12" y1="46" x2="40" y2="46" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="26" cy="40" r="4.2" fill={fig} />
        <path d="M26 36 L26 22" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M16 46 L17 38 L23 34" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 46 L35 38 L29 34" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 22 L26 8" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 18. 90-Degree Push-up
  if (key === 'push_90_degree') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="46" x2="44" y2="46" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="14" cy="34" r="4.2" fill={fig} />
        <path d="M17 34 L32 30 L40 18" stroke={fig} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 34 L21 44" stroke={fig} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // ==========================================
  // 2. PULL BRANCH (14 EXERCISES)
  // ==========================================

  // 19. Active Dead Hang
  if (key === 'pull_dead_hang' || key === 'dead_hang') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="8" x2="46" y2="8" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="19" y1="8" x2="22" y2="18" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <line x1="33" y1="8" x2="30" y2="18" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="26" cy="18" r="4.2" fill={fig} />
        <path d="M26 22 L26 34" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M26 34 L26 46" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 20. Scapular Pull-ups
  if (key === 'pull_scapular') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="8" x2="46" y2="8" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M20 8 L23 16" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M32 8 L29 16" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="26" cy="15" r="4.2" fill={fig} />
        <path d="M26 19 L26 32" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M26 32 L26 44" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M12 25 L12 18 M10 20 L12 18 L14 20" stroke={app} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 25 L40 18 M38 20 L40 18 L42 20" stroke={app} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 21. Australian Rows
  if (key === 'pull_australian' || key === 'australian_row') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="12" y1="18" x2="40" y2="18" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="6" y1="44" x2="48" y2="44" stroke={app} strokeWidth="1.5" opacity="0.35" />
        <circle cx="23" cy="22" r="4.2" fill={fig} />
        <path d="M25 25 L34 32 L44 42" stroke={fig} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 18 L25 25" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="44" cy="42" r="2" fill={fig} />
      </svg>
    );
  }

  // 22. Standard Pull-up
  if (key === 'pull_standard' || key === 'pullup') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="12" x2="46" y2="12" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="8" r="4.2" fill={fig} />
        <path d="M26 12 L26 27" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M16 12 L20 19 L25 17" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 12 L32 19 L27 17" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 27 L25 41 L27 45" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 23. Chin-ups (Supinated)
  if (key === 'pull_chinup') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="12" x2="46" y2="12" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="8" r="4.2" fill={fig} />
        <path d="M26 12 L26 27" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M21 12 L21 19 L25 17" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31 12 L31 19 L27 17" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 27 L25 43" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 24. Chest-to-Bar Pull-up
  if (key === 'pull_chest_to_bar') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="18" x2="46" y2="18" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="6" r="4.2" fill={fig} />
        <path d="M26 10 L26 26" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M16 18 L18 13 L24 11" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 18 L34 13 L28 11" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 26 L25 42" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 25. High Explosive Pull-up
  if (key === 'pull_high') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="24" x2="46" y2="24" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="5" r="4.2" fill={fig} />
        <path d="M26 9 L26 23" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M17 24 L21 17 L24 13" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M35 24 L31 17 L28 13" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M26 23 L25 39" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
        <path d="M22 45 L26 41 L30 45" stroke={app} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }

  // 26. Archer Pull-ups
  if (key === 'pull_archer') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="12" x2="46" y2="12" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="19" cy="8" r="4.2" fill={fig} />
        <path d="M20 12 L23 28" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M14 12 L16 19 L20 17" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M22 17 L38 12" stroke={fig} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M23 28 L23 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 27. Bar Muscle-up
  if (key === 'pull_muscle_up' || key === 'muscle_up') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="28" x2="46" y2="28" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="8" r="4.2" fill={fig} />
        <path d="M26 12 L26 25" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M19 28 L21 20 L24 16" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M33 28 L31 20 L28 16" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M26 25 L25 41 L27 45" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 28. Ring Muscle-up
  if (key === 'pull_ring_muscle_up') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="14" y1="4" x2="14" y2="20" stroke={app} strokeWidth="1.5" opacity="0.6" />
        <line x1="38" y1="4" x2="38" y2="20" stroke={app} strokeWidth="1.5" opacity="0.6" />
        <circle cx="14" cy="24" r="4" stroke={app} strokeWidth="2.2" />
        <circle cx="38" cy="24" r="4" stroke={app} strokeWidth="2.2" />
        <circle cx="26" cy="9" r="4.2" fill={fig} />
        <path d="M26 13 L26 27" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M14 24 L20 19 L24 15" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M38 24 L32 19 L28 15" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M26 27 L25 43" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 29. Strict Slow Muscle-up
  if (key === 'pull_slow_muscle_up' || key === 'muscle_up_slow') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="26" x2="46" y2="26" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="20" cy="25" r="2" fill={fig} />
        <circle cx="32" cy="25" r="2" fill={fig} />
        <circle cx="26" cy="9" r="4.2" fill={fig} />
        <path d="M26 13 L26 25" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M20 26 L22 18 L24 15" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M32 26 L30 18 L28 15" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M26 25 L26 44" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 30. Typewriter Pull-up
  if (key === 'pull_typewriter') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="12" x2="46" y2="12" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="32" cy="8" r="4.2" fill={fig} />
        <path d="M32 12 L30 28" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M38 12 L36 19 L32 17" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M30 17 L14 12" stroke={fig} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M30 28 L30 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
        <path d="M16 6 L12 6 M14 4 L12 6 L14 8" stroke={app} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 31. Assisted One-Arm Chin
  if (key === 'pull_assisted_oac') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="12" x2="46" y2="12" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="25" cy="8" r="4.2" fill={fig} />
        <path d="M25 12 L25 28" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M25 12 L22 18 L25 17" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 17 L28 20 L25 19" stroke={fig} strokeWidth="3.2" strokeLinecap="round" opacity="0.8" />
        <path d="M25 28 L25 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 32. One-Arm Chin-up
  if (key === 'pull_one_arm_chin' || key === 'pull_one_arm') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="12" x2="46" y2="12" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="25" cy="8" r="4.2" fill={fig} />
        <path d="M25 12 L25 28" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M25 12 L22 18 L25 17" stroke={fig} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27 19 L31 23" stroke={fig} strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        <path d="M25 28 L25 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    );
  }

  // ==========================================
  // 3. STATIC LEVERS & PLANCHE (15 EXERCISES)
  // ==========================================

  // 33. Tuck Front Lever
  if (key === 'fl_tuck') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M22 10 L19 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="12" cy="26" r="4.2" fill={fig} />
        <path d="M16 26 L32 26" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M32 26 L36 34 L28 34" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 34. Adv Tuck Front Lever
  if (key === 'fl_adv_tuck') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M22 10 L19 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="12" cy="26" r="4.2" fill={fig} />
        <path d="M16 26 L34 26" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M34 26 L34 36 L24 36" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 35. Straddle Front Lever
  if (key === 'fl_straddle') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M23 10 L19 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="12" cy="26" r="4.2" fill={fig} />
        <path d="M16 26 L32 26" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M32 26 L45 21" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M32 26 L45 31" stroke={fig} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // 36. Full Front Lever
  if (key === 'fl_full' || key === 'front_lever') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M23 10 L19 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M29 10 L22 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="12" cy="26" r="4.2" fill={fig} />
        <path d="M16 26 L46 26" stroke={fig} strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 37. German Hang
  if (key === 'bl_german_hang' || key === 'german_hang') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 10 L26 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="26" cy="30" r="4" fill={fig} />
        <path d="M26 30 L26 44" stroke={fig} strokeWidth="4.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 38. Skin the Cat
  if (key === 'bl_skin_the_cat') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M23 10 L25 22" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="26" cy="24" r="4" fill={fig} />
        <path d="M26 28 C 34 28, 36 38, 26 40 C 18 38, 20 28, 26 28" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M12 28 A 6 6 0 1 0 16 20" stroke={app} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // 39. Tuck Back Lever
  if (key === 'bl_tuck') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M26 10 L28 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="12" cy="26" r="4.2" fill={fig} />
        <path d="M16 26 L32 26" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M32 26 L36 20 L28 20" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 40. Full Back Lever
  if (key === 'bl_full' || key === 'back_lever') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="10" x2="44" y2="10" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M26 10 L28 26" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="12" cy="26" r="4.2" fill={fig} />
        <path d="M16 26 L46 26" stroke={fig} strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 41. Planche Lean
  if (key === 'planche_lean') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="12" cy="24" r="4.2" fill={fig} />
        <path d="M15 26 L30 32 L44 42" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M22 28 L17 42" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <circle cx="44" cy="42" r="2" fill={fig} />
      </svg>
    );
  }

  // 42. Tuck Planche
  if (key === 'planche_tuck') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="14" cy="22" r="4.2" fill={fig} />
        <path d="M18 22 L32 22" stroke={fig} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M32 22 L36 30 L28 30" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 22 L19 42" stroke={fig} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // 43. Adv Tuck Planche
  if (key === 'planche_adv_tuck') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="13" cy="22" r="4.2" fill={fig} />
        <path d="M17 22 L34 22" stroke={fig} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M34 22 L34 32 L26 32" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 22 L19 42" stroke={fig} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // 44. Straddle Planche
  if (key === 'planche_straddle' || key === 'planche_full' || key === 'planche') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="12" cy="22" r="4.2" fill={fig} />
        <path d="M16 22 L32 22" stroke={fig} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M32 22 L45 18" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M32 22 L45 26" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M25 22 L20 42" stroke={fig} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // 45. Elevated Side Plank
  if (key === 'flag_side_plank') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="14" cy="22" r="4.2" fill={fig} />
        <path d="M17 25 L31 33 L43 42" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M18 27 L18 42" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M24 29 L28 20" stroke={fig} strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 46. Tuck Human Flag
  if (key === 'flag_tuck') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="12" y1="6" x2="12" y2="46" stroke={app} strokeWidth="4" strokeLinecap="round" />
        <path d="M12 18 L21 24" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M12 32 L21 27" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="23" cy="22" r="4" fill={fig} />
        <path d="M24 25 L34 25" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M34 25 L38 32 L30 32" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 47. Full Human Flag
  if (key === 'flag_full' || key === 'human_flag') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="12" y1="6" x2="12" y2="46" stroke={app} strokeWidth="4" strokeLinecap="round" />
        <path d="M12 18 L21 24" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M12 32 L21 27" stroke={fig} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="23" cy="22" r="4" fill={fig} />
        <path d="M24 25 L47 25" stroke={fig} strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    );
  }

  // ==========================================
  // 4. CORE & COMPRESSION (8 EXERCISES)
  // ==========================================

  // 48. Hollow Body Plank
  if (key === 'core_plank') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="13" cy="26" r="4.2" fill={fig} />
        <path d="M16 28 L30 33 L44 40" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M18 30 L18 42 L24 42" stroke={fig} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 49. Hollow Body Hold
  if (key === 'core_hollow_body' || key === 'hollow_body') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <circle cx="12" cy="24" r="4.2" fill={fig} />
        <path d="M12 28 Q 26 38 42 26" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M12 28 L7 22" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 50. Hanging Knee Raises
  if (key === 'core_hanging_knee') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="8" x2="46" y2="8" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="20" y1="8" x2="22" y2="18" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="32" y1="8" x2="30" y2="18" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="18" r="4.2" fill={fig} />
        <path d="M26 22 L26 33" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M26 33 L35 24 L28 24" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 51. Hanging Leg Raises
  if (key === 'core_hanging_leg_raise' || key === 'hanging_leg_raise') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="8" x2="46" y2="8" stroke={app} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="20" y1="8" x2="22" y2="18" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="32" y1="8" x2="30" y2="18" stroke={fig} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="18" r="4.2" fill={fig} />
        <path d="M26 22 L26 34" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M26 34 L38 12" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 52. Floor L-Sit
  if (key === 'core_lsit_floor' || key === 'lsit') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="42" x2="44" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="19" cy="14" r="4.2" fill={fig} />
        <path d="M19 18 L19 32" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M19 23 L16 42" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M19 32 L43 32" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 53. Dragon Flag
  if (key === 'core_dragon_flag' || key === 'dragon_flag') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="42" x2="46" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="12" cy="38" r="4" fill={fig} />
        <path d="M15 37 L39 13" stroke={fig} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M15 39 L9 35" stroke={fig} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 54. High V-Sit
  if (key === 'core_vsit' || key === 'vsit') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="42" x2="44" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="16" cy="19" r="4.2" fill={fig} />
        <path d="M16 23 L18 35" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M16 26 L14 42" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M18 35 L38 16" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 55. Manna
  if (key === 'core_manna' || key === 'manna') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="8" y1="42" x2="44" y2="42" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="28" cy="28" r="4.2" fill={fig} />
        <path d="M26 31 L26 42" stroke={fig} strokeWidth="4" strokeLinecap="round" />
        <path d="M26 31 L8 31" stroke={fig} strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  // ==========================================
  // 5. LEGS & MOBILITY (8 EXERCISES)
  // ==========================================

  // 56. Bodyweight Squat
  if (key === 'legs_air_squat' || key === 'squat') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="26" cy="18" r="4.2" fill={fig} />
        <path d="M26 22 L26 33" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
        <path d="M26 33 L18 33 L16 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 33 L34 33 L36 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 25 L34 23" stroke={fig} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 57. Bulgarian Split Squat
  if (key === 'legs_bulgarian') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <rect x="36" y="34" width="10" height="10" rx="2" fill={app} opacity="0.5" />
        <circle cx="20" cy="18" r="4.2" fill={fig} />
        <path d="M20 22 L20 33" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M20 33 L27 33 L27 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 33 L32 38 L38 34" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 58. Cossack Squats
  if (key === 'legs_cossack' || key === 'cossack') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="20" cy="18" r="4.2" fill={fig} />
        <path d="M20 22 L18 33" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M18 33 L14 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
        <path d="M18 33 L42 44" stroke={fig} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 59. Assisted Pistol Squat
  if (key === 'legs_assisted_pistol') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="10" y1="12" x2="10" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="20" cy="19" r="4.2" fill={fig} />
        <path d="M20 24 L10 24" stroke={fig} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M20 23 L18 34" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M18 34 L25 34 L21 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 34 L42 34" stroke={fig} strokeWidth="4.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 60. Full Pistol Squat
  if (key === 'legs_pistol' || key === 'pistol_squat') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="18" cy="19" r="4.2" fill={fig} />
        <path d="M18 23 L16 34" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M16 34 L23 34 L19 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 34 L42 34" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M18 26 L29 26" stroke={fig} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 61. Deep Shrimp Squat
  if (key === 'legs_shrimp' || key === 'shrimp_squat') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="21" cy="18" r="4.2" fill={fig} />
        <path d="M21 22 L20 33" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M20 33 L26 33 L21 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
        <path d="M20 33 L14 38 L18 28" stroke={fig} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 62. Dragon Squat
  if (key === 'legs_dragon_squat') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="20" cy="18" r="4.2" fill={fig} />
        <path d="M20 22 L19 33" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M19 33 L24 33 L20 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 33 L13 37 L30 42" stroke={fig} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 25 L29 22" stroke={fig} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 63. Weighted Pistol (+16kg)
  if (key === 'legs_weighted_pistol') {
    return (
      <svg viewBox="0 0 52 52" className={className} fill="none">
        <line x1="6" y1="44" x2="46" y2="44" stroke={app} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="18" cy="19" r="4.2" fill={fig} />
        <path d="M18 23 L16 34" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        <path d="M16 34 L23 34 L19 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 34 L42 34" stroke={fig} strokeWidth="5" strokeLinecap="round" />
        {/* Kettlebell held at chest */}
        <circle cx="26" cy="25" r="3.5" fill="#334155" stroke={app} strokeWidth="1.2" />
        <path d="M24 22 C 24 20, 28 20, 28 22" stroke={app} strokeWidth="1.2" fill="none" />
        <path d="M18 24 L24 23" stroke={fig} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // ==========================================
  // ATHLETIC YELLOW DUDE (Universal Fallback)
  // ==========================================
  return (
    <svg viewBox="0 0 52 52" className={className} fill="none">
      <circle cx="26" cy="12" r="4.8" fill={fig} />
      <path d="M26 17 L26 32" stroke={fig} strokeWidth="5.2" strokeLinecap="round" />
      <path d="M26 22 L17 28" stroke={fig} strokeWidth="4" strokeLinecap="round" />
      <path d="M26 22 L35 28" stroke={fig} strokeWidth="4" strokeLinecap="round" />
      <path d="M26 32 L20 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M26 32 L32 44" stroke={fig} strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
};

/**
 * The primary app illustration system. These original motion figures use an editorial,
 * faceless athlete silhouette: a solid saffron body, dark utility vest and steel apparatus.
 * The pose is inferred from the exercise so a node reads as an athlete in motion at a
 * glance, even at the small sizes used by the canvas.
 */
export const MotionMascotIcon: React.FC<SkillVectorIconProps> = ({
  id = '',
  iconKey = '',
  className = 'w-12 h-12',
  color = '#FFB703',
}) => {
  const key = `${id} ${iconKey}`.toLowerCase();
  const isLeg = /legs|squat|pistol|shrimp|bulgarian|cossack/.test(key);
  const isPull = /pull|chin|hang|row|muscle/.test(key);
  const isStatic = /lever|planche|flag|manna/.test(key);
  const isCore = /core|hollow|l_sit|v_sit|dragon|toes/.test(key);
  const line = color;
  const steel = '#657087';
  const outline = '#17191F';
  const vest = '#23262E';

  const Head = ({ x, y }: { x: number; y: number }) => (
    <g>
      <ellipse cx={x} cy={y} rx="6.3" ry="7.4" fill={line} stroke={outline} strokeWidth="1.6" />
      <path d={`M ${x - 3.5} ${y - 5.2} Q ${x} ${y - 7.8} ${x + 3.5} ${y - 5.2}`} fill="none" stroke="#F9D25B" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
    </g>
  );

  const Stroke = ({ d, width = 7 }: { d: string; width?: number }) => (
    <>
      <path d={d} fill="none" stroke={outline} strokeWidth={width + 2.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={line} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );

  let figure: React.ReactNode;

  if (isPull) {
    figure = <>
      <path d="M10 10H54" stroke={steel} strokeWidth="4" strokeLinecap="round" />
      <path d="M16 10v5M48 10v5" stroke={steel} strokeWidth="2" opacity=".65" />
      <Head x={32} y={24} />
      <path d="M26 30 Q32 27 38 30 L39 41 Q32 45 25 41Z" fill={vest} stroke={outline} strokeWidth="1.5" />
      <Stroke d="M27 31 L19 16 L16 10" width={6} />
      <Stroke d="M37 31 L45 16 L48 10" width={6} />
      <Stroke d="M28 41 L25 55" width={7} />
      <Stroke d="M36 41 L40 55" width={7} />
    </>;
  } else if (isStatic) {
    figure = <>
      <path d="M8 50H56" stroke={steel} strokeWidth="2.2" strokeLinecap="round" opacity=".55" />
      <Head x={17} y={31} />
      <path d="M23 30 Q33 25 42 30 L46 38 Q36 41 24 38Z" fill={vest} stroke={outline} strokeWidth="1.5" />
      <Stroke d="M26 35 L14 47" width={6} />
      <Stroke d="M32 36 L22 50" width={6} />
      <Stroke d="M42 33 L55 28" width={7} />
      <Stroke d="M42 38 L55 44" width={7} />
    </>;
  } else if (isCore) {
    figure = <>
      <path d="M12 43H52" stroke={steel} strokeWidth="3" strokeLinecap="round" opacity=".7" />
      <Head x={25} y={20} />
      <path d="M24 27 Q31 25 37 29 L38 40 Q30 43 24 39Z" fill={vest} stroke={outline} strokeWidth="1.5" />
      <Stroke d="M26 33 L16 43" width={6} />
      <Stroke d="M36 34 L45 43" width={6} />
      <Stroke d="M31 40 L45 40" width={7} />
      <Stroke d="M31 40 L49 51" width={7} />
    </>;
  } else if (isLeg) {
    figure = <>
      <path d="M9 53H55" stroke={steel} strokeWidth="2.4" strokeLinecap="round" opacity=".6" />
      <Head x={29} y={16} />
      <path d="M24 23 Q30 20 36 24 L38 35 Q30 39 23 34Z" fill={vest} stroke={outline} strokeWidth="1.5" />
      <Stroke d="M25 28 L16 33" width={6} />
      <Stroke d="M36 28 L45 33" width={6} />
      <Stroke d="M27 35 L19 43 L18 53" width={8} />
      <Stroke d="M34 36 L42 43 L49 51" width={8} />
    </>;
  } else {
    figure = <>
      <path d="M8 51H56" stroke={steel} strokeWidth="2.4" strokeLinecap="round" opacity=".6" />
      <Head x={20} y={28} />
      <path d="M25 31 Q34 27 42 32 L45 40 Q36 44 27 40Z" fill={vest} stroke={outline} strokeWidth="1.5" />
      <Stroke d="M27 35 L20 47 L17 51" width={6} />
      <Stroke d="M32 37 L31 49 L28 51" width={6} />
      <Stroke d="M41 34 L50 48" width={7} />
      <Stroke d="M42 39 L54 50" width={7} />
    </>;
  }

  return (
    <svg viewBox="0 0 64 64" className={`${className} motion-mascot-icon`} fill="none" aria-hidden="true" focusable="false">
      {figure}
    </svg>
  );
};
