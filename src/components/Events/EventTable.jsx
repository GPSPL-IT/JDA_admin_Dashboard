import React from 'react';
import { FaEye, FaFileDownload, FaMapMarkerAlt, FaUsers, FaImages } from 'react-icons/fa';

const EventTable = ({ filteredEvents, t, onView, onDownload, onGalleryOpen }) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {["eventName", "date", "location", "participants", "status", "actions"].map((key) => (
            <th key={key} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {t(`events.table.${key}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredEvents.map((event) => (
          <tr key={event.id} className="hover:bg-green-50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
            <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" />
              {event.location}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaUsers className="text-gray-400" />
                {event.participants.toLocaleString()}
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : event.status === "Ongoing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                {t(`events.status.${event.status.toLowerCase()}`)}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <button onClick={() => onView(event)} className="text-gray-600 hover:text-green-600" title={t("common.view")}> <FaEye size={18} /> </button>
                <button onClick={() => onDownload(event.id)} className="text-gray-600 hover:text-blue-600" title={t("common.download")}> <FaFileDownload size={18} /> </button>
                <button onClick={() => onGalleryOpen(event.id)} className="text-gray-600 hover:text-purple-600" title={t("events.gallery")}> <FaImages size={18} /> </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EventTable; 