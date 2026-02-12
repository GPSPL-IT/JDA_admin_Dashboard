import React, { useState, useEffect } from 'react';

const EditUserForm = ({ open, onClose, onSave, user }) => {
  const [form, setForm] = useState({
    location: '',
    email: '',
    department: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        location: user.location || '',
        email: user.email || '',
        department: user.department || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center " style={{backdropFilter: 'blur(6px)'}}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-green-700">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm; 