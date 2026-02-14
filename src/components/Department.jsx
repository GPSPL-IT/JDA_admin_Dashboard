import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SpeciesDetails from './SpeciesDetails';

const Department = ({ selectedDate, selectedEvent }) => {
    const { t } = useTranslation('department');
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(8); // Match List default
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedSpecies, setSelectedSpecies] = React.useState(null);

    // Memoize the data generation based on date/event
    const currentSpeciesData = React.useMemo(() => {
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

        // Base Data - Adjusted to sum to 143,900 (Calculated to match Zone List total)
        const baseSpecies = [
            { speciesName: "Neem (Azadirachta indica)", indiv: 24000, block: 7000, nursery: 4000, total: 35000 },
            { speciesName: "Peepal (Ficus religiosa)", indiv: 20000, block: 6000, nursery: 3000, total: 29000 },
            { speciesName: "Banyan (Ficus benghalensis)", indiv: 17000, block: 5000, nursery: 2500, total: 24500 },
            { speciesName: "Khejri (Prosopis cineraria)", indiv: 13000, block: 4000, nursery: 2000, total: 19000 },
            { speciesName: "Gulmohar (Delonix regia)", indiv: 11000, block: 3000, nursery: 1500, total: 15500 },
            { speciesName: "Ashoka (Saraca asoca)", indiv: 9000, block: 2500, nursery: 1200, total: 12700 },
            { speciesName: "Amaltas (Cassia fistula)", indiv: 8000, block: 2000, nursery: 1000, total: 11000 },
            { speciesName: "Arjun (Terminalia arjuna)", indiv: 7500, block: 1500, nursery: 800, total: 9800 }
        ];

        // Calculate target total based on base sums (should be 143900 + variation)
        // We use the same variation logic as List.jsx to ensure matching totals
        const baseTotalSum = 156500; // Recalculated sum of above totals
        const targetTotalData = Math.floor(baseTotalSum * variation);

        // Distribution logic to ensure exact sum matches targetTotalData
        let currentTotalSum = 0;

        return baseSpecies.map((species, index) => {
            const newIndiv = Math.floor(species.indiv * variation);
            const newBlock = Math.floor(species.block * variation);
            const newNursery = Math.floor(species.nursery * variation);

            let newTotal;
            if (index === baseSpecies.length - 1) {
                // Adjust the last item to match the target total exactly
                newTotal = targetTotalData - currentTotalSum;
            } else {
                newTotal = Math.floor(species.total * variation);
                currentTotalSum += newTotal;
            }

            return {
                ...species,
                indiv: newIndiv.toLocaleString('en-IN'),
                block: newBlock.toLocaleString('en-IN'),
                nursery: newNursery.toLocaleString('en-IN'),
                total: newTotal.toLocaleString('en-IN')
            };
        });
    }, [selectedDate, selectedEvent]);

    // Filter species by search query
    const filteredSpecies = currentSpeciesData.filter(species =>
        species.speciesName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination values based on filtered data
    const totalPages = Math.ceil(filteredSpecies.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentSpecies = filteredSpecies.slice(startIndex, endIndex);

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

    // Calculate total plantation count from all species
    const totalPlantation = React.useMemo(() => {
        // If searching, sum filtered rows. If not searching, use the exact target total from the first row's generation logic? 
        // Better: always sum the currently visible/filtered rows' *total* column to be accurate to what's shown.
        return filteredSpecies.reduce((sum, species) => {
            // Remove commas and parse as integer
            const count = parseInt(species.total.replace(/,/g, '')) || 0;
            return sum + count;
        }, 0);
    }, [filteredSpecies]);

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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        {t('headerSpecies')}
                    </h2>
                    {/* Search Bar */}
                    <div className="flex items-center w-full sm:w-auto relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={t('searchSpecies') || 'Search species...'}
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
                                            {t('speciesName')}
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
                                    {currentSpecies.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-12 text-gray-400 text-sm">
                                                <div className="flex flex-col items-center gap-2">
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {t('noSpeciesFound') || 'No species found.'}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentSpecies.map((species, index) => (
                                            <tr key={index} className="hover:bg-green-50/50 transition-colors duration-200 group">
                                                <td className="px-6 py-4 text-sm text-gray-700 font-semibold sticky left-0 bg-white group-hover:bg-green-50/50 z-10 border-r border-transparent group-hover:border-green-100/50">
                                                    {species.speciesName}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right text-gray-600 font-medium font-mono">
                                                    {species.total}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedSpecies(species)}
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
                            {t('totalRecords')}: <span className="text-gray-900">{filteredSpecies.length}</span>
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

            {/* Species Details Modal */}
            {selectedSpecies && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedSpecies(null)}
                    ></div>
                    <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col">
                        <SpeciesDetails
                            speciesName={selectedSpecies.speciesName}
                            speciesData={selectedSpecies}
                            onClose={() => setSelectedSpecies(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Department;
