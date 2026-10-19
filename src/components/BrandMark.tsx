import React from 'react';

/** The app mark: a tiny skill tree (filled = logged, ring = next). Matches favicon.svg. */
export const BrandMark: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Tech Tree">
    <rect width="64" height="64" rx="16" fill="#14161A" />
    <path d="M32 47V37M32 37 20 25M32 37l12-12" fill="none" stroke="#5FC4B0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="48" r="6.5" fill="#5FC4B0" />
    <circle cx="19" cy="21" r="6" fill="#5FC4B0" />
    <circle cx="45" cy="21" r="5" fill="none" stroke="#5FC4B0" strokeWidth="3" />
  </svg>
);
