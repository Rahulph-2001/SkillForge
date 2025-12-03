interface ProfileTabsProps {
  activeTab: 'reviews' | 'about';
  onTabChange: (tab: 'reviews' | 'about') => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="px-6 border-b border-gray-100">
      <div className="flex gap-12">
        <button
          onClick={() => onTabChange('reviews')}
          className={`py-4 px-2 font-medium transition-colors border-b-2 ${
            activeTab === 'reviews'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => onTabChange('about')}
          className={`py-4 px-2 font-medium transition-colors border-b-2 ${
            activeTab === 'about'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          About
        </button>
      </div>
    </div>
  );
}
