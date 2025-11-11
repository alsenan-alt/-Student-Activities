import React from 'react';
import { SocialXIcon } from './icons/SocialXIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TiktokIcon } from './icons/TiktokIcon';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#004D40] text-white py-8 print-hide">
            <div className="container mx-auto max-w-3xl text-center">
                <p className="text-sm text-gray-300">The Loop Newsletter - Deanship of Student Affairs</p>
                <div className="flex justify-center items-center gap-4 mt-4">
                    <a href="#" aria-label="X Profile" className="text-gray-300 hover:text-white transition-colors"><SocialXIcon className="w-6 h-6" /></a>
                    <a href="#" aria-label="Instagram Profile" className="text-gray-300 hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                    <a href="#" aria-label="TikTok Profile" className="text-gray-300 hover:text-white transition-colors"><TiktokIcon className="w-6 h-6" /></a>
                    <span className="font-semibold text-gray-200">@kfupm_dsa</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;