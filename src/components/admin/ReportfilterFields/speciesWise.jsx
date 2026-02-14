import React from 'react';
import { useTranslation } from 'react-i18next';

const SpeciesWiseFilter = ({
  stateOptions = [],
  speciesOptions = [],
  filterValues = {},
  onChange = () => { },
  onApply = () => { },
  onReset = () => { },
}) => {
  const { t } = useTranslation();
  return (
    <form className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div>
        <label className="block mb-1 font-medium">{t('reports.labels.species', 'Species')}</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={filterValues.species || ''}
          onChange={e => onChange('species', e.target.value)}
        >
          <option value="">{t('reports.labels.selectSpecies', 'Select Species')}</option>
          {speciesOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.labels.startDate', 'Start Date')}</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={filterValues.startDate || ''}
          onChange={e => onChange('startDate', e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('reports.labels.endDate', 'End Date')}</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={filterValues.endDate || ''}
          onChange={e => onChange('endDate', e.target.value)}
        />
      </div>
      <div className="col-span-1 md:col-span-3 flex flex-wrap gap-4 mt-4">
        <button type="button" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700" onClick={onApply}>
          {t('reports.labels.applyFilter', 'Apply Filter')}
        </button>
        <button type="button" className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50" onClick={onReset}>
          {t('reports.labels.resetFilters', 'Reset Filters')}
        </button>
      </div>
    </form>
  );
};

export default SpeciesWiseFilter; 