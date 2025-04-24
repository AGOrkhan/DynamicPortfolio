import Header from './Header';

const Hero = () => {
    const handleVideoError = (e) => {
        console.error('Video loading error:', e);
    };

    return (
        <section id="home" className="page-section title-section relative min-h-screen flex items-center justify-center">
            <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                preload="auto"
                className="background-video"
                onError={handleVideoError}
            >
                <source 
                    src="/assets/background_new.mp4" 
                    type="video/mp4"
                />
                <source 
                    src="/assets/background.webm" 
                    type="video/webm"
                />
                Your browser does not support HTML5 video.
            </video>

            <Header/>
            
            <p className="main-subtitle">Software Engineer, Full stack developer</p>
            <div className="hero-bottom-gradient" />
        </section>
    );
};

export default Hero;