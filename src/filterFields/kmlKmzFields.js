
const kmlKmzFields = [
  {
    name: 'zone',
    label: 'Zone',
    type: 'select',
    options: ['All Zones', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7'].map(zone => ({
      value: zone.toLowerCase().replace(/\s+/g, ''),
      label: zone
    }))
  },
  {
    name: 'placeCategory',
    label: 'Place Category',
    type: 'select',
    options: ['All', 'Urban', 'Rural', 'Forest Area'].map(category => ({
      value: category.toLowerCase().replace(/\s+/g, ''),
      label: category
    }))
  },
  {
    name: 'species',
    label: 'Species',
    type: 'select',
    options: ['All Species', 'Neem', 'Banyan', 'Peepal', 'Mango', 'Gulmohar', 'Ashoka', 'Amaltas', 'Arjun'].map(species => ({
      value: species.toLowerCase().replace(/\s+/g, ''),
      label: species
    }))
  }
];

export default kmlKmzFields;