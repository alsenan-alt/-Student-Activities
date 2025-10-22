import React from 'react';
import { getIconComponent } from './icons/iconMap';

interface HeaderProps {
    title: string;
    subtitle: string;
    titleSize: string;
    headerIcon: string;
    titleFont: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, titleSize, headerIcon, titleFont }) => {
    const IconComponent = getIconComponent(headerIcon);
    return (
        <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center bg-[var(--color-card-bg)] p-4 rounded-full shadow-lg mb-4">
                <IconComponent className="w-12 h-12 text-[var(--color-accent)]" />
            </div>
            <h1 
                className={`${titleSize} font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-blue-500`}
                style={{ fontFamily: `'${titleFont}', sans-serif` }}
            >
                {title}
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-6">{subtitle}</p>
        </header>
    );
};

export default Header;