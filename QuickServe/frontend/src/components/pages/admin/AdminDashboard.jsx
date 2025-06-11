import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiShoppingBag, 
  FiHome, 
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowLeft,
  FiSearch,
  FiDollarSign,
  FiActivity,
  FiList, 
  FiGrid, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSave,
  FiImage, 
  FiInfo
} from 'react-icons/fi';
import { FaUtensils, FaLeaf, FaCheese } from 'react-icons/fa';
import Sidebar from '../../ui/Sidebar';

const OrderStatusBadge = ({ status }) => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    delivered: 'bg-purple-100 text-purple-800'
  };

  const statusText = {
    pending: 'Pending',
    preparing: 'Preparing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    delivered: 'Delivered'
  };

  const statusIcons = {
    pending: <FiClock className="w-4 h-4 mr-1" />,
    preparing: <FiActivity className="w-4 h-4 mr-1" />,
    completed: <FiCheckCircle className="w-4 h-4 mr-1" />,
    cancelled: <FiX className="w-4 h-4 mr-1" />,
    delivered: <FiShoppingBag className="w-4 h-4 mr-1" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {statusIcons[status]}
      {statusText[status]}
    </span>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [restaurantName, setRestaurantName] = useState('');
  const [metrics, setMetrics] = useState({
    activeOrders: 0,
    todaysRevenue: 0,
    totalOrders: 0,
    todaysOrders: 0
  });
  const lastUpdateRef = useRef(null);

  // Navigation items for sidebar
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/menu-management', label: 'Menu Management', icon: <FiList size={20} /> },
    { path: '/order-management', label: 'Orders', icon: <FiShoppingBag size={20} /> },
    { path: '/table-management', label: 'Table Management', icon: <FiGrid size={20} /> },
    { path: '/admin-profile', label: 'Profile', icon: <FiUser size={20} /> },
    { path: '/home', label: 'Logout', icon: <FiLogOut size={20} /> }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Calculate dashboard metrics including both active orders and order history
  const calculateMetrics = (activeOrders, historyOrders) => {
    const today = new Date().toDateString();
    const allOrders = [...activeOrders, ...historyOrders];
    
    const todayOrders = allOrders.filter(order => 
      new Date(order.orderDate || order.createdAt).toDateString() === today
    );
    
    const activeOrdersCount = activeOrders.filter(order => 
      ['pending', 'preparing'].includes(order.status)
    ).length;
    
    const todaysRevenue = todayOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
    
    return {
      activeOrders: activeOrdersCount,
      todaysRevenue,
      totalOrders: allOrders.length,
      todaysOrders: todayOrders.length
    };
  };

  // Function to move completed orders to order history after 1 minute
  const moveCompletedOrders = (ordersList) => {
    const now = new Date();
    const updatedOrders = ordersList.filter(order => {
      if (order.status === 'completed') {
        const completionTime = new Date(order.completionTime || order.orderDate);
        const timeDiff = now - completionTime;
        return timeDiff < 3600000; // Keep in dashboard if less than 1 minute
      }
      return true;
    });

    const ordersToMove = ordersList.filter(order => 
      order.status === 'completed' && 
      (now - new Date(order.completionTime || order.orderDate)) >= 60000
    );

    if (ordersToMove.length > 0) {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const updatedHistory = [...orderHistory, ...ordersToMove];
      localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      setOrderHistory(updatedHistory);
      
      const metricsBeforeMove = calculateMetrics(ordersList, updatedHistory);
      setMetrics(metricsBeforeMove);
    }

    return updatedOrders;
  };

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      // Load active orders
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const filteredOrders = moveCompletedOrders(storedOrders);
      
      const sortedOrders = filteredOrders.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      
      setOrders(sortedOrders);
      localStorage.setItem('orders', JSON.stringify(sortedOrders));
      
      // Load order history
      const storedHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      setOrderHistory(storedHistory);
      
      // Update metrics
      const newMetrics = calculateMetrics(sortedOrders, storedHistory);
      setMetrics(newMetrics);
      
      // Load restaurants
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      setRestaurants(storedRestaurants);
      
      // Load current admin and restaurant name
      const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
      if (currentAdmin) {
        const restaurant = storedRestaurants.find(r => r.id === currentAdmin.restaurantId);
        if (restaurant) {
          setRestaurantName(restaurant.name);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
    
    const handleStorageChange = (e) => {
      if (e.key === 'orders' || e.key === 'orderHistory' || e.key === 'orderStatusUpdated') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const intervalId = setInterval(() => {
      const lastUpdate = localStorage.getItem('orderStatusUpdated');
      if (lastUpdate !== lastUpdateRef.current) {
        lastUpdateRef.current = lastUpdate;
        loadData();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Get restaurant by ID
  const getRestaurantById = (id) => {
    return restaurants.find(restaurant => restaurant.id === id);
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const restaurant = getRestaurantById(order.restaurantId);
    const searchTerm = searchQuery.toLowerCase();
    
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }
    
    const orderDate = new Date(order.orderDate);
    const dateString = orderDate.toLocaleDateString();
    const timeString = orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const orderMonth = orderDate.toLocaleString('default', { month: 'long' }).toLowerCase();
    const orderDay = orderDate.getDate().toString();
    const orderYear = orderDate.getFullYear().toString();

    return (
      (restaurant?.name?.toLowerCase().includes(searchTerm)) ||
      dateString.includes(searchTerm) ||
      timeString.includes(searchTerm) ||
      orderMonth.includes(searchTerm) ||
      orderDay.includes(searchTerm) ||
      orderYear.includes(searchTerm) ||
      order.id?.toLowerCase().includes(searchTerm) ||
      (order.userDetails?.name?.toLowerCase().includes(searchTerm)) ||
      order.totalAmount.toString().includes(searchTerm)
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.orderDate === orderId || order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === 'completed') {
          updatedOrder.completionTime = new Date().toISOString();
        }
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    localStorage.setItem('orderStatusUpdated', Date.now().toString());
    
    const newMetrics = calculateMetrics(updatedOrders, orderHistory);
    setMetrics(newMetrics);
  };

  // Get next status in progression
  const getNextStatus = (currentStatus) => {
    switch(currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'completed';
      default:
        return currentStatus;
    }
  };

  // Handle status update button click
  const handleStatusUpdate = (order) => {
    const nextStatus = getNextStatus(order.status || 'pending');
    updateOrderStatus(order.orderDate || order.id, nextStatus);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} navItems={navItems} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              {restaurantName ? `Welcome back, ${restaurantName}` : 'Admin Dashboard'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { 
                title: "Active Orders", 
                value: metrics.activeOrders, 
                icon: <FiActivity className="h-6 w-6 text-blue-600" /> 
              },
              { 
                title: "Today's Revenue", 
                value: `₹${metrics.todaysRevenue.toFixed(2)}`, 
                icon: <FiDollarSign className="h-6 w-6 text-green-600" /> 
              },
              { 
                title: "Today's Orders", 
                value: metrics.todaysOrders, 
                icon: <FiShoppingBag className="h-6 w-6 text-orange-600" /> 
              },
              { 
                title: "Total Orders", 
                value: metrics.totalOrders, 
                icon: <FiCheckCircle className="h-6 w-6 text-purple-600" /> 
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Section */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 rounded-lg shadow bg-white">
              <h2 className="text-xl font-medium mb-2 text-gray-900">
                {searchQuery || filterStatus !== 'all' ? "No matching orders found" : "No orders yet"}
              </h2>
              <p className="mb-4 text-gray-500">
                {searchQuery || filterStatus !== 'all' 
                  ? "Try adjusting your search or filter criteria" 
                  : "No orders have been placed yet."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => {
                      const restaurant = getRestaurantById(order.restaurantId);
                      const canUpdateStatus = ['pending', 'preparing'].includes(order.status);
                      
                      return (
                        <tr key={order.orderDate} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id || order.orderDate.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {restaurant?.name || "Restaurant"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.userDetails?.name || "Customer"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.orderDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <OrderStatusBadge status={order.status || 'pending'} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleStatusUpdate(order)}
                              disabled={!canUpdateStatus}
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                canUpdateStatus 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {canUpdateStatus ? 'Next Status' : 'Completed'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{filteredOrders.length}</span> orders
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;