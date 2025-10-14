import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  Award,
  Shield,
  Activity
} from 'lucide-react';

const History = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterYear, setFilterYear] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive DRRM history data
  const historyData = [
    {
      id: 1,
      year: 1990,
      date: '1990-06-15',
      title: 'Establishment of Barangay DRRM Council',
      category: 'Organization',
      location: 'Barangay Hall',
      description: 'Formal establishment of the Barangay Disaster Risk Reduction and Management Council as mandated by Republic Act 10121.',
      impact: 'High',
      participants: 25,
      documents: ['DRRM_Council_Establishment.pdf', 'RA_10121_Compliance.pdf'],
      lessons: [
        'Importance of community-based disaster management',
        'Need for regular training and capacity building',
        'Establishment of early warning systems'
      ],
      status: 'Completed'
    },
    {
      id: 2,
      year: 1995,
      date: '1995-11-08',
      title: 'First Community Disaster Drill',
      category: 'Training',
      location: 'Barangay Plaza',
      description: 'Conducted the first comprehensive disaster preparedness drill involving evacuation procedures and emergency response protocols.',
      impact: 'Medium',
      participants: 150,
      documents: ['First_Drill_Report.pdf', 'Evacuation_Procedures.pdf'],
      lessons: [
        'Community engagement is crucial for effective drills',
        'Regular practice improves response time',
        'Clear communication channels are essential'
      ],
      status: 'Completed'
    },
    {
      id: 3,
      year: 2000,
      date: '2000-09-20',
      title: 'Typhoon Response Operation',
      category: 'Emergency Response',
      location: 'Entire Barangay',
      description: 'Major typhoon response operation that successfully evacuated 500 families and provided emergency relief to affected residents.',
      impact: 'High',
      participants: 300,
      documents: ['Typhoon_Response_Report.pdf', 'Evacuation_Records.pdf', 'Relief_Distribution_Log.pdf'],
      lessons: [
        'Early evacuation saves lives',
        'Coordination with neighboring barangays is vital',
        'Proper relief distribution systems are necessary'
      ],
      status: 'Completed'
    },
    {
      id: 4,
      year: 2005,
      date: '2005-03-15',
      title: 'Installation of Early Warning System',
      category: 'Infrastructure',
      location: 'Strategic locations in barangay',
      description: 'Installation of modern early warning system including sirens, weather monitoring equipment, and communication devices.',
      impact: 'High',
      participants: 50,
      documents: ['EWS_Installation_Report.pdf', 'Equipment_Specifications.pdf', 'Maintenance_Manual.pdf'],
      lessons: [
        'Technology enhances disaster preparedness',
        'Regular maintenance is crucial',
        'Community training on system usage is essential'
      ],
      status: 'Completed'
    },
    {
      id: 5,
      year: 2010,
      date: '2010-07-22',
      title: 'Flood Mitigation Project',
      category: 'Infrastructure',
      location: 'Low-lying areas',
      description: 'Implementation of flood mitigation measures including drainage improvements and flood barriers.',
      impact: 'High',
      participants: 200,
      documents: ['Flood_Mitigation_Plan.pdf', 'Construction_Reports.pdf', 'Effectiveness_Study.pdf'],
      lessons: [
        'Prevention is better than response',
        'Infrastructure projects require community support',
        'Regular monitoring and maintenance are needed'
      ],
      status: 'Completed'
    },
    {
      id: 6,
      year: 2015,
      date: '2015-12-10',
      title: 'DRRM Training Center Establishment',
      category: 'Organization',
      location: 'Barangay Training Center',
      description: 'Establishment of a dedicated training center for disaster preparedness and response training.',
      impact: 'Medium',
      participants: 75,
      documents: ['Training_Center_Proposal.pdf', 'Construction_Reports.pdf', 'Training_Programs.pdf'],
      lessons: [
        'Dedicated facilities improve training quality',
        'Regular training programs build community resilience',
        'Partnerships with experts enhance learning'
      ],
      status: 'Completed'
    },
    {
      id: 7,
      year: 2020,
      date: '2020-03-15',
      title: 'COVID-19 Emergency Response',
      category: 'Emergency Response',
      location: 'Entire Barangay',
      description: 'Comprehensive response to COVID-19 pandemic including health protocols, relief distribution, and community support.',
      impact: 'High',
      participants: 400,
      documents: ['COVID_Response_Plan.pdf', 'Health_Protocols.pdf', 'Relief_Distribution_Records.pdf'],
      lessons: [
        'Health emergencies require different approaches',
        'Digital tools are essential for modern response',
        'Community solidarity is crucial during crises'
      ],
      status: 'Completed'
    },
    {
      id: 8,
      year: 2023,
      date: '2023-08-30',
      title: 'Digital DRRM System Implementation',
      category: 'Technology',
      location: 'Barangay Operations Center',
      description: 'Implementation of digital DRRM management system for improved coordination and data management.',
      impact: 'High',
      participants: 30,
      documents: ['Digital_System_Proposal.pdf', 'Implementation_Report.pdf', 'User_Manual.pdf'],
      lessons: [
        'Digital transformation improves efficiency',
        'User training is essential for adoption',
        'Data security and privacy must be prioritized'
      ],
      status: 'Ongoing'
    }
  ];

  // Filter events
  const filteredEvents = historyData.filter(event => {
    const matchesYear = filterYear === 'All' || event.year.toString() === filterYear;
    const matchesCategory = filterCategory === 'All' || event.category === filterCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesCategory && matchesSearch;
  });

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Planned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get unique years and categories for filters
  const years = ['All', ...Array.from(new Set(historyData.map(event => event.year.toString())))];
  const categories = ['All', ...Array.from(new Set(historyData.map(event => event.category)))];

  return (
    <div className="mx-1 mt-1 p-4 sm:p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg shadow-lg h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
              <Activity className="text-blue-600 dark:text-blue-400" />
              Barangay DRRM History
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Historical records of disaster risk reduction and management activities, achievements, and lessons learned.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="text-2xl mr-3 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">{historyData.length}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Total Events</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="text-2xl mr-3 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg">
              {historyData.filter(e => e.status === 'Completed').length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Completed</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="text-2xl mr-3 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold text-lg">
              {historyData.filter(e => e.impact === 'High').length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">High Impact</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="text-2xl mr-3 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg">
              {historyData.reduce((sum, event) => sum + event.participants, 0)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Total Participants</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 text-sm"
            >
              {years.map(year => (
                <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category === 'All' ? 'All Categories' : category}</option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 text-sm w-full"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-400">
            {filteredEvents.length} of {historyData.length} events
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-slate-700">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-slate-200">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(event.impact)}`}>
                        {event.impact} Impact
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-slate-400">Date:</span>
                      <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-slate-400">Participants:</span>
                      <span className="font-medium">{event.participants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-slate-400">Documents:</span>
                      <span className="font-medium">{event.documents.length}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-slate-300 mb-4">
                    {event.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-4xl my-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Event Details</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-2">{selectedEvent.title}</h3>
                  <p className="text-gray-600 dark:text-slate-400">{selectedEvent.category}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Date:</span>
                    <span className="ml-2 font-medium">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Location:</span>
                    <span className="ml-2 font-medium">{selectedEvent.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Impact:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getImpactColor(selectedEvent.impact)}`}>
                      {selectedEvent.impact}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Participants:</span>
                    <span className="ml-2 font-medium">{selectedEvent.participants}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Documents:</span>
                    <span className="ml-2 font-medium">{selectedEvent.documents.length} files</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-gray-700 dark:text-slate-300">{selectedEvent.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Lessons Learned</h4>
                  <ul className="text-sm space-y-1">
                    {selectedEvent.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Related Documents</h4>
                  <div className="space-y-2">
                    {selectedEvent.documents.map((document, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded">
                        <span className="text-sm">{document}</span>
                        <button className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;