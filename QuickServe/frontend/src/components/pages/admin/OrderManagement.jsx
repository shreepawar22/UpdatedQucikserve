import { useState, useEffect } from 'react';
import { 
  FiHome, FiList, FiShoppingBag, FiGrid, FiUser, FiLogOut,
  FiSearch, FiFilter, FiChevronDown, FiClock, FiDollarSign, FiInfo,
  FiRefreshCw, FiPrinter, FiCheckCircle, FiXCircle, FiTruck
} from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../../ui/Sidebar";

const OrderStatusBadge = ({ status }) => {
  switch(status) {
    case "pending":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <FiClock className="mr-1 h-4 w-4" />
          Pending
        </span>
      );
    case "preparing":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <FiClock className="mr-1 h-4 w-4" />
          Preparing
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <FiCheckCircle className="mr-1 h-4 w-4" />
          Completed
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <FiXCircle className="mr-1 h-4 w-4" />
          Cancelled
        </span>
      );
    case "delivered":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          <FiTruck className="mr-1 h-4 w-4" />
          Delivered
        </span>
      );
    default:
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">{status}</span>;
  }
};

const OrderManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/menu-management', label: 'Menu Management', icon: <FiList size={20} /> },
    { path: '/order-management', label: 'Orders', icon: <FiShoppingBag size={20} /> },
    { path: '/table-management', label: 'Table Management', icon: <FiGrid size={20} /> },
    { path: '/admin-profile', label: 'Profile', icon: <FiUser size={20} /> },
    { path: '/home', label: 'Logout', icon: <FiLogOut size={20} /> }
  ];

  // Load order history from localStorage
  useEffect(() => {
    const loadOrderHistory = () => {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      setOrders(orderHistory);
    };

    loadOrderHistory();

    // Set up an event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'orderHistory') {
        loadOrderHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount).replace('₹', '₹');
  };

  // Filter orders by search term, type and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userDetails?.name && order.userDetails.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.orderDate && order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'today' && new Date(order.orderDate).toDateString() === new Date().toDateString()) ||
      order.status === activeTab;
    
    const matchesType = 
      typeFilter === 'all' || 
      (order.orderType === typeFilter) || 
      (order.type === typeFilter);
    
    return matchesSearch && matchesTab && matchesType;
  });

  // Sorting orders - newest first
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.orderDate || b.createdAt).getTime() - new Date(a.orderDate || a.createdAt).getTime();
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} navItems={navItems} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiShoppingBag className="text-blue-600" />
              Order Management
            </h1>
            <p className="text-gray-500">
              View and manage all customer orders
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="eat-in">Eat-In</option>
                  <option value="pre-order">Pre-Order</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="delivery">Delivery</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
              </div>
              
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                <FiRefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                <FiPrinter className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>

          {/* Order Tabs */}
          <div className="flex overflow-x-auto mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('today')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'today' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Today's Orders
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('preparing')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'preparing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Preparing
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'delivered' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Delivered
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'cancelled' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => (
                      <tr 
                        key={order.id || order.orderDate} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id ? order.id.split('-')[1] : order.orderDate.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customerName || order.userDetails?.name || 'Customer'}
                          {order.customerContact && (
                            <div className="text-xs text-gray-400 mt-1">{order.customerContact}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.type === 'eat-in' ? 'Eat-In' : 
                           order.type === 'pre-order' ? 'Pre-Order' : 
                           order.type === 'takeaway' ? 'Takeaway' : 
                           order.orderType === 'eat-in' ? 'Eat-In' :
                           order.orderType === 'delivery' ? 'Delivery' : 
                           order.orderType === 'takeaway' ? 'Takeaway' : 'Order'}
                          {order.tableNumber && <span className="ml-1 text-gray-400">(Table {order.tableNumber})</span>}
                          {order.deliveryAddress && (
                            <div className="text-xs text-gray-400 mt-1">{order.deliveryAddress}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount || order.total || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrderStatusBadge status={order.status || 'completed'} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.orderDate || order.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm || typeFilter !== 'all' || activeTab !== 'all'
                          ? 'No orders match your search criteria' 
                          : 'No orders found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{orders.length}</span> orders
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto bg-white">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{selectedOrder.id || selectedOrder.orderDate.slice(0, 8)}
                </h3>
                <p className="text-sm mt-1 text-gray-500">
                  {formatDate(selectedOrder.orderDate || selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-4 text-gray-900">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">Customer</h4>
                  <p>{selectedOrder.customerName || selectedOrder.userDetails?.name || 'Customer'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Order Type</h4>
                  <p>
                    {selectedOrder.type === 'eat-in' ? 'Eat-In' : 
                     selectedOrder.type === 'pre-order' ? 'Pre-Order' : 
                     selectedOrder.type === 'takeaway' ? 'Takeaway' : 
                     selectedOrder.orderType === 'eat-in' ? 'Eat-In' :
                     selectedOrder.orderType === 'delivery' ? 'Delivery' : 
                     selectedOrder.orderType === 'takeaway' ? 'Takeaway' : 'Order'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Status</h4>
                  <OrderStatusBadge status={selectedOrder.status || 'completed'} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Total Amount</h4>
                  <p>{formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-sm">
                            {item.name}
                            {item.specialInstructions && (
                              <p className="text-xs mt-1 text-gray-500">Note: {item.specialInstructions}</p>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-gray-200 font-medium">
                        <td colSpan={2} className="px-4 py-2 text-right">Total:</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Additional Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {selectedOrder.tableNumber && (
                    <>
                      <div className="text-gray-500">Table Number:</div>
                      <div>Table {selectedOrder.tableNumber}</div>
                    </>
                  )}
                  
                  {selectedOrder.customerContact && (
                    <>
                      <div className="text-gray-500">Contact:</div>
                      <div>{selectedOrder.customerContact}</div>
                    </>
                  )}
                  
                  {selectedOrder.deliveryAddress && (
                    <>
                      <div className="text-gray-500">Delivery Address:</div>
                      <div>{selectedOrder.deliveryAddress}</div>
                    </>
                  )}
                  
                  {selectedOrder.completionTime && (
                    <>
                      <div className="text-gray-500">Completed At:</div>
                      <div>{formatDate(selectedOrder.completionTime)}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;