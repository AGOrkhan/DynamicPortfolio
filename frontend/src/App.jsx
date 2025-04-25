import React, { useRef, useEffect, useState, Suspense } from "react";
import Header from "./components/MainPage/Header";
import Expertise from "./components/MainPage/Expertise";
import Hero from "./components/MainPage/Hero";
import Contact from "./components/MainPage/Contact";
import Projects from "./components/MainPage/Projects";
import Work from "./components/MainPage/Work";
import SideNav from "./components/MainPage/SideNav";
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/MainPage/ErrorBoundary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const AdminPanel = React.lazy(() => import('./components/Admin/AdminPanel'));

function App() {
  const userId = import.meta.env.VITE_USER_ID;
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

  useEffect(() => {
    const handleWheel = (e) => {
      const carousel = document.querySelector('.carousel');
      if (carousel && (carousel === e.target || carousel.contains(e.target))) {
        e.preventDefault();
      }
    };

    // Add wheel event listener to document
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
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
      <Routes>
        <Route 
          path="/admin/*" 
          element={
            <Suspense>
              <AdminPanel />
            </Suspense>
          } 
        />
        <Route 
          path="/" 
          element={
            <main className="bg-black min-h-screen">
              <div className="lg:hidden">
                <Header/>
              </div>
              <div ref={homePageRef} className="flex flex-col justify-center">
                <Hero />
                <SideNav visible={!isHomePageVisible} />
              </div>
              <div className="sections">
                <Expertise />
                <Work userId={parseInt(userId)}/>
                <Projects />
                <Contact />
              </div>
            </main>
          } 
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
