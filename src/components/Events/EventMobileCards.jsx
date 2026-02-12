import React from 'react';
import { FaEye, FaFileDownload, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaImages } from 'react-icons/fa';

const EventMobileCards = ({ filteredEvents, t, onView, onDownload, onGalleryOpen }) => (
  <div className="block md:hidden">
    {filteredEvents.map((event) => (
      <div key={event.id} className="p-4 border-b border-gray-200 bg-white rounded-lg mb-3 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{event.name}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            event.status === "Completed"
              ? "bg-green-100 text-green-800"
              : event.status === "Ongoing"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {t(`events.status.${event.status.toLowerCase()}`)}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="text-gray-400" />
            {t("events.participantsCount", { count: event.participants })}
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => onView(event)}
            className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded-lg flex items-center justify-center gap-2 hover:bg-green-100 transition"
          >
            <FaEye /> {t("common.view")}
          </button>
          <button
            onClick={() => onDownload(event.id)}
            className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition"
          >
            <FaFileDownload /> {t("common.download")}
          </button>
          <button
            onClick={() => onGalleryOpen(event.id)}
            className="flex-1 py-2 px-3 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-100 transition"
          >
            <FaImages /> {t("events.gallery")}
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default EventMobileCards; 