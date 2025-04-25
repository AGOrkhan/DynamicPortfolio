import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import ProjectPopup from "./ProjectPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import { MdDelete, MdEdit } from "react-icons/md";

const AdminPanel = () => {
    const [projects, setProjects] = useState([]);
    const [archivedProjects, setArchivedProjects] = useState([]);
    const [showArchived, setShowArchived] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteClicked, setDeleteClicked] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch projects on component mount
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const [activeRes, archivedRes] = await Promise.all([
                api.get('/api/admin/projects'),
                api.get('/api/admin/projects/archived')
            ]);
            setProjects(activeRes.data);
            setArchivedProjects(archivedRes.data);
        } catch (error) {
            toast.error('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/admin/projects/${selectedProject.id}`);
            toast.success('Project deleted successfully');
            fetchProjects(); // Refresh the projects list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete project');
        } finally {
            setDeleteClicked(false);
            setSelectedProject(null);
        }
    };

    const handleArchive = async (project) => {
        try {
            await api.put(`/api/admin/projects/${project.id}/archive`);
            toast.success('Project archived successfully');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to archive project');
        }
    };

    const handleUnarchive = async (project) => {
        try {
            await api.put(`/api/admin/projects/${project.id}/unarchive`);
            toast.success('Project unarchived successfully');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to unarchive project');
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>;
    }

    return (
        <div className="min-h-screen text-white">
            <div className="flex justify-between items-center py-12 px-12">
                <h1 className="text-5xl font-bold">Admin Panel</h1>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowArchived(!showArchived)} 
                        className="bg-[#2c5282] hover:bg-[#2b4c7e] px-6 py-3 rounded-lg text-lg font-medium transition-colors"
                    >
                        {showArchived ? 'Show Active Projects' : 'Show Archived Projects'}
                    </button>

                    <button 
                        onClick={() => setShowPopup(true)} 
                        className="bg-[#428332] hover:bg-[#3b732d] px-6 py-3 rounded-lg text-lg font-medium transition-colors"
                    >
                        Add Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-12">
                {(showArchived ? archivedProjects : projects).map((project) => (
                    <div 
                        key={project.id}
                        className="bg-slate-700/50 rounded-lg p-6 relative group
                            transition-all duration-500 ease-in-out
                            hover:bg-slate-600/50 hover:scale-[1.02]"
                    >
                        <h1 className="text-xl font-medium mb-4">{project.title}</h1>
                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                            {project.description}
                        </p>
                        
                        <div className="flex justify-end gap-2 mt-4">
                            <button 
                                onClick={() => {
                                    setSelectedProject(project);
                                    setShowPopup(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => showArchived ? handleUnarchive(project) : handleArchive(project)}
                                className={`${
                                    showArchived 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-yellow-600 hover:bg-yellow-700'
                                } px-4 py-2 rounded-lg transition-colors`}
                            >
                                {showArchived ? 'Unarchive' : 'Archive'}
                            </button>
                            <button 
                                onClick={() => {
                                    setSelectedProject(project);
                                    setDeleteClicked(true);
                                }}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showPopup && (
                <ProjectPopup
                    project={selectedProject}
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedProject(null);
                    }}
                    onSuccess={() => {
                        setShowPopup(false);
                        setSelectedProject(null);
                        fetchProjects();
                    }}
                />
            )}

            {deleteClicked && (
                <ConfirmationPopup
                    message={`Are you sure you want to delete ${selectedProject?.title}?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteClicked(false)}
                    confirmText="Delete"
                    confirmButtonClass="bg-red-600 hover:bg-red-500"
                />
            )}
        </div>
    );
};

export default AdminPanel;