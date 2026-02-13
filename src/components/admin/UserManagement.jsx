import React, { useState, useRef } from 'react';
import { FaUserPlus, FaSearch, FaDownload, FaEdit, FaTrash, FaFileExcel, FaFileCsv } from 'react-icons/fa';
import EditUserForm from './EditUserForm';
import { useTranslation } from 'react-i18next';
import { mockUsers } from '../../data/mockData';

const UserManagement = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState(mockUsers);
  const [selected, setSelected] = useState([]);
  const [downloadMode, setDownloadMode] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [exportDropdown, setExportDropdown] = useState(false);
  const exportBtnRef = useRef(null);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(search.toLowerCase()));
    const roleMatch = roleFilter ? user.role.toLowerCase() === roleFilter : true;
    const statusMatch = statusFilter ? user.status.toLowerCase() === statusFilter : true;
    return searchMatch && roleMatch && statusMatch;
  });

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredUsers.map((u) => u.id));
    } else {
      setSelected([]);
    }
  };

  // Individual select handler
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Check if all are selected
  const allSelected = filteredUsers.length > 0 && selected.length === filteredUsers.length;

  // Download mode toggle
  const handleDownloadMode = () => {
    setDownloadMode((prev) => !prev);
    setSelected([]);
    setExportDropdown(false);
  };

  // Export selected users to CSV
  const handleExportCSV = () => {
    const selectedUsers = users.filter((u) => selected.includes(u.id));
    if (selectedUsers.length === 0) return;
    const csvRows = [
      ['Name', 'Email', 'Phone', 'Role', 'Department', 'Status'],
      ...selectedUsers.map((u) => [u.name, u.email, u.phone, u.role, u.department, u.status]),
    ];
    const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadMode(false);
    setSelected([]);
    setExportDropdown(false);
  };

  // Export selected users and open in Excel (simulate by opening CSV in new tab)
  const handleExportExcel = () => {
    const selectedUsers = users.filter((u) => selected.includes(u.id));
    if (selectedUsers.length === 0) return;
    const csvRows = [
      ['Name', 'Phone', 'Role', 'Location', 'Status'],
      ...selectedUsers.map((u) => [u.name, u.phone, u.role, u.location, u.status]),
    ];
    const csvContent = csvRows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setExportDropdown(false);
  };

  // Handle click outside dropdown to close
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (exportBtnRef.current && !exportBtnRef.current.contains(event.target)) {
        setExportDropdown(false);
      }
    }
    if (exportDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exportDropdown]);

  // Edit icon click handler
  const handleEditClick = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  // Save handler for edit form
  const handleEditSave = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );
    setEditOpen(false);
    setEditUser(null);
  };

  // Close handler for edit form
  const handleEditClose = () => {
    setEditOpen(false);
    setEditUser(null);
  };

  return (
    <div className="p-2 sm:p-6">
      <EditUserForm open={editOpen} onClose={handleEditClose} onSave={handleEditSave} user={editUser} />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-600">{t('userManagement.title')}</h2>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
            <FaUserPlus className="mr-2" />
            <span className="hidden sm:inline">{t('userManagement.addNewUser')}</span>
            <span className="sm:hidden">{t('userManagement.addUser')}</span>
          </button>
          <button
            className={`flex items-center px-3 sm:px-4 py-2 border text-sm sm:text-base rounded-lg hover:bg-green-50 transition-colors ${downloadMode ? 'bg-green-100 text-green-700 border-green-400' : 'bg-white text-green-600 border-green-600'}`}
            onClick={handleDownloadMode}
          >
            <FaDownload className="mr-2" />
            {t('userManagement.download')}
          </button>
          {downloadMode && (
            <div className="relative" ref={exportBtnRef}>
              <button
                className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                onClick={() => setExportDropdown((prev) => !prev)}
                disabled={selected.length === 0}
              >
                {t('userManagement.export')}
              </button>
              {exportDropdown && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <button
                    className="flex items-center w-full px-3 sm:px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={handleExportExcel}
                  >
                    <FaFileExcel className="mr-2 text-green-600" /> {t('userManagement.openInExcel')}
                  </button>
                  <button
                    className="flex items-center w-full px-3 sm:px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={handleExportCSV}
                  >
                    <FaFileCsv className="mr-2 text-blue-600" /> {t('userManagement.downloadCSV')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Search and Filter */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('userManagement.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>
            <select
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">{t('userManagement.allRoles')}</option>
              <option value="admin">{t('userManagement.admin')}</option>
              <option value="manager">{t('userManagement.manager')}</option>
              <option value="user">{t('userManagement.user')}</option>
            </select>
            <select
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('userManagement.allStatus')}</option>
              <option value="active">{t('userManagement.active')}</option>
              <option value="inactive">{t('userManagement.inactive')}</option>
            </select>
          </div>
        </div>

        {/* Mobile User Cards */}
        <div className="block sm:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {downloadMode && (
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={() => handleSelect(user.id)}
                      className="mr-3"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-900 p-1" title={t('userManagement.edit')} onClick={() => handleEditClick(user)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1" title={t('userManagement.delete')}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">{t('role')}:</span>
                  <span className="ml-1 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">{user.role}</span>
                </div>
                <div>
                  <span className="text-gray-500">{t('userManagement.status')}:</span>
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t(`userManagement.${user.status.toLowerCase()}`)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">{t('userManagement.location')}:</span>
                  <span className="ml-1">{user.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          {/* List Header */}
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-t-lg font-semibold text-gray-600 text-sm">
            {downloadMode && (
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <span>{t('userManagement.all')}</span>
              </div>
            )}
            <div className="w-1/5">{t('userManagement.name')}</div>
            <div className="w-1/5">{t('userManagement.phone')}</div>
            <div className="w-1/5">{t('userManagement.role')}</div>
            <div className="w-1/5">{t('userManagement.location')}</div>
            <div className="w-1/5 text-right">{t('userManagement.status')}</div>
            <div className="w-1/5 text-right">{t('userManagement.actions')}</div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-b-lg shadow divide-y">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center px-4 py-3">
                {downloadMode && (
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => handleSelect(user.id)}
                    className="mr-4"
                  />
                )}
                <div className="w-1/5">{user.name}</div>
                <div className="w-1/5">{user.phone}</div>
                <div className="w-1/5">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">{user.role}</span>
                </div>
                <div className="w-1/5">{user.location}</div>
                <div className="w-1/5 text-right">
                  <span className={`px-2 py-1 rounded text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t(`userManagement.${user.status.toLowerCase()}`)}</span>
                </div>
                <div className="w-1/5 text-right flex justify-end gap-2">
                  <button className="text-green-600 hover:text-green-900" title={t('userManagement.edit')} onClick={() => handleEditClick(user)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-900" title={t('userManagement.delete')}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 