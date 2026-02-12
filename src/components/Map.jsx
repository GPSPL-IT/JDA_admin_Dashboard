import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, Circle, ImageOverlay, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import omnivore from 'leaflet-omnivore';
// ... imports

// Component to load KML layer
const KMLLayer = ({ url }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !url) {
      console.log('KML Layer: map or url not available', { map: !!map, url });
      return;
    }

    console.log('Loading KML from:', url);

    const kmlLayer = omnivore.kml(url, null, L.geoJSON(null, {
      style: () => ({
        color: '#1B5E20',
        weight: 4,
        opacity: 0.8,
        fillOpacity: 0.15,
        fillColor: '#4CAF50'
      }),
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          const popupContent = `<div style="font-family: 'Poppins', sans-serif;">
            <strong style="color: #2E7D32; font-size: 14px;">${feature.properties.name || 'Jaipur Area'}</strong>
            ${feature.properties.description ? `<p style="margin-top: 5px; font-size: 12px;">${feature.properties.description}</p>` : ''}
          </div>`;
          layer.bindPopup(popupContent);
        }
      }
    }))
      .on('ready', function () {
        console.log('KML loaded successfully!', kmlLayer);
        try {
          const bounds = kmlLayer.getBounds();
          console.log('KML bounds:', bounds);
          if (bounds && bounds.isValid()) {
            map.fitBounds(bounds);
          }
        } catch (e) {
          console.error('Could not fit bounds:', e);
        }
      })
      .on('error', function (e) {
        console.error('Error loading KML:', e);
      })
      .addTo(map);

    return () => {
      if (map.hasLayer(kmlLayer)) {
        map.removeLayer(kmlLayer);
      }
    };
  }, [map, url]);

  return null;
};


// Fix for default marker icons in Leaflet with Vite/Webpack
// Using CDN URLs for marker icons
if (L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Map = () => {
  const { t } = useTranslation('map');

  const [mapData, setMapData] = useState([]);

  // Rajasthan center coordinates
  const rajasthanCenter = [27.0238, 74.2179];
  const zoomLevel = 7; // Zoom level to show entire Rajasthan

  // Bounds to show Rajasthan state
  const rajasthanBounds = [
    [23.5, 69.5], // Southwest corner (southern Rajasthan)
    [30.5, 78.5]  // Northeast corner (northern Rajasthan)
  ];

  // JDA Office Locations in Jaipur
  const jdaLocations = [
    {
      name: 'JDA Office - Ram Kishor Vyas Bhawan',
      position: [26.902787873312974, 75.82374076670897],
      address: 'Ram Kishor Vyas Bhawan, Indra Circle, Jawahar Lal Nehru Marg, Rambagh, Jaipur, Rajasthan 302004',
      image: 'https://lh5.googleusercontent.com/p/AF1QipPQCqGfL_b5JxL7OhJUqKJHLGLJzElLmVpVvJZC=w408-h306-k-no',
      phone: '082902 62601',
      website: 'jda.rajasthan.gov.in'
    },
    {
      name: 'JDA Office - Prithviraj Nagar South',
      position: [26.851033831668, 75.77327232743703],
      address: 'Prithviraj Nagar South, Zone 18 & 19, Sector 12, Mansarover Scheme, Jaipur, Rajasthan 302020',
      image: 'https://lh5.googleusercontent.com/p/AF1QipM5vYPVMzqnJxmZTqOdPr0gOXt8GQMzK1E_l_Fd=w408-h306-k-no',
      phone: '0141 256 9696',
      website: 'jda.urban.rajasthan.gov.in'
    },
    {
      name: 'JDA PRN North Zone Office',
      position: [26.906155658103728, 75.73413353779756],
      address: 'Zone 16 & 17, Office of Prithviraj Nagar North, 4, Sandhya Marg, Chitrakoot Sector 3, Chitrakoot, Jaipur 303021',
      image: 'https://lh5.googleusercontent.com/p/AF1QipPBY5H9vXH_d2QfmkH6dS6Pz7JJfhgL_B7MNBFu=w408-h306-k-no',
      phone: 'Not listed',
      website: 'jda.urban.rajasthan.gov.in'
    }
  ];

  // Create custom red icon for JDA offices
  const jdaIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const legendItems = [
    { color: '#2E7D32', label: t('legend.high'), value: t('legend.highValue') },
    { color: '#FFA726', label: t('legend.medium'), value: t('legend.mediumValue') },
    { color: '#EF5350', label: t('legend.low'), value: t('legend.lowValue') },
  ];

  useEffect(() => {
    apiFetchMapData();
  }, []);

  const apiFetchMapData = () => {
    // Mock map data for demonstration purposes
    const mockMapData = [
      { level: 1, id: 'IN-RJ', lgd_code: 113, name: 'Rajasthan', value: 645 }
    ];
    setMapData(mockMapData);
  };

  // Function to get color based on plantation value
  const getColorByValue = (value) => {
    if (value >= 120) return '#2E7D32'; // High
    if (value >= 90) return '#FFA726'; // Medium
    return '#EF5350'; // Low
  };

  return (
    <div className="flex flex-col lg:flex-row w-full lg:w-1/2 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-[#2E7D32] flex items-center gap-2">
              <span className="p-1.5 bg-[#E8F5E9] rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Plantation Map
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-9">
              Interactive map of plantation zones
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#C8E6C9] rounded-full transition-colors duration-200 flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {t('map.button')}
          </button>
        </div>

        {/* Color Legend */}
        <div className="px-6 py-3 border-b border-gray-100 bg-white">
          <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-700 font-[Poppins]">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-400 border-l border-gray-300 pl-1.5">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaflet Map */}
        <div className="relative h-[calc(100%-130px)] z-0">
          <div className="absolute inset-0 p-3 sm:p-4 md:p-6">
            <div className="h-full rounded-xl border border-[#E0E0E0] overflow-hidden">
              <MapContainer
                center={rajasthanCenter}
                zoom={zoomLevel}
                minZoom={6}
                maxZoom={18}
                maxBounds={rajasthanBounds}
                maxBoundsViscosity={1.0}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </LayersControl.BaseLayer>

                  <LayersControl.Overlay name="JDA Sector Map">
                    <ImageOverlay
                      url="https://jda.urban.rajasthan.gov.in/content/dam/raj/udh/jda/images/map_images/Sector_map.jpg"
                      bounds={[[26.75, 75.65], [27.05, 75.95]]}
                      opacity={0.3}
                      zIndex={10}
                    />
                  </LayersControl.Overlay>
                </LayersControl>

                {/* Load KML Plantation Zones */}
                <KMLLayer url="/data/doc.kml" />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
