
const zoneWiseFields = [
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
        name: 'plantationYear',
        label: 'Plantation Year',
        options: ['All Years', '2023-2024', '2022-2023', '2021-2022'].map(year => ({
            value: year,
            label: year
        }))
    },
    {
        name: 'status',
        label: 'Status',
        options: ['All', 'Active', 'Completed', 'Maintenance'].map(status => ({
            value: status.toLowerCase(),
            label: status
        }))
    }
];

export default zoneWiseFields;
