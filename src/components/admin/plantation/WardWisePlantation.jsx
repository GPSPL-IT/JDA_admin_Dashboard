import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaInfoCircle, FaDownload, FaFileExcel, FaFileCsv, FaPlus } from "react-icons/fa";
import images from '../../../assets/images';
import { useTranslation } from 'react-i18next';

// Sample ward data
const sampleWards = [
    {
        id: 1,
        wardName: 'Ward 1 - Gandhi Nagar',
        area: 3.5,
        plantCount: 450,
        plantingDate: '2024-01-20',
        status: 'Active',
        preImage: images.preplantation,
        postImage: images.postplantation,
        contactNumber: '+91 9876543210',
        state: 'Rajasthan',
        district: 'Jaipur',
        ward: 'Ward 1',
        wardNumber: 1,
        department: 'Municipal Corporation',
        organization: 'JMC Green Division',
        wardCode: 'W1-JP-001',
        coordinates: '26.924088, 75.828473',
        numberOfPlants: 450,
        createdAt: '1/15/2024, 9:00:00 AM',
        updatedAt: '2/5/2024, 2:30:00 PM',
        plantsList: [
            { name: 'Neem', species: 'Azadirachta indica', quantity: 200 },
            { name: 'Ashoka', species: 'Saraca asoca', quantity: 150 },
            { name: 'Peepal', species: 'Ficus religiosa', quantity: 100 },
        ],
        submittedBy: 'Ward Officer Amit Sharma',
        totalArea: 3.5,
    },
    {
        id: 2,
        wardName: 'Ward 2 - Malviya Nagar',
        area: 4.2,
        plantCount: 600,
        plantingDate: '2024-02-10',
        status: 'Active',
        preImage: images.preplantation,
        postImage: images.postplantation,
        contactNumber: '+91 9876543211',
        state: 'Rajasthan',
        district: 'Jaipur',
        ward: 'Ward 2',
        wardNumber: 2,
        department: 'Municipal Corporation',
        organization: 'JMC Green Division',
        wardCode: 'W2-JP-002',
        coordinates: '26.852088, 75.812479',
        numberOfPlants: 600,
        createdAt: '1/25/2024, 10:00:00 AM',
        updatedAt: '2/12/2024, 3:00:00 PM',
        plantsList: [
            { name: 'Banyan', species: 'Ficus benghalensis', quantity: 250 },
            { name: 'Mango', species: 'Mangifera indica', quantity: 200 },
            { name: 'Neem', species: 'Azadirachta indica', quantity: 150 },
        ],
        submittedBy: 'Ward Officer Priya Verma',
        totalArea: 4.2,
    },
];

const PAGE_SIZE = 5;

const WardWisePlantation = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedWard, setSelectedWard] = useState(null);
    const [showPlantsList, setShowPlantsList] = useState(false);

    // Download/select/export state
    const [downloadMode, setDownloadMode] = useState(false);
    const [selected, setSelected] = useState([]);
    const [exportDropdown, setExportDropdown] = useState(false);
    const exportBtnRef = useRef(null);

    // Filter and paginate data
    const filtered = sampleWards.filter(w =>
        (w.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.ward.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? w.status.toLowerCase() === statusFilter : true)
    );
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Select all handler
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(paginated.map((w) => w.id));
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

    // Export selected wards to CSV
    const handleExportCSV = () => {
        const selectedWards = sampleWards.filter((w) => selected.includes(w.id));
        if (selectedWards.length === 0) return;
        const csvRows = [
            [
                'Ward Name', 'Ward Number', 'Area (ha)', 'Plant Count', 'Planting Date', 'Status', 'Contact Number',
                'State', 'District', 'Ward', 'Department', 'Organization', 'Ward Code',
                'Coordinates', 'Number of Plants', 'Created At', 'Updated At'
            ],
            ...selectedWards.map((w) => [
                w.wardName, w.wardNumber, w.area, w.plantCount, w.plantingDate, w.status, w.contactNumber,
                w.state, w.district, w.ward, w.department, w.organization, w.wardCode,
                w.coordinates, w.numberOfPlants, w.createdAt, w.updatedAt
            ]),
        ];
        const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wards.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        setExportDropdown(false);
    };

    // Export selected wards and open in Excel
    const handleExportExcel = () => {
        const selectedWards = sampleWards.filter((w) => selected.includes(w.id));
        if (selectedWards.length === 0) return;
        const csvRows = [
            [
                'Ward Name', 'Ward Number', 'Area (ha)', 'Plant Count', 'Planting Date', 'Status', 'Contact Number',
                'State', 'District', 'Ward', 'Department', 'Organization', 'Ward Code',
                'Coordinates', 'Number of Plants', 'Created At', 'Updated At'
            ],
            ...selectedWards.map((w) => [
                w.wardName, w.wardNumber, w.area, w.plantCount, w.plantingDate, w.status, w.contactNumber,
                w.state, w.district, w.ward, w.department, w.organization, w.wardCode,
                w.coordinates, w.numberOfPlants, w.createdAt, w.updatedAt
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
    const openImagesModal = (ward) => {
        setSelectedWard(ward);
        setShowImageModal(true);
    };
    const openInfoModal = (ward) => {
        setSelectedWard(ward);
        setShowInfoModal(true);
    };
    const closeModals = () => {
        setShowImageModal(false);
        setShowInfoModal(false);
        setSelectedWard(null);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-full bg-[#f7f8fa] min-h-screen">
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-2 sm:mb-0 tracking-tight">Ward Wise Plantation</h2>
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                    <button
                        className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold text-base shadow"
                        aria-label="Add New Ward"
                        title="Add New Ward"
                    >
                        <span className="sm:hidden"><FaPlus /></span>
                        <span className="hidden sm:inline-flex items-center"><FaPlus className="mr-2" />Add New Ward</span>
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
                    placeholder="Search wards..."
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
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Ward Name</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Ward No.</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Area (ha)</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Plant Count</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">District</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Status</th>
                                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {paginated.length === 0 && (
                                <tr><td colSpan={downloadMode ? 8 : 7} className="text-center py-6 text-gray-400">No wards found.</td></tr>
                            )}
                            {paginated.map((ward) => (
                                <tr key={ward.id} className="align-middle">
                                    {downloadMode && (
                                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(ward.id)}
                                                onChange={() => handleSelect(ward.id)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle font-medium text-gray-900">{ward.wardName}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{ward.wardNumber}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{ward.area}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{ward.plantCount}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{ward.district}</td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ward.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{ward.status}</span>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle text-lg flex gap-2 sm:gap-3 items-center">
                                        <button title="Show Images" onClick={() => openImagesModal(ward)}>
                                            <FaImage className="text-blue-500 hover:text-blue-700" />
                                        </button>
                                        <button title="Show Details" onClick={() => openInfoModal(ward)}>
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
                            No wards found.
                        </div>
                    ) : (
                        paginated.map((ward) => (
                            <div
                                key={ward.id}
                                className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4 snap-center"
                            >
                                <div className="font-bold text-green-700 mb-2">{ward.wardName}</div>
                                <div className="text-xs mb-1"><b>Ward No:</b> {ward.wardNumber}</div>
                                <div className="text-xs mb-1"><b>Area:</b> {ward.area} ha</div>
                                <div className="text-xs mb-1"><b>Plant Count:</b> {ward.plantCount}</div>
                                <div className="text-xs mb-1"><b>District:</b> {ward.district}</div>
                                <div className="text-xs mb-1">
                                    <b>Status:</b>{' '}
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ward.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {ward.status}
                                    </span>
                                </div>
                                <div className="flex gap-3 mt-2 items-center">
                                    <button title="Show Images" onClick={() => openImagesModal(ward)}>
                                        <FaImage className="text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button title="Show Details" onClick={() => openInfoModal(ward)}>
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
                    Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} wards
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
            {showImageModal && selectedWard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-80 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-xs sm:max-w-2xl relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
                        <h3 className="text-base sm:text-lg font-bold mb-4">Ward Plantation Images</h3>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex-1">
                                <div className="font-semibold mb-2">Pre-Plantation</div>
                                <img src={selectedWard.preImage} alt="Pre-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold mb-2">Post-Plantation</div>
                                <img src={selectedWard.postImage} alt="Post-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {showInfoModal && selectedWard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-2">
                    <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-sm sm:max-w-3xl relative max-h-[80vh] overflow-y-auto">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
                        <h3 className="text-base sm:text-lg font-bold mb-4">Ward Plantation Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-2 mb-4 text-xs sm:text-base">
                            <div><span className="font-semibold">Ward Name:</span> {selectedWard.wardName}</div>
                            <div><span className="font-semibold">Ward Number:</span> {selectedWard.wardNumber}</div>
                            <div><span className="font-semibold">Area (ha):</span> {selectedWard.area}</div>
                            <div><span className="font-semibold">Plant Count:</span> {selectedWard.plantCount}</div>
                            <div><span className="font-semibold">Planting Date:</span> {selectedWard.plantingDate}</div>
                            <div><span className="font-semibold">Status:</span> <span className={selectedWard.status === 'Active' ? 'text-green-600' : 'text-blue-600'}>{selectedWard.status}</span></div>
                            <div><span className="font-semibold">Contact Number:</span> {selectedWard.contactNumber}</div>
                            <div><span className="font-semibold">State:</span> {selectedWard.state}</div>
                            <div><span className="font-semibold">District:</span> {selectedWard.district}</div>
                            <div><span className="font-semibold">Ward:</span> {selectedWard.ward}</div>
                            <div><span className="font-semibold">Department:</span> {selectedWard.department}</div>
                            <div><span className="font-semibold">Organization:</span> {selectedWard.organization}</div>
                            <div><span className="font-semibold">Ward Code:</span> {selectedWard.wardCode}</div>
                            <div><span className="font-semibold">Coordinates:</span> {selectedWard.coordinates}</div>
                            <div><span className="font-semibold">Number of Plants:</span> {selectedWard.numberOfPlants}</div>
                            <div><span className="font-semibold">Created At:</span> {selectedWard.createdAt}</div>
                            <div><span className="font-semibold">Updated At:</span> {selectedWard.updatedAt}</div>
                            <div><span className="font-semibold">Submitted By:</span> {selectedWard.submittedBy}</div>
                        </div>
                        {/* Plants List */}
                        <div className="mb-4">
                            <button
                                className="font-semibold mb-1 flex items-center gap-2"
                                onClick={() => setShowPlantsList((prev) => !prev)}
                            >
                                Species List
                                <span>{showPlantsList ? "▲" : "▼"}</span>
                            </button>
                            {showPlantsList && (
                                <div className="flex gap-2 sm:gap-4 flex-wrap mt-2">
                                    {selectedWard.plantsList.map((plant, idx) => (
                                        <div key={idx} className="bg-gray-100 rounded px-2 sm:px-4 py-2">
                                            {plant.name}<br />
                                            <span className="text-xs text-gray-600">Species: {plant.species}</span><br />
                                            <span className="text-xs text-gray-600">Quantity: {plant.quantity}</span>
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

export default WardWisePlantation;
