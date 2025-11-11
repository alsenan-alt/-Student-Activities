import React from 'react';

interface HeroProps {
    title: string;
    subtitle: string;
    titleSize: string;
    titleFont: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, titleSize, titleFont }) => {
    return (
        <header 
            className="relative h-64 flex items-center justify-center text-white"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1562774053-61a2765c925e?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#004D40] via-[#004D40]/80 to-transparent"></div>
            <div className="relative z-10 text-center p-4">
                 <p 
                    className="text-lg font-semibold tracking-wider flex items-center justify-center gap-2"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {subtitle}
                </p>
                <h1 
                    className={`${titleSize} font-bold mt-2`}
                    style={{ fontFamily: `'${titleFont}', sans-serif`, textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}
                >
                    {title}
                </h1>
            </div>
        </header>
    );
};

export default Hero;