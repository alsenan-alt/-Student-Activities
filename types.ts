export type UserRole = 'admin' | 'student';

export interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  description?: string;
}

export interface Announcement {
  id: number;
  title: string;
  category: 'male' | 'female';
  imageUrl: string;
  details: string;
  date: string; // ISO String format
  location: string;
  registrationType: 'link' | 'open';
  registrationUrl?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ThemeConfig {
  title: string;
  subtitle: string;
  titleSize: 'text-4xl md:text-5xl' | 'text-5xl md:text-6xl' | 'text-6xl md:text-7xl';
  headerIcon: string;
  accentColor: string;
  preset: string;
  titleFont: string;
}