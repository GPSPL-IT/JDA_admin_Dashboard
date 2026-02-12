import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ZoneDetails from './ZoneDetails';

const List = ({ selectedDate, selectedEvent }) => {
    const { t } = useTranslation('list');
    const navigate = useNavigate();

    // Modal State
    const [selectedZone, setSelectedZone] = React.useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(8); // Changed to 8 records per page
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    // Memoize the data generation based on date/event
    const currentZonesData = React.useMemo(() => {
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

        // Generate variation factor - MUST MATCH PlantationRecords logic for index 1 ("plantation" item)
        // This ensures the variations are identical across components
        const variation = ((filterHash + 1 * 123) % 100) / 100 * 0.75 + 0.2;

        // Base Data
        const baseZones = [
            { zoneName: "Zone 1", indiv: 18500, block: 5000, nursery: 2000, total: 25500 },
            { zoneName: "Zone 2", indiv: 16200, block: 4500, nursery: 1800, total: 22500 },
            { zoneName: "Zone 3", indiv: 15800, block: 3800, nursery: 1500, total: 21100 },
            { zoneName: "Zone 4", indiv: 14500, block: 3200, nursery: 1200, total: 18900 },
            { zoneName: "Zone 5", indiv: 13500, block: 2800, nursery: 1000, total: 17300 },
            { zoneName: "Zone 6", indiv: 15000, block: 4100, nursery: 1600, total: 20700 },
            { zoneName: "Zone 7", indiv: 13000, block: 3500, nursery: 1400, total: 17900 }
        ];

        return baseZones.map(zone => {
            const newIndiv = Math.floor(zone.indiv * variation);
            const newBlock = Math.floor(zone.block * variation);
            const newNursery = Math.floor(zone.nursery * variation);
            const newTotal = Math.floor(zone.total * variation);

            return {
                ...zone,
                indiv: newIndiv.toLocaleString('en-IN'),
                block: newBlock.toLocaleString('en-IN'),
                nursery: newNursery.toLocaleString('en-IN'),
                total: newTotal.toLocaleString('en-IN') // This might not perfectly sum up due to individual flooring, but close enough
            };
        });
    }, [selectedDate, selectedEvent]);

    // Filter zones by search query
    const filteredZones = currentZonesData.filter(zone =>
        zone.zoneName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination values based on filtered data
    const totalPages = Math.ceil(filteredZones.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentZones = filteredZones.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reset to first page when changing rows per page
    };

    // Handle search change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Calculate total plantation count from all zones
    const totalPlantation = React.useMemo(() => {
        return filteredZones.reduce((sum, zone) => {
            // Remove commas and parse as integer
            const count = parseInt(zone.indiv.replace(/,/g, '')) || 0;
            return sum + count;
        }, 0);
    }, [filteredZones]);

    // Static total plantation limit
    const TOTAL_PLANTATION_LIMIT = 120000;
    const exceedsLimit = totalPlantation > TOTAL_PLANTATION_LIMIT;

    return (
        <div className="lg:w-1/2 md:w-1/2 px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm flex flex-col h-[600px] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-lg font-bold text-white flex items-center tracking-wide">
                        <div className="bg-white/20 p-1.5 rounded-lg mr-3 backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        {t('header')}
                    </h2>
                    {/* Search Bar */}
                    <div className="flex items-center w-full sm:w-auto relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={t('searchZone') || 'Search zone...'}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border-none rounded-full bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all text-sm backdrop-blur-sm"
                        />
                        <svg className="w-4 h-4 text-white/70 absolute left-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-hidden flex flex-col bg-white">
                    <div className="overflow-x-auto flex-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-30">
                                            {t('zone') || 'Zone Name'}
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {t('individual')}
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {t('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {currentZones.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-12 text-gray-400 text-sm">
                                                <div className="flex flex-col items-center gap-2">
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {t('noZonesFound') || 'No zones found.'}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentZones.map((zone, index) => (
                                            <tr key={index} className="hover:bg-green-50/50 transition-colors duration-200 group">
                                                <td className="px-6 py-4 text-sm text-gray-700 font-semibold sticky left-0 bg-white group-hover:bg-green-50/50 z-10 border-r border-transparent group-hover:border-green-100/50">
                                                    {zone.zoneName}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right text-gray-600 font-medium font-mono">
                                                    {zone.indiv}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedZone(zone)}
                                                        className="px-3 py-1.5 text-xs font-medium text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#2E7D32] hover:text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                                                    >
                                                        {t('viewDetails')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs text-gray-500 font-medium">
                            {t('totalRecords')}: <span className="text-gray-900">{filteredZones.length}</span>
                        </div>
                        <div className={`text-sm font-bold ${exceedsLimit ? 'text-red-600' : 'text-[#2E7D32]'
                            }`}>
                            Total Plantation: <span className="font-mono">{totalPlantation.toLocaleString('en-IN')}</span>
                            {exceedsLimit && (
                                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                    Exceeds limit!
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-md text-gray-500 hover:text-[#2E7D32] hover:bg-green-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span className="text-xs font-medium text-gray-700 px-2 min-w-[3rem] text-center">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-md text-gray-500 hover:text-[#2E7D32] hover:bg-green-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        <select
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                        >
                            <option value="5">5 rows</option>
                            <option value="8">8 rows</option>
                            <option value="10">10 rows</option>
                            <option value="15">15 rows</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Zone Details Modal */}
            {selectedZone && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedZone(null)}
                    ></div>
                    <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col">
                        <ZoneDetails
                            zoneName={selectedZone.zoneName}
                            zoneData={selectedZone}
                            onClose={() => setSelectedZone(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default List;
