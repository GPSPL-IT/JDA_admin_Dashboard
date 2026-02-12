import React from 'react';

const EventHeader = ({ eventFilter, specialEvents, t, clearFilter }) => (
  <div className="mb-6 lg:mb-8">
    <div className="flex flex-col items-start">
      <h1 className="text-4xl font-extrabold text-green-800 mb-2 tracking-tight leading-tight">
        {eventFilter ? specialEvents[eventFilter]?.name : t("events.title")}
      </h1>
      <p className="text-lg text-gray-700 mb-2 max-w-2xl">
        {eventFilter ? specialEvents[eventFilter]?.description : t("events.subtitle")}
      </p>
      {eventFilter && (
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={clearFilter}
            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            {t("events.viewAllEvents")}
          </button>
        </div>
      )}
    </div>
  </div>
);

export default EventHeader;
