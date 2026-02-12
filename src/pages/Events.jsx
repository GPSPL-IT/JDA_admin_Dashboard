import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { images } from '../assets/images';
import {
  EventHeader,
  EventSearchBar,
  EventStats,
  EventList,
  EventModal,
  EventGalleryModal
} from '../components/Events';

const Events = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventFilter = searchParams.get('event');

  useEffect(() => {
    document.title = `${t("events.title")} | GeoTreeMIS`;
  }, [t]);

  // Special events mapping
  const specialEvents = {
    hariyali_teej: {
      name: t("hariyali_teej"),
      description: t("hariyali_teej_desc"),
      date: "2023-08-19",
      location: t("events.locations.maharashtraForest"),
      department: t("events.departments.forest"),
      participants: 2000,
      treesPlanted: 15000,
      status: "Completed",
      image: images.hariyaliTeej
    },
    pm_scheme: {
      name: t("pm_scheme"),
      description: t("pm_scheme_desc"),
      date: "2024-01-01",
      location: t("events.locations.multipleDistricts"),
      department: t("events.departments.environment"),
      participants: 5000,
      treesPlanted: 50000,
      status: "Ongoing",
      image: images.pmScheme
    },
    world_environment_day: {
      name: t("world_environment_day"),
      description: t("world_environment_day_desc"),
      date: "2023-06-05",
      location: t("events.locations.karnatakaSchools"),
      department: t("events.departments.education"),
      participants: 3000,
      treesPlanted: 25000,
      status: "Completed",
      image: images.worldEnvironment
    }
  };

  const events = [
    {
      id: 1,
      name: t("events.eventNames.hariyaliMahotsav"),
      date: "2024-07-15",
      location: t("events.locations.maharashtraForest"),
      department: t("events.departments.forest"),
      participants: 1500,
      treesPlanted: 10000,
      status: "Completed",
      description: t("events.description1"),
      type: "regular"
    },
    {
      id: 2,
      name: t("events.eventNames.greenSchoolInitiative"),
      date: "2024-08-05",
      location: t("events.locations.karnatakaSchools"),
      department: t("events.departments.education"),
      participants: 800,
      treesPlanted: 3000,
      status: "Upcoming",
      description: t("events.description2"),
      type: "regular"
    },
    {
      id: 3,
      name: t("events.eventNames.vanMahotsavWeek"),
      date: "2024-07-01",
      location: t("events.locations.multipleDistricts"),
      department: t("events.departments.environment"),
      participants: 2500,
      treesPlanted: 15000,
      status: "Completed",
      description: t("events.description3"),
      type: "regular"
    }
  ];

  // Add special events to the events array
  const allEvents = [
    ...events,
    {
      id: 4,
      name: specialEvents.hariyali_teej.name,
      date: specialEvents.hariyali_teej.date,
      location: specialEvents.hariyali_teej.location,
      department: specialEvents.hariyali_teej.department,
      participants: specialEvents.hariyali_teej.participants,
      treesPlanted: specialEvents.hariyali_teej.treesPlanted,
      status: specialEvents.hariyali_teej.status,
      description: specialEvents.hariyali_teej.description,
      type: "special",
      specialEventId: "hariyali_teej"
    },
    {
      id: 5,
      name: specialEvents.pm_scheme.name,
      date: specialEvents.pm_scheme.date,
      location: specialEvents.pm_scheme.location,
      department: specialEvents.pm_scheme.department,
      participants: specialEvents.pm_scheme.participants,
      treesPlanted: specialEvents.pm_scheme.treesPlanted,
      status: specialEvents.pm_scheme.status,
      description: specialEvents.pm_scheme.description,
      type: "special",
      specialEventId: "pm_scheme"
    },
    {
      id: 6,
      name: specialEvents.world_environment_day.name,
      date: specialEvents.world_environment_day.date,
      location: specialEvents.world_environment_day.location,
      department: specialEvents.world_environment_day.department,
      participants: specialEvents.world_environment_day.participants,
      treesPlanted: specialEvents.world_environment_day.treesPlanted,
      status: specialEvents.world_environment_day.status,
      description: specialEvents.world_environment_day.description,
      type: "special",
      specialEventId: "world_environment_day"
    }
  ];

  // Filter events based on URL parameter
  const [search, setSearch] = useState("");
  const filteredEvents = (eventFilter
    ? allEvents.filter(event => event.specialEventId === eventFilter)
    : allEvents
  ).filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase()) ||
    event.department.toLowerCase().includes(search.toLowerCase())
  );

  // Mock gallery data
  const eventGallery = [
    {
      eventId: 1,
      photos: [
        { id: 1, url: images.A, caption: t("events.photos.treePlantation") },
        { id: 2, url: images.B, caption: t("events.photos.communityParticipation") },
        { id: 3, url: images.C, caption: t("events.photos.volunteerGroup") }
      ]
    },
    {
      eventId: 2,
      photos: [
        { id: 4, url: images.D, caption: t("events.photos.schoolChildren") },
        { id: 5, url: images.E, caption: t("events.photos.educationalSession") }
      ]
    },
    {
      eventId: 3,
      photos: [
        { id: 6, url: images.A, caption: t("events.photos.vanMahotsav") },
        { id: 7, url: images.B, caption: t("events.photos.districtOfficials") },
        { id: 8, url: images.C, caption: t("events.photos.massPlantation") }
      ]
    }
  ];

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedEventPhotos, setSelectedEventPhotos] = useState([]);

  const handleView = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDownload = (eventId) => {
    // Download logic here
    console.log(t("events.downloadingReport", { eventId }));
  };

  const handleGalleryOpen = (eventId) => {
    const eventPhotos = eventGallery.find(gallery => gallery.eventId === eventId)?.photos || [];
    setSelectedEventPhotos(eventPhotos);
    setShowGalleryModal(true);
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  // Calculate stats
  const totalStates = 10; // mock value for now
  const totalParticipants = '10L+'; // mock value for now
  const totalTreesPlanted = allEvents.reduce((sum, event) => sum + event.treesPlanted, 0).toLocaleString();
  const totalEvents = allEvents.length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200">
      <main className="flex-1 p-0 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Event Heading */}
          <div className="mb-4">
            <EventHeader eventFilter={eventFilter} specialEvents={specialEvents} t={t} clearFilter={clearFilter} />
          </div>
          {/* Search and Add New Event Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <EventSearchBar
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("events.searchPlaceholder")}
              className=""
            />
            <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all flex items-center gap-2 shadow-lg font-semibold w-full md:w-auto justify-center">
              <span>{t("events.addNewEvent")}</span>
            </button>
          </div>
          {/* Stats Row */}
          <div className="mb-10">
            <EventStats
              totalEvents={totalEvents}
              totalTreesPlanted={totalTreesPlanted}
              totalStates={totalStates}
              totalParticipants={totalParticipants}
              t={t}
            />
          </div>
          {/* Events List */}
          <div className="mt-2 bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
            <div className="p-6 border-b border-green-100 bg-green-50/60 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-green-800">
                {eventFilter ? t("events.specialEventDetails") : t("events.eventList")}
              </h2>
            </div>
            <EventList
              filteredEvents={filteredEvents}
              t={t}
              onView={handleView}
              onDownload={handleDownload}
              onGalleryOpen={handleGalleryOpen}
            />
          </div>
          {/* Pagination (can be modularized if needed) */}
          <div className="mt-8 bg-white px-6 py-4 rounded-2xl shadow border border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left w-full sm:w-auto">
              {t("events.pagination", { from: 1, to: filteredEvents.length, total: filteredEvents.length })}
            </div>
            <div className="flex justify-center gap-2 w-full sm:w-auto">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-green-50 transition">
                {t("common.previous")}
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-green-50 transition">
                {t("common.next")}
              </button>
            </div>
          </div>
          <EventModal
            show={showModal}
            event={selectedEvent}
            t={t}
            onClose={() => setShowModal(false)}
            onDownload={handleDownload}
          />
          <EventGalleryModal
            show={showGalleryModal}
            photos={selectedEventPhotos}
            t={t}
            onClose={() => setShowGalleryModal(false)}
            eventName={selectedEvent?.name}
          />
        </div>
      </main>
    </div>
  );
};

export default Events;
