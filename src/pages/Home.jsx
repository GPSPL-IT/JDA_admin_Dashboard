import React, { useState } from "react";
import { Cards, Map, GraphChart, List, Department, CarbonOffset } from "../components/index.js";

const Home = () => {
  // Lifted state for synchronization across components
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
      {/* Cards Section */}
      <Cards
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />



      {/* Map and Graph */}
      <div className="flex flex-col md:flex-row">
        <Map />
        <GraphChart />
      </div>

      {/* List and Department */}
      <div className="flex flex-col lg:flex-row">
        <List
          className="w-1/2"
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
        />
        <Department
          className="w-1/2"
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
        />
      </div>
      {/* Carbon Offset Section */}
      <CarbonOffset />
    </>
  );
};

export default Home;
