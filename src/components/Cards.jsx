import React, { useState, memo } from 'react';
import { FaTree, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import PlantationRecords from './PlantationRecords';
import SpecialEvents, { EVENTS_DATA } from './SpecialEvents';
import { useTranslation } from 'react-i18next';

const TabButton = memo(({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold transition-all duration-200 border-2 select-none shadow-md
            ${active
                ? 'bg-[#1a5d1a] text-white border-[#1a5d1a] shadow-lg scale-105 z-10'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
    >
        {icon}
        <span className="whitespace-nowrap">{label}</span>
    </button>
));

const SearchBar = memo(({ placeholder }) => (
    <div className="relative w-full md:w-auto group">
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full md:w-[300px] lg:w-[400px] px-4 py-2.5 pl-10 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            />
            <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#4CAF50] transition-colors duration-300" />
        </div>
    </div>
));

const Cards = ({ selectedDate, setSelectedDate, selectedEvent, setSelectedEvent }) => {
    const [activeTab, setActiveTab] = useState('plantation');
    const [showGallery, setShowGallery] = useState(false);
    const { t } = useTranslation();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'plantation') {
            setSelectedEvent(null);
            setShowGallery(false);
        }
    };

    const handleEventSelect = (eventId) => {
        if (selectedEvent === eventId) {
            setSelectedEvent(null);
            setShowGallery(false);
        } else {
            setSelectedEvent(eventId);
            setShowGallery(false);
        }
    };

    return (
        <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 mt-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header Section with Gradient Background */}
                <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white via-gray-50 to-green-50/30">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <TabButton
                                    active={activeTab === 'plantation'}
                                    onClick={() => handleTabChange('plantation')}
                                    icon={<FaTree className={activeTab === 'plantation' ? "w-5 h-5" : "w-5 h-5 opacity-70"} />}
                                    label={t('plantation_record', 'Plantation Records')}
                                />
                                <TabButton
                                    active={activeTab === 'events'}
                                    onClick={() => handleTabChange('events')}
                                    icon={<FaCalendarAlt className={activeTab === 'events' ? "w-5 h-5" : "w-5 h-5 opacity-70"} />}
                                    label={t('special_events', 'Special Events')}
                                />
                            </div>
                            <div className="md:ml-auto w-full md:w-auto flex flex-col sm:flex-row gap-3">
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all duration-300 bg-white text-gray-700 shadow-md hover:shadow-lg cursor-pointer font-medium"
                                    />
                                </div>
                                <SearchBar placeholder={t('search_placeholder', 'Search records...')} />
                            </div>
                        </div>

                        {/* Event Filter Buttons */}
                        {activeTab === 'events' && (
                            <div className="flex flex-wrap gap-2.5 animate-fadeIn pt-2">
                                {EVENTS_DATA.map((event) => (
                                    <button
                                        key={event.id}
                                        onClick={() => handleEventSelect(event.id)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border shadow-md hover:shadow-lg transform hover:scale-105 ${selectedEvent === event.id
                                            ? 'bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white border-[#2E7D32] shadow-green-900/30 scale-105'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32] hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100'
                                            }`}
                                    >
                                        {t(event.title)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-b from-gray-50/50 to-white rounded-b-3xl">
                    {(activeTab === 'plantation' || (activeTab === 'events' && selectedEvent)) && (
                        <PlantationRecords selectedDate={selectedDate} selectedEvent={selectedEvent} />
                    )}

                    {activeTab === 'events' && selectedEvent && (
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <button
                                onClick={() => setShowGallery(!showGallery)}
                                className="mx-auto flex items-center justify-center gap-2 px-6 py-3 text-[#2E7D32] font-bold hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-full transition-all duration-300 border-2 border-[#2E7D32]/30 hover:border-[#2E7D32] mb-6 group shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                <FaCalendarAlt className="group-hover:scale-110 transition-transform duration-300" />
                                {showGallery ? t('hide_event_gallery', 'Hide Event Gallery') : t('show_event_gallery', 'Show Event Gallery')}
                            </button>

                            {showGallery && (
                                <div className="animate-fadeIn">
                                    <SpecialEvents />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Cards);
