// Sidebar items configuration for Sidebar.jsx
import { LayoutDashboard, Landmark, TreeDeciduous, Building, Settings, Droplets, CandlestickChart } from 'lucide-react';

const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    {
        id: 'rgd', 
        icon: Landmark, 
        label: 'Relief Good and Distribution',
        subItems: [
            { id: 'rgd-Beneficiery', label: 'Relief Beneficiery' },
            { id: 'rgd-rdt', label: 'Relief distribution tracker' },
            { id: 'rgd-inventory', label: 'Relief Inventory' }
        ]
    },
    {
        id: 'Irr', 
        icon: TreeDeciduous, 
        label: 'Incident Reporting and Responselog',
        subItems: [
            { id: 'Irr-UI', label: 'Upload incident' }
        ]
    },
    {
        id: 'Tool', 
        icon: Building, 
        label: 'Barangay DRRM Coordination Tool',
        subItems: [
            { id: 'Tool-Training', label: 'Training & Drill Scheduling' },
            { id: 'Tool-Resource', label: 'Resource Inventory Management' }
        ]
    },
    {
        id: 'Earlywarning', 
        icon: Droplets, 
        label: 'Disaster Early Warning System',
        subItems: [
            { id: 'DEWS-Alert', label: 'Alert' },
            { id: 'DEWS-Guidelines', label: 'Safety Guidelines' },
            { id: 'DEWS-Hotlines', label: 'Emergency Hotlines' }
        ]
    },

    {
        id: 'HES', 
        icon: CandlestickChart, 
        label: 'Hazard & Evacuation system',
        subItems: [
            { id: 'HES-Map', label: 'Hazard Map' },
            { id: 'HES-Evac', label: 'Evacuation' }
        ]
    },
    {
        id: 'History and archives', 
        icon: CandlestickChart, 
        label: 'History & Archives',
        subItems: [
            { id: 'History', label: 'History' },
            { id: 'Archives', label: 'Archives' }
        ]
    },
    { id: 'settings', icon: Settings, label: 'Settings' }
];

export default sidebarItems;
