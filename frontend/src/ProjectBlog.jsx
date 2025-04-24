import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "./utils/api";
import { toast } from "react-hot-toast";
import { Carousel } from "@material-tailwind/react";

const ProjectBlog = () => {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('id');
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === (project.image_urls.length - 1) ? 0: prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? project.image_urls.length - 1 : prev - 1
        );
    };

    const CarouselSection = () => (
        <div className="relative w-full mb-8">
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative rounded-xl overflow-hidden">
                {project.image_urls && (
                    <div className="w-full h-full relative">
                        <img 
                            src={getImageUrl(project.image_urls[currentImageIndex])}
                            alt={`${project.title} - View ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain bg-gray-900 transition-opacity duration-500 ease-in-out"
                            style={{
                                animation: 'fadeInOut 0.5s ease-in-out'
                            }}
                        />
                    </div>
                )}
                
                {/* Navigation Buttons */}
                <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 
                              text-white p-4 rounded-full transition-all duration-300 
                              hover:scale-110 hover:shadow-lg z-10"
                >
                    <span className="text-xl">←</span>
                </button>
                <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 
                              text-white p-4 rounded-full transition-all duration-300 
                              hover:scale-110 hover:shadow-lg z-10"
                >
                    <span className="text-xl">→</span>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {project.image_urls && project.image_urls.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentImageIndex === index 
                                    ? "w-8 bg-white scale-110" 
                                    : "w-2 bg-white/50 hover:bg-white/75"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get('/api/projects');
                const selectedProject = response.data.find(p => p.id === parseInt(projectId));
                if (selectedProject) {
                    setProject(selectedProject);
                }
            } catch (error) {
                toast.error('Failed to load project');
                console.error('Error fetching project:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0b263a] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#0b263a] text-white flex items-center justify-center">
                <h1 className="text-4xl">Project not found</h1>
            </div>
        );
    }

    const getImageUrl = (imageUrl) => {
        return `${import.meta.env.VITE_API_URL}/assets/${imageUrl}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b263a] to-black">
            <div className="fixed top-4 left-4 z-10">
                <button 
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 
                             rounded-full transition-all duration-300 transform 
                             hover:scale-105 flex items-center gap-2 text-white"
                >
                    ← Back
                </button>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
                    <div className="flex flex-wrap justify-center gap-2">
                        {project?.tech_stack && (
                            project.tech_stack.includes(',')
                                ? project.tech_stack
                                    .split(',')
                                    .map(tech => tech.trim())
                                    .filter(tech => tech.length > 0)
                                    .map((tech, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 
                                                     rounded-full text-xs font-medium tracking-wider
                                                     transition-colors duration-200 text-white"
                                        >
                                            {tech}
                                        </span>
                                    ))
                                : <span className="px-3 py-1 bg-purple-600 hover:bg-purple-700 
                                                 rounded-full text-xs font-medium tracking-wider
                                                 transition-colors duration-200 text-white">
                                    {project.tech_stack.trim()}
                                  </span>
                        )}
                    </div>
                </div>

                {/* Image Gallery
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {project.image_urls && project.image_urls.map((imageUrl, index) => (
                        <div key={index} 
                             className="relative overflow-hidden rounded-lg shadow-lg group">
                            <img 
                                src={getImageUrl(imageUrl)} 
                                alt={`${project.title} - View ${index + 1}`}
                                className="w-full h-[300px] object-cover transform 
                                         transition-all duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 
                                          to-transparent opacity-0 group-hover:opacity-100 
                                          transition-opacity duration-300" />
                        </div>
                    ))}
                </div> */}
                
                <CarouselSection/>

                {/* Content Section */}
                <div className="bg-[#0f1824] rounded-lg shadow-xl p-6 text-white">
                    <div className="prose prose-invert max-w-none">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-3 text-purple-400">
                                Project Overview
                            </h2>
                            <p className="text-gray-300">
                                {project.description}
                            </p>
                        </div>

                        {project.blog_content && (
                            <div>
                                <h2 className="text-2xl font-bold mb-3 text-purple-400">
                                    Technical Details
                                </h2>
                                <p className="text-gray-300 whitespace-pre-line">
                                    {project.blog_content}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectBlog;