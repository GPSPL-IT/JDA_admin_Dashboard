import React from 'react';
import EventMobileCards from './EventMobileCards';
import EventTable from './EventTable';

const EventList = ({ filteredEvents, t, onView, onDownload, onGalleryOpen }) => (
  <div className="w-full">
    <EventMobileCards
      filteredEvents={filteredEvents}
      t={t}
      onView={onView}
      onDownload={onDownload}
      onGalleryOpen={onGalleryOpen}
    />
    <EventTable
      filteredEvents={filteredEvents}
      t={t}
      onView={onView}
      onDownload={onDownload}
      onGalleryOpen={onGalleryOpen}
    />
  </div>
);

export default EventList;
