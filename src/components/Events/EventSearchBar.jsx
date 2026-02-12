import React from 'react';
import { FaSearch } from 'react-icons/fa';

const EventSearchBar = ({ value, onChange, placeholder, className = "" }) => (
  <div className={`relative w-full max-w-xs ${className}`}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none shadow-sm text-base transition-all"
    />
    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
  </div>
);

export default EventSearchBar; 