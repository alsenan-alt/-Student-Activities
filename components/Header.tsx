import React, { useState, useEffect } from 'react';
import { getIconComponent } from './icons/iconMap';

interface HeaderProps {
    title: string;
    subtitle: string;
    titleSize: string;
    headerIcon: string;
    titleFont: string;
    titleColor: string;
    subtitleColor: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, titleSize, headerIcon, titleFont, titleColor, subtitleColor }) => {
    const IconComponent = getIconComponent(headerIcon);
    const [offsetY, setOffsetY] = useState(0);

    const handleScroll = () => setOffsetY(window.pageYOffset);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="relative text-center mb-10 rounded-xl overflow-hidden shadow-2xl h-80 flex flex-col items-center justify-center p-4">
            {/* Background image with parallax effect */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1562774053-61a2765c925e?q=80&w=2070&auto=format&fit=crop')",
                    transform: `translateY(${offsetY * 0.4}px)`,
                }}
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent z-10" />

            {/* Content, positioned on top */}
            <div className="relative z-20 flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm p-4 rounded-full shadow-lg mb-4 print-hide">
                    <IconComponent className="w-12 h-12 text-[var(--color-accent)]" />
                </div>
                <h1
                    className={`${titleSize} font-bold`}
                    style={{
                        fontFamily: `'${titleFont}', sans-serif`,
                        textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
                        color: titleColor,
                    }}
                >
                    {title}
                </h1>
                <p 
                    className="mt-6 max-w-lg"
                    style={{ color: subtitleColor }}
                >
                    {subtitle}
                </p>
            </div>
        </header>
    );
};

export default Header;