import React from 'react';

interface IconProps {
  className?: string;
}

export const MoonIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.5 16C21.5 21.2467 17.2467 25.5 12 25.5C11.1639 25.5 10.3551 25.3763 9.58974 25.1441C12.1343 24.0681 13.5 22.0453 13.5 16C13.5 9.95465 12.1343 7.93194 9.58974 6.85592C10.3551 6.62371 11.1639 6.5 12 6.5C17.2467 6.5 21.5 10.7533 21.5 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 8L25.5 6.5M26 12H28M24 16L25.5 17.5M20 20L21.5 21.5M16 22V24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const VideoIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M24 11L28 8V24L24 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 16L10 13.5C10 13.2239 10.2239 13 10.5 13H11.1716C11.298 13 11.4207 13.0421 11.5196 13.1196L15.6804 16.6196C15.8578 16.7648 15.8578 17.0352 15.6804 17.1804L11.5196 20.6804C11.4207 20.7579 11.298 20.8 11.1716 20.8H10.5C10.2239 20.8 10 20.5761 10 20.3V16Z" fill="currentColor"/>
  </svg>
);

export const PenIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 4.5L27.5 9.5L10 27H5V22L22.5 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 8L24 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 27L10 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="23" cy="23" r="1" fill="currentColor"/>
    <circle cx="26" cy="26" r="1" fill="currentColor"/>
    <circle cx="20" cy="26" r="1" fill="currentColor"/>
  </svg>
);

export const MusicIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 22V8L24 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="25" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="21" cy="22" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 12L24 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10C8 8.89543 8.89543 8 10 8H22C23.1046 8 24 8.89543 24 10V18C24 19.1046 23.1046 20 22 20H17L13 24V20H10C8.89543 20 8 19.1046 8 18V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="1" fill="currentColor"/>
    <circle cx="16" cy="14" r="1" fill="currentColor"/>
    <circle cx="20" cy="14" r="1" fill="currentColor"/>
  </svg>
);

export const CommunityIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="24" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 13C19.3137 13 22 15.6863 22 19V24H10V19C10 15.6863 12.6863 13 16 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 15C5.79086 15 4 16.7909 4 19V23H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 15C26.2091 15 28 16.7909 28 19V23H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="22" height="5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="6" y="16" width="20" height="11" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 11V27" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11C11 8.79086 12.7909 7 15 7C16.1046 7 17 7.89543 17 9C17 10.1046 16.1046 11 15 11" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M21 11C21 8.79086 19.2091 7 17 7C15.8954 7 15 7.89543 15 9C15 10.1046 15.8954 11 17 11" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="21" r="1" fill="currentColor"/>
    <circle cx="22" cy="21" r="1" fill="currentColor"/>
  </svg>
);