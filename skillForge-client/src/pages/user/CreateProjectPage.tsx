import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateProjectPage() {
    const navigate = useNavigate();
    const [skills, setSkills] = useState<string[]>([]);
    const [currSkill, setCurrSkill] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        budget: '',
        duration: '',
        deadline: ''
    });

    const handleAddSkill = () => {
        if (currSkill.trim() && !skills.includes(currSkill.trim())) {
            setSkills([...skills, currSkill.trim()]);
            setCurrSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API integration
        toast.success("Project posted successfully (Demo)");
        navigate('/projects');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-blue-600 mb-1">Post a New Project</h1>
                    <p className="text-gray-600 text-sm">Create a project and find the perfect contributor</p>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">7</span> project posts remaining this month (Professional Plan)
                        <button className="ml-2 text-blue-600 hover:text-blue-700 underline font-medium">Upgrade</button>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Details</h2>

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="e.g., E-commerce Website Development"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
                                    placeholder="Provide a detailed description of your project, including requirements, deliverables, and any specific expectations..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="web-development">Web Development</option>
                                    <option value="mobile-app">Mobile App Development</option>
                                    <option value="design">Design & Creative</option>
                                    <option value="writing">Writing & Translation</option>
                                    <option value="digital-marketing">Digital Marketing</option>
                                    <option value="video-animation">Video & Animation</option>
                                </select>
                            </div>

                            {/* Required Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Required Skills <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        value={currSkill}
                                        onChange={(e) => setCurrSkill(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {skills.map((skill) => (
                                            <span key={skill} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="hover:text-blue-900 focus:outline-none"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Budget */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Budget (₹ Rupees) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        placeholder="25000"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Amount will be held in escrow until project completion</p>
                                </div>

                                {/* Estimated Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estimated Duration <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        placeholder="e.g., 4-6 weeks"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Application Deadline (Optional)
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment & Escrow Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment & Escrow</h2>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
                            <div className="flex gap-3">
                                <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-semibold text-emerald-800 mb-2">How payment works:</h3>
                                    <ul className="list-disc ml-4 space-y-1 text-sm text-emerald-700">
                                        <li>Your budget amount will be paid upfront and held in admin escrow when you post the project</li>
                                        <li>Funds are held securely by the platform until the project is completed</li>
                                        <li>When you approve the work, your request goes to admin for final verification</li>
                                        <li>Admin approves the release, and funds are transferred to the contributor</li>
                                        <li>If you reject the work, you can request a refund which also requires admin approval</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Post Project & Pay to Escrow
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
