import React from 'react';

export function PaintBrush({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 3c1.5 1.5 3 3.9 3 6s-1 4-3 4c-1.5 0-3-1-3-3 0-2 1.5-5 3-7z" />
      <path d="M9 21c-2.2 0-4-1.8-4-4 0-1.5 1-3 2.5-3.5C9 13 10 13 10 13c0-2 1-3 3-3s3 1 3 3" />
    </svg>
  );
}