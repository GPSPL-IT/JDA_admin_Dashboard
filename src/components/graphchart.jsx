import React, { useState } from 'react';
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
import { Bar, Line } from 'react-chartjs-2';

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

const GraphChart = () => {
  const { t } = useTranslation();
  const [isCumulative, setIsCumulative] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2023-2024');

  const years = [
    '2019-2020', '2020-2021', '2021-2022',
    '2022-2023', '2023-2024', '2024-2025', '2025-2026'
  ];

  const yearlyData = {
    '2019-2020': [80, 120, 150, 200, 180, 160, 140],
    '2020-2021': [320, 280, 240, 200, 180, 160, 140],
    '2021-2022': [200, 180, 160, 140, 120, 100, 80],
    '2022-2023': [230, 210, 190, 170, 150, 130, 110],
    '2023-2024': [290, 270, 250, 230, 210, 190, 170],
    '2024-2025': [90, 80, 70, 60, 50, 40, 30],
    '2025-2026': [5, 10, 15, 20, 25, 30, 35]
  };

  const cumulativeData = years.reduce((acc, year, index) => {
    const yearValue = yearlyData[year][0];
    if (index === 0) return [yearValue];
    return [...acc, acc[index - 1] + yearValue];
  }, []);

  const createGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, 'rgba(178, 234, 215, 0.3)');
    gradient.addColorStop(0.5, 'rgba(46, 125, 50, 0.5)');
    gradient.addColorStop(1, 'rgba(46, 125, 50, 0.7)');
    return gradient;
  };

  const yearlyChartData = {
    labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7'],
    datasets: [
      {
        type: 'bar',
        label: t('graph.yearlyLabel'),
        data: yearlyData[selectedYear],
        backgroundColor: 'rgba(46, 125, 50, 0.7)',
        borderColor: 'rgb(100, 181, 246)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 40,
      }
    ],
  };

  const cumulativeChartData = {
    labels: years,
    datasets: [
      {
        type: 'line',
        fill: true,
        label: t('graph.cumulativeLabel'),
        data: cumulativeData,
        borderColor: '#2E7D32',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return createGradient(ctx);
        },
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        borderWidth: 3,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: window.innerWidth < 768 ? 10 : 12
          },
          padding: window.innerWidth < 768 ? 8 : 12
        }
      },
      title: {
        display: true,
        text: t('graph.title', 'Progress: Zone Wise Plantation Records'),
        font: {
          family: "'Poppins', sans-serif",
          size: window.innerWidth < 768 ? 14 : 16,
          weight: 'bold'
        },
        padding: window.innerWidth < 768 ? 10 : 20
      },
      tooltip: {
        backgroundColor: '#2E7D32',
        titleFont: { family: "'Poppins', sans-serif", size: 12 },
        bodyFont: { family: "'Poppins', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' ' + t('graph.trees');
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: { family: "'Poppins', sans-serif", size: window.innerWidth < 768 ? 10 : 12 },
          callback: function (value) {
            return value + ' ' + t('graph.trees');
          }
        },
        title: {
          display: true,
          text: t('graph.yAxis'),
          font: { family: "'Poppins', sans-serif", size: window.innerWidth < 768 ? 10 : 12 }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Poppins', sans-serif", size: window.innerWidth < 768 ? 9 : 11 },
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="w-full md:w-1/2 px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm p-6 h-full flex flex-col">

        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start bg-gray-50/80 p-1 rounded-full border border-gray-100">
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-sm
              ${!isCumulative
                  ? 'bg-[#2E7D32] text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-[#2E7D32] hover:bg-white'}`}
              onClick={() => setIsCumulative(false)}
            >
              {t('graph.yearly')}
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-sm
              ${isCumulative
                  ? 'bg-[#2E7D32] text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-[#2E7D32] hover:bg-white'}`}
              onClick={() => setIsCumulative(true)}
            >
              {t('graph.cumulative')}
            </button>
          </div>

          {/* Year Selector (Only for yearly mode) */}
          {!isCumulative && (
            <div className="relative group">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-2 text-sm font-medium rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] cursor-pointer appearance-none hover:border-[#2E7D32] transition-colors"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Chart Area */}
        <div className="flex-1 min-h-[300px] relative w-full">
          {isCumulative ? (
            <Line options={options} data={cumulativeChartData} />
          ) : (
            <Bar options={options} data={yearlyChartData} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
            <span>Live Data</span>
          </div>
          <p>
            {t('graph.lastUpdated')}: <span className="font-semibold text-gray-700">{isCumulative ? years[years.length - 1] : selectedYear}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GraphChart;
