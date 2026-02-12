import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { FaArrowLeft, FaLeaf, FaSeedling, FaCloudRain, FaTemperatureHigh } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SpeciesDetails = () => {
    const { speciesName } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Use useLocation to get state
    const { t } = useTranslation();

    // Get data from state if available
    const speciesData = location.state?.speciesData;

    // Mock Data Generators based on Species Name
    const cleanName = decodeURIComponent(speciesName).split(' ')[0];

    // Determine the main total count
    let totalPlantedCount = 0;
    if (speciesData && speciesData.total) {
        totalPlantedCount = parseInt(speciesData.total.replace(/,/g, '')) || 0;
    } else {
        // Fallback
        const baseValue = cleanName.length * 1500;
        totalPlantedCount = baseValue * 4.2;
    }

    const summaryData = {
        totalPlanted: totalPlantedCount.toLocaleString('en-IN'),
        carbonOffset: `${(totalPlantedCount * 0.005).toFixed(1)} Tons`, // Adjusted formula
        growthRate: 'Moderate-Fast',
        avgHeight: '15-20 Meters'
    };

    const growthChartData = {
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        datasets: [
            {
                label: 'Average Height (ft)',
                data: [2, 5, 12, 18, 25],
                fill: true,
                backgroundColor: 'rgba(46, 125, 50, 0.2)',
                borderColor: '#2E7D32',
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#2E7D32',
                pointRadius: 5,
            },
        ],
    };

    // Distribute total across zones
    const zoneWeights = [1.0, 0.8, 1.5, 0.6, 1.1]; // Weights for 5 zones
    const totalWeight = zoneWeights.reduce((a, b) => a + b, 0);
    let currentSum = 0;

    const zoneCounts = zoneWeights.map((w, i) => {
        let count = 0;
        if (i === zoneWeights.length - 1) {
            count = totalPlantedCount - currentSum;
        } else {
            count = Math.floor((w / totalWeight) * totalPlantedCount);
            currentSum += count;
        }
        return count;
    });

    const zoneDistributionData = {
        labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
        datasets: [
            {
                label: 'Plantation Count',
                data: zoneCounts,
                backgroundColor: 'rgba(102, 187, 106, 0.8)',
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { family: "'Poppins', sans-serif" } }
            },
            title: { display: false }
        },
        scales: {
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { family: "'Poppins', sans-serif" } }
            },
            x: {
                grid: { display: false },
                ticks: { font: { family: "'Poppins', sans-serif" } }
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-10 pt-20">
            {/* Header Section */}
            <div className="bg-[#1B5E20] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                    <FaLeaf size={300} />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-white/80 hover:text-white transition-colors mb-4 group"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t('backToSpecies', 'Back to Species List')}
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-3xl font-bold font-poppins">{decodeURIComponent(speciesName)}</h1>
                            <p className="text-green-100 mt-1 italic">{t('scientificName', 'Scientific Name: ')} <span className="font-semibold">Azadirachta indica</span> (Mock)</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20">Medicinal</span>
                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20">Timber</span>
                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20">Shade</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SummaryCard
                        title="Total Planted"
                        value={summaryData.totalPlanted}
                        icon={FaSeedling}
                        color="text-emerald-600"
                        bgColor="bg-emerald-50"
                    />
                    <SummaryCard
                        title="Est. Carbon Offset"
                        value={summaryData.carbonOffset}
                        icon={FaCloudRain}
                        color="text-cyan-600"
                        bgColor="bg-cyan-50"
                    />
                    <SummaryCard
                        title="Growth Rate"
                        value={summaryData.growthRate}
                        icon={FaLeaf}
                        color="text-green-600"
                        bgColor="bg-green-50"
                    />
                    <SummaryCard
                        title="Avg. Height"
                        value={summaryData.avgHeight}
                        icon={FaTemperatureHigh}
                        color="text-orange-600"
                        bgColor="bg-orange-50"
                    />
                </div>

                {/* Info & Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Species Information */}
                    <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 font-poppins border-b pb-2">{t('aboutSpecies', 'About Species')}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                This species is known for its resilience and fast growth. It provides excellent shade and has significant medicinal properties. It is widely planted in arid and semi-arid regions for soil conservation and afforestation.
                            </p>
                            <h4 className="font-semibold text-gray-700 text-sm mb-2">{t('keyBenefits', 'Key Benefits:')}</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li>Drought Tolerance</li>
                                <li>High Air Purification</li>
                                <li>Soil Nitrogen Fixation</li>
                                <li>Biodiversity Support</li>
                            </ul>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <button className="w-full py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-lg font-semibold hover:bg-[#2E7D32] hover:text-white transition-colors text-sm">
                                {t('downloadGuide', 'Download Planting Guide')}
                            </button>
                        </div>
                    </div>

                    {/* Growth Chart */}
                    <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 font-poppins">{t('growthCurve', 'Typical Growth Curve')}</h3>
                        <div className="h-64">
                            <Line options={chartOptions} data={growthChartData} />
                        </div>
                    </div>

                    {/* Zone Distribution Chart */}
                    <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 font-poppins">{t('distribution', 'Zone Distribution')}</h3>
                        <div className="h-64">
                            <Bar options={chartOptions} data={zoneDistributionData} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-start justify-between transform hover:scale-105 transition-transform duration-300">
        <div>
            <p className="text-sm font-medium text-gray-500 font-poppins">{title}</p>
            <p className="text-xl font-bold text-gray-800 mt-1 font-poppins">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
            <Icon className="text-xl" />
        </div>
    </div>
);

export default SpeciesDetails;
