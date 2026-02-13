import React, { memo } from 'react';
import { FaTree } from 'react-icons/fa';
import { images } from '../assets/images';
import { useTranslation } from 'react-i18next';

const PLANTATION_DATA = [
    {
        title: "total_plantation",
        count: "1,20,000",
        icon: <FaTree className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
        color: "#B5EAD7",
        image: images.totalPlantation
    },
    {
        title: " Today`s plantation",
        count: "1,06,500", // Matched with Table Totals from List.jsx
        icon: <FaTree className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
        color: "#FFD1BA",
        image: images.individualPlantation
    },



    {
        title: "zones_created",
        count: "58",
        icon: <FaTree className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: "#CDB4DB",
        image: images.nurseryRegistered
    },
    {
        title: "total_species",
        count: "125",
        icon: <FaTree className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
        color: "#E2F0D9",
        image: images.totalSpecies
    }
];

const PlantationCard = memo(({ title, count, icon, color, image }) => (
    <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center h-[220px] sm:h-[240px] lg:h-[260px] w-full group relative isolate">
        <div className="h-28 sm:h-32 lg:h-36 w-full bg-gray-100 relative flex items-center justify-center overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
            />
            <div className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-40 mix-blend-multiply" style={{ backgroundColor: color }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4 w-full text-center flex-1 flex flex-col justify-center bg-white relative z-10">
            {/* Floating Icon */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-[#4CAF50] text-xl sm:text-2xl lg:text-3xl drop-shadow-sm">{icon}</span>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center gap-1">
                <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-700 leading-tight line-clamp-2 uppercase tracking-wider group-hover:text-[#2E7D32] transition-colors duration-300">{title}</h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E7D32] leading-tight mt-1 tracking-tight drop-shadow-sm">{count}</p>
            </div>
        </div>
    </div>
));

const PlantationRecords = memo(({ selectedDate, selectedEvent }) => {
    const { t } = useTranslation();

    // Mock filtering logic - generates deterministic "random" data based on the date string and event
    const displayData = React.useMemo(() => {
        if (!selectedDate && !selectedEvent) return PLANTATION_DATA;

        // Simple hash function to generate a pseudo-random number from a string
        const hashCode = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash | 0; // Convert to 32bit integer
            }
            return Math.abs(hash);
        };

        // Create a combined string key for the hash
        const filterKey = `${selectedDate || ''}-${selectedEvent || ''}`;
        const filterHash = hashCode(filterKey);

        // Get the total plantation count (static, doesn't change)
        const totalPlantationBase = parseInt(PLANTATION_DATA[0].count.replace(/,/g, '')) || 0;

        return PLANTATION_DATA.map((item, index) => {
            // Keep total_plantation static - it never changes
            if (item.title === "total_plantation") {
                return item;
            }

            // Parse the original count to get a base number (remove commas)
            const baseCount = parseInt(item.count.replace(/,/g, '')) || 0;

            // Generate a variation factor between 0.2 and 0.95 based on filters
            // This ensures data changes with date/event while keeping it realistic
            const variation = ((filterHash + index * 123) % 100) / 100 * 0.75 + 0.2;

            // Calculate new count
            let newCount = Math.floor(baseCount * variation);

            // CRITICAL: If this is plantation data, ensure it doesn't exceed total plantation
            if (item.title === "plantation") {
                newCount = Math.min(newCount, totalPlantationBase);
            }

            // Format number with commas
            const formattedCount = newCount.toLocaleString('en-IN');

            return {
                ...item,
                count: formattedCount
            };
        });
    }, [selectedDate, selectedEvent]);

    const plantationData = displayData.map(item => ({
        ...item,
        title: t(item.title)
    }));
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
            {plantationData.map((card, index) => (
                <div className="w-full min-w-[200px]" key={index}>
                    <PlantationCard {...card} />
                </div>
            ))}
        </div>
    );
});

export default PlantationRecords; 