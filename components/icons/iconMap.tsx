import React from 'react';
import { LinkIcon } from './LinkIcon';
import { CalendarIcon } from './CalendarIcon';
import { DocumentIcon } from './DocumentIcon';
import { ChatBubbleIcon } from './ChatBubbleIcon';
import { UsersIcon } from './UsersIcon';

export interface IconInfo {
  id: string;
  name: string;
  component: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const availableIcons: IconInfo[] = [
  { id: 'link', name: 'رابط', component: LinkIcon },
  { id: 'document', name: 'مستند', component: DocumentIcon },
  { id: 'calendar', name: 'تقويم', component: CalendarIcon },
  { id: 'chat', name: 'تواصل', component: ChatBubbleIcon },
  { id: 'users', name: 'مجموعة', component: UsersIcon },
];

const iconMap: { [key: string]: IconInfo } = availableIcons.reduce((acc, icon) => {
  acc[icon.id] = icon;
  return acc;
}, {} as { [key:string]: IconInfo });

export const getIconComponent = (iconId: string): React.FC<React.SVGProps<SVGSVGElement>> => {
    return iconMap[iconId]?.component || LinkIcon;
}
