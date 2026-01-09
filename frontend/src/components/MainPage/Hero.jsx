import { useState, useEffect } from 'react';
import Header from './Header';

const Hero = () => {
    const userName = import.meta.env.VITE_USER_NAME;
    const [isMobile, setIsMobile] = useState(false);

    const handleVideoError = (e) => {
        console.error('Video loading error:', e);
    };

    const getVideoSource = () => {
        if (userName === "Ikram Ahmed") {
            return "/assets/background_iky_new.mp4";
        }
        return "/assets/background_new.mp4";
    };

    useEffect(() => {
        const checkMobile = () => {
            const isM = window.innerWidth < 1024;
            setIsMobile(isM);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section id="home" className="page-section title-section relative min-h-screen flex items-center justify-center">
            <video
                key={isMobile ? 'mobile' : 'desktop'} // Add key to force video reload
                autoPlay 
                muted 
                loop 
                playsInline 
                preload="auto"
                className="background-video"
                onError={handleVideoError}
            >
                <source 
                    src={isMobile ? "/assets/notextnew.mp4": getVideoSource()} 
                    type="video/mp4"
                />
                <source 
                    src="/assets/background.webm" 
                    type="video/webm"
                />
                Your browser does not support HTML5 video.
            </video>

            <Header/>
            
            {isMobile ? (
                <div className='z-20 text-center'>
                    <h1 className='text-4xl md:text-5xl text-white font-mono mb-4'>{userName}</h1>
                    <p className="text-xl md:text-2xl text-white font-mono">Network Engineer, Full stack developer</p>
                </div>
            ) : (
                <h1 className="main-subtitle z-10">Network Engineer, Full stack developer</h1>
            )}
            <div className="hero-bottom-gradient" />
        </section>
    );
};

export default Hero;