
import React, { useState } from 'react';
import { FaTree, FaUsers, FaMapMarkerAlt, FaFileAlt, FaCalendarAlt, FaSeedling } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Main green color - aligned with global theme
const MAIN_GREEN = '#2E7D32';

const StatCard = ({ title, value, icon: Icon, percentage }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 truncate">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold" style={{ color: MAIN_GREEN }}>{value}</p>
        {percentage && (
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-semibold" style={{ color: MAIN_GREEN }}>{percentage}</span> {title && title.includes('User') ? null : <span>{' '}</span>}
          </p>
        )}
      </div>
      <div className="p-2 sm:p-3 rounded-full flex items-center justify-center flex-shrink-0 ml-3 bg-green-50">
        <Icon className="text-xl sm:text-2xl" style={{ color: MAIN_GREEN }} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = ({ setActiveSection }) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('allTime');
  const [isLoading, setIsLoading] = useState(false);
  const [mapViewType, setMapViewType] = useState('zone');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  const timePeriodData = {
    allTime: {
      plantation: 120000,
      event: 12475,
      zone: 7,
      species: 8,
      total: 120000 // Aligned with Total Plantation
    },
    thisYear: {
      plantation: 63900, // Approx 60%
      event: 8475,
      zone: 7,
      species: 8,
      total: 63900
    },
    thisMonth: {
      plantation: 10650, // Approx 10%
      event: 1475,
      zone: 7,
      species: 5,
      total: 10650
    }
  };

  // Canonical data matching List.jsx and Department.jsx
  const locationData = {
    zones: [
      { id: 1, name: t('zones.Zone 1', 'Zone 1'), plantations: 150, plants: 18500 },
      { id: 2, name: t('zones.Zone 2', 'Zone 2'), plantations: 120, plants: 16200 },
      { id: 3, name: t('zones.Zone 3', 'Zone 3'), plantations: 100, plants: 15800 },
      { id: 4, name: t('zones.Zone 4', 'Zone 4'), plantations: 90, plants: 14500 },
      { id: 5, name: t('zones.Zone 5', 'Zone 5'), plantations: 80, plants: 13500 },
      { id: 6, name: t('zones.Zone 6', 'Zone 6'), plantations: 110, plants: 15000 },
      { id: 7, name: t('zones.Zone 7', 'Zone 7'), plantations: 95, plants: 13000 },
    ],
    species: [
      { id: 1, name: t('speciesNames.Neem', 'Neem'), plantations: 500, plants: 18500 },
      { id: 2, name: t('speciesNames.Peepal', 'Peepal'), plantations: 400, plants: 15200 },
      { id: 3, name: t('speciesNames.Banyan', 'Banyan'), plantations: 300, plants: 12800 },
      { id: 4, name: t('speciesNames.Khejri', 'Khejri'), plantations: 600, plants: 22000 },
      { id: 5, name: t('speciesNames.Gulmohar', 'Gulmohar'), plantations: 350, plants: 11200 },
      { id: 6, name: t('speciesNames.Ashoka', 'Ashoka'), plantations: 200, plants: 10000 },
      { id: 7, name: t('speciesNames.Amaltas', 'Amaltas'), plantations: 180, plants: 8800 },
      { id: 8, name: t('speciesNames.Arjun', 'Arjun'), plantations: 160, plants: 8000 }
    ]
  };

  const handlePeriodChange = (period) => {
    setIsLoading(true);
    setSelectedPeriod(period);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleViewTypeChange = (type) => {
    setMapViewType(type);
    setSelectedZone('');
    setSelectedSpecies('');
  };

  const getCurrentViewData = () => {
    switch (mapViewType) {
      case 'zone':
        return selectedZone ? locationData.zones.filter(z => z.name === selectedZone) : locationData.zones;
      case 'species':
        return selectedSpecies ? locationData.species.filter(s => s.name === selectedSpecies) : locationData.species;
      default:
        return locationData.zones;
    }
  };

  const getCurrentViewTitle = () => {
    switch (mapViewType) {
      case 'zone':
        return selectedZone ? t('dashboard.zoneViewSelected', '{{zone}} View', { zone: selectedZone }) : t('dashboard.zoneView', 'Zone Wise View');
      case 'species':
        return selectedSpecies ? t('dashboard.speciesViewSelected', '{{species}} Distribution', { species: selectedSpecies }) : t('dashboard.speciesView', 'Species Wise View');
      default:
        return t('dashboard.plantationMap', 'Plantation Map');
    }
  };

  const stats = [
    { title: t('dashboard.totalPlantations', 'Total Plantations'), value: '1,20,000', icon: FaTree, percentage: '+8.2%' },
    { title: t('dashboard.totalUsers', 'Total Users'), value: '2,487', icon: FaUsers, percentage: '+4.1%' },
    { title: t('dashboard.locations', 'Locations'), value: '328', icon: FaMapMarkerAlt, percentage: '+2.5%' },
    { title: t('dashboard.certificatesIssued', 'Certificates Issued'), value: '1,654', icon: FaFileAlt, percentage: '+12.3%' },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Combined Plantation Summary and Map Section */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Plantation Summary */}
        <div className="flex-1 p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: MAIN_GREEN }}>{t('dashboard.plantationSummary', 'Plantation Summary')}</h3>

          {/* Period Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={() => handlePeriodChange('allTime')}
              className={`px-3 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 border border-[#2E7D32] ${selectedPeriod === 'allTime' ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-white text-[#2E7D32] hover:bg-green-50'}`}
            >
              {t('dashboard.allTime', 'All Time')}
            </button>
            <button
              onClick={() => handlePeriodChange('thisYear')}
              className={`px-3 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 border border-[#2E7D32] ${selectedPeriod === 'thisYear' ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-white text-[#2E7D32] hover:bg-green-50'}`}
            >
              {t('dashboard.thisYear', 'This Year')}
            </button>
            <button
              onClick={() => handlePeriodChange('thisMonth')}
              className={`px-3 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 border border-[#2E7D32] ${selectedPeriod === 'thisMonth' ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-white text-[#2E7D32] hover:bg-green-50'}`}
            >
              {t('dashboard.thisMonth', 'This Month')}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPeriod}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              {isLoading ? (
                <div className="col-span-2 flex justify-center items-center h-32 sm:h-48">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2" style={{ borderColor: MAIN_GREEN }}></div>
                </div>
              ) : (
                <>
                  <div
                    className="flex flex-col items-center p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-green-50 transition border border-gray-100"
                    onClick={() => setActiveSection && setActiveSection('individual')}
                  >
                    <FaTree className="text-2xl sm:text-3xl mb-2" style={{ color: MAIN_GREEN }} />
                    <p className="text-xs sm:text-sm text-gray-800 font-medium text-center">{t('dashboard.plantation', 'Plantation')}</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{ color: MAIN_GREEN }}>{timePeriodData[selectedPeriod].plantation.toLocaleString()}</p>
                  </div>
                  <div
                    className="flex flex-col items-center p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-green-50 transition border border-gray-100"
                    onClick={() => setActiveSection && setActiveSection('event')}
                  >
                    <FaCalendarAlt className="text-2xl sm:text-3xl mb-2" style={{ color: MAIN_GREEN }} />
                    <p className="text-xs sm:text-sm text-gray-800 font-medium text-center">{t('dashboard.event', 'Event')}</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{ color: MAIN_GREEN }}>{timePeriodData[selectedPeriod].event.toLocaleString()}</p>
                  </div>
                  <div
                    className="flex flex-col items-center p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-green-50 transition border border-gray-100"
                    onClick={() => setActiveSection && setActiveSection('zonewise')}
                  >
                    <FaMapMarkerAlt className="text-2xl sm:text-3xl mb-2" style={{ color: MAIN_GREEN }} />
                    <p className="text-xs sm:text-sm text-gray-800 font-medium text-center">{t('dashboard.zone', 'Zone')}</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{ color: MAIN_GREEN }}>{timePeriodData[selectedPeriod].zone.toLocaleString()}</p>
                  </div>
                  <div
                    className="flex flex-col items-center p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-green-50 transition border border-gray-100"
                    onClick={() => setActiveSection && setActiveSection('specieswise')}
                  >
                    <FaSeedling className="text-2xl sm:text-3xl mb-2" style={{ color: MAIN_GREEN }} />
                    <p className="text-xs sm:text-sm text-gray-800 font-medium text-center">{t('dashboard.species', 'Species')}</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{ color: MAIN_GREEN }}>{timePeriodData[selectedPeriod].species.toLocaleString()}</p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
            <p className="text-base sm:text-lg font-semibold" style={{ color: MAIN_GREEN }}>{t('dashboard.totalPlantations', 'Total Plantations')}</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: MAIN_GREEN }}>{timePeriodData[selectedPeriod].total.toLocaleString()}</p>
          </div>
        </div>

        {/* Plantation Map */}
        <div className="flex-1 p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: MAIN_GREEN }}>{t('dashboard.plantationMap', 'Plantation Map')}</h3>

          {/* Map View Type Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleViewTypeChange('zone')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border border-[#2E7D32] ${mapViewType === 'zone' ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-white text-[#2E7D32] hover:bg-green-50'}`}
            >
              {t('zones.Zone Wise', 'Zone Wise')}
            </button>
            <button
              onClick={() => handleViewTypeChange('species')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border border-[#2E7D32] ${mapViewType === 'species' ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-white text-[#2E7D32] hover:bg-green-50'}`}
            >
              {t('zones.Species Wise', 'Species Wise')}
            </button>
          </div>

          {/* Zone View - Select Zone */}
          {mapViewType === 'zone' && (
            <div className="mb-4">
              <label htmlFor="zone-select" className="block text-sm font-semibold mb-2" style={{ color: MAIN_GREEN }}>{t('zones.Select Zone', 'Select Zone')}</label>
              <select
                id="zone-select"
                className="block w-full px-3 sm:px-4 py-2 rounded-lg shadow-sm focus:outline-none text-sm border border-gray-200 bg-white"
                style={{ color: MAIN_GREEN }}
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value);
                  setMapViewType('zone');
                }}
              >
                <option value="">{t('zones.All Zones', 'All Zones')}</option>
                {locationData.zones.map(zone => (
                  <option key={zone.id} value={zone.name}>{zone.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Species View - Select Species */}
          {mapViewType === 'species' && (
            <div className="mb-4">
              <label htmlFor="species-select" className="block text-sm font-semibold mb-2" style={{ color: MAIN_GREEN }}>{t('zones.Select Species', 'Select Species')}</label>
              <select
                id="species-select"
                className="block w-full px-3 sm:px-4 py-2 rounded-lg shadow-sm focus:outline-none text-sm border border-gray-200 bg-white"
                style={{ color: MAIN_GREEN }}
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
              >
                <option value="">{t('speciesNames.All Species', 'All Species')}</option>
                {locationData.species.map(species => (
                  <option key={species.id} value={species.name}>{species.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Map Display */}
          <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-white border border-gray-100">
            <img
              src="https://via.placeholder.com/800x400?text=Interactive+Map+Placeholder"
              alt={t('dashboard.plantationMap', 'Plantation Map')}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
              <div
                className="rounded-lg shadow-xl text-center"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: `1px solid ${MAIN_GREEN}20`,
                  minWidth: 280,
                  maxWidth: 400,
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <FaMapMarkerAlt className="text-3xl sm:text-4xl mb-2" style={{ color: MAIN_GREEN }} />
                <p className="text-lg sm:text-2xl font-bold mb-1" style={{ color: MAIN_GREEN }}>
                  {mapViewType === 'zone'
                    ? (selectedZone ? selectedZone : t('dashboard.allZones', 'All Zones'))
                    : (selectedSpecies ? selectedSpecies : t('dashboard.allSpecies', 'All Species'))
                  }
                </p>
                <p className="text-sm sm:text-base mb-0" style={{ color: MAIN_GREEN, opacity: 0.8 }}>
                  {t('dashboard.showingTypes', 'Total Count: {{count}}', {
                    count: (mapViewType === 'zone'
                      ? (selectedZone ? locationData.zones.find(z => z.name === selectedZone)?.plants : locationData.zones.reduce((acc, curr) => acc + curr.plants, 0))
                      : (selectedSpecies ? locationData.species.find(s => s.name === selectedSpecies)?.plants : locationData.species.reduce((acc, curr) => acc + curr.plants, 0))
                    ).toLocaleString()
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;