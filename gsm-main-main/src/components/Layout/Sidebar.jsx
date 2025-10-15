import React from 'react'
import { ChevronDown, LogOut } from 'lucide-react';
import sidebarItems from './sidebarItems';
import gsmLogo from '../../assets/gsm_logo.png';


function Sidebar({ collapsed, onPageChange, activeItem, onLogout }) {
    const [expandedItem, setExpandedItem] = React.useState(new Set([""]));
    const [activeSubItem, setActiveSubItem] = React.useState(null);

    const toggleExpanded = (itemid) => {
        const newExpanded = new Set(expandedItem);
        if (newExpanded.has(itemid)) {
            newExpanded.delete(itemid);
        } else {
            newExpanded.add(itemid);
        }
        setExpandedItem(newExpanded);
    }

    return (
        <div className="flex">
            <div className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-slate-200/50 flex
            flex-col transition-width duration-200 dark:bg-slate-900 dark:border-slate-700`}>
                {/* Logo */}
                <div className='p-6'>
                    <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 flex items-center justify-center'>
                            <img src={gsmLogo} alt="GSM Logo" className='w-10 h-10 object-contain' />
                        </div>

                        {!collapsed && (
                            <div>
                                <h1 className='text-xl font-bold dark:text-white'>GSM</h1>
                                <p className='text-xs text-slate-500'>Admin Dashboard</p>
                            </div>
                        )}
                    </div>
                </div>

                <hr className='border-slate-200 dark:border-slate-700 mx-2' />

                {/* Navigation Links Mapping*/}
                <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
                    {sidebarItems.map((item) => {
                        return (
                            <div key={item.id}>
                                <button
                                    className={`w-full flex justify-between items-center p-2 rounded-xl 
                                    transition-all duration-200 ${
                                        (activeItem === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeSubItem)))
                                            ? 'bg-orange-200 text-orange-600 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-slate-600 dark:hover:bg-slate-200'
                                    }`}
                                    onClick={() => {
                                        if (item.subItems) {
                                            toggleExpanded(item.id);
                                            if (item.subItems.length > 0) {
                                                setActiveSubItem(item.subItems[0].id);
                                                if (onPageChange) onPageChange(item.subItems[0].id);
                                            }
                                        } else {
                                            setActiveSubItem(null);
                                            if (onPageChange) onPageChange(item.id);
                                        }
                                    }}
                                >
                                    <div className='flex items-center space-x-3'>
                                        <item.icon className='w-5 h-5' />
                                        {!collapsed && (
                                            <span className='text-sm font-medium'>{item.label}</span>
                                        )}
                                    </div>
                                    {!collapsed && item.subItems && (
                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200`} />
                                    )}
                                </button>

                                {!collapsed && item.subItems && expandedItem.has(item.id) && (
                                    <div className='ml-8 mt-2 space-y-1 border-l-1 border-slate-300'>
                                        {item.subItems.map((subitem) => {
                                            return (
                                                <button
                                                    key={subitem.id}
                                                    className={`w-full ml-2 text-sm text-left p-2 rounded-lg ${
                                                        activeSubItem === subitem.id
                                                            ? 'bg-orange-100 text-orange-700 font-semibold'
                                                            : 'text-slate-700 dark:text-slate-500 hover:bg-slate-200 dark:hover:text-slate-600 dark:hover:bg-slate-100'
                                                    }`}
                                                    onClick={() => {
                                                        setActiveSubItem(subitem.id);
                                                        if (onPageChange) onPageChange(subitem.id);
                                                    }}
                                                >
                                                    {subitem.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className='p-4 border-t border-slate-200 dark:border-slate-700'>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to logout?')) {
                                onLogout();
                            }
                        }}
                        className='w-full flex items-center space-x-3 p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200'
                    >
                        <LogOut className='w-5 h-5' />
                        {!collapsed && (
                            <span className='text-sm font-medium'>Logout</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
