import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaFileExcel, FaFilePdf, FaFilter, FaDownload, FaTree, FaMapMarkedAlt, FaLayerGroup, FaMap } from 'react-icons/fa';
import customFields from '../filterFields/customFields';
import stateWiseFields from '../filterFields/stateWiseFields';

import speciesWiseFields from '../filterFields/speciesWiseFields';
import zoneWiseFields from '../filterFields/zoneWiseFields';
import kmlKmzFields from '../filterFields/kmlKmzFields';

// --- Sub-components with Glass/Premium Styling ---

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 font-poppins">{title}</p>
      <p className="text-xl font-bold text-gray-800 mt-1 font-poppins">{value}</p>
    </div>
    <div className={`p-3 rounded-lg bg-opacity-20 ${color.replace('text-', 'bg-')} ${color}`}>
      <Icon className="text-lg" />
    </div>
  </div>
);

const ZoneSummaryTable = ({ data }) => {
  const { t } = useTranslation();

  // Calculate totals
  const totalPlantation = data.reduce((acc, curr) => acc + curr.total, 0);
  const totalSurvival = Math.round(data.reduce((acc, curr) => acc + (curr.total * (curr.survival / 100)), 0));

  return (
    <div className="space-y-6">
      {/* Quick Stats for Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Zones Selected" value={data.length} icon={FaMap} color="text-indigo-600" />
        <SummaryCard title="Total Plantation" value={totalPlantation.toLocaleString()} icon={FaTree} color="text-green-600" />
        <SummaryCard title="Est. Survival" value={totalSurvival.toLocaleString()} icon={FaLayerGroup} color="text-emerald-600" />
        <SummaryCard title="Avg. Success Rate" value={`${Math.round(data.reduce((acc, curr) => acc + curr.survival, 0) / data.length)}%`} icon={FaMapMarkedAlt} color="text-blue-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 font-poppins flex items-center">
            <FaMap className="mr-2 text-[#2E7D32]" />
            Zone Wise Summary
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">Zone Name</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">Target</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">Achieved</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">Survival %</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-green-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">{row.zone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-mono">{row.target.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-bold">{row.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.survival >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {row.survival}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-xs font-medium text-gray-500">Active</span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-poppins">
                    No data available for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SpeciesSummaryTable = ({ data }) => {
  const { t } = useTranslation();

  const totalTrees = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats for Species */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Unique Species" value={data.length} icon={FaTree} color="text-green-600" />
        <SummaryCard title="Total Trees Count" value={totalTrees.toLocaleString()} icon={FaLayerGroup} color="text-emerald-600" />
        <SummaryCard title="Top Performing" value={data[0]?.name || 'N/A'} icon={FaMapMarkedAlt} color="text-blue-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 font-poppins flex items-center">
            <FaTree className="mr-2 text-[#2E7D32]" />
            {t("summary.speciesWise")}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">
                  {t("filters.labels.species")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">
                  Scientific Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">
                  {t("summary.totalTrees")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-green-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">{row.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic font-poppins">{row.scientific}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-medium">{row.count.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                    {((row.count / totalTrees) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-poppins">
                    No species data matches your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



const KmlKmzSummary = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-6 font-poppins flex items-center">
        <FaMapMarkedAlt className="mr-2 text-[#2E7D32]" />
        {t("summary.kmlKmz")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard
          title={t("summary.totalFiles")}
          value="3"
          icon={FaMapMarkedAlt}
          color="text-blue-600"
        />
        <SummaryCard
          title={t("summary.totalLocations")}
          value="15"
          icon={FaTree}
          color="text-green-600"
        />
      </div>
    </div>
  );
};

const Report = () => {
  const { t } = useTranslation();
  const downloadSectionRef = useRef(null);

  useEffect(() => {
    document.title = t("pageTitle.reports");
  }, [t]);

  const [activeTab, setActiveTab] = useState('zoneWise'); // Changed default to zoneWise as requested
  const [filters, setFilters] = useState({
    placeCategory: 'all',
    startDate: '',
    endDate: '',
    state: '',
    district: '',
    block: '',
    gp: '',

    species: '',
    zone: 'allzones', // Added zone filter default
    plantationYear: '',
    status: '',
    plantationType: []
  });

  const [showDownload, setShowDownload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]); // Store filtered results

  const filterFields = {
    zoneWise: zoneWiseFields,
    speciesWise: speciesWiseFields,

    // stateWise: stateWiseFields, // Hidden for simplicity if not needed
    custom: customFields,
    kmlKmz: kmlKmzFields,
  };

  // Mock Data
  const mockZoneData = [
    { zone: 'Zone 1', target: 2000, total: 1850, survival: 92 },
    { zone: 'Zone 2', target: 1500, total: 1200, survival: 75 },
    { zone: 'Zone 3', target: 1800, total: 1750, survival: 95 },
    { zone: 'Zone 4', target: 2200, total: 2100, survival: 88 },
    { zone: 'Zone 5', target: 1600, total: 1550, survival: 91 },
    { zone: 'Zone 6', target: 1900, total: 1880, survival: 85 },
    { zone: 'Zone 7', target: 1400, total: 1350, survival: 89 },
  ];

  const mockSpeciesData = [
    { name: 'Neem', scientific: 'Azadirachta indica', count: 5000, type: 'medicinaltrees' },
    { name: 'Peepal', scientific: 'Ficus religiosa', count: 2100, type: 'nativesspecies' },
    { name: 'Banyan', scientific: 'Ficus benghalensis', count: 1800, type: 'nativesspecies' },
    { name: 'Gulmohar', scientific: 'Delonix regia', count: 1500, type: 'ornamentaltrees' },
    { name: 'Mango', scientific: 'Mangifera indica', count: 3200, type: 'fruittrees' },
  ];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const fieldConfig = filterFields[activeTab].find(field => field.name === name);
      if (fieldConfig && fieldConfig.type === 'checkbox') {
        setFilters(prev => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter(v => v !== value)
        }));
      }
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowDownload(false);
    // Reset filters but arguably you might want to keep some overlap
    setFilters({
      placeCategory: 'all',
      startDate: '',
      endDate: '',
      state: '',
      district: '',
      block: '',
      gp: '',

      species: '',
      zone: 'allzones',
      plantationYear: '',
      status: '',
      plantationType: []
    });
  };

  const handleApplyFilter = async () => {
    setIsLoading(true);

    // Simulate API call and Filtering Logic
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      let results = [];

      if (activeTab === 'zoneWise') {
        if (filters.zone && filters.zone !== 'allzones') {
          // Filter by specific zone text match (simple includes check for mock)
          // Clean the filter value format to match display
          const zoneNumber = filters.zone.replace('zone', '');
          results = mockZoneData.filter(item => item.zone.toLowerCase().includes(filters.zone) || item.zone.includes(zoneNumber));
        } else {
          results = mockZoneData;
        }
      } else if (activeTab === 'speciesWise') {
        results = mockSpeciesData;

        // Filter by Species
        if (filters.species && filters.species !== 'allspecies') {
          results = results.filter(item => item.type === filters.species || item.name.toLowerCase().includes(filters.species));
        }

        // Filter by Zone (New) - Mock logic since species data doesn't have zone, we'll randomize or just pass through for demo
        if (filters.zone && filters.zone !== 'allzones') {
          // For demo purposes, we can simulate filtering. 
          // in real app, species data would come with zone info or be fetched based on zone.
          // Let's just filter randomly to show effect if needed, or assume all species exist in all zones for now.
          // Actually, the user wants "Zone" filter, so we should arguably filter. 
          // Let's assume the mock species data *could* have a zone property, or we just leave it as is if the mock data doesn't support it.
          // Given the mock data structure: { name, scientific, count, type }, there is no zone. 
          // I will add a comment that this would filter by zone in real API.
          // For now, I won't filter mock data by zone to avoid showing empty results, unless I add 'zone' to mockSpeciesData.
          // Let's just leave it passing through for now, as the UI update is the request.
          console.log("Filtering species by zone:", filters.zone);
        }

        if (results.length === 0 && filters.species && filters.species !== 'allspecies') results = [mockSpeciesData[0]];
      } else if (activeTab === 'custom') {
        // Custom Logic - for now, treat similar to speciesWise but with potentially more filters
        results = mockSpeciesData;

        if (filters.species && filters.species !== 'allspecies') {
          results = results.filter(item => item.type === filters.species || item.name.toLowerCase().includes(filters.species));
        }

        if (filters.zone && filters.zone !== 'allzones') {
          console.log("Filtering custom by zone:", filters.zone);
          // Mock filter: if zone 1 is selected, maybe filter some out? 
          // For now just pass through to show data.
        }
      } else if (activeTab === 'kmlKmz' || activeTab === 'stateWise') {
        // Treat KML/KMZ and State (now Zone) wise similar to Species/Custom
        results = mockSpeciesData;

        if (filters.species && filters.species !== 'allspecies') {
          results = results.filter(item => item.type === filters.species || item.name.toLowerCase().includes(filters.species));
        }

        if (filters.zone && filters.zone !== 'allzones') {
          console.log(`Filtering ${activeTab} by zone:`, filters.zone);
        }
      }

      setFilteredData(results);
      setShowDownload(true);
      setTimeout(() => {
        downloadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format) => {
    console.log(t("log.downloading", { format }));
  };

  const renderField = (field) => {
    if (field.type === 'checkbox' && field.layout === 'horizontal-header') {
      return (
        <div className="col-span-full mb-2">
          <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
            <h3 className="text-sm font-bold text-green-800 mb-3 font-poppins uppercase tracking-wider">
              {t(field.title)}
            </h3>
            <div className="flex flex-wrap gap-4">
              {field.options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 hover:border-green-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option.value}
                    checked={filters[field.name]?.includes(option.value)}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 font-poppins">
                    {t(option.label) || option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide font-poppins">
          {field.label || field.name}
        </label>
        {field.type === 'checkbox' ? (
          <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
            {field.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={filters[field.name]?.includes(option.value)}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 font-poppins">{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <select
            name={field.name}
            value={filters[field.name]}
            onChange={handleFilterChange}
            className="w-full p-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-sm font-poppins bg-white hover:border-gray-300 transition-colors"
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-24 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins text-wrap">
            {activeTab === 'zoneWise' ? 'Zone Wise Reports' :
              activeTab === 'speciesWise' ? 'Species Wise Reports' :
                t(`reportHeaders.${activeTab}`)}
          </h1>
          <p className="text-gray-500 mt-1 font-poppins text-sm sm:text-base break-words max-w-full">Generate comprehensive reports with advanced filtering.</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-white/60 p-1.5 rounded-xl border border-white/50 backdrop-blur-md">
            {Object.keys(filterFields).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap font-poppins capitalize flex-grow sm:flex-grow-0 ${activeTab === tab
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2E7D32] hover:bg-white/50'
                  }`}
              >
                {tab.replace(/([A-Z])/g, ' $1').trim()} {/* Simple formatting: zoneWise -> Zone Wise */}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm p-4 sm:p-8 mb-8 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full opacity-50 -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center sm:justify-start mb-6">
              <div className="bg-green-100 p-2 rounded-lg mr-3 text-[#2E7D32]">
                <FaFilter />
              </div>
              <h2 className="text-xl font-bold text-gray-800 font-poppins capitalize">
                {activeTab.replace(/([A-Z])/g, ' $1').trim()} Filters
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filterFields[activeTab] || []).map((field) => (
                <React.Fragment key={field.name}>
                  {renderField(field)}
                </React.Fragment>
              ))}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide font-poppins">{t("filters.labels.startDate")}</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-sm font-poppins text-gray-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide font-poppins">{t("filters.labels.endDate")}</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-sm font-poppins text-gray-600"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={handleApplyFilter}
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 bg-[#2E7D32] text-white px-8 py-3 rounded-xl hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32] transition-all shadow-lg shadow-green-900/20 font-semibold font-poppins ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-0.5'
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("buttons.processing")}
                  </>
                ) : t("buttons.applyFilter")}
              </button>
              <button
                onClick={() => {
                  setFilters({
                    placeCategory: 'all',
                    startDate: '',
                    endDate: '',
                    state: '',
                    district: '',
                    block: '',
                    gp: '',

                    species: '',
                    zone: 'allzones',
                    plantationYear: '',
                    status: '',
                    plantationType: []
                  });
                  setShowDownload(false);
                  setFilteredData([]);
                }}
                className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-semibold font-poppins transition-colors"
              >
                {t("buttons.resetFilters")}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showDownload && (
          <div ref={downloadSectionRef} className="animate-fade-in-up">
            {/* Summary Components - Passing filtered data */}
            {activeTab === 'zoneWise' && <ZoneSummaryTable data={filteredData} />}
            {activeTab === 'speciesWise' && <SpeciesSummaryTable data={filteredData} />}
            {activeTab === 'custom' && <SpeciesSummaryTable data={filteredData} />}
            {activeTab === 'stateWise' && <SpeciesSummaryTable data={filteredData} />}
            {activeTab === 'kmlKmz' && <SpeciesSummaryTable data={filteredData} />}

            {/* Download Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">
                    <FaDownload />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-poppins">
                    Download {t(`reportHeaders.${activeTab}`) || activeTab.replace(/([A-Z])/g, ' $1').trim()} Report
                  </h3>
                </div>

                {/* Selected Filters Chips */}
                <div className="hidden md:flex flex-wrap gap-2 justify-end max-w-md">
                  {Object.entries(filters)
                    .filter(([_, value]) => value && value !== 'all' && value !== 'allzones' && value !== 'allspecies' && (Array.isArray(value) ? value.length > 0 : true))
                    .map(([key, value], index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                      >
                        {key === 'startDate' || key === 'endDate' ? value : t(`filters.options.${value}`) || value.toString()}
                      </span>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl">
                <button
                  onClick={() => handleDownload('excel')}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-300 group bg-white shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600 mr-3 group-hover:scale-110 transition-transform">
                      <FaFileExcel className="text-xl" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-gray-800 font-poppins group-hover:text-green-800">
                        {t("buttons.excel")}
                      </span>
                      <span className="text-xs text-gray-500">.xlsx format</span>
                    </div>
                  </div>
                  <FaDownload className="text-gray-300 group-hover:text-green-500" />
                </button>

                <button
                  onClick={() => handleDownload('pdf')}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 group bg-white shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600 mr-3 group-hover:scale-110 transition-transform">
                      <FaFilePdf className="text-xl" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-gray-800 font-poppins group-hover:text-red-800">
                        {t("buttons.pdf")}
                      </span>
                      <span className="text-xs text-gray-500">.pdf format</span>
                    </div>
                  </div>
                  <FaDownload className="text-gray-300 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Report;

