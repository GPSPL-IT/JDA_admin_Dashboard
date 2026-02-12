import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaInfoCircle, FaDownload, FaFileExcel, FaFileCsv, FaPlus } from "react-icons/fa";
import images from '../../../assets/images';
import { useTranslation } from 'react-i18next';

// Sample species data
const sampleSpecies = [
    {
        id: 1,
        speciesName: 'Neem',
        scientificName: 'Azadirachta indica',
        totalPlanted: 3500,
        survivalRate: 92,
        status: 'Active',
        preImage: images.preplantation,
        postImage: images.postplantation,
        contactPerson: 'Dr. Rajesh Kumar',
        contactNumber: '+91 9876543210',
        state: 'Rajasthan',
        category: 'Medicinal',
        nativeStatus: 'Native',
        growthRate: 'Fast',
        height: '15-20m',
        plantingSeasons: ['Monsoon', 'Winter'],
        benefits: 'Medicinal properties, Air purification, Shade',
        zones: ['Zone 1', 'Zone 2', 'Zone 3'],
        wards: ['Ward 1', 'Ward 5', 'Ward 8'],
        createdAt: '12/1/2023, 10:00:00 AM',
        updatedAt: '2/1/2024, 3:00:00 PM',
    },
    {
        id: 2,
        speciesName: 'Peepal',
        scientificName: 'Ficus religiosa',
        totalPlanted: 2800,
        survivalRate: 88,
        status: 'Active',
        preImage: images.preplantation,
        postImage: images.postplantation,
        contactPerson: 'Dr. Priya Sharma',
        contactNumber: '+91 9876543211',
        state: 'Rajasthan',
        category: 'Sacred',
        nativeStatus: 'Native',
        growthRate: 'Medium',
        height: '20-30m',
        plantingSeasons: ['Monsoon'],
        benefits: 'Religious significance, Oxygen production, Shade',
        zones: ['Zone 1', 'Zone 4'],
        wards: ['Ward 2', 'Ward 6'],
        createdAt: '12/10/2023, 11:00:00 AM',
        updatedAt: '2/5/2024, 4:00:00 PM',
    },
    {
        id: 3,
        speciesName: 'Banyan',
        scientificName: 'Ficus benghalensis',
        totalPlanted: 1500,
        survivalRate: 95,
        status: 'Active',
        preImage: images.preplantation,
        postImage: images.postplantation,
        contactPerson: 'Dr. Amit Verma',
        contactNumber: '+91 9876543212',
        state: 'Rajasthan',
        category: 'Heritage',
        nativeStatus: 'Native',
        growthRate: 'Slow',
        height: '20-25m',
        plantingSeasons: ['Monsoon', 'Winter'],
        benefits: 'Cultural importance, Large canopy, Wildlife habitat',
        zones: ['Zone 2', 'Zone 5'],
        wards: ['Ward 3', 'Ward 7'],
        createdAt: '12/15/2023, 9:00:00 AM',
        updatedAt: '2/8/2024, 2:30:00 PM',
    },
];

const PAGE_SIZE = 5;

const SpeciesWisePlantation = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [showZonesWards, setShowZonesWards] = useState(false);

    // Download/select/export state
    const [downloadMode, setDownloadMode] = useState(false);
    const [selected, setSelected] = useState([]);
    const [exportDropdown, setExportDropdown] = useState(false);
    const exportBtnRef = useRef(null);

    // Filter and paginate data
    const filtered = sampleSpecies.filter(s =>
        (s.speciesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? s.status.toLowerCase() === statusFilter : true)
    );
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Select all handler
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(paginated.map((s) => s.id));
        } else {
            setSelected([]);
        }
    };

    // Individual select handler
    const handleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    // Check if all are selected
    const allSelected = paginated.length > 0 && selected.length === paginated.length;

    // Download mode toggle
    const handleDownloadMode = () => {
        setDownloadMode((prev) => !prev);
        setSelected([]);
        setExportDropdown(false);
    };

    // Export selected species to CSV
    const handleExportCSV = () => {
        const selectedData = sampleSpecies.filter((s) => selected.includes(s.id));
        if (selectedData.length === 0) return;
        const csvRows = [
            [
                'Species Name', 'Scientific Name', 'Total Planted', 'Survival Rate (%)', 'Status',
                'Category', 'Native Status', 'Growth Rate', 'Height', 'Contact Person', 'Contact Number'
            ],
            ...selectedData.map((s) => [
                s.speciesName, s.scientificName, s.totalPlanted, s.survivalRate, s.status,
                s.category, s.nativeStatus, s.growthRate, s.height, s.contactPerson, s.contactNumber
            ]),
        ];
        const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'species.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        setExportDropdown(false);
    };

    // Export selected species and open in Excel
    const handleExportExcel = () => {
        const selectedData = sampleSpecies.filter((s) => selected.includes(s.id));
        if (selectedData.length === 0) return;
        const csvRows = [
            [
                'Species Name', 'Scientific Name', 'Total Planted', 'Survival Rate (%)', 'Status',
                'Category', 'Native Status', 'Growth Rate', 'Height', 'Contact Person', 'Contact Number'
            ],
            ...selectedData.map((s) => [
                s.speciesName, s.scientificName, s.totalPlanted, s.survivalRate, s.status,
                s.category, s.nativeStatus, s.growthRate, s.height, s.contactPerson, s.contactNumber
            ]),
        ];
        const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setExportDropdown(false);
    };

    // Handle click outside dropdown to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (exportBtnRef.current && !exportBtnRef.current.contains(event.target)) {
                setExportDropdown(false);
            }
        }
        if (exportDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [exportDropdown]);

    // Handlers
    const openImagesModal = (species) => {
        setSelectedSpecies(species);
        setShowImageModal(true);
    };
    const openInfoModal = (species) => {
        setSelectedSpecies(species);
        setShowInfoModal(true);
    };
    const closeModals = () => {
        setShowImageModal(false);
        setShowInfoModal(false);
        setSelectedSpecies(null);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-full bg-[#f7f8fa] min-h-screen">
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-2 sm:mb-0 tracking-tight">Species Wise Plantation</h2>
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                    <button
                        className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold text-base shadow"
                        aria-label="Add New Species"
                        title="Add New Species"
                    >
                        <span className="sm:hidden"><FaPlus /></span>
                        <span className="hidden sm:inline-flex items-center"><FaPlus className="mr-2" />Add New Species</span>
                    </button>
                    <button
                        className={`w-full sm:w-auto flex items-center justify-center px-5 py-2 border ${downloadMode ? 'bg-green-100 text-green-700 border-green-400' : 'bg-white text-green-600 border-green-600'} rounded-lg hover:bg-green-50 transition-colors font-semibold text-base shadow`}
                        onClick={handleDownloadMode}
                        aria-label="Download"
                        title="Download"
                    >
                        <span className="sm:hidden"><FaDownload /></span>
                        <span className="hidden sm:inline-flex items-center"><FaDownload className="mr-2" />Download</span>
                    </button>
                    {downloadMode && (
                        <div className="relative w-full sm:w-auto" ref={exportBtnRef}>
                            <button
                                className="w-full sm:w-auto flex items-center justify-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-0 sm:ml-2 font-semibold text-base shadow"
                                onClick={() => setExportDropdown((prev) => !prev)}
                                disabled={selected.length === 0}
                                aria-label="Export"
                                title="Export"
                            >
                                <span className="sm:hidden"><FaDownload /></span>
                                <span className="hidden sm:inline">Export</span>
                            </button>
                            {exportDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={handleExportExcel}
                                    >
                                        <FaFileExcel className="mr-2 text-green-600" /> <span className="hidden sm:inline">Open in Excel</span><span className="sm:hidden">Excel</span>
                                    </button>
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={handleExportCSV}
                                    >
                                        <FaFileCsv className="mr-2 text-blue-600" /> <span className="hidden sm:inline">Download CSV</span><span className="sm:hidden">CSV</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md mb-6 p-4 flex flex-col sm:flex-row sm:items-center gap-3 w-full border border-gray-100">
                <input
                    type="text"
                    placeholder="Search species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-56 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Table for desktop/tablet */}
            <div className="hidden sm:block w-full overflow-x-auto">
                <div className="bg-white rounded-xl shadow-md border border-gray-100">
                    <table className="min-w-[600px] w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {downloadMode && (
                                    <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={handleSelectAll}
                                                className="mr-2"
                                            />
                                            <span>All</span>
                                        </div>
                                    </th>
                                )}
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Species Name</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Scientific Name</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Total Planted</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Survival Rate</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Status</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {paginated.length === 0 && (
                                <tr><td colSpan={downloadMode ? 7 : 6} className="text-center py-6 text-gray-400">No species found.</td></tr>
                            )}
                            {paginated.map((species) => (
                                <tr key={species.id} className="align-middle">
                                    {downloadMode && (
                                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(species.id)}
                                                onChange={() => handleSelect(species.id)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle font-medium text-gray-900">{species.speciesName}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle text-gray-600 italic">{species.scientificName}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{species.totalPlanted.toLocaleString()}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">
                                        <span className={`font-semibold ${species.survivalRate >= 90 ? 'text-green-600' : species.survivalRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {species.survivalRate}%
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${species.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{species.status}</span>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle text-lg flex gap-2 sm:gap-3 items-center">
                                        <button title="Show Images" onClick={() => openImagesModal(species)}>
                                            <FaImage className="text-blue-500 hover:text-blue-700" />
                                        </button>
                                        <button title="Show Details" onClick={() => openInfoModal(species)}>
                                            <FaInfoCircle className="text-green-500 hover:text-green-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slider for mobile */}
            <div className="sm:hidden w-full">
                <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory pb-2">
                    {paginated.length === 0 ? (
                        <div className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4 text-center text-gray-400">
                            No species found.
                        </div>
                    ) : (
                        paginated.map((species) => (
                            <div
                                key={species.id}
                                className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4 snap-center"
                            >
                                <div className="font-bold text-green-700 mb-2">{species.speciesName}</div>
                                <div className="text-xs mb-1 italic text-gray-600">{species.scientificName}</div>
                                <div className="text-xs mb-1"><b>Total Planted:</b> {species.totalPlanted.toLocaleString()}</div>
                                <div className="text-xs mb-1">
                                    <b>Survival Rate:</b>{' '}
                                    <span className={`font-semibold ${species.survivalRate >= 90 ? 'text-green-600' : species.survivalRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {species.survivalRate}%
                                    </span>
                                </div>
                                <div className="text-xs mb-1"><b>Category:</b> {species.category}</div>
                                <div className="text-xs mb-1">
                                    <b>Status:</b>{' '}
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${species.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {species.status}
                                    </span>
                                </div>
                                <div className="flex gap-3 mt-2 items-center">
                                    <button title="Show Images" onClick={() => openImagesModal(species)}>
                                        <FaImage className="text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button title="Show Details" onClick={() => openInfoModal(species)}>
                                        <FaInfoCircle className="text-green-500 hover:text-green-700" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-end items-center px-2 sm:px-4 pb-2 sm:pb-4 gap-2 mt-2">
                <span className="text-xs sm:text-sm text-gray-600 self-start sm:self-center">
                    Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} species
                </span>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm font-semibold bg-white shadow"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm font-semibold bg-white shadow"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Image Modal */}
            {showImageModal && selectedSpecies && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-80 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-xs sm:max-w-2xl relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
                        <h3 className="text-base sm:text-lg font-bold mb-4">{selectedSpecies.speciesName} - Plantation Images</h3>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex-1">
                                <div className="font-semibold mb-2">Pre-Plantation</div>
                                <img src={selectedSpecies.preImage} alt="Pre-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold mb-2">Post-Plantation</div>
                                <img src={selectedSpecies.postImage} alt="Post-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {showInfoModal && selectedSpecies && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-2">
                    <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-sm sm:max-w-3xl relative max-h-[80vh] overflow-y-auto">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
                        <h3 className="text-base sm:text-lg font-bold mb-4">{selectedSpecies.speciesName} - Detailed Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2 mb-4 text-xs sm:text-base">
                            <div><span className="font-semibold">Species Name:</span> {selectedSpecies.speciesName}</div>
                            <div><span className="font-semibold">Scientific Name:</span> <span className="italic">{selectedSpecies.scientificName}</span></div>
                            <div><span className="font-semibold">Total Planted:</span> {selectedSpecies.totalPlanted.toLocaleString()}</div>
                            <div>
                                <span className="font-semibold">Survival Rate:</span>{' '}
                                <span className={`font-semibold ${selectedSpecies.survivalRate >= 90 ? 'text-green-600' : selectedSpecies.survivalRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {selectedSpecies.survivalRate}%
                                </span>
                            </div>
                            <div><span className="font-semibold">Status:</span> <span className={selectedSpecies.status === 'Active' ? 'text-green-600' : 'text-blue-600'}>{selectedSpecies.status}</span></div>
                            <div><span className="font-semibold">Category:</span> {selectedSpecies.category}</div>
                            <div><span className="font-semibold">Native Status:</span> {selectedSpecies.nativeStatus}</div>
                            <div><span className="font-semibold">Growth Rate:</span> {selectedSpecies.growthRate}</div>
                            <div><span className="font-semibold">Height:</span> {selectedSpecies.height}</div>
                            <div><span className="font-semibold">Contact Person:</span> {selectedSpecies.contactPerson}</div>
                            <div><span className="font-semibold">Contact Number:</span> {selectedSpecies.contactNumber}</div>
                            <div className="col-span-1 sm:col-span-2">
                                <span className="font-semibold">Planting Seasons:</span> {selectedSpecies.plantingSeasons.join(', ')}
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <span className="font-semibold">Benefits:</span> {selectedSpecies.benefits}
                            </div>
                        </div>
                        {/* Zones and Wards */}
                        <div className="mb-4">
                            <button
                                className="font-semibold mb-1 flex items-center gap-2"
                                onClick={() => setShowZonesWards((prev) => !prev)}
                            >
                                Zones & Wards Distribution
                                <span>{showZonesWards ? "▲" : "▼"}</span>
                            </button>
                            {showZonesWards && (
                                <div className="mt-2">
                                    <div className="mb-2">
                                        <span className="font-semibold text-sm">Zones:</span>
                                        <div className="flex gap-2 flex-wrap mt-1">
                                            {selectedSpecies.zones.map((zone, idx) => (
                                                <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                    {zone}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Wards:</span>
                                        <div className="flex gap-2 flex-wrap mt-1">
                                            {selectedSpecies.wards.map((ward, idx) => (
                                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                    {ward}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeciesWisePlantation;
