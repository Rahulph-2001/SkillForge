import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  bgColor: string;
}


const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bgColor }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center text-xl mb-4`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

export default StatCard;
