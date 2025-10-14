
import Dashboard from './modules/Dashboard/DashboardOverview'; // Import Dashboard component
import UploadIncident from './modules/Irr/Irr-Upload'; // Import Upload Incident component

import Rdt from './modules/Rgd/RgdTracker'; // Import Relief Distribution Tracker component

import TDS from './modules/CoordinationTool/TDS'; // Import Training & Drill Scheduling component
import ToolR from './modules/CoordinationTool/ToolR'; // Import Resource Inventory Management component
import Hotlines from './modules/Wsdr/Hotlines'; // Import WSDR Maintenance component
import Alert from './modules/Wsdr/Alert'; // Import WSDR Usage component
import Guidelines from './modules/Wsdr/Guidelines'; // Import WSDR Maintenance component
import Map from './modules/HES/Map'; // Import HES Map component
import Evac from './modules/HES/Evac'; // Import HES Reports component
import Reliefbenefiecary from './modules/Rgd/reliefBene'; // Import Relief Beneficiary component
import RgdInventory from './modules/Rgd/rgdInventory'; // Import Relief Inventory component
import History from './modules/Historyandarchives/History';
import Archives from './modules/Historyandarchives/Archives';

function ContentRenderer({ activeItem }) {
    switch (activeItem) {
        case 'dashboard':
            return <div><Dashboard /></div>;
        case 'settings':
            return <div>Settings Content</div>;
        
        // Relief Good and Distribution (RGD) cases
    
        case 'rgd-Beneficiery':
            return <div><Reliefbenefiecary /></div>;
        case 'rgd-rdt':
            return <div><Rdt/></div>;
        case 'rgd-inventory':
            return <div><RgdInventory/></div>;
        
        // Incident Reporting and Response (IRR) cases
        case 'Irr-UI':
            return <div><UploadIncident /></div>;
       
        
        // Barangay DRRM Coordination Tool cases
        case 'Tool-Training':
            return <div><TDS /></div>;
        case 'Tool-Resource':
            return <div><ToolR /></div>;
       
        
        // Disaster Early Warning System (WSDR) cases
    
        case 'DEWS-Alert':
            return <div><Alert /></div>;
        case 'DEWS-Guidelines':
            return <div><Guidelines /></div>;
        case 'DEWS-Hotlines':
            return <div><Hotlines /></div>;
        
        // Hazard & Evacuation System (HES) cases
        case 'HES-Map':
            return <div><Map /></div>;
        case 'HES-Evac':
            return <div><Evac /></div>;

         // History and Archives cases   
        case 'History':
            return <div><History /></div>;
        case 'Archives':
            return <div><Archives /></div>;
        


        
        default:
            return <div><Dashboard /></div>;
    }
}

export default ContentRenderer;
