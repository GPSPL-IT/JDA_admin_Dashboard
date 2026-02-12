import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FaArrowLeft, FaTree, FaCloudSun, FaWater, FaTrophy, FaLeaf } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ZoneDetails = ({ zoneName: propZoneName, zoneData, onClose }) => {
    const { zoneName: paramZoneName } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Determine if we are in modal mode
    const isModal = !!propZoneName;
    const zoneName = propZoneName || paramZoneName;

    // Filter states
    const [selectedSpecies, setSelectedSpecies] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');

    // Calculate/mock data based on input or fallback
    let totalPlantationCount = 0;
    let baseChartValue = 0;
    let zoneId = 1;

    if (zoneData) {
        // Use actual data from keys
        // 'indiv' is main "Plantation" count in table
        totalPlantationCount = parseInt(zoneData.indiv.replace(/,/g, '')) || 0;
        zoneId = parseInt(zoneName?.replace(/[^0-9]/g, '') || '1');
        // Derive base value for charts (approx split over 5 years + growth)
        baseChartValue = Math.floor(totalPlantationCount / 5.5);
    } else {
        // Fallback mock logic for URL access
        zoneId = parseInt(zoneName?.replace(/[^0-9]/g, '') || '1');
        const fallbackBase = zoneId * 1000;
        totalPlantationCount = fallbackBase * 5.5;
        baseChartValue = fallbackBase;
    }

    const summaryData = {
        totalPlantation: totalPlantationCount.toLocaleString('en-IN'),
        activeSites: 12 + zoneId,
        survivalRate: '85%',
        waterConsumption: `${zoneId * 2.5}M Liters`
    };

    const defaultSpeciesData = [
        { name: 'Neem', scientific: 'Azadirachta indica', weight: 95, status: 'Thriving', statusColor: 'bg-green-100 text-green-800' },
        { name: 'Peepal', scientific: 'Ficus religiosa', weight: 90, status: 'Thriving', statusColor: 'bg-green-100 text-green-800' },
        { name: 'Mango', scientific: 'Mangifera indica', weight: 85, status: 'Growing', statusColor: 'bg-blue-100 text-blue-800' },
        { name: 'Banyan', scientific: 'Ficus benghalensis', weight: 80, status: 'Thriving', statusColor: 'bg-green-100 text-green-800' },
        { name: 'Ashoka', scientific: 'Saraca asoca', weight: 75, status: 'Growing', statusColor: 'bg-blue-100 text-blue-800' },
        { name: 'Jamun', scientific: 'Syzygium cumini', weight: 70, status: 'Thriving', statusColor: 'bg-green-100 text-green-800' },
        { name: 'Arjun', scientific: 'Terminalia arjuna', weight: 65, status: 'Growing', statusColor: 'bg-blue-100 text-blue-800' },
        { name: 'Gulmohar', scientific: 'Delonix regia', weight: 60, status: 'Healthy', statusColor: 'bg-emerald-100 text-emerald-800' },
    ];

    // Distribute totalPlantationCount among species based on weights
    const totalWeight = defaultSpeciesData.reduce((acc, item) => acc + item.weight, 0);
    let currentSum = 0;

    const allSpeciesData = defaultSpeciesData.map((species, index) => {
        let count = 0;
        if (index === defaultSpeciesData.length - 1) {
            // Assign remaining to last item to ensure exact sum
            count = totalPlantationCount - currentSum;
        } else {
            count = Math.floor((species.weight / totalWeight) * totalPlantationCount);
            currentSum += count;
        }
        return {
            ...species,
            count: count
        };
    });

    // Charts Data Synchronization
    // 1. Bar Chart: Distribute total across 5 years
    // Weights for years
    const yearWeights = [1, 1.2, 1.5, 1.3, 1.5];
    const totalYearWeight = yearWeights.reduce((a, b) => a + b, 0);
    let currentYearSum = 0;

    const yearlyData = yearWeights.map((w, i) => {
        let val = 0;
        if (i === yearWeights.length - 1) {
            val = totalPlantationCount - currentYearSum;
        } else {
            val = Math.floor((w / totalYearWeight) * totalPlantationCount);
            currentYearSum += val;
        }
        return val;
    });

    const barChartData = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [
            {
                label: 'Plantation Count',
                data: yearlyData,
                backgroundColor: 'rgb(35, 107, 39,0.8)',
                hoverBackgroundColor: 'rgb(35, 107, 39)',
                borderColor: '#10b981',
                borderWidth: 0,
                borderRadius: 8,
                barThickness: 50,
            },
        ],
    };

    // 2. Pie Chart: Use Species Data
    const pieChartLabels = allSpeciesData.slice(0, 4).map(s => s.name);
    pieChartLabels.push('Other');

    const top4Count = allSpeciesData.slice(0, 4).reduce((sum, s) => sum + (s.count || 0), 0);
    const otherCount = totalPlantationCount - top4Count;

    const pieChartValues = allSpeciesData.slice(0, 4).map(s => s.count || 0);
    pieChartValues.push(otherCount);

    const pieChartData = {
        labels: pieChartLabels,
        datasets: [
            {
                data: pieChartValues,
                backgroundColor: [
                    'rgb(35, 107, 39,1)',    // Neem
                    'rgb(46, 125, 50, 1)',   // Peepal 
                    'rgb(76, 175, 80, 1)',   // Mango
                    'rgb(102, 187, 106, 1)', // Banyan
                    'rgb(165, 214, 167, 1)', // Other
                ],
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 10,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: "'Inter', 'Poppins', sans-serif",
                        size: 12,
                        weight: '500'
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 13, weight: '600' },
                bodyFont: { size: 12 },
                borderColor: 'rgb(35, 107, 39,0.3)',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 11 },
                    color: '#6b7280'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 11 },
                    color: '#6b7280'
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        family: "'Inter', 'Poppins', sans-serif",
                        size: 12,
                        weight: '500'
                    },
                    padding: 12,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 13, weight: '600' },
                bodyFont: { size: 12 },
                borderColor: 'rgb(35, 107, 39,0.3)',
                borderWidth: 1
            }
        }
    };



    // Filter species based on selected filter and search term
    const speciesData = allSpeciesData.filter(species => {
        const matchesSpecies = selectedSpecies === 'all' || species.name === selectedSpecies;
        const matchesSearch = species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            species.scientific.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSpecies && matchesSearch;
    });

    return (
        <div className={isModal ? "bg-gray-50 max-h-[90vh] overflow-y-auto" : "min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30 pb-12 pt-20"}>
            {/* Enhanced Header Section with Gradient */}
            <div className={`relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white ${isModal ? 'py-6 px-6' : 'py-12 px-4 sm:px-6 lg:px-8'} shadow-2xl overflow-hidden`}>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={isModal ? onClose : () => navigate(-1)}
                        className="flex items-center text-white/90 hover:text-white transition-all mb-6 group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">{isModal ? t('close', 'Close') : t('back', 'Back to List')}</span>
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                <FaTree className="text-4xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                                    {decodeURIComponent(zoneName)} {t('overview', 'Overview')}
                                </h1>
                                <p className="text-green-100 text-lg font-medium">
                                    {t('zoneDetailsSubtitle', 'Detailed plantation analytics and performance metrics')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 shadow-lg">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                            <div>
                                <span className="text-xs text-green-200 font-medium uppercase tracking-wider">Status</span>
                                <div className="font-bold text-lg">Active</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isModal ? 'py-8' : '-mt-10'}`}>
                {/* Enhanced Summary Cards with Consistent Green Gradient */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <SummaryCard
                        title="Total Plantation"
                        value={summaryData.totalPlantation}
                        icon={FaTree}
                        gradient="from-green-500 to-emerald-600"
                        iconBg="bg-white/20"
                    />
                    <SummaryCard
                        title="Active Sites"
                        value={summaryData.activeSites}
                        icon={FaMapMarkerAltDummy}
                        gradient="from-green-500 to-emerald-600"
                        iconBg="bg-white/20"
                    />
                    <SummaryCard
                        title="Survival Rate"
                        value={summaryData.survivalRate}
                        icon={FaLeaf}
                        gradient="from-green-500 to-emerald-600"
                        iconBg="bg-white/20"
                    />
                    <SummaryCard
                        title="Water Consumed"
                        value={summaryData.waterConsumption}
                        icon={FaWater}
                        gradient="from-green-500 to-emerald-600"
                        iconBg="bg-white/20"
                    />
                </div>

                {/* Enhanced Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Yearly Trend with Better Styling */}
                    <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 p-8 hover:shadow-3xl transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {t('yearlyProgress', 'Yearly Plantation Progress')}
                            </h3>
                        </div>
                        <div className="h-80">
                            <Bar options={chartOptions} data={barChartData} />
                        </div>
                    </div>

                    {/* Species Distribution with Better Styling */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 p-8 hover:shadow-3xl transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {t('speciesDist', 'Species Distribution')}
                            </h3>
                        </div>
                        <div className="h-80 flex items-center justify-center">
                            <Pie options={pieOptions} data={pieChartData} />
                        </div>
                    </div>
                </div>


                {/* Enhanced Table with Modern Design */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden hover:shadow-3xl transition-shadow">
                    <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-green-50/30">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <FaTrophy className="text-2xl text-yellow-500" />
                                <h3 className="text-xl font-bold text-gray-800">
                                    {t('topSpecies', 'Top Performing Species in Zone')}
                                </h3>
                            </div>

                            {/* Filter Controls */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Species Filter Dropdown */}
                                <select
                                    value={selectedSpecies}
                                    onChange={(e) => setSelectedSpecies(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm font-medium text-gray-700 shadow-sm hover:border-green-400 transition-colors"
                                >
                                    <option value="all">All Species</option>
                                    {allSpeciesData.map((species) => (
                                        <option key={species.name} value={species.name}>
                                            {species.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Search species..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm placeholder-gray-400 shadow-sm hover:border-green-400 transition-colors min-w-[200px]"
                                />

                                {/* Clear Filters Button */}
                                {(selectedSpecies !== 'all' || searchTerm) && (
                                    <button
                                        onClick={() => {
                                            setSelectedSpecies('all');
                                            setSearchTerm('');
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium shadow-sm"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-green-50/20">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Species Name</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Scientific Name</th>
                                    <th className="px-8 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Plantation Count</th>
                                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
                                {speciesData.map((species, i) => (
                                    <tr key={i} className="hover:bg-green-50/30 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                                                <span className="text-sm font-semibold text-gray-900">{species.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="text-sm text-gray-600 italic font-medium">{species.scientific}</span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <span className="text-sm font-bold text-gray-900">{species.count.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-center">
                                            <span className={`px-4 py-2 inline-flex text-xs font-bold rounded-full ${species.statusColor} shadow-sm`}>
                                                {species.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Simple Icon Component for reuse
const FaMapMarkerAltDummy = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
);

const SummaryCard = ({ title, value, icon: Icon, gradient, iconBg }) => (
    <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}>
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${iconBg} backdrop-blur-sm shadow-lg`}>
                    <Icon className="text-2xl" />
                </div>
            </div>
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-extrabold">{value}</p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"></div>
    </div>
);

export default ZoneDetails;
