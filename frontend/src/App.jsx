import React, { useRef, useEffect, useState } from "react";
import Header from "./components/MainPage/Header";
import Expertise from "./components/MainPage/Expertise";
import Hero from "./components/MainPage/Hero";
import Contact from "./components/MainPage/Contact";
import Projects from "./components/MainPage/Projects";
import Work from "./components/MainPage/Work";
import SideNav from "./components/MainPage/SideNav";
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/MainPage/ErrorBoundary';

function App() {
  const homePageRef = useRef(null);
  const [isHomePageVisible, setIsHomePageVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsHomePageVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (homePageRef.current) {
      observer.observe(homePageRef.current);
    }

    return () => {
      if (observer && homePageRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e3f',
            color: '#fff',
          },
          success: { style: { background: 'green' } },
          error: { style: { background: 'red' } },
        }}
      />
      <main className="bg-black min-h-screen">
        <div ref={homePageRef} className="flex flex-col justify-center">
          <Hero />
          <SideNav visible={!isHomePageVisible} />
        </div>
        <div className="sections">
          <Expertise />
          <Work />
          <Projects />
          <Contact />
        </div>
      </main>
    </ErrorBoundary>
  );
}

export default App;
