import React from 'react';
import { useTranslation } from 'react-i18next';

const CustomFilter = ({
  stateOptions = [],
  districtOptions = [],
  blockOptions = [],
  gpOptions = [],
  departmentOptions = [],
  speciesOptions = [],
  placeCategoryOptions = [],
  filterValues = {},
  onChange = () => { },
  onApply = () => { },
  onReset = () => { },
}) => {
  const { t } = useTranslation();
  return (
    <form className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div>
        <label className="block mb-1 font-medium">{t('reports.state', 'State')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.state || ''} onChange={e => onChange('state', e.target.value)}>
          {stateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.district', 'District')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.district || ''} onChange={e => onChange('district', e.target.value)}>
          {districtOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.block', 'Block')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.block || ''} onChange={e => onChange('block', e.target.value)}>
          {blockOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.gp', 'Gram Panchayat')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.gp || ''} onChange={e => onChange('gp', e.target.value)}>
          {gpOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.department', 'Department')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.department || ''} onChange={e => onChange('department', e.target.value)}>
          {departmentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.species', 'Species')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.species || ''} onChange={e => onChange('species', e.target.value)}>
          {speciesOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.placeCategory', 'Place Category')}</label>
        <select className="w-full border rounded px-3 py-2" value={filterValues.placeCategory || ''} onChange={e => onChange('placeCategory', e.target.value)}>
          {placeCategoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
      <div className="col-span-1 md:col-span-3 flex flex-wrap gap-4 mt-4">
        <button type="button" className="bg-green-600 text-white px-6 py-2 rounded" onClick={onApply}>{t('reports.applyFilter', 'Apply Filter')}</button>
        <button type="button" className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded" onClick={onReset}>{t('reports.resetFilters', 'Reset Filters')}</button>
      </div>
    </form>
  );
};

export default CustomFilter; 