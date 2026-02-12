import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaFileDownload } from 'react-icons/fa';

const EventModal = ({ show, event, t, onClose, onDownload }) => {
  if (!show || !event) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-green-800">{event.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-green-700 text-2xl font-bold">×</button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaUsers />
            <span>{t("events.participantsCount", { count: event.participants })}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{t("events.eventDetails")}</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">{t("events.achievement")}</h3>
            <p className="text-green-700">{t("events.totalTreesPlanted", { count: event.treesPlanted })}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => onDownload(event.id)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all shadow-lg font-semibold"
          >
            <FaFileDownload />
            {t("common.downloadReport")}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal; 