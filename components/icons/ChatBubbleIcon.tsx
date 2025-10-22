import React from 'react';

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.125 1.125 0 0 0-1.59.028l-2.348 2.347a1.125 1.125 0 0 1-1.59 0l-2.347-2.347a1.125 1.125 0 0 0-1.592 0l-3.72 3.72c-1.133-.093-1.98-1.057-1.98-2.192V10.608c0-.97.616-1.813 1.5-2.097m14.25-1.128a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25m14.25 0-3.75 3.75m-10.5-3.75 3.75 3.75" />
  </svg>
);
