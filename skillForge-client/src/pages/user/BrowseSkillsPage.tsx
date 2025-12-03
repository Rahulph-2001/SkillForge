import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Clock, Award, Loader2, Filter, X } from 'lucide-react';
import Navbar from '../../components/shared/Navbar/Navbar';
import Pagination from '../../components/shared/Pagination';
import { useAppSelector } from '../../store/hooks';
import { browseSkillsService, BrowseSkill } from '../../services/browseSkillsService';
import { toast } from 'react-hot-toast';

export default function BrowseSkillsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [skills, setSkills] = useState<BrowseSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Technology',
    'Languages',
    'Music',
    'Fitness',
    'Creative',
    'Professional',
    'Business',
    'Arts',
    'Science',
  ];

  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchSkills();
  }, [searchQuery, selectedCategory, selectedLevel, currentPage]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await browseSkillsService.browseSkills({
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        level: selectedLevel !== 'All Levels' ? selectedLevel : undefined,
        page: currentPage,
        limit: 12,
        excludeProviderId: user?.id, // Exclude user's own skills
      });
      
      setSkills(response.skills);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Failed to fetch skills:', error);
      toast.error(error.response?.data?.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (skillId: string) => {
    navigate(`/skills/${skillId}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All Levels');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All Levels';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <Navbar 
        isAuthenticated={!!user}
        user={user ? {
          name: user.name,
          avatar: user.avatar || undefined,
          credits: user.credits,
          subscriptionPlan: 'free'
        } : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Award className="w-10 h-10 text-blue-600" />
            Browse Skills
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and book sessions with expert skill providers from around the world
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills, tags, or providers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filter Toggle for Mobile */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <span className="text-sm text-gray-600 font-semibold">Filters:</span>
              
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              {/* Clear Filters Button (Desktop) */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{skills.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{total}</span> skills
          </p>
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && skills.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading amazing skills...</p>
          </div>
        ) : (
          <>
            {/* Skills Grid */}
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
                  >
                    {/* Skill Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
                      {skill.imageUrl ? (
                        <img
                          src={skill.imageUrl}
                          alt={skill.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-7xl font-bold text-white drop-shadow-lg">
                            {skill.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold rounded-full shadow-md">
                          {skill.category}
                        </span>
                      </div>
                      {/* Level Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 backdrop-blur-sm text-xs font-bold rounded-full shadow-md ${
                          skill.level === 'Beginner' ? 'bg-green-500/90 text-white' :
                          skill.level === 'Intermediate' ? 'bg-yellow-500/90 text-white' :
                          'bg-red-500/90 text-white'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Title and Rating */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {skill.title}
                        </h3>
                        {skill.rating > 0 && (
                          <div className="flex items-center gap-1 ml-2 bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">
                              {skill.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {skill.description}
                      </p>

                      {/* Provider */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {skill.provider.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {skill.provider.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{skill.durationHours} hours</span>
                            {skill.totalSessions > 0 && (
                              <>
                                <span>•</span>
                                <span>{skill.totalSessions} sessions</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {skill.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                            >
                              #{tag}
                            </span>
                          ))}
                          {skill.tags.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{skill.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price and Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">Price</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-green-600">
                              {skill.creditsPerHour}
                            </span>
                            <span className="text-gray-500 text-xs">credits/hr</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewDetails(skill.id)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills found</h3>
                <p className="text-gray-500 mb-6">
                  {hasActiveFilters
                    ? 'Try adjusting your search or filters to find what you\'re looking for'
                    : 'No skills are currently available'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
