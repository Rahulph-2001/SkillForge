import React from 'react';
import { Project } from '../../types/project';
import { Clock, Users, CheckCircle } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'Open':
                return 'bg-blue-100 text-blue-700';
            case 'In_Progress':
                return 'bg-gray-100 text-gray-700';
            case 'Completed':
                return 'bg-green-100 text-green-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatStatus = (status: Project['status']) => {
        switch (status) {
            case 'In_Progress':
                return 'In Progress';
            default:
                return status;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                            {project.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {formatStatus(project.status)}
                        </span>
                    </div>
                </div>
                <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded border border-gray-100">
                    {project.category}
                </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 font-medium">₹</span>
                        <span className="font-semibold text-gray-900">{project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{project.applicationsCount} applications</span>
                    </div>
                </div>

                {project.client && (
                    <div className="flex items-center gap-2">
                        {project.client.avatar ? (
                            <img
                                src={project.client.avatar}
                                alt={project.client.name}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-blue-600">{project.client.name.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-gray-900">{project.client.name}</span>
                                {project.client.isVerified && (
                                    <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-50" />
                                )}
                            </div>
                            {project.client.rating !== undefined && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-gray-500">★ {project.client.rating}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
