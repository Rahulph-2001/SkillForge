import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { Project } from '../../types/project';
import ProjectCard from '../../components/projects/ProjectCard';

export default function ProjectsPage() {
    const navigate = useNavigate();
    // @ts-ignore - TODO: Remove when API integration is implemented
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Recent');

    // TODO: Implement API integration
    useEffect(() => {
        // fetchProjects();
    }, [searchQuery, statusFilter, categoryFilter, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600 mb-1">Browse Projects</h1>
                        <p className="text-gray-600 text-sm">Find freelance opportunities and showcase your skills</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            My Projects
                        </button>
                        <button
                            onClick={() => navigate('/projects/create')}
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Post a Project
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search projects by title, skills..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                <option value="Technology">Technology</option>
                                <option value="Languages">Languages</option>
                                <option value="Creative">Creative</option>
                                <option value="Business">Business</option>
                            </select>
                            <select
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All Status">All Status</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Filter className="w-4 h-4" />
                            <span>Sort by:</span>
                        </div>
                        <div className="flex gap-2">
                            {['Recent', 'Budget', 'Most Applications'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setSortBy(option)}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${sortBy === option
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Listing */}
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm mb-4">{projects.length} projects found</p>

                    {projects.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                            <p className="text-gray-500 mb-2">No projects found</p>
                            <p className="text-gray-400 text-sm">Check back later or post a new project</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
