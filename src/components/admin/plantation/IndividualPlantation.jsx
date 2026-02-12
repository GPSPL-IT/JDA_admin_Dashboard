import React, { useState } from 'react';
import { FaImage, FaInfoCircle, FaDownload, FaFileExcel, FaFileCsv, FaPlus } from "react-icons/fa";
import { images } from '../../../assets/images';

// Sample data (replace with API data as needed)
const samplePlantations = [
  {
    id: 1,
    organization: 'Green Earth NGO',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Sanganer',
    gramPanchayat: 'Muhana',
    department: 'Forest Department',
    dateOfPlantation: '2024-03-15',
    status: 'Active',
    preImage: images.preplantation,
    postImage: images.postplantation,
    latitude: 26.836732,
    longitude: 75.833699,
    landOwnership: 'Government',
  },
  {
    id: 2,
    organization: 'Eco Warriors',
    state: 'Maharashtra',
    district: 'Pune',
    block: 'Haveli',
    gramPanchayat: 'Wagholi',
    department: 'Environment Department',
    dateOfPlantation: '2024-04-10',
    status: 'Completed',
    preImage: images.preplantation1,
    postImage: images.postplantation1,
    latitude: 18.5204,
    longitude: 73.8567,
    landOwnership: 'Private',
  },
  // Add more sample plantations as needed
];

const PAGE_SIZE = 5;

const IndividualPlantation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedPlantation, setSelectedPlantation] = useState(null);
  const [downloadMode, setDownloadMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [exportDropdown, setExportDropdown] = useState(false);
  const exportBtnRef = React.useRef(null);

  // Filter and paginate data
  const filtered = samplePlantations.filter(p =>
    (p.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gramPanchayat.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? p.status.toLowerCase() === statusFilter : true)
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Handlers
  const openImagesModal = (plantation) => {
    setSelectedPlantation(plantation);
    setShowImageModal(true);
  };
  const openInfoModal = (plantation) => {
    setSelectedPlantation(plantation);
    setShowInfoModal(true);
  };
  const closeModals = () => {
    setShowImageModal(false);
    setShowInfoModal(false);
    setSelectedPlantation(null);
  };
  const downloadDetails = (plantation) => {
    const csv = `Field,Value\nOrganization,${plantation.organization}\nState,${plantation.state}\nDistrict,${plantation.district}\nBlock,${plantation.block}\nGram Panchayat,${plantation.gramPanchayat}\nDepartment,${plantation.department}\nDate of Plantation,${plantation.dateOfPlantation}\nStatus,${plantation.status}\nLatitude,${plantation.latitude}\nLongitude,${plantation.longitude}\nLand Ownership,${plantation.landOwnership}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantation_${plantation.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginated.map((p) => p.id));
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
  // Export selected plantations to CSV
  const handleExportCSV = () => {
    const selectedPlantations = samplePlantations.filter((p) => selected.includes(p.id));
    if (selectedPlantations.length === 0) return;
    const csvRows = [
      [
        'Organization', 'State', 'District', 'Block', 'Gram Panchayat', 'Department', 'Date of Plantation', 'Status', 'Latitude', 'Longitude', 'Land Ownership'
      ],
      ...selectedPlantations.map((p) => [
        p.organization, p.state, p.district, p.block, p.gramPanchayat, p.department, p.dateOfPlantation, p.status, p.latitude, p.longitude, p.landOwnership
      ]),
    ];
    const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'individual_plantations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setExportDropdown(false);
  };
  // Export selected plantations and open in Excel (simulate by opening CSV in new tab)
  const handleExportExcel = () => {
    const selectedPlantations = samplePlantations.filter((p) => selected.includes(p.id));
    if (selectedPlantations.length === 0) return;
    const csvRows = [
      [
        'Organization', 'State', 'District', 'Block', 'Gram Panchayat', 'Department', 'Date of Plantation', 'Status', 'Latitude', 'Longitude', 'Land Ownership'
      ],
      ...selectedPlantations.map((p) => [
        p.organization, p.state, p.district, p.block, p.gramPanchayat, p.department, p.dateOfPlantation, p.status, p.latitude, p.longitude, p.landOwnership
      ]),
    ];
    const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setExportDropdown(false);
  };
  // Handle click outside dropdown to close
  React.useEffect(() => {
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

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-full bg-[#f7f8fa] min-h-screen">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-2 sm:mb-0 tracking-tight">Individual Plantation</h2>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold text-base shadow">
            <span className="sm:hidden"><FaPlus /></span>
            <span className="hidden sm:inline-flex items-center"><FaPlus className="mr-2" />Add New Individual Plantation</span>
          </button>
          <button
            className={`w-full sm:w-auto flex items-center justify-center px-5 py-2 border ${downloadMode ? 'bg-green-100 text-green-700 border-green-400' : 'bg-white text-green-600 border-green-600'} rounded-lg hover:bg-green-50 transition-colors font-semibold text-base shadow`}
            onClick={handleDownloadMode}
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
          placeholder="Search by organization, state, district, block, gram panchayat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-56 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      {/* Table for desktop/tablet */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {downloadMode && (
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">
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
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Organization</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Department</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Date of Plantation</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.length === 0 && (
                <tr><td colSpan={downloadMode ? 7 : 6} className="text-center py-6 text-gray-400">No plantations found.</td></tr>
              )}
              {paginated.map((plantation) => (
                <tr key={plantation.id} className="align-middle">
                  {downloadMode && (
                    <td className="px-4 py-4 whitespace-nowrap align-middle">
                      <input
                        type="checkbox"
                        checked={selected.includes(plantation.id)}
                        onChange={() => handleSelect(plantation.id)}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap align-middle font-medium text-gray-900">{plantation.organization}</td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">{plantation.state}, {plantation.district}, {plantation.block}, {plantation.gramPanchayat}</td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">{plantation.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">{plantation.dateOfPlantation}</td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${plantation.status === 'Active' ? 'bg-green-100 text-green-800' : plantation.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{plantation.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-lg flex gap-3 items-center">
                    <button title="Show Images" onClick={() => openImagesModal(plantation)}>
                      <FaImage className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button title="Show Details" onClick={() => openInfoModal(plantation)}>
                      <FaInfoCircle className="text-green-500 hover:text-green-700" />
                    </button>
                    <button title="Download Details" onClick={() => downloadDetails(plantation)}>
                      <FaDownload className="text-gray-500 hover:text-gray-700" />
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
              No plantations found.
            </div>
          ) : (
            paginated.map((plantation) => (
              <div
                key={plantation.id}
                className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4 snap-center"
              >
                <div className="font-bold text-green-700 mb-2">{plantation.organization}</div>
                <div className="text-xs mb-1"><b>Location:</b> {plantation.state}, {plantation.district}, {plantation.block}, {plantation.gramPanchayat}</div>
                <div className="text-xs mb-1"><b>Department:</b> {plantation.department}</div>
                <div className="text-xs mb-1"><b>Date of Plantation:</b> {plantation.dateOfPlantation}</div>
                <div className="text-xs mb-1">
                  <b>Status:</b>{' '}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plantation.status === 'Active' ? 'bg-green-100 text-green-800' : plantation.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{plantation.status}</span>
                </div>
                <div className="flex gap-3 mt-2 items-center">
                  <button title="Show Images" onClick={() => openImagesModal(plantation)}>
                    <FaImage className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button title="Show Details" onClick={() => openInfoModal(plantation)}>
                    <FaInfoCircle className="text-green-500 hover:text-green-700" />
                  </button>
                  <button title="Download Details" onClick={() => downloadDetails(plantation)}>
                    <FaDownload className="text-gray-500 hover:text-gray-700" />
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
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} plantations
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
      {showImageModal && selectedPlantation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Plantation Images</h3>
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="font-semibold mb-2">Pre-Plantation</div>
                <img src={selectedPlantation.preImage} alt="Pre-Plantation" className="rounded-lg w-full h-48 object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-2">Post-Plantation</div>
                <img src={selectedPlantation.postImage} alt="Post-Plantation" className="rounded-lg w-full h-48 object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Info Modal */}
      {showInfoModal && selectedPlantation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Plantation Details</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div><span className="font-semibold">Organization:</span> {selectedPlantation.organization}</div>
              <div><span className="font-semibold">Department:</span> {selectedPlantation.department}</div>
              <div><span className="font-semibold">State:</span> {selectedPlantation.state}</div>
              <div><span className="font-semibold">District:</span> {selectedPlantation.district}</div>
              <div><span className="font-semibold">Block:</span> {selectedPlantation.block}</div>
              <div><span className="font-semibold">Gram Panchayat:</span> {selectedPlantation.gramPanchayat}</div>
              <div><span className="font-semibold">Date of Plantation:</span> {selectedPlantation.dateOfPlantation}</div>
              <div><span className="font-semibold">Status:</span> <span className={selectedPlantation.status === 'Active' ? 'text-green-600' : selectedPlantation.status === 'Completed' ? 'text-blue-600' : 'text-yellow-600'}>{selectedPlantation.status}</span></div>
              <div><span className="font-semibold">Latitude:</span> {selectedPlantation.latitude}</div>
              <div><span className="font-semibold">Longitude:</span> {selectedPlantation.longitude}</div>
              <div><span className="font-semibold">Land Ownership:</span> {selectedPlantation.landOwnership}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualPlantation; 