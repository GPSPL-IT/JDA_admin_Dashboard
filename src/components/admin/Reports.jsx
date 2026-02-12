import React, { useState } from 'react';
import { FaDownload, FaFileExcel, FaFileCsv, FaChartBar, FaFilter, FaPrint, FaEye, FaTimes } from 'react-icons/fa';
import ZoneWiseFilter from './ReportfilterFields/zoneWise';
import SpeciesWiseFilter from './ReportfilterFields/speciesWise';
import KMLKMZFilter from './ReportfilterFields/kmlkmz';
import { useTranslation } from 'react-i18next';
import { mockReportData } from '../../data/mockData';

const Reports = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('zoneWise');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  // Sample data for filters
  const sampleZones = [
    { value: 'zone1', label: 'North Zone' },
    { value: 'zone2', label: 'South Zone' },
    { value: 'zone3', label: 'East Zone' },
    { value: 'zone4', label: 'West Zone' },
    { value: 'zone5', label: 'Central Zone' },
  ];

  const sampleSpecies = [
    { value: 'neem', label: 'Neem' },
    { value: 'peepal', label: 'Peepal' },
    { value: 'banyan', label: 'Banyan' },
    { value: 'mango', label: 'Mango' },
    { value: 'gulmohar', label: 'Gulmohar' },
    { value: 'ashoka', label: 'Ashoka' },
  ];

  // Move tabList here!
  const tabList = [
    {
      key: 'zoneWise',
      label: t('reports.zoneWise', 'Zone Wise'),
      icon: FaChartBar,
      description: t('reports.zoneWiseDesc', 'View reports by zone')
    },
    {
      key: 'speciesWise',
      label: t('reports.speciesWise', 'Species Wise'),
      icon: FaEye,
      description: t('reports.speciesWiseDesc', 'Analyze data by tree species')
    },
    {
      key: 'kmlkmz',
      label: t('reports.kmlkmz', 'KML/KMZ Export'),
      icon: FaDownload,
      description: t('reports.kmlkmzDesc', 'Export geographical data')
    },
  ];

  // Handle download functionality
  const handleDownload = async (format) => {
    setIsGenerating(true);
    setShowDownloadOptions(false);

    try {
      // Simulate API call for report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create and download file
      const fileName = `tree_plantation_report_${activeTab}_${new Date().toISOString().split('T')[0]}.${format}`;

      if (format === 'xlsx') {
        // For Excel file
        const excelData = generateExcelData();
        downloadExcelFile(excelData, fileName);
      } else if (format === 'csv') {
        // For CSV file
        const csvData = generateCSVData();
        downloadCSVFile(csvData, fileName);
      }

      // Show success message
      alert(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    let filtered = [...mockReportData];

    // Filter by zone
    if (filterValues.zone) {
      const selectedZone = sampleZones.find(z => z.value === filterValues.zone);
      if (selectedZone) {
        filtered = filtered.filter(item => item.zone === selectedZone.label);
      }
    }

    // Filter by species
    if (filterValues.species) {
      const selectedSpecies = sampleSpecies.find(s => s.value === filterValues.species);
      if (selectedSpecies) {
        filtered = filtered.filter(item => item.species === selectedSpecies.label);
      }
    }

    // Filter by date range
    if (filterValues.startDate) {
      filtered = filtered.filter(item => item.date >= filterValues.startDate);
    }
    if (filterValues.endDate) {
      filtered = filtered.filter(item => item.date <= filterValues.endDate);
    }

    setFilteredData(filtered);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    setFilteredData(mockReportData);
  };

  // State for filtered data
  const [filteredData, setFilteredData] = useState(mockReportData);


  // Function to render data table
  const renderDataTable = () => {
    if (activeTab === 'kmlkmz') return null; // No table for KML/KMZ

    return (
      <div className="mt-6 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">{t('reports.reportResults', 'Report Results')}</h3>
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.zone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.species}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      row.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No records found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-gray-600">
          Total Records: <span className="font-semibold">{filteredData.length}</span>
        </div>
      </div>
    );
  };

  // Generate sample Excel data
  const generateExcelData = () => {
    return [
      ['Tree Plantation Report', '', '', '', ''],
      ['Generated Date:', new Date().toLocaleDateString(), '', '', ''],
      ['Report Type:', tabList.find(tab => tab.key === activeTab)?.label, '', '', ''],
      ['', '', '', '', ''],
      ['Location', 'Species', 'Quantity', 'Plantation Date', 'Status'],
      ['Jaipur', 'Neem', '150', '2024-01-15', 'Completed'],
      ['Udaipur', 'Banyan', '200', '2024-01-20', 'In Progress'],
      ['Jodhpur', 'Peepal', '100', '2024-01-25', 'Completed'],
      ['Kota', 'Mango', '300', '2024-02-01', 'Planned'],
    ];
  };

  // Generate sample CSV data
  const generateCSVData = () => {
    return [
      ['Location', 'Species', 'Quantity', 'Plantation Date', 'Status'],
      ['Jaipur', 'Neem', '150', '2024-01-15', 'Completed'],
      ['Udaipur', 'Banyan', '200', '2024-01-20', 'In Progress'],
      ['Jodhpur', 'Peepal', '100', '2024-01-25', 'Completed'],
      ['Kota', 'Mango', '300', '2024-02-01', 'Planned'],
    ];
  };

  // Download Excel file
  const downloadExcelFile = (data, fileName) => {
    // This is a simplified version - in real implementation, you'd use a library like xlsx
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Download CSV file
  const downloadCSVFile = (data, fileName) => {
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Mobile Optimized */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 text-white">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center sm:justify-start">
                <FaChartBar className="mr-2 sm:mr-3 text-lg sm:text-xl" />
                {t('reports.title', 'Tree Plantation Reports')}
              </h1>
              <p className="text-green-100 text-sm sm:text-base">
                {t('reports.subtitle', 'Generate comprehensive reports and export data in multiple formats')}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {tabList.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 transform hover:scale-105 min-h-[80px] sm:min-h-[100px] ${activeTab === tab.key
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-25'
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <IconComponent
                      className={`text-lg sm:text-xl ${activeTab === tab.key ? 'text-green-600' : 'text-gray-500'
                        }`}
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-sm sm:text-base block ${activeTab === tab.key ? 'text-green-700' : 'text-gray-700'
                        }`}>
                        {tab.label}
                      </span>
                      <p className={`text-xs sm:text-sm mt-1 ${activeTab === tab.key ? 'text-green-600' : 'text-gray-500'
                        }`}>
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Content - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          {/* Content Header - Mobile Optimized */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-3 sm:px-6 py-3 sm:py-4 border-b border-green-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-green-800">
                  {tabList.find(tab => tab.key === activeTab)?.label}
                </h3>
                <p className="text-xs sm:text-sm text-green-600 mt-1">
                  {tabList.find(tab => tab.key === activeTab)?.description}
                </p>
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-1 sm:gap-2"
                >
                  <FaDownload className="text-xs sm:text-sm" />
                  <span className="hidden sm:inline">{t('reports.export', 'Export')}</span>
                </button>
                <button className="bg-gray-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center gap-1 sm:gap-2">
                  <FaPrint className="text-xs sm:text-sm" />
                  <span className="hidden sm:inline">{t('reports.print', 'Print')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report Content - Mobile Optimized */}
          <div className="p-3 sm:p-6 md:p-8">
            {activeTab === 'zoneWise' && (
              <ZoneWiseFilter
                zoneOptions={sampleZones}
                filterValues={filterValues}
                onChange={handleFilterChange}
                onApply={handleApplyFilter}
                onReset={handleResetFilters}
              />
            )}
            {activeTab === 'speciesWise' && (
              <SpeciesWiseFilter
                speciesOptions={sampleSpecies}
                filterValues={filterValues}
                onChange={handleFilterChange}
                onApply={handleApplyFilter}
                onReset={handleResetFilters}
              />
            )}
            {activeTab === 'kmlkmz' && (
              <KMLKMZFilter
                filterValues={filterValues}
                onChange={handleFilterChange}
                onApply={handleApplyFilter}
                onReset={handleResetFilters}
              />
            )}

            {/* Render Results Table */}
            {renderDataTable()}
          </div>
        </div>

        {/* Loading Overlay - Mobile Optimized */}
        {isGenerating && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-2xl max-w-sm w-full">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Generating Report</h3>
              <p className="text-sm sm:text-base text-gray-600">Please wait while we prepare your download...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 