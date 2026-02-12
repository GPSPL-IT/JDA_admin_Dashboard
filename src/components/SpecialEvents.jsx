import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '../assets/images';
import { useTranslation } from 'react-i18next';

export const EVENTS_DATA = [
    {
        id: 'hariyali_teej',
        title: "hariyali_teej",
        date: "August 19, 2023",
        description: "hariyali_teej_desc",
        image: images.hariyaliTeej
    },
    {
        id: 'pm_scheme',
        title: "pm_scheme",
        date: "ongoing",
        description: "pm_scheme_desc",
        image: images.pmScheme
    },
    {
        id: 'world_environment_day',
        title: "world_environment_day",
        date: "June 5, 2023",
        description: "world_environment_day_desc",
        image: images.worldEnvironment
    }
];

const EventCard = memo(({ title, date, description, image, onClick }) => (
    <div
        className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 hover:shadow-2xl transition-all duration-500 flex flex-col items-center h-[260px] sm:h-[280px] lg:h-[300px] w-full cursor-pointer group relative isolate overflow-hidden"
        onClick={onClick}
    >
        <div className="h-32 sm:h-36 lg:h-40 w-full bg-gray-100 relative flex items-center justify-center overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300" />

            {/* Date Badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <p className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">{date}</p>
            </div>
        </div>

        <div className="p-4 sm:p-5 w-full flex-1 flex flex-col relative z-10 bg-white">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight mb-2 line-clamp-1 group-hover:text-[#2E7D32] transition-colors duration-300">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{description}</p>

            <div className="mt-auto flex items-center text-[#2E7D32] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>View Details</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
    </div>
));

const SpecialEvents = memo(() => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const eventsData = EVENTS_DATA.map(item => ({
        ...item,
        title: t(item.title),
        description: t(item.description)
    }));
    const handleEventClick = (eventId) => {
        navigate(`/events?event=${eventId}`);
    };
    return (
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10 pb-8">
            {eventsData.map((event, index) => (
                <div key={index} className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.33%-2rem)] lg:w-[calc(25%-2.5rem)] xl:w-[calc(20%-2.5rem)] min-w-[260px] max-w-[340px]">
                    <EventCard
                        {...event}
                        onClick={() => handleEventClick(event.id)}
                    />
                </div>
            ))}
        </div>
    );
});

export default SpecialEvents; 