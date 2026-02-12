import React from 'react';
import { FaUsers, FaTree, FaGlobeAsia, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const EventStats = ({ totalEvents, totalTreesPlanted, totalStates, totalParticipants }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <div className="bg-white rounded-lg p-5 shadow-md border border-green-100 flex flex-col items-center justify-center">
        <FaGlobeAsia className="text-green-500 text-2xl mb-2" />
        <div className="text-sm text-gray-600">{t("events.totalStates")}</div>
        <div className="text-2xl font-bold text-green-700">{totalStates}</div>
      </div>
      <div className="bg-white rounded-lg p-5 shadow-md border border-green-100 flex flex-col items-center justify-center">
        <FaCheckCircle className="text-green-600 text-2xl mb-2" />
        <div className="text-sm text-gray-600">{t("events.successfulEvents")}</div>
        <div className="text-2xl font-bold text-green-700">10+</div>
      </div>
      <div className="bg-white rounded-lg p-5 shadow-md border border-green-100 flex flex-col items-center justify-center">
        <FaTree className="text-green-700 text-2xl mb-2" />
        <div className="text-sm text-gray-600">{t("events.treesPlanted")}</div>
        <div className="text-2xl font-bold text-green-700">{totalTreesPlanted}</div>
      </div>
      <div className="bg-white rounded-lg p-5 shadow-md border border-green-100 flex flex-col items-center justify-center">
        <FaUsers className="text-green-500 text-2xl mb-2" />
        <div className="text-sm text-gray-600">{t("events.totalParticipants")}</div>
        <div className="text-2xl font-bold text-green-700">{totalParticipants}</div>
      </div>
    </div>
  );
};

export default EventStats;
