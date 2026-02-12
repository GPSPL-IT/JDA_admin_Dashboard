import React from 'react';
import { FaImages, FaTimes } from 'react-icons/fa';

const EventGalleryModal = ({ show, photos, t, onClose, eventName }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            {t("events.eventGallery")} {eventName ? `- ${eventName}` : ""}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-green-700 p-2 text-2xl font-bold"
          >
            <FaTimes />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={t("events.photoAlt")}
                className="w-full h-48 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300?text=Photo+Not+Found";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                <p className="text-sm">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
        {photos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaImages size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t("events.noPhotosAvailable")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGalleryModal;
