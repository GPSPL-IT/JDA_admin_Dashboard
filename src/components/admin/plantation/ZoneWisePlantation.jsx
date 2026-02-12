import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaInfoCircle, FaDownload, FaFileExcel, FaFileCsv, FaPlus } from "react-icons/fa";
import images from '../../../assets/images';
import { useTranslation } from 'react-i18next';

// Sample zone data
const sampleZones = [
    {
        id: 1,
        zoneName: 'Zone 1 - Central District',
        area: 15.5,
        plantCount: 1500,
        plantingDate: '2024-01-15',
        status: 'Active',
        preImage: images.preplantation,
        postImage: images.postplantation,
        contactNumber: '+91 9876543210',
        state: 'Rajasthan',
        district: 'Jaipur',
        zone: 'Zone 1',
        department: 'Forest Department',
        organization: 'State Forest Corporation',
        zoneCode: 'Z1-RAJ-001',
        coordinates: '26.824088, 75.968473',
        numberOfPlants: 1500,
        createdAt: '1/10/2024, 10:00:00 AM',
        updatedAt: '2/1/2024, 3:30:00 PM',
        plantsList: [
            { name: 'Neem', species: 'Azadirachta indica', quantity: 800 },
            { name: 'Peepal', species: 'Ficus religiosa', quantity: 400 },
            { name: 'Banyan', species: 'Ficus benghalensis', quantity: 300 },
        ],
        submittedBy: 'Zone Officer Ramesh Kumar',
        totalArea: 15.5,
    },
    {
        id: 2,
        zoneName: 'Zone 2 - North District',
        area: 12.3,
        plantCount: 1200,
        plantingDate: '2024-02-01',
        status: 'Active',
        preImage: images.preplantation,
        postImage: images.postplantation,
        contactNumber: '+91 9876543211',
        state: 'Rajasthan',
        district: 'Udaipur',
        zone: 'Zone 2',
        department: 'Forest Department',
        organization: 'State Forest Corporation',
        zoneCode: 'Z2-RAJ-002',
        coordinates: '24.585445, 73.712479',
        numberOfPlants: 1200,
        createdAt: '1/20/2024, 11:00:00 AM',
        updatedAt: '2/10/2024, 4:00:00 PM',
        plantsList: [
            { name: 'Mango', species: 'Mangifera indica', quantity: 600 },
            { name: 'Neem', species: 'Azadirachta indica', quantity: 400 },
            { name: 'Ashoka', species: 'Saraca asoca', quantity: 200 },
        ],
        submittedBy: 'Zone Officer Suresh Patel',
        totalArea: 12.3,
    },
];

const PAGE_SIZE = 5;

const ZoneWisePlantation = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [showPlantsList, setShowPlantsList] = useState(false);

    // Download/select/export state
    const [downloadMode, setDownloadMode] = useState(false);
    const [selected, setSelected] = useState([]);
    const [exportDropdown, setExportDropdown] = useState(false);
    const exportBtnRef = useRef(null);

    // Filter and paginate data
    const filtered = sampleZones.filter(z =>
        (z.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            z.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
            z.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
            z.zone.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? z.status.toLowerCase() === statusFilter : true)
    );
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Select all handler
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(paginated.map((z) => z.id));
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

    // Export selected zones to CSV
    const handleExportCSV = () => {
        const selectedZones = sampleZones.filter((z) => selected.includes(z.id));
        if (selectedZones.length === 0) return;
        const csvRows = [
            [
                'Zone Name', 'Area (ha)', 'Plant Count', 'Planting Date', 'Status', 'Contact Number',
                'State', 'District', 'Zone', 'Department', 'Organization', 'Zone Code',
                'Coordinates', 'Number of Plants', 'Created At', 'Updated At'
            ],
            ...selectedZones.map((z) => [
                z.zoneName, z.area, z.plantCount, z.plantingDate, z.status, z.contactNumber,
                z.state, z.district, z.zone, z.department, z.organization, z.zoneCode,
                z.coordinates, z.numberOfPlants, z.createdAt, z.updatedAt
            ]),
        ];
        const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'zones.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        setExportDropdown(false);
    };

    // Export selected zones and open in Excel
    const handleExportExcel = () => {
        const selectedZones = sampleZones.filter((z) => selected.includes(z.id));
        if (selectedZones.length === 0) return;
        const csvRows = [
            [
                'Zone Name', 'Area (ha)', 'Plant Count', 'Planting Date', 'Status', 'Contact Number',
                'State', 'District', 'Zone', 'Department', 'Organization', 'Zone Code',
                'Coordinates', 'Number of Plants', 'Created At', 'Updated At'
            ],
            ...selectedZones.map((z) => [
                z.zoneName, z.area, z.plantCount, z.plantingDate, z.status, z.contactNumber,
                z.state, z.district, z.zone, z.department, z.organization, z.zoneCode,
                z.coordinates, z.numberOfPlants, z.createdAt, z.updatedAt
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
    const openImagesModal = (zone) => {
        setSelectedZone(zone);
        setShowImageModal(true);
    };
    const openInfoModal = (zone) => {
        setSelectedZone(zone);
        setShowInfoModal(true);
    };
    const closeModals = () => {
        setShowImageModal(false);
        setShowInfoModal(false);
        setSelectedZone(null);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-full bg-[#f7f8fa] min-h-screen">
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-2 sm:mb-0 tracking-tight">{t('plantationTypes.zonewise')}</h2>
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                    <button
                        className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold text-base shadow"
                        aria-label="Add New Zone"
                        title="Add New Zone"
                    >
                        <span className="sm:hidden"><FaPlus /></span>
                        <span className="hidden sm:inline-flex items-center"><FaPlus className="mr-2" />{t('plantationTypes.addNewZone')}</span>
                    </button>
                    <button
                        className={`w-full sm:w-auto flex items-center justify-center px-5 py-2 border ${downloadMode ? 'bg-green-100 text-green-700 border-green-400' : 'bg-white text-green-600 border-green-600'} rounded-lg hover:bg-green-50 transition-colors font-semibold text-base shadow`}
                        onClick={handleDownloadMode}
                        aria-label="Download"
                        title="Download"
                    >
                        <span className="sm:hidden"><FaDownload /></span>
                        <span className="hidden sm:inline-flex items-center"><FaDownload className="mr-2" />{t('common.download')}</span>
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
                                <span className="hidden sm:inline">{t('userManagement.export')}</span>
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
                    placeholder={t('plantationTypes.searchZones')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-56 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
                >
                    <option value="">{t('plantationTypes.allStatus')}</option>
                    <option value="active">{t('plantationTypes.active')}</option>
                    <option value="completed">{t('plantationTypes.completed')}</option>
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
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('plantationTypes.zoneName')}</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('plantationTypes.area')}</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('plantationTypes.plantCount')}</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('plantationTypes.district')}</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('userManagement.status')}</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {paginated.length === 0 && (
                                <tr><td colSpan={downloadMode ? 7 : 6} className="text-center py-6 text-gray-400">{t('plantationTypes.noZonesFound')}</td></tr>
                            )}
                            {paginated.map((zone) => (
                                <tr key={zone.id} className="align-middle">
                                    {downloadMode && (
                                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(zone.id)}
                                                onChange={() => handleSelect(zone.id)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle font-medium text-gray-900">{zone.zoneName}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{zone.area}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{zone.plantCount}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{zone.district}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${zone.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{zone.status}</span>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle text-lg flex gap-2 sm:gap-3 items-center">
                                        <button title="Show Images" onClick={() => openImagesModal(zone)}>
                                            <FaImage className="text-blue-500 hover:text-blue-700" />
                                        </button>
                                        <button title="Show Details" onClick={() => openInfoModal(zone)}>
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
                            No zones found.
                        </div>
                    ) : (
                        paginated.map((zone) => (
                            <div
                                key={zone.id}
                                className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4 snap-center"
                            >
                                <div className="font-bold text-green-700 mb-2">{zone.zoneName}</div>
                                <div className="text-xs mb-1"><b>Area:</b> {zone.area} ha</div>
                                <div className="text-xs mb-1"><b>Plant Count:</b> {zone.plantCount}</div>
                                <div className="text-xs mb-1"><b>District:</b> {zone.district}</div>
                                <div className="text-xs mb-1">
                                    <b>Status:</b>{' '}
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${zone.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {zone.status}
                                    </span>
                                </div>
                                <div className="flex gap-3 mt-2 items-center">
                                    <button title="Show Images" onClick={() => openImagesModal(zone)}>
                                        <FaImage className="text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button title="Show Details" onClick={() => openInfoModal(zone)}>
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
                    Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} zones
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
            {showImageModal && selectedZone && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-80 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-xs sm:max-w-2xl relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
                        <h3 className="text-base sm:text-lg font-bold mb-4">{t('plantationTypes.zoneImages')}</h3>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex-1">
                                <div className="font-semibold mb-2">{t('plantationTypes.prePlantation')}</div>
                                <img src={selectedZone.preImage} alt="Pre-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold mb-2">{t('plantationTypes.postPlantation')}</div>
                                <img src={selectedZone.postImage} alt="Post-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {showInfoModal && selectedZone && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-2">
                    <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-sm sm:max-w-3xl relative max-h-[80vh] overflow-y-auto">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
                        <h3 className="text-base sm:text-lg font-bold mb-4">{t('plantationTypes.zoneDetails')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-2 mb-4 text-xs sm:text-base">
                            <div><span className="font-semibold">{t('fields.zoneName')}:</span> {selectedZone.zoneName}</div>
                            <div><span className="font-semibold">{t('fields.area')}:</span> {selectedZone.area}</div>
                            <div><span className="font-semibold">{t('fields.plantCount')}:</span> {selectedZone.plantCount}</div>
                            <div><span className="font-semibold">{t('fields.plantingDate')}:</span> {selectedZone.plantingDate}</div>
                            <div><span className="font-semibold">{t('fields.status')}:</span> <span className={selectedZone.status === 'Active' ? 'text-green-600' : 'text-blue-600'}>{selectedZone.status}</span></div>
                            <div><span className="font-semibold">{t('fields.contactNumber')}:</span> {selectedZone.contactNumber}</div>
                            <div><span className="font-semibold">{t('fields.state')}:</span> {selectedZone.state}</div>
                            <div><span className="font-semibold">{t('fields.district')}:</span> {selectedZone.district}</div>
                            <div><span className="font-semibold">{t('fields.zone')}:</span> {selectedZone.zone}</div>
                            <div><span className="font-semibold">{t('fields.department')}:</span> {selectedZone.department}</div>
                            <div><span className="font-semibold">{t('fields.organization')}:</span> {selectedZone.organization}</div>
                            <div><span className="font-semibold">{t('fields.zoneCode')}:</span> {selectedZone.zoneCode}</div>
                            <div><span className="font-semibold">{t('fields.coordinates')}:</span> {selectedZone.coordinates}</div>
                            <div><span className="font-semibold">{t('fields.numberOfPlants')}:</span> {selectedZone.numberOfPlants}</div>
                            <div><span className="font-semibold">{t('fields.createdAt')}:</span> {selectedZone.createdAt}</div>
                            <div><span className="font-semibold">{t('fields.updatedAt')}:</span> {selectedZone.updatedAt}</div>
                            <div><span className="font-semibold">{t('fields.submittedBy')}:</span> {selectedZone.submittedBy}</div>
                        </div>
                        {/* Plants List */}
                        <div className="mb-4">
                            <button
                                className="font-semibold mb-1 flex items-center gap-2"
                                onClick={() => setShowPlantsList((prev) => !prev)}
                            >
                                {t('fields.speciesList')}
                                <span>{showPlantsList ? "▲" : "▼"}</span>
                            </button>
                            {showPlantsList && (
                                <div className="flex gap-2 sm:gap-4 flex-wrap mt-2">
                                    {selectedZone.plantsList.map((plant, idx) => (
                                        <div key={idx} className="bg-gray-100 rounded px-2 sm:px-4 py-2">
                                            {plant.name}<br />
                                            <span className="text-xs text-gray-600">{t('fields.species')}: {plant.species}</span><br />
                                            <span className="text-xs text-gray-600">{t('fields.quantity')}: {plant.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZoneWisePlantation;
