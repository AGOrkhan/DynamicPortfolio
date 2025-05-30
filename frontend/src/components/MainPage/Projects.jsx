import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/api/projects');
                setProjects(response.data);
            } catch (error) {
                toast.error('Failed to load projects');
                console.error('Error fetching projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            const preventScroll = (e) => {
                if (e.target.closest('.carousel')) {
                    e.preventDefault();
                }
            };
            
            carousel.addEventListener('wheel', preventScroll, { passive: false });
            return () => carousel.removeEventListener('wheel', preventScroll);
        }
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX);
        setScrollLeft(carouselRef.current.scrollLeft);
        carouselRef.current.classList.add('dragging');
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 1.5;
        requestAnimationFrame(() => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft = scrollLeft - walk;
            }
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.classList.remove('dragging');
            
            const container = carouselRef.current;
            const scrollPosition = container.scrollLeft;
            const cardWidth = container.children[0].offsetWidth + 24;
            const nearestCard = Math.round(scrollPosition / cardWidth);
            
            container.scrollTo({
                left: nearestCard * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleWheel = (e) => {
        if (carouselRef.current && e.target.closest('.carousel')) {
            e.preventDefault();
            e.stopPropagation(); // Stop event from bubbling up
            
            const container = carouselRef.current;
            const cardWidth = container.children[0].offsetWidth + 24;
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            // Only scroll if there's more content
            if (maxScroll > 0) {
                const newScrollPosition = e.deltaY > 0 
                    ? Math.min(container.scrollLeft + cardWidth, maxScroll)
                    : Math.max(container.scrollLeft - cardWidth, 0);

                container.scrollTo({
                    left: newScrollPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>;
    }

    return (
        <section id="projects" className="py-16 text-white relative">
            <h2 className="text-5xl lg:text-7xl text-center mb-[50px] font-extrabold">Projects</h2>
            
            <div className="relative px-4 md:px-12">
                <div
                    ref={carouselRef}
                    className="carousel flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth pb-4"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onWheel={handleWheel}
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    {projects.map((project) => (
                        <div key={project.id} 
                             className="project-card shrink-0 w-[300px] md:w-[700px] bg-gray-800 rounded-2xl shadow-lg 
                                      first:ml-4 md:first:ml-8 last:mr-[20%] transition-transform duration-300 hover:scale-[1.02]">
                            {project.image_urls && (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/assets/${project.image_urls[0]}`}
                                    alt={project.title}
                                    className="rounded-t-2xl"
                                    draggable="false"
                                />
                            )}
                            <div className="content-wrapper">
                                <h3 className="text-xl font-bold">{project.title}</h3>
                                <div className="tech-stack-container">
                                    {project?.tech_stack && project.tech_stack.split(',').map((tech, idx) => (
                                        <span key={idx} 
                                              className="px-3 py-1 bg-purple-600 rounded-full text-xs font-medium 
                                                       whitespace-nowrap">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                                <div className="description-container">
                                    <p className="description-text text-gray-300">
                                        {project.description}
                                    </p>
                                    <span 
                                        onClick={() => navigate(`/projects?id=${project.id}`)}
                                        className="read-more text-sm text-gray-300 hover:text-white 
                                                 underline underline-offset-2 cursor-pointer"
                                    >
                                        Read
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
