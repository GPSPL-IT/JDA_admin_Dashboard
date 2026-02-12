import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaInfoCircle, FaDownload, FaFileExcel, FaFileCsv, FaPlus } from "react-icons/fa";
import images from '../../../assets/images';
import { useTranslation } from 'react-i18next';

// Sample data (replace with API data as needed)
const sampleBlocks = [
  {
    id: 1,
    blockName: 'Green Valley Block',
    area: 5.5,
    plantCount: 350,
    plantingDate: '2024-03-01',
    status: 'Active',
    preImage: images.preplantation,
    postImage: images.postplantation,
    contactNumber: '+91 9876543210',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Chaksu',
    gramPanchayat: 'Shivdaspura',
    department: 'Forest Department',
    organization: 'State Forest Corporation',
    landOwnership: 'Government',
    coordinates: '26.824088, 75.968473',
    gpCode: 'SDP-001',
    dictCode: 'RJ-JP-001',
    blockCode: 'CHK-001',
    ownerName: 'State of Rajasthan',
    numberOfPlants: 350,
    createdAt: '2/15/2024, 4:00:00 PM',
    updatedAt: '3/5/2024, 8:15:00 PM',
    plantsList: [
      { name: 'Neem', quantity: 200 },
      { name: 'Peepal', quantity: 100 },
      { name: 'Banyan', quantity: 50 },
    ],
    locationPoints: [
      { name: 'Location Point 1', latitude: 26.824088, longitude: 75.968473, area: 2.5 },
      { name: 'Location Point 2', latitude: 26.825, longitude: 75.97, area: 3 },
    ],
    submittedBy: 'Forest Officer Rajesh Kumar',
    totalArea: 5.5,
  },
  // Add more sample blocks as needed
];

const PAGE_SIZE = 5;

const BlockPlantation = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showPlantsList, setShowPlantsList] = useState(false);

  // Download/select/export state
  const [downloadMode, setDownloadMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [exportDropdown, setExportDropdown] = useState(false);
  const exportBtnRef = useRef(null);

  // Filter and paginate data
  const filtered = sampleBlocks.filter(b =>
    (b.blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.gramPanchayat.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? b.status.toLowerCase() === statusFilter : true)
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginated.map((b) => b.id));
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

  // Export selected blocks to CSV
  const handleExportCSV = () => {
    const selectedBlocks = sampleBlocks.filter((b) => selected.includes(b.id));
    if (selectedBlocks.length === 0) return;
    const csvRows = [
      [
        'Block Name', 'Area (ha)', 'Plant Count', 'Planting Date', 'Status', 'Contact Number',
        'State', 'District', 'Block', 'Gram Panchayat', 'Department', 'Organization',
        'Land Ownership', 'Coordinates', 'GP Code', 'DICT Code', 'Block Code', 'Owner Name',
        'Number of Plants', 'Created At', 'Updated At'
      ],
      ...selectedBlocks.map((b) => [
        b.blockName, b.area, b.plantCount, b.plantingDate, b.status, b.contactNumber,
        b.state, b.district, b.block, b.gramPanchayat, b.department, b.organization,
        b.landOwnership, b.coordinates, b.gpCode, b.dictCode, b.blockCode, b.ownerName,
        b.numberOfPlants, b.createdAt, b.updatedAt
      ]),
    ];
    const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blocks.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setExportDropdown(false);
  };

  // Export selected blocks and open in Excel (simulate by opening CSV in new tab)
  const handleExportExcel = () => {
    const selectedBlocks = sampleBlocks.filter((b) => selected.includes(b.id));
    if (selectedBlocks.length === 0) return;
    const csvRows = [
      [
        'Block Name', 'Area (ha)', 'Plant Count', 'Planting Date', 'Status', 'Contact Number',
        'State', 'District', 'Block', 'Gram Panchayat', 'Department', 'Organization',
        'Land Ownership', 'Coordinates', 'GP Code', 'DICT Code', 'Block Code', 'Owner Name',
        'Number of Plants', 'Created At', 'Updated At'
      ],
      ...selectedBlocks.map((b) => [
        b.blockName, b.area, b.plantCount, b.plantingDate, b.status, b.contactNumber,
        b.state, b.district, b.block, b.gramPanchayat, b.department, b.organization,
        b.landOwnership, b.coordinates, b.gpCode, b.dictCode, b.blockCode, b.ownerName,
        b.numberOfPlants, b.createdAt, b.updatedAt
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
  const openImagesModal = (block) => {
    setSelectedBlock(block);
    setShowImageModal(true);
  };
  const openInfoModal = (block) => {
    setSelectedBlock(block);
    setShowInfoModal(true);
  };
  const closeModals = () => {
    setShowImageModal(false);
    setShowInfoModal(false);
    setSelectedBlock(null);
  };
  const downloadDetails = (block) => {
    const csv = `Field,Value\nBlock Name,${block.blockName}\nArea (ha),${block.area}\nPlant Count,${block.plantCount}\nPlanting Date,${block.plantingDate}\nStatus,${block.status}\nContact Number,${block.contactNumber}\nState,${block.state}\nDistrict,${block.district}\nBlock,${block.block}\nGram Panchayat,${block.gramPanchayat}\nDepartment,${block.department}\nOrganization,${block.organization}\nLand Ownership,${block.landOwnership}\nCoordinates,${block.coordinates}\nGP Code,${block.gpCode}\nDICT Code,${block.dictCode}\nBlock Code,${block.blockCode}\nOwner Name,${block.ownerName}\nNumber of Plants,${block.numberOfPlants}\nCreated At,${block.createdAt}\nUpdated At,${block.updatedAt}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `block_${block.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-full bg-[#f7f8fa] min-h-screen">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-2 sm:mb-0 tracking-tight">{t('block_plantation', 'Block Plantation')}</h2>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold text-base shadow"
            aria-label={t('blockPlantation.addNew', 'Add New Block')}
            title={t('blockPlantation.addNew', 'Add New Block')}
          >
            <span className="sm:hidden"><FaPlus /></span>
            <span className="hidden sm:inline-flex items-center"><FaPlus className="mr-2" />{t('blockPlantation.addNew', 'Add New Block')}</span>
          </button>
          <button
            className={`w-full sm:w-auto flex items-center justify-center px-5 py-2 border ${downloadMode ? 'bg-green-100 text-green-700 border-green-400' : 'bg-white text-green-600 border-green-600'} rounded-lg hover:bg-green-50 transition-colors font-semibold text-base shadow`}
            onClick={handleDownloadMode}
            aria-label={t('download', 'Download')}
            title={t('download', 'Download')}
          >
            <span className="sm:hidden"><FaDownload /></span>
            <span className="hidden sm:inline-flex items-center"><FaDownload className="mr-2" />{t('download', 'Download')}</span>
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
          placeholder={t('blockPlantation.searchPlaceholder', 'Search blocks...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-56 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base bg-gray-50"
        >
          <option value="">{t('blockPlantation.allStatus', 'All Status')}</option>
          <option value="active">{t('blockPlantation.active', 'Active')}</option>
          <option value="completed">{t('blockPlantation.completed', 'Completed')}</option>
          <option value="planned">{t('blockPlantation.planned', 'Planned')}</option>
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
                      <span>{t('blockPlantation.all', 'All')}</span>
                    </div>
                  </th>
                )}
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('blockPlantation.blockName', 'Block Name')}</th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('blockPlantation.area', 'Area (ha)')}</th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('blockPlantation.plantCount', 'Plant Count')}</th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('blockPlantation.plantingDate', 'Planting Date')}</th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('blockPlantation.status', 'Status')}</th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle">{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.length === 0 && (
                <tr><td colSpan={downloadMode ? 7 : 6} className="text-center py-6 text-gray-400">{t('blockPlantation.noBlocksFound', 'No blocks found.')}</td></tr>
              )}
              {paginated.map((block) => (
                <tr key={block.id} className="align-middle">
                  {downloadMode && (
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">
                      <input
                        type="checkbox"
                        checked={selected.includes(block.id)}
                        onChange={() => handleSelect(block.id)}
                      />
                    </td>
                  )}
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle font-medium text-gray-900">{block.blockName}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{block.area}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{block.plantCount}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">{block.plantingDate}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${block.status === 'Active' ? 'bg-green-100 text-green-800' : block.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{t(`blockPlantation.statuses.${block.status.toLowerCase()}`, block.status)}</span>
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap align-middle text-lg flex gap-2 sm:gap-3 items-center">
                    <button title={t('blockPlantation.showImages', 'Show Images')} onClick={() => openImagesModal(block)}>
                      <FaImage className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button title={t('blockPlantation.showDetails', 'Show Details')} onClick={() => openInfoModal(block)}>
                      <FaInfoCircle className="text-green-500 hover:text-green-700" />
                    </button>
                    <button title={t('blockPlantation.downloadDetails', 'Download Details')} onClick={() => downloadDetails(block)}>
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
              {t('blockPlantation.noBlocksFound', 'No blocks found.')}
            </div>
          ) : (
            paginated.map((block) => (
              <div
                key={block.id}
                className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4 snap-center"
              >
                <div className="font-bold text-green-700 mb-2">{block.blockName}</div>
                <div className="text-xs mb-1"><b>{t('blockPlantation.area', 'Area')}:</b> {block.area} ha</div>
                <div className="text-xs mb-1"><b>{t('blockPlantation.plantCount', 'Plant Count')}:</b> {block.plantCount}</div>
                <div className="text-xs mb-1"><b>{t('blockPlantation.plantingDate', 'Planting Date')}:</b> {block.plantingDate}</div>
                <div className="text-xs mb-1">
                  <b>{t('blockPlantation.status', 'Status')}:</b>{' '}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${block.status === 'Active' ? 'bg-green-100 text-green-800' : block.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {t(`blockPlantation.statuses.${block.status.toLowerCase()}`, block.status)}
                  </span>
                </div>
                <div className="flex gap-3 mt-2 items-center">
                  <button title={t('blockPlantation.showImages', 'Show Images')} onClick={() => openImagesModal(block)}>
                    <FaImage className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button title={t('blockPlantation.showDetails', 'Show Details')} onClick={() => openInfoModal(block)}>
                    <FaInfoCircle className="text-green-500 hover:text-green-700" />
                  </button>
                  <button title={t('blockPlantation.downloadDetails', 'Download Details')} onClick={() => downloadDetails(block)}>
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
          {t('blockPlantation.pagination', 'Showing')} {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} {t('blockPlantation.to', 'to')} {Math.min(currentPage * PAGE_SIZE, filtered.length)} {t('blockPlantation.of', 'of')} {filtered.length} {t('blockPlantation.blocks', 'blocks')}
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm font-semibold bg-white shadow"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {t('previous', 'Previous')}
          </button>
          <button
            className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm font-semibold bg-white shadow"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {t('next', 'Next')}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-xs sm:max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-base sm:text-lg font-bold mb-4">{t('blockPlantation.imagesModalTitle', 'Block Plantation Images')}</h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="font-semibold mb-2">{t('blockPlantation.prePlantation', 'Pre-Plantation')}</div>
                <img src={selectedBlock.preImage} alt="Pre-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-2">{t('blockPlantation.postPlantation', 'Post-Plantation')}</div>
                <img src={selectedBlock.postImage} alt="Post-Plantation" className="rounded-lg w-full h-40 sm:h-48 object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && selectedBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-2">
          <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-sm sm:max-w-3xl relative max-h-[80vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-base sm:text-lg font-bold mb-4">{t('blockPlantation.detailsModalTitle', 'Block Plantation Details')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-2 mb-4 text-xs sm:text-base">
              <div><span className="font-semibold">{t('blockPlantation.blockName', 'Block Name')}:</span> {selectedBlock.blockName}</div>
              <div><span className="font-semibold">{t('blockPlantation.area', 'Area (ha)')}:</span> {selectedBlock.area}</div>
              <div><span className="font-semibold">{t('blockPlantation.plantCount', 'Plant Count')}:</span> {selectedBlock.plantCount}</div>
              <div><span className="font-semibold">{t('blockPlantation.plantingDate', 'Planting Date')}:</span> {selectedBlock.plantingDate}</div>
              <div><span className="font-semibold">{t('blockPlantation.status', 'Status')}:</span> <span className={selectedBlock.status === 'Active' ? 'text-green-600' : selectedBlock.status === 'Completed' ? 'text-blue-600' : 'text-yellow-600'}>{t(`blockPlantation.statuses.${selectedBlock.status.toLowerCase()}`, selectedBlock.status)}</span></div>
              <div><span className="font-semibold">{t('blockPlantation.contactNumber', 'Contact Number')}:</span> {selectedBlock.contactNumber}</div>
              <div><span className="font-semibold">{t('blockPlantation.state', 'State')}:</span> {selectedBlock.state}</div>
              <div><span className="font-semibold">{t('blockPlantation.district', 'District')}:</span> {selectedBlock.district}</div>
              <div><span className="font-semibold">{t('blockPlantation.block', 'Block')}:</span> {selectedBlock.block}</div>
              <div><span className="font-semibold">{t('blockPlantation.gramPanchayat', 'Gram Panchayat')}:</span> {selectedBlock.gramPanchayat}</div>
              <div><span className="font-semibold">{t('blockPlantation.department', 'Department')}:</span> {selectedBlock.department}</div>
              <div><span className="font-semibold">{t('blockPlantation.organization', 'Organization')}:</span> {selectedBlock.organization}</div>
              <div><span className="font-semibold">{t('blockPlantation.landOwnership', 'Land Ownership')}:</span> {selectedBlock.landOwnership}</div>
              <div><span className="font-semibold">{t('blockPlantation.coordinates', 'Coordinates')}:</span> {selectedBlock.coordinates}</div>
              <div><span className="font-semibold">{t('blockPlantation.gpCode', 'GP Code')}:</span> {selectedBlock.gpCode}</div>
              <div><span className="font-semibold">{t('blockPlantation.dictCode', 'DICT Code')}:</span> {selectedBlock.dictCode}</div>
              <div><span className="font-semibold">{t('blockPlantation.blockCode', 'Block Code')}:</span> {selectedBlock.blockCode}</div>
              <div><span className="font-semibold">{t('blockPlantation.ownerName', 'Owner Name')}:</span> {selectedBlock.ownerName}</div>
              <div><span className="font-semibold">{t('blockPlantation.numberOfPlants', 'Number of Plants')}:</span> {selectedBlock.numberOfPlants}</div>
              <div><span className="font-semibold">{t('blockPlantation.createdAt', 'Created At')}:</span> {selectedBlock.createdAt}</div>
              <div><span className="font-semibold">{t('blockPlantation.updatedAt', 'Updated At')}:</span> {selectedBlock.updatedAt}</div>
              <div><span className="font-semibold">{t('blockPlantation.submittedBy', 'Submitted By')}:</span> {selectedBlock.submittedBy}</div>
            </div>
            {/* Plants List */}
            <div className="mb-4">
              <button
                className="font-semibold mb-1 flex items-center gap-2"
                onClick={() => setShowPlantsList((prev) => !prev)}
              >
                {t('blockPlantation.plantsList', 'Plants List')}
                <span>{showPlantsList ? "▲" : "▼"}</span>
              </button>
              {showPlantsList && (
                <div className="flex gap-2 sm:gap-4 flex-wrap mt-2">
                  {selectedBlock.plantsList.map((plant, idx) => (
                    <div key={idx} className="bg-gray-100 rounded px-2 sm:px-4 py-2">
                      {plant.name}<br />
                      <span className="text-xs text-gray-600">{t('blockPlantation.quantity', 'Quantity')}: {plant.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Location Points */}
            <div className="mb-4">
              <div className="font-semibold mb-1">{t('blockPlantation.locationPoints', 'Location Points')}</div>
              <div className="flex gap-2 sm:gap-4 flex-wrap">
                {selectedBlock.locationPoints.map((loc, idx) => (
                  <div key={idx} className="bg-gray-100 rounded px-2 sm:px-4 py-2">
                    {loc.name}<br />
                    <span className="text-xs text-gray-600">{t('blockPlantation.latitude', 'Latitude')}: {loc.latitude}<br />{t('blockPlantation.longitude', 'Longitude')}: {loc.longitude}<br />{t('blockPlantation.area', 'Area')}: {loc.area} ha</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockPlantation; 