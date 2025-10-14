import React from 'react';
import { 
    LayoutDashboard, 
    Landmark, 
    TreeDeciduous, 
    Building, 
    Droplets, 
    CandlestickChart,
    Users,
    Package,
    AlertTriangle,
    MapPin,
    TrendingUp,
    Activity,
    Shield,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

function DashboardOverview() {
  // Mock data for analytics - in a real app, this would come from your backend
  const analyticsData = {
    reliefDistribution: {
      totalBeneficiaries: 15420,
      reliefPackages: 12350,
      pendingDeliveries: 890,
      completedDeliveries: 11460,
      trend: '+12.5%'
    },
    incidentReporting: {
      totalIncidents: 234,
      resolvedIncidents: 198,
      pendingIncidents: 36,
      criticalIncidents: 12,
      trend: '+8.3%'
    },
    drrmCoordination: {
      activePlans: 45,
      scheduledTrainings: 23,
      completedDrills: 67,
      resourceItems: 1234,
      trend: '+15.2%'
    },
    earlyWarning: {
      activeAlerts: 3,
      totalAlerts: 156,
      evacuationOrders: 8,
      weatherStations: 12,
      trend: '-5.1%'
    },
    hazardEvacuation: {
      evacuationCenters: 28,
      totalCapacity: 15400,
      activeEvacuations: 2,
      hazardZones: 15,
      trend: '+2.8%'
    }
  };

  const recentActivities = [
    { id: 1, type: 'relief', message: 'Relief package delivered to Barangay San Jose', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'incident', message: 'New incident reported in Barangay Poblacion', time: '4 hours ago', status: 'pending' },
    { id: 3, type: 'training', message: 'DRRM training scheduled for next week', time: '6 hours ago', status: 'scheduled' },
    { id: 4, type: 'alert', message: 'Weather alert issued for coastal areas', time: '8 hours ago', status: 'active' },
    { id: 5, type: 'evacuation', message: 'Evacuation center opened in Barangay Central', time: '12 hours ago', status: 'active' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'relief': return <Package className="w-4 h-4" />;
      case 'incident': return <AlertTriangle className="w-4 h-4" />;
      case 'training': return <Users className="w-4 h-4" />;
      case 'alert': return <AlertCircle className="w-4 h-4" />;
      case 'evacuation': return <MapPin className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className='mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg'>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive analytics for all DRRM modules</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Beneficiaries</p>
              <p className="text-3xl font-bold">{analyticsData.reliefDistribution.totalBeneficiaries.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Incidents</p>
              <p className="text-3xl font-bold">{analyticsData.incidentReporting.pendingIncidents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Evacuation Centers</p>
              <p className="text-3xl font-bold">{analyticsData.hazardEvacuation.evacuationCenters}</p>
            </div>
            <MapPin className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Alerts</p>
              <p className="text-3xl font-bold">{analyticsData.earlyWarning.activeAlerts}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Module Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Relief & Distribution Analytics */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-orange-500 p-2 rounded-lg mr-3">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Relief & Distribution</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Beneficiaries</span>
              <span className="font-semibold">{analyticsData.reliefDistribution.totalBeneficiaries.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Relief Packages</span>
              <span className="font-semibold">{analyticsData.reliefDistribution.reliefPackages.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending Deliveries</span>
              <span className="font-semibold text-orange-600">{analyticsData.reliefDistribution.pendingDeliveries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
              <span className="font-semibold text-green-600">
                {Math.round((analyticsData.reliefDistribution.completedDeliveries / analyticsData.reliefDistribution.reliefPackages) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Incident Reporting Analytics */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 p-2 rounded-lg mr-3">
              <TreeDeciduous className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Incident Reporting</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Incidents</span>
              <span className="font-semibold">{analyticsData.incidentReporting.totalIncidents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Resolved</span>
              <span className="font-semibold text-green-600">{analyticsData.incidentReporting.resolvedIncidents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
              <span className="font-semibold text-yellow-600">{analyticsData.incidentReporting.pendingIncidents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Critical</span>
              <span className="font-semibold text-red-600">{analyticsData.incidentReporting.criticalIncidents}</span>
            </div>
          </div>
        </div>

        {/* DRRM Coordination Analytics */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-green-500 p-2 rounded-lg mr-3">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">DRRM Coordination</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Plans</span>
              <span className="font-semibold">{analyticsData.drrmCoordination.activePlans}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Scheduled Trainings</span>
              <span className="font-semibold">{analyticsData.drrmCoordination.scheduledTrainings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completed Drills</span>
              <span className="font-semibold text-green-600">{analyticsData.drrmCoordination.completedDrills}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Resource Items</span>
              <span className="font-semibold">{analyticsData.drrmCoordination.resourceItems.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Early Warning System Analytics */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-purple-500 p-2 rounded-lg mr-3">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Early Warning System</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Alerts</span>
              <span className="font-semibold text-red-600">{analyticsData.earlyWarning.activeAlerts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Alerts</span>
              <span className="font-semibold">{analyticsData.earlyWarning.totalAlerts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Evacuation Orders</span>
              <span className="font-semibold text-orange-600">{analyticsData.earlyWarning.evacuationOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Weather Stations</span>
              <span className="font-semibold">{analyticsData.earlyWarning.weatherStations}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-500 p-2 rounded-lg mr-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Recent Activities</h3>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
