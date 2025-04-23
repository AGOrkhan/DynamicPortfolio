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
            
            // Calculate which card to snap to
            const container = carouselRef.current;
            const cardWidth = container.offsetWidth;
            const scrollPosition = container.scrollLeft;
            const targetCard = Math.round(scrollPosition / cardWidth);
            
            container.scrollTo({
                left: targetCard * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>;
    }

    return (
        <section id="projects" className="py-16 text-white px-4 md:px-24">
            <h2 className="text-4xl font-extrabold text-center mb-10">Projects</h2>

            <div
                ref={carouselRef}
                className="carousel flex overflow-x-auto scrollbar-hide"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                style={{
                    WebkitOverflowScrolling: 'touch',
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
            >
                {projects.map((project) => (
                    <div key={project.id} 
                         className="project-card shrink-0 w-[300px] md:w-[700px] h-[400px] md:h-[500px] 
                                 bg-gray-800 rounded-2xl shadow-lg mx-3 snap-center 
                                 transition-transform duration-300 hover:scale-[1.02]">
                        {project.image_urls && (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/assets/${project.image_urls[0]}`}
                                alt={project.title}
                                className="w-full h-3/5 object-cover rounded-t-2xl"
                                draggable="false"
                            />
                        )}
                        <div className="p-6 flex flex-col h-2/5">
                            <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project?.tech_stack && (
                                    project.tech_stack.includes(',')
                                        ? project.tech_stack
                                            .split(',')
                                            .map(tech => tech.trim())
                                            .filter(tech => tech.length > 0)
                                            .map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 
                                                            rounded-full text-xs font-medium tracking-wider
                                                            transition-colors duration-200"
                                                >
                                                    {tech}
                                                </span>
                                            ))
                                        : <span className="px-3 py-1 bg-purple-600 hover:bg-purple-700 
                                                        rounded-full text-xs font-medium tracking-wider
                                                        transition-colors duration-200">
                                            {project.tech_stack.trim()}
                                        </span>
                                )}
                            </div>
                            <div className="relative flex-grow">
                                <p className="text-gray-300 line-clamp-3 pr-16 relative">
                                    {project.description}
                                    <span className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-800 to-transparent" />
                                </p>
                                <button
                                    onClick={() => navigate(`/projects?id=${project.id}`)}
                                    className="absolute bottom-0 right-0 text-sm text-gray-300 hover:text-white 
                                             underline underline-offset-2 font-normal transition-colors duration-200"
                                >
                                    Read
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
