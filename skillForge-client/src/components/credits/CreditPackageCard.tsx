import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

export interface CreditPackageProps {
    id: string;
    credits: number;
    price: number;
    finalPrice: number;
    savings: number; // Accepts both for compatibility
    discount: number;
    isPopular: boolean;
    onSelect: (id: string) => void;
    selected: boolean;
}

const CreditPackageCard: React.FC<CreditPackageProps> = ({
    id,
    credits,
    price,
    finalPrice,
    savings,
    discount,
    isPopular,
    onSelect,
    selected
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => onSelect(id)}
            className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${selected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-transparent bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-md'
                }`}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <FaStar className="text-[10px]" /> POPULAR
                </div>
            )}

            {discount > 0 && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                    SAVE {discount}%
                </div>
            )}

            <div className="text-center mb-4 pt-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    {credits}
                </div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                    Credits
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2">
                    {discount > 0 && (
                        <span className="text-gray-400 line-through text-sm">
                            ₹{price}
                        </span>
                    )}
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{finalPrice}
                    </span>
                </div>
                {savings > 0 && (
                    <div className="text-center text-xs text-green-600 font-medium">
                        You save ₹{savings}
                    </div>
                )}
            </div>

            <div className={`w-full py-2 rounded-xl text-center font-semibold transition-colors ${selected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                }`}>
                {selected ? 'Selected' : 'Select Package'}
            </div>
        </motion.div>
    );
};

export default CreditPackageCard;
