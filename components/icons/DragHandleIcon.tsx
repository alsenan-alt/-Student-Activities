import React from 'react';

export const DragHandleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25H9.75M9 8.25H9.75M9 11.25H9.75M9 14.25H9.75M9 17.25H9.75M14.25 5.25H15M14.25 8.25H15M14.25 11.25H15M14.25 14.25H15M14.25 17.25H15" />
  </svg>
);
