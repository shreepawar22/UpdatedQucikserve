import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  ChevronDown,
  UtensilsCrossed,
  Leaf,
  Armchair

} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../ui/Sidebar';

const MenuManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: true,
    isAvailable: true,
    image: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();

  // Load data from restaurants array in localStorage
  useEffect(() => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin) {
      navigate('/admin');
      return;
    }

    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const adminRestaurant = restaurants.find(r => r.id === currentAdmin.restaurantId);
    
    if (adminRestaurant) {
      setCategories(adminRestaurant.categories || []);
      setMenuItems(adminRestaurant.menuItems || []);
    } else {
      setCategories([]);
      setMenuItems([]);
    }
  }, [navigate]);

  // Save data to restaurants array in localStorage
  const saveRestaurantData = (updatedCategories, updatedMenuItems) => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === currentAdmin.restaurantId) {
        return {
          ...restaurant,
          categories: updatedCategories || categories,
          menuItems: updatedMenuItems || menuItems
        };
      }
      return restaurant;
    });
    
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
  };

  // Filter menu items by selected category
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const category = {
        id: `cat-${Date.now()}`,
        name: newCategory,
        description: ''
      };
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      setNewCategory('');
      saveRestaurantData(updatedCategories, menuItems);
    }
  };

  // Delete category
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Delete this category and all its items?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      const updatedMenuItems = menuItems.filter(item => item.category !== categoryId);
      setCategories(updatedCategories);
      setMenuItems(updatedMenuItems);
      saveRestaurantData(updatedCategories, updatedMenuItems);
    }
  };

  // Add new menu item
  const handleAddItem = (categoryId) => {
    const item = {
      id: `item-${Date.now()}`,
      name: newItem.name || 'New Item',
      description: newItem.description || 'Item description',
      price: parseFloat(newItem.price) || 0,
      category: categoryId || newItem.category,
      isVeg: newItem.isVeg,
      isAvailable: newItem.isAvailable,
      image: newItem.image || 'https://via.placeholder.com/150?text=New+Item'
    };
    const updatedMenuItems = [...menuItems, item];
    setMenuItems(updatedMenuItems);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      isVeg: true,
      isAvailable: true,
      image: ''
    });
    setIsAdding(false);
    saveRestaurantData(categories, updatedMenuItems);
  };

  // Edit menu item
  const handleEditItem = (item) => {
    setEditingId(item.id);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      image: item.image
    });
  };

  // Save edited item
  const handleSaveEdit = () => {
    const updatedMenuItems = menuItems.map(item => 
      item.id === editingId 
        ? { 
            ...item, 
            name: newItem.name,
            description: newItem.description,
            price: parseFloat(newItem.price),
            category: newItem.category,
            isVeg: newItem.isVeg,
            isAvailable: newItem.isAvailable,
            image: newItem.image
          } 
        : item
    );
    setMenuItems(updatedMenuItems);
    setEditingId(null);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      isVeg: true,
      isAvailable: true,
      image: ''
    });
    saveRestaurantData(categories, updatedMenuItems);
  };

  // Delete menu item
  const handleDeleteItem = (itemId) => {
    if (window.confirm('Delete this menu item?')) {
      const updatedMenuItems = menuItems.filter(item => item.id !== itemId);
      setMenuItems(updatedMenuItems);
      saveRestaurantData(categories, updatedMenuItems);
    }
  };

  // Cancel edit/add
  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      isVeg: true,
      isAvailable: true,
      image: ''
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/menu-management', label: 'Menu Management', icon: 'list' },
    { path: '/order-management', label: 'Orders', icon: 'shopping-bag' },
    { path: '/table-management', label: 'Table Management', icon: 'grid' },
    { path: '/admin-profile', label: 'Profile', icon: 'user' },
    { path: '/home', label: 'Logout', icon: 'log-out' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} navItems={navItems} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UtensilsCrossed className="text-blue-600" />
              Menu Management
            </h1>
            <p className="text-gray-500">
              Manage your restaurant's menu items and categories
            </p>
          </div>

          {/* Filter and Add Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2 w-full">
              <div className="relative flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <input
                type="text"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              
              <button
                onClick={handleAddCategory}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                disabled={!newCategory.trim()}
              >
                <PlusCircle className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingId) && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Item name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Item description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewItem({...newItem, isVeg: true})}
                        className={`p-2 rounded-lg ${newItem.isVeg ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <Leaf className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setNewItem({...newItem, isVeg: false})}
                        className={`p-2 rounded-lg ${!newItem.isVeg ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <Armchair className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <button
                      onClick={() => setNewItem({...newItem, isAvailable: !newItem.isAvailable})}
                      className={`px-3 py-2 rounded-lg ${newItem.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {newItem.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleSaveEdit : () => handleAddItem(newItem.category)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  disabled={!newItem.name || !newItem.price || !newItem.category}
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </div>
          )}

          {/* Menu Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <span className="text-lg font-semibold">₹{item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {categories.find(cat => cat.id === item.category)?.name || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
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
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                No menu items found{selectedCategory !== 'All' ? ` in this category` : ''}
              </p>
              {categories.length > 0 && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Item
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MenuManagement;