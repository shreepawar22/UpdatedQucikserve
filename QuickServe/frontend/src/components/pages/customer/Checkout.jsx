import React, { useState, useEffect } from 'react';
import { 
  FiArrowLeft, FiUser, FiPhone, FiMapPin, FiClock, FiInfo
} from 'react-icons/fi';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: ''
  });
  const [orderType, setOrderType] = useState('Home Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  // Color palette
  const colors = {
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1E293B',
    textLight: '#64748B',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B'
  };

  // Load cart items, restaurant data, and tables
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        if (!id) {
          navigate('/restaurants');
          return;
        }

        // Simulate API loading
        await new Promise(resolve => setTimeout(resolve, 500));

        // Load restaurant data
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const foundRestaurant = restaurants.find(r => r.id === id);
        
        if (!foundRestaurant) {
          console.error('Restaurant not found with ID:', id);
          navigate('/restaurants');
          return;
        }

        setRestaurant(foundRestaurant);

        // Load cart items
        let itemsToSet = [];
        if (location.state?.cartItems) {
          itemsToSet = location.state.cartItems;
        } else {
          const allCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          itemsToSet = allCartItems.filter(item => item.restaurantId === id);
        }

        if (itemsToSet.length === 0) {
          console.warn('No cart items found for restaurant:', id);
        }
        setCartItems(itemsToSet);

        // Load user details
        const user = JSON.parse(localStorage.getItem('user')) || {
          name: '',
          phone: ''
        };
        setUserDetails(user);

        // Load available tables for this restaurant
        const tables = foundRestaurant.tables || [];
        setAvailableTables(tables.filter(table => table.status === 'free'));
      } catch (error) {
        console.error('Error loading checkout data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate, location.state]);

  const validateForm = () => {
    const errors = {};
    
    if (!userDetails.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!userDetails.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(userDetails.phone)) {
      errors.phone = 'Invalid phone number';
    }
    
    if (orderType === 'Home Delivery' && !deliveryAddress.trim()) {
      errors.deliveryAddress = 'Delivery address is required';
    }
    
    if (['Eat-in', 'Pre-order'].includes(orderType) && !selectedTable) {
      errors.table = 'Please select a table';
    }
    
    if (cartItems.length === 0) {
      errors.cart = 'Your cart is empty';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    if (orderType !== 'Home Delivery') return 0;
    return getCartTotal() > 500 ? 0 : 49;
  };

  const calculateGST = () => {
    return getCartTotal() * 0.05; // 5% GST
  };

  const getGrandTotal = () => {
    return getCartTotal() + calculateDeliveryFee() + calculateGST();
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    // Create order object
    const order = {
      id: `order_${Date.now()}`,
      restaurantId: id,
      restaurantName: restaurant?.name,
      restaurantImage: restaurant?.image,
      items: cartItems,
      userDetails,
      orderType,
      deliveryAddress: orderType === 'Home Delivery' ? deliveryAddress : null,
      tableNumber: ['Eat-in', 'Pre-order'].includes(orderType) ? selectedTable : null,
      specialInstructions,
      subtotal: getCartTotal(),
      deliveryFee: calculateDeliveryFee(),
      tax: calculateGST(),
      totalAmount: getGrandTotal(),
      status: 'pending',
      orderDate: new Date().toISOString(),
      estimatedTime: orderType === 'Home Delivery' ? '30-45 mins' : '20-30 mins'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, order]));

    // Update table status if Eat-in or Pre-order
    if (['Eat-in', 'Pre-order'].includes(orderType)) {
      const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      const updatedRestaurants = restaurants.map(r => {
        if (r.id === id) {
          const updatedTables = r.tables?.map(table => 
            table.id === selectedTable 
              ? { 
                  ...table, 
                  status: orderType === 'Eat-in' ? 'booked' : 'reserved' 
                } 
              : table
          ) || [];
          return { ...r, tables: updatedTables };
        }
        return r;
      });
      localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    }

    // Clear cart for this restaurant
    const allCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const otherRestaurantItems = allCartItems.filter(item => item.restaurantId !== id);
    localStorage.setItem('cartItems', JSON.stringify(otherRestaurantItems));

    // Save user details
    localStorage.setItem('user', JSON.stringify(userDetails));

    // Navigate to order confirmation with order data
    navigate(`/order-confirmation/${order.id}`, { state: { order } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-700">Loading your order...</h2>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-700">Restaurant not found</h2>
          <button 
            onClick={() => navigate('/restaurants')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(`/restaurant/${id}`)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
          >
            <FiArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500">{restaurant?.name}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="lg:flex lg:gap-8">
          {/* Order Details Form - Left Side */}
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className={`flex items-center rounded-lg border px-3 py-2 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                      value={userDetails.name}
                      onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                    />
                  </div>
                  {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className={`flex items-center rounded-lg border px-3 py-2 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}>
                    <span className="text-gray-500 mr-2">+91</span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                      value={userDetails.phone}
                      onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                    />
                  </div>
                  {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Order Type */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                <FiClock className="mr-2 text-blue-500" />
                Order Type
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { type: 'Home Delivery', icon: '🚚', desc: 'Food delivered to your address' },
                  { type: 'Takeaway', icon: '🛍️', desc: 'Pick up your order' },
                  { type: 'Eat-in', icon: '🍽️', desc: 'Dine at the restaurant' },
                  { type: 'Pre-order', icon: '⏱️', desc: 'Reserve for later' }
                ].map(({ type, icon, desc }) => (
                  <button
                    key={type}
                    className={`p-3 rounded-lg border text-left transition-all ${orderType === type ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setOrderType(type)}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{icon}</span>
                      <div>
                        <p className="font-medium text-gray-800">{type}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Delivery Address */}
              {orderType === 'Home Delivery' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <div className={`flex items-center rounded-lg border px-3 py-2 ${formErrors.deliveryAddress ? 'border-red-500' : 'border-gray-300'}`}>
                    <FiMapPin className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Enter your full address with landmark"
                      className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  {formErrors.deliveryAddress && <p className="mt-1 text-sm text-red-500">{formErrors.deliveryAddress}</p>}
                  <p className="mt-2 text-xs text-gray-500 flex items-center">
                    <FiInfo className="mr-1" /> Free delivery on orders above ₹500
                  </p>
                </div>
              )}

              {/* Table Selection */}
              {['Eat-in', 'Pre-order'].includes(orderType) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Table</label>
                  {availableTables.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTables.map(table => (
                        <button
                          key={table.id}
                          className={`p-3 rounded-lg border text-center transition-all ${selectedTable === table.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300 '}`}
                          onClick={() => setSelectedTable(table.id)}
                        >
                          <p className="font-medium text-white">Table {table.number}</p>
                          <p className="text-xs text-white">{table.capacity} persons</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm">
                      No tables available for {orderType.toLowerCase()}. Please try another option.
                    </div>
                  )}
                  {formErrors.table && <p className="mt-1 text-sm text-red-500">{formErrors.table}</p>}
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                <FiInfo className="mr-2 text-blue-500" />
                Special Instructions
              </h2>
              <textarea
                className="w-full border rounded-lg p-3 text-gray-800 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                style={{ minHeight: '100px' }}
                placeholder="Any special requests, dietary restrictions, or delivery instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-500">
                Note: Requests for cutlery, napkins, or specific preparation methods can be mentioned here.
              </p>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h2>
              
              {/* Restaurant Info */}
              <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                <img 
                  src={restaurant?.image || 'https://via.placeholder.com/80x80?text=Restaurant'} 
                  alt={restaurant?.name} 
                  className="w-12 h-12 rounded-lg object-cover mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{restaurant?.name}</h3>
                  <p className="text-xs text-gray-500">{restaurant?.cuisineType || 'Multi-cuisine'}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex items-start">
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                          {item.quantity}
                        </span>
                        <div>
                          <span className="text-gray-800">{item.name}</span>
                          {item.variant && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No items in cart</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm text-gray-800">₹{getCartTotal().toFixed(2)}</span>
                </div>
                
                {orderType === 'Home Delivery' && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Delivery Fee</span>
                    <span className="text-sm text-gray-800">
                      {calculateDeliveryFee() === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${calculateDeliveryFee().toFixed(2)}`
                      )}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tax (5%)</span>
                  <span className="text-sm text-gray-800">₹{calculateGST().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-100">
                  <span className="text-gray-800">Total</span>
                  <span className="text-blue-600">₹{getGrandTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center text-sm text-gray-500 mb-6 bg-blue-50 rounded-lg p-3">
                <FiClock className="mr-2 text-blue-500" />
                <span>
                  Estimated {orderType === 'Home Delivery' ? 'delivery' : 'preparation'} time: {' '}
                  <span className="font-medium text-gray-700">
                    {orderType === 'Home Delivery' ? '30-45 mins' : '20-30 mins'}
                  </span>
                </span>
              </div>

              {/* Place Order Button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || (['Eat-in', 'Pre-order'].includes(orderType) && !selectedTable)}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${cartItems.length === 0 || (['Eat-in', 'Pre-order'].includes(orderType) && !selectedTable) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;