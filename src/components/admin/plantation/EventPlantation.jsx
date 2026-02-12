import React, { useState } from 'react';
import { FaImage, FaInfoCircle, FaDownload, FaFileExcel, FaFileCsv, FaPlus } from "react-icons/fa";
import images from '../../../assets/images';

// Sample special events data
const sampleEvents = [
  {
    id: 1,
    eventName: 'Hariyali Teej',
    eventType: 'Festival',
    eventDate: '2024-08-07',
    location: '26.9124, 75.7873',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Jhotwara',
    gramPanchayat: 'Kalwar',
    department: 'Forest Department',
    organization: 'Van Vibhag Rajasthan',
    participants: 850,
    treesPlanted: 3500,
    status: 'Completed',
    preImage: images.preplantation,
    duringImage: images.preplantation1,
    postImage: images.postplantation,
    landOwnership: 'Government',
    species: ['Neem', 'Peepal', 'Mango', 'Amla'],
    zones: ['Zone 1', 'Zone 2'],
    wards: ['Ward 1', 'Ward 3', 'Ward 5'],
  },
  {
    id: 2,
    eventName: 'Pradhan Mantri Scheme',
    eventType: 'Government Scheme',
    eventDate: '2024-06-15',
    location: '26.8467, 75.8056',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Sanganer',
    gramPanchayat: 'Vatika',
    department: 'Agriculture Department',
    organization: 'Govt. of Rajasthan',
    participants: 1200,
    treesPlanted: 5000,
    status: 'Completed',
    preImage: images.preplantation,
    duringImage: images.preplantation1,
    postImage: images.postplantation,
    landOwnership: 'Community',
    species: ['Neem', 'Ashoka', 'Banyan', 'Peepal'],
    zones: ['Zone 3', 'Zone 4'],
    wards: ['Ward 7', 'Ward 9'],
  },
  {
    id: 3,
    eventName: 'World Environment Day',
    eventType: 'International Day',
    eventDate: '2024-06-05',
    location: '26.9484, 75.7306',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Amer',
    gramPanchayat: 'Khejroli',
    department: 'Environment Department',
    organization: 'Eco Warriors NGO',
    participants: 600,
    treesPlanted: 2400,
    status: 'Completed',
    preImage: images.preplantation,
    duringImage: images.preplantation1,
    postImage: images.postplantation,
    landOwnership: 'Government',
    species: ['Neem', 'Jamun', 'Arjun', 'Gulmohar'],
    zones: ['Zone 5', 'Zone 6'],
    wards: ['Ward 11', 'Ward 13'],
  },
  {
    id: 4,
    eventName: 'Van Mahotsav 2024',
    eventType: 'Festival',
    eventDate: '2024-07-01',
    location: '26.8124, 75.7373',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Chaksu',
    gramPanchayat: 'Shivdaspura',
    department: 'Forest Department',
    organization: 'Van Vibhag Rajasthan',
    participants: 950,
    treesPlanted: 4200,
    status: 'Active',
    preImage: images.preplantation,
    duringImage: images.preplantation1,
    postImage: images.postplantation,
    landOwnership: 'Government',
    species: ['Neem', 'Peepal', 'Banyan', 'Mango', 'Ashoka'],
    zones: ['Zone 2', 'Zone 7'],
    wards: ['Ward 2', 'Ward 4', 'Ward 6'],
  },
];

const PAGE_SIZE = 5;

const EventPlantation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [downloadMode, setDownloadMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [exportDropdown, setExportDropdown] = useState(false);
  const exportBtnRef = React.useRef(null);

  // Filter and paginate data
  const filtered = sampleEvents.filter(e =>
    (e.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.gramPanchayat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.organization.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? e.status.toLowerCase() === statusFilter : true)
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Handlers
  const openImagesModal = (event) => {
    setSelectedEvent(event);
    setShowImageModal(true);
  };
  const openInfoModal = (event) => {
    setSelectedEvent(event);
    setShowInfoModal(true);
  };
  const closeModals = () => {
    setShowImageModal(false);
    setShowInfoModal(false);
    setSelectedEvent(null);
  };
  const downloadDetails = (event) => {
    const csv = `Field,Value\nEvent Name,${event.eventName}\nEvent Date,${event.eventDate}\nLocation,${event.location}\nState,${event.state}\nDistrict,${event.district}\nBlock,${event.block}\nGram Panchayat,${event.gramPanchayat}\nDepartment,${event.department}\nOrganization,${event.organization}\nParticipants,${event.participants}\nTrees Planted,${event.treesPlanted}\nStatus,${event.status}\nLand Ownership,${event.landOwnership}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event_${event.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginated.map((ev) => ev.id));
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
  // Export selected events to CSV
  const handleExportCSV = () => {
    const selectedEvents = sampleEvents.filter((ev) => selected.includes(ev.id));
    if (selectedEvents.length === 0) return;
    const csvRows = [
      [
        'Event Name', 'Event Type', 'Event Date', 'Location', 'State', 'District', 'Block', 'Gram Panchayat', 'Organization', 'Participants', 'Trees Planted', 'Status', 'Land Ownership'
      ],
      ...selectedEvents.map((ev) => [
        ev.eventName, ev.eventType, ev.eventDate, ev.location, ev.state, ev.district, ev.block, ev.gramPanchayat, ev.organization, ev.participants, ev.treesPlanted, ev.status, ev.landOwnership
      ]),
    ];
    const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setExportDropdown(false);
  };
  // Export selected events and open in Excel (simulate by opening CSV in new tab)
  const handleExportExcel = () => {
    const selectedEvents = sampleEvents.filter((ev) => selected.includes(ev.id));
    if (selectedEvents.length === 0) return;
    const csvRows = [
      [
        'Event Name', 'Event Type', 'Event Date', 'Location', 'State', 'District', 'Block', 'Gram Panchayat', 'Organization', 'Participants', 'Trees Planted', 'Status', 'Land Ownership'
      ],
      ...selectedEvents.map((ev) => [
        ev.eventName, ev.eventType, ev.eventDate, ev.location, ev.state, ev.district, ev.block, ev.gramPanchayat, ev.organization, ev.participants, ev.treesPlanted, ev.status, ev.landOwnership
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-2 sm:mb-0 tracking-tight">Event Plantation</h2>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold text-base shadow"
            aria-label="Create New Event"
            title="Create New Event"
          >
            <span className="sm:hidden"><FaPlus /></span>
            <span className="hidden sm:inline-flex items-center"><FaPlus className="mr-2" />Create New Event</span>
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
          placeholder="Search events..."
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
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table for desktop/tablet */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {downloadMode && (
                  <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[40px]">
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
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[120px]">Event Name</th>
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[100px]">Event Type</th>
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[100px]">Date</th>
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[180px]">Location</th>
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[80px]">Participants</th>
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[100px]">Trees Planted</th>
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[80px]">Status</th>
                <th className="px-2 sm:px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider align-middle min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.length === 0 && (
                <tr><td colSpan={downloadMode ? 9 : 8} className="text-center py-6 text-gray-400">No events found.</td></tr>
              )}
              {paginated.map((event) => (
                <tr key={event.id} className="align-middle">
                  {downloadMode && (
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">
                      <input
                        type="checkbox"
                        checked={selected.includes(event.id)}
                        onChange={() => handleSelect(event.id)}
                      />
                    </td>
                  )}
                  <td className="px-2 sm:px-4 py-4 align-middle font-medium text-gray-900">{event.eventName}</td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">{event.eventType}</td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">{event.eventDate}</td>
                  <td className="px-2 sm:px-4 py-4 break-words align-middle">{event.location}<br />{event.state}, {event.district}, {event.block}, {event.gramPanchayat}</td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">{event.participants}</td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">{event.treesPlanted}</td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap align-middle">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'Active' ? 'bg-green-100 text-green-800' : event.status === 'Completed' ? 'bg-blue-100 text-blue-800' : event.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{event.status}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-lg flex gap-2 sm:gap-3 items-center align-middle">
                    <button title="Show Images" onClick={() => openImagesModal(event)}>
                      <FaImage className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button title="Show Details" onClick={() => openInfoModal(event)}>
                      <FaInfoCircle className="text-green-500 hover:text-green-700" />
                    </button>
                    <button title="Download Details" onClick={() => downloadDetails(event)}>
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
              No events found.
            </div>
          ) : (
            paginated.map((event) => (
              <div
                key={event.id}
                className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4 snap-center"
              >
                <div className="font-bold text-green-700 mb-2">{event.eventName}</div>
                <div className="text-xs mb-1">
                  <b>Type:</b> <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">{event.eventType}</span>
                </div>
                <div className="text-xs mb-1"><b>Date:</b> {event.eventDate}</div>
                <div className="text-xs mb-1"><b>Location:</b> {event.location}</div>
                <div className="text-xs mb-1"><b>State:</b> {event.state}</div>
                <div className="text-xs mb-1"><b>District:</b> {event.district}</div>
                <div className="text-xs mb-1"><b>Block:</b> {event.block}</div>
                <div className="text-xs mb-1"><b>Gram Panchayat:</b> {event.gramPanchayat}</div>
                <div className="text-xs mb-1"><b>Department:</b> {event.department}</div>
                <div className="text-xs mb-1"><b>Organization:</b> {event.organization}</div>
                <div className="text-xs mb-1"><b>Participants:</b> {event.participants}</div>
                <div className="text-xs mb-1"><b>Trees Planted:</b> {event.treesPlanted}</div>
                <div className="text-xs mb-1">
                  <b>Status:</b>{' '}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'Active' ? 'bg-green-100 text-green-800' : event.status === 'Completed' ? 'bg-blue-100 text-blue-800' : event.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{event.status}</span>
                </div>
                <div className="flex gap-3 mt-2 items-center">
                  <button title="Show Images" onClick={() => openImagesModal(event)}>
                    <FaImage className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button title="Show Details" onClick={() => openInfoModal(event)}>
                    <FaInfoCircle className="text-green-500 hover:text-green-700" />
                  </button>
                  <button title="Download Details" onClick={() => downloadDetails(event)}>
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
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} events
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
      {showImageModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Event Images</h3>
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="font-semibold mb-2">Pre-Event</div>
                <img src={selectedEvent.preImage} alt="Pre-Event" className="rounded-lg w-full h-48 object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-2">During Event</div>
                <img src={selectedEvent.duringImage} alt="During Event" className="rounded-lg w-full h-48 object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-2">Post-Event</div>
                <img src={selectedEvent.postImage} alt="Post-Event" className="rounded-lg w-full h-48 object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Info Modal */}
      {showInfoModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative max-h-[80vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Event Details</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
              <div><span className="font-semibold">Event Name:</span> {selectedEvent.eventName}</div>
              <div><span className="font-semibold">Event Type:</span> <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">{selectedEvent.eventType}</span></div>
              <div><span className="font-semibold">Event Date:</span> {selectedEvent.eventDate}</div>
              <div><span className="font-semibold">Participants:</span> {selectedEvent.participants}</div>
              <div><span className="font-semibold">Trees Planted:</span> {selectedEvent.treesPlanted}</div>
              <div><span className="font-semibold">Status:</span> <span className={selectedEvent.status === 'Active' ? 'text-green-600' : selectedEvent.status === 'Completed' ? 'text-blue-600' : selectedEvent.status === 'Ongoing' ? 'text-yellow-600' : 'text-gray-600'}>{selectedEvent.status}</span></div>
              <div><span className="font-semibold">Location:</span> {selectedEvent.location}</div>
              <div><span className="font-semibold">State:</span> {selectedEvent.state}</div>
              <div><span className="font-semibold">District:</span> {selectedEvent.district}</div>
              <div><span className="font-semibold">Block:</span> {selectedEvent.block}</div>
              <div><span className="font-semibold">Gram Panchayat:</span> {selectedEvent.gramPanchayat}</div>
              <div><span className="font-semibold">Department:</span> {selectedEvent.department}</div>
              <div><span className="font-semibold">Organization:</span> {selectedEvent.organization}</div>
              <div><span className="font-semibold">Land Ownership:</span> {selectedEvent.landOwnership}</div>
            </div>
            {/* Species List */}
            {selectedEvent.species && (
              <div className="mb-4">
                <div className="font-semibold mb-2">Species Planted:</div>
                <div className="flex gap-2 flex-wrap">
                  {selectedEvent.species.map((sp, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Zones and Wards */}
            {(selectedEvent.zones || selectedEvent.wards) && (
              <div className="mb-4">
                <div className="font-semibold mb-2">Distribution:</div>
                {selectedEvent.zones && (
                  <div className="mb-2">
                    <span className="text-sm font-semibold">Zones:</span>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {selectedEvent.zones.map((zone, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedEvent.wards && (
                  <div>
                    <span className="text-sm font-semibold">Wards:</span>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {selectedEvent.wards.map((ward, idx) => (
                        <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          {ward}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPlantation; 