
const speciesWiseFields = [
  {
    name: 'zone',
    label: 'Zone',
    options: [
      'All Zones',
      'Zone 1',
      'Zone 2',
      'Zone 3',
      'Zone 4',
      'Zone 5',
      'Zone 6',
      'Zone 7'
    ].map(zone => ({
      value: zone.toLowerCase().replace(/\s+/g, ''),
      label: zone
    }))
  },
  {
    name: 'species',
    label: 'Species',
    options: [
      'All Species',
      'Fruit Trees',
      'Timber Trees',
      'Medicinal Trees',
      'Ornamental Trees',
      'Native Species'
    ].map(species => ({
      value: species.toLowerCase().replace(/\s+/g, ''),
      label: species
    }))
  },
  {
    name: 'placeCategory',
    label: 'Place Category',
    options: ['All', 'Urban', 'Rural', 'Forest Area'].map(category => ({
      value: category.toLowerCase().replace(/\s+/g, ''),
      label: category
    }))
  }
];

export default speciesWiseFields;