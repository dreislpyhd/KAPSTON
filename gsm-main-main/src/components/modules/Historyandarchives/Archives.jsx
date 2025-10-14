import React, { useState } from 'react';
import { 
  Archive, 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Folder,
  File,
  Image,
  Video,
  Music,
  Trash2,
  Eye,
  Share2,
  Star,
  Clock,
  User,
  Tag,
  Grid,
  List,
  SortAsc,
  SortDesc,
  MoreVertical,
  Plus,
  Upload,
  FolderPlus,
  FilePlus
} from 'lucide-react';

const Archives = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterYear, setFilterYear] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'size', 'type'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Comprehensive DRRM archive data
  const archiveData = [
    {
      id: 1,
      name: 'DRRM_Annual_Report_2023.pdf',
      title: 'DRRM Annual Report 2023',
      category: 'Reports',
      type: 'PDF',
      year: 2023,
      date: '2023-12-31',
      size: '2.4 MB',
      sizeBytes: 2516582,
      uploadedBy: 'DRRM Coordinator',
      description: 'Comprehensive annual report covering all disaster risk reduction and management activities for 2023.',
      tags: ['annual report', '2023', 'comprehensive'],
      downloads: 45,
      favorites: 12,
      filePath: '/archives/reports/2023/DRRM_Annual_Report_2023.pdf'
    },
    {
      id: 2,
      name: 'Evacuation_Center_Photos_2023.zip',
      title: 'Evacuation Center Documentation 2023',
      category: 'Media',
      type: 'ZIP',
      year: 2023,
      date: '2023-11-15',
      size: '156.7 MB',
      sizeBytes: 164348928,
      uploadedBy: 'Media Team',
      description: 'Photographic documentation of evacuation centers, facilities, and emergency response activities.',
      tags: ['photos', 'evacuation centers', 'documentation'],
      downloads: 23,
      favorites: 8,
      filePath: '/archives/media/2023/Evacuation_Center_Photos_2023.zip'
    },
    {
      id: 3,
      name: 'Emergency_Response_Protocols_2023.docx',
      title: 'Emergency Response Protocols 2023',
      category: 'Procedures',
      type: 'DOCX',
      year: 2023,
      date: '2023-10-20',
      size: '1.8 MB',
      sizeBytes: 1887436,
      uploadedBy: 'Safety Officer',
      description: 'Updated emergency response protocols and standard operating procedures for various disaster scenarios.',
      tags: ['protocols', 'emergency response', 'SOP'],
      downloads: 67,
      favorites: 25,
      filePath: '/archives/procedures/2023/Emergency_Response_Protocols_2023.docx'
    },
    {
      id: 4,
      name: 'Training_Materials_2023.pptx',
      title: 'DRRM Training Materials 2023',
      category: 'Training',
      type: 'PPTX',
      year: 2023,
      date: '2023-09-10',
      size: '45.2 MB',
      sizeBytes: 47398912,
      uploadedBy: 'Training Coordinator',
      description: 'Comprehensive training materials including presentations, handouts, and assessment tools.',
      tags: ['training', 'materials', 'presentations'],
      downloads: 89,
      favorites: 34,
      filePath: '/archives/training/2023/Training_Materials_2023.pptx'
    },
    {
      id: 5,
      name: 'Incident_Reports_2023.xlsx',
      title: 'Incident Reports Database 2023',
      category: 'Data',
      type: 'XLSX',
      year: 2023,
      date: '2023-12-15',
      size: '3.1 MB',
      sizeBytes: 3250585,
      uploadedBy: 'Data Analyst',
      description: 'Comprehensive database of all incident reports, response times, and outcomes for 2023.',
      tags: ['incidents', 'database', 'statistics'],
      downloads: 34,
      favorites: 15,
      filePath: '/archives/data/2023/Incident_Reports_2023.xlsx'
    },
    {
      id: 6,
      name: 'Relief_Distribution_Records_2023.pdf',
      title: 'Relief Distribution Records 2023',
      category: 'Reports',
      type: 'PDF',
      year: 2023,
      date: '2023-12-20',
      size: '4.2 MB',
      sizeBytes: 4404019,
      uploadedBy: 'Relief Coordinator',
      description: 'Detailed records of relief goods distribution, beneficiaries, and inventory management.',
      tags: ['relief', 'distribution', 'beneficiaries'],
      downloads: 28,
      favorites: 11,
      filePath: '/archives/reports/2023/Relief_Distribution_Records_2023.pdf'
    },
    {
      id: 7,
      name: 'Hazard_Map_2023.png',
      title: 'Updated Hazard Map 2023',
      category: 'Maps',
      type: 'PNG',
      year: 2023,
      date: '2023-08-05',
      size: '8.7 MB',
      sizeBytes: 9122611,
      uploadedBy: 'GIS Specialist',
      description: 'Updated hazard map showing flood-prone areas, evacuation routes, and emergency facilities.',
      tags: ['hazard map', 'flood zones', 'evacuation routes'],
      downloads: 56,
      favorites: 22,
      filePath: '/archives/maps/2023/Hazard_Map_2023.png'
    },
    {
      id: 8,
      name: 'Emergency_Contacts_2023.csv',
      title: 'Emergency Contacts Directory 2023',
      category: 'Data',
      type: 'CSV',
      year: 2023,
      date: '2023-07-15',
      size: '0.5 MB',
      sizeBytes: 524288,
      uploadedBy: 'Administrative Officer',
      description: 'Updated directory of emergency contacts including government agencies, hospitals, and key personnel.',
      tags: ['contacts', 'directory', 'emergency'],
      downloads: 78,
      favorites: 31,
      filePath: '/archives/data/2023/Emergency_Contacts_2023.csv'
    },
    {
      id: 9,
      name: 'DRRM_Budget_2023.pdf',
      title: 'DRRM Budget Allocation 2023',
      category: 'Financial',
      type: 'PDF',
      year: 2023,
      date: '2023-06-30',
      size: '1.2 MB',
      sizeBytes: 1258291,
      uploadedBy: 'Finance Officer',
      description: 'Detailed budget allocation and expenditure report for DRRM activities and projects.',
      tags: ['budget', 'financial', 'allocation'],
      downloads: 19,
      favorites: 7,
      filePath: '/archives/financial/2023/DRRM_Budget_2023.pdf'
    },
    {
      id: 10,
      name: 'Training_Videos_2023.mp4',
      title: 'DRRM Training Videos 2023',
      category: 'Media',
      type: 'MP4',
      year: 2023,
      date: '2023-05-20',
      size: '245.3 MB',
      sizeBytes: 257286144,
      uploadedBy: 'Media Team',
      description: 'Collection of training videos covering emergency procedures, first aid, and disaster preparedness.',
      tags: ['videos', 'training', 'procedures'],
      downloads: 112,
      favorites: 45,
      filePath: '/archives/media/2023/Training_Videos_2023.mp4'
    },
    {
      id: 11,
      name: 'Equipment_Inventory_2023.xlsx',
      title: 'Equipment and Resource Inventory 2023',
      category: 'Data',
      type: 'XLSX',
      year: 2023,
      date: '2023-04-10',
      size: '2.8 MB',
      sizeBytes: 2936012,
      uploadedBy: 'Logistics Officer',
      description: 'Complete inventory of emergency equipment, vehicles, and resources available for disaster response.',
      tags: ['inventory', 'equipment', 'resources'],
      downloads: 41,
      favorites: 18,
      filePath: '/archives/data/2023/Equipment_Inventory_2023.xlsx'
    },
    {
      id: 12,
      name: 'Community_Assessment_2023.pdf',
      title: 'Community Vulnerability Assessment 2023',
      category: 'Reports',
      type: 'PDF',
      year: 2023,
      date: '2023-03-25',
      size: '5.6 MB',
      sizeBytes: 5872025,
      uploadedBy: 'Assessment Team',
      description: 'Comprehensive assessment of community vulnerability, risk factors, and preparedness levels.',
      tags: ['assessment', 'vulnerability', 'community'],
      downloads: 33,
      favorites: 14,
      filePath: '/archives/reports/2023/Community_Assessment_2023.pdf'
    }
  ];

  // Filter files
  const filteredFiles = archiveData.filter(file => {
    const matchesYear = filterYear === 'All' || file.year.toString() === filterYear;
    const matchesCategory = filterCategory === 'All' || file.category === filterCategory;
    const matchesType = filterType === 'All' || file.type === filterType;
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesYear && matchesCategory && matchesType && matchesSearch;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'size':
        comparison = a.sizeBytes - b.sizeBytes;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Get file type icon
  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'DOCX': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'XLSX': return <FileText className="w-5 h-5 text-green-500" />;
      case 'PPTX': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'PNG': case 'JPG': case 'JPEG': return <Image className="w-5 h-5 text-purple-500" />;
      case 'MP4': case 'AVI': case 'MOV': return <Video className="w-5 h-5 text-pink-500" />;
      case 'ZIP': case 'RAR': return <Folder className="w-5 h-5 text-yellow-500" />;
      case 'CSV': return <FileText className="w-5 h-5 text-gray-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Reports': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Media': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Procedures': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Training': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Data': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'Maps': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Financial': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get unique years, categories, and types for filters
  const years = ['All', ...Array.from(new Set(archiveData.map(file => file.year.toString())))];
  const categories = ['All', ...Array.from(new Set(archiveData.map(file => file.category)))];
  const types = ['All', ...Array.from(new Set(archiveData.map(file => file.type)))];

  // Calculate statistics
  const totalFiles = archiveData.length;
  const totalSize = archiveData.reduce((sum, file) => sum + file.sizeBytes, 0);
  const totalDownloads = archiveData.reduce((sum, file) => sum + file.downloads, 0);
  const totalFavorites = archiveData.reduce((sum, file) => sum + file.favorites, 0);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mx-1 mt-1 p-4 sm:p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg shadow-lg h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
              <Archive className="text-blue-600 dark:text-blue-400" />
              DRRM Archives
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Digital repository of disaster risk reduction and management documents, reports, and resources.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="text-2xl mr-3 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">{totalFiles}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Total Files</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Folder className="text-2xl mr-3 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg">{formatFileSize(totalSize)}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Total Size</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Download className="text-2xl mr-3 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold text-lg">{totalDownloads}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Total Downloads</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Star className="text-2xl mr-3 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg">{totalFavorites}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Favorites</p>
          </div>
        </div>

        {/* Filters, Search, and Controls */}
        <div className="mb-6 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 text-sm"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                ))}
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 text-sm w-full"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">
              {sortedFiles.length} of {totalFiles} files
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border rounded text-sm dark:bg-slate-700 dark:text-slate-200"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-slate-400">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Files Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedFiles.map((file) => (
              <div key={file.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFileTypeIcon(file.type)}
                    <span className="text-xs text-gray-500">{file.type}</span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-sm text-gray-900 dark:text-slate-200 mb-1 truncate" title={file.title}>
                  {file.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {file.description}
                </p>

                <div className="space-y-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </span>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{file.size}</span>
                    <span>{new Date(file.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>By {file.uploadedBy}</span>
                  <span>{file.downloads} downloads</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedFile(file);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs">
                    <Download className="w-3 h-3" />
                  </button>
                  <button className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs">
                    <Star className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFiles.map((file) => (
              <div key={file.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getFileTypeIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-slate-200 truncate">
                        {file.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 truncate">
                        {file.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{file.size}</span>
                    <span>{new Date(file.date).toLocaleDateString()}</span>
                    <span>{file.uploadedBy}</span>
                    <span>{file.downloads} downloads</span>
                  </div>

                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFile(file);
                        setIsModalOpen(true);
                      }}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                    >
                      View
                    </button>
                    <button className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File Details Modal */}
        {selectedFile && isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl my-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">File Details</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {getFileTypeIcon(selectedFile.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{selectedFile.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{selectedFile.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Category:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedFile.category)}`}>
                      {selectedFile.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Type:</span>
                    <span className="ml-2 font-medium">{selectedFile.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Size:</span>
                    <span className="ml-2 font-medium">{selectedFile.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Date:</span>
                    <span className="ml-2 font-medium">{new Date(selectedFile.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Uploaded by:</span>
                    <span className="ml-2 font-medium">{selectedFile.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Downloads:</span>
                    <span className="ml-2 font-medium">{selectedFile.downloads}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-gray-700 dark:text-slate-300">{selectedFile.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">File Path</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400 font-mono bg-gray-50 dark:bg-slate-700 p-2 rounded">
                    {selectedFile.filePath}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded">
                    Share
                  </button>
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedFile(null);
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

export default Archives;