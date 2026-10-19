import React from 'react';
import { BranchId } from '../types/techTree';

const ARTWORK_BY_BRANCH: Record<BranchId, string> = {
  push: '/icons/push.svg',
  pull: '/icons/pull.svg',
  levers: '/icons/static.svg',
  core: '/icons/core-planche.png',
  legs: '/icons/legs.svg',
};

interface ExerciseArtworkProps {
  branch: BranchId;
  iconUrl?: string;
  className?: string;
  muted?: boolean;
}

/** Generated editorial athlete art, shared by tree nodes, search, and detail views. */
export const ExerciseArtwork: React.FC<ExerciseArtworkProps> = ({
  branch,
  iconUrl,
  className = '',
  muted = false,
}) => (
  <img
    src={iconUrl || ARTWORK_BY_BRANCH[branch]}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`object-contain select-none ${muted ? 'grayscale opacity-45' : ''} ${className}`}
  />
);
