import React from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Dashboard from './components/modules/Dashboard/DashboardOverview'
import ContentRenderer from './components/ContentRenderer';
import sidebarItems from './components/Layout/sidebarItems';
import LandingPage from './components/LandingPage';


function App() {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const handleToggleDarkMode = () => setIsDarkMode((prev) => !prev);

    const [showLandingPage, setShowLandingPage] = React.useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState('dashboard');
    
    // Helper to find breadcrumb path from sidebarItems
    function getBreadcrumb(itemId) {
        for (const item of sidebarItems) {
            if (item.id === itemId) return [item.label];
            if (item.subItems) {
                const sub = item.subItems.find(sub => sub.id === itemId);
                if (sub) return [item.label, sub.label];
            }
        }
        return ['Dashboard'];
    }

    const handleEnterSystem = () => {
        setShowLandingPage(false);
    };

    const handleGoHome = () => {
        setShowLandingPage(true);
    };

    // Show landing page if showLandingPage is true
    if (showLandingPage) {
        return <LandingPage onEnterSystem={handleEnterSystem} />;
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 transition-colors duration-200'> 
            <div className='flex h-screen overflow-hidden'>
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    activeItem={activeItem}
                    onPageChange={setActiveItem}
                />
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <Header
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                        breadcrumb={getBreadcrumb(activeItem)}
                        isDarkMode={isDarkMode}
                        onToggleDarkMode={handleToggleDarkMode}
                        onGoHome={handleGoHome}
                    />
                    <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                        <ContentRenderer activeItem={activeItem} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
