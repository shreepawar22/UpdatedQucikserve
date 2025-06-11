import { useState, useEffect, useRef } from 'react';
import { 
  TableProperties,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Armchair,
  Circle
} from 'lucide-react';
import Sidebar from "../../ui/Sidebar";
import { useNavigate } from 'react-router-dom';

const TableManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tables, setTables] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: 4,
    status: 'free'
  });
  const navigate = useNavigate();
  const lastUpdateRef = useRef(null);

  // Load tables from restaurant data
  const loadTables = () => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin) {
      navigate('/admin');
      return;
    }

    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const adminRestaurant = restaurants.find(r => r.id === currentAdmin.restaurantId);
    
    if (adminRestaurant) {
      setTables(adminRestaurant.tables || []);
    } else {
      setTables([]);
    }
  };

  // Initialize and set up real-time updates
  useEffect(() => {
    loadTables();
    
    // Set up an event listener for storage changes to sync between tabs
    const handleStorageChange = (e) => {
      if (e.key === 'restaurants' || e.key === 'tablesUpdated') {
        loadTables();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Set up polling for same-tab updates (fallback)
    const intervalId = setInterval(() => {
      const lastUpdate = localStorage.getItem('tablesUpdated');
      if (lastUpdate !== lastUpdateRef.current) {
        lastUpdateRef.current = lastUpdate;
        loadTables();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [navigate]);

  // Save tables to restaurant data
  const saveRestaurantData = (updatedTables) => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === currentAdmin.restaurantId) {
        return {
          ...restaurant,
          tables: updatedTables
        };
      }
      return restaurant;
    });
    
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    localStorage.setItem('tablesUpdated', Date.now().toString());
    setTables(updatedTables);
  };

  // Filter tables based on search and status
  const filteredTables = tables.filter(table => {
    const searchTerm = searchQuery.toLowerCase();
    
    // Status filter
    if (filterStatus !== 'all' && table.status !== filterStatus) {
      return false;
    }
    
    return (
      table.number.toString().includes(searchTerm) ||
      table.capacity.toString().includes(searchTerm) ||
      table.status.toLowerCase().includes(searchTerm)
    );
  });

  // Table management functions
  const addTable = () => {
    if (newTable.number && newTable.capacity) {
      // Check if table number already exists
      if (tables.some(table => table.number === newTable.number)) {
        alert('Table with this number already exists!');
        return;
      }
      
      const tableWithId = {
        ...newTable,
        id: `table-${Date.now()}`,
        number: newTable.number,
        capacity: parseInt(newTable.capacity),
        status: newTable.status
      };
      
      const updatedTables = [...tables, tableWithId];
      saveRestaurantData(updatedTables);
      setIsAdding(false);
      setNewTable({ number: '', capacity: 4, status: 'free' });
    }
  };

  const updateTableStatus = (tableId, status) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? { ...table, status } : table
    );
    saveRestaurantData(updatedTables);
  };

  const deleteTable = (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      const updatedTables = tables.filter(table => table.id !== tableId);
      saveRestaurantData(updatedTables);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    
    switch(status) {
      case "free":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Free</span>;
      case "reserved":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Reserved</span>;
      case "booked":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Booked</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TableProperties className="text-blue-600" />
              Table Management
            </h1>
            <p className="text-gray-500">
              Manage your restaurant tables and their status
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tables by number, capacity or status"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="free">Free</option>
                <option value="reserved">Reserved</option>
                <option value="booked">Booked</option>
              </select>
              
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center"
              >
                <PlusCircle className="h-4 w-4" />
                Add Table
              </button>
            </div>
          </div>

          {/* Add Table Form */}
          {isAdding && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Add New Table</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                  <input
                    type="text"
                    value={newTable.number}
                    onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1, 2, 3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <select
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[2, 4, 6, 8, 10, 12].map(num => (
                      <option key={num} value={num}>{num} people</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newTable.status}
                    onChange={(e) => setNewTable({...newTable, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="free">Free</option>
                    <option value="reserved">Reserved</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewTable({ number: '', capacity: 4, status: 'free' });
                  }}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={addTable}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  disabled={!newTable.number}
                >
                  <Save className="h-4 w-4" />
                  Add Table
                </button>
              </div>
            </div>
          )}

          {/* Tables Grid */}
          {filteredTables.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all' 
                  ? "No matching tables found" 
                  : "No tables added yet"}
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Add Your First Table
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTables.sort((a, b) => a.number - b.number).map(table => (
                <div key={table.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Table {table.number}</h3>
                        <StatusBadge status={table.status} />
                      </div>
                      <div className="flex items-center gap-1">
                        <Armchair className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700 font-medium">{table.capacity}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Change Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateTableStatus(table.id, 'free')}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            table.status === 'free' 
                              ? 'bg-green-600 text-white' 
                              : 'text-green-700 border border-green-200 hover:bg-green-50'
                          }`}
                        >
                          Free
                        </button>
                        <button
                          onClick={() => updateTableStatus(table.id, 'reserved')}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            table.status === 'reserved' 
                              ? 'bg-yellow-500 text-white' 
                              : 'text-yellow-700 border border-yellow-200 hover:bg-yellow-50'
                          }`}
                        >
                          Reserved
                        </button>
                        <button
                          onClick={() => updateTableStatus(table.id, 'booked')}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            table.status === 'booked' 
                              ? 'bg-red-600 text-white' 
                              : 'text-red-700 border border-red-200 hover:bg-red-50'
                          }`}
                        >
                          Booked
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => deleteTable(table.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Status Guide */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Table Status Guide</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Circle className="h-3 w-3 text-green-500 fill-green-500" />
                <span className="font-medium text-gray-700">Free</span>
                <span className="text-sm text-gray-500">- Table is available for customers</span>
              </div>
              <div className="flex items-center gap-3">
                <Circle className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-gray-700">Reserved</span>
                <span className="text-sm text-gray-500">- Table is reserved for future use</span>
              </div>
              <div className="flex items-center gap-3">
                <Circle className="h-3 w-3 text-red-500 fill-red-500" />
                <span className="font-medium text-gray-700">Booked</span>
                <span className="text-sm text-gray-500">- Table is currently occupied</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TableManagement;