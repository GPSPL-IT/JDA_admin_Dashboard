import React from 'react';
import { useTranslation } from 'react-i18next';

const DepartmentWiseFilter = ({
  stateOptions = [],
  districtOptions = [],
  departmentOptions = [],
  filterValues = {},
  onChange = () => { },
  onApply = () => { },
  onReset = () => { },
}) => {
  const { t } = useTranslation();
  return (
    <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block mb-1 font-medium">{t('reports.department', 'Department')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.department || ''} onChange={e => onChange('department', e.target.value)}>
          <option value="">{t('reports.selectDepartment', 'Select Department')}</option>
          {departmentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.startDate', 'Start Date')}</label>
        <input type="date" className="w-full border rounded px-3 py-2" value={filterValues.startDate || ''} onChange={e => onChange('startDate', e.target.value)} />
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.endDate', 'End Date')}</label>
        <input type="date" className="w-full border rounded px-3 py-2" value={filterValues.endDate || ''} onChange={e => onChange('endDate', e.target.value)} />
      </div>
      <div className="col-span-1 md:col-span-3 flex gap-4 mt-4">
        <button type="button" className="bg-green-600 text-white px-6 py-2 rounded" onClick={onApply}>{t('reports.applyFilter', 'Apply Filter')}</button>
        <button type="button" className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded" onClick={onReset}>{t('reports.resetFilters', 'Reset Filters')}</button>
      </div>
    </form>
  );
};

export default DepartmentWiseFilter; 