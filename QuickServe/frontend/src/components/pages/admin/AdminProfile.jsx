import { useState, useEffect } from 'react';
import {
  User,
  Save,
  MapPin,
  Phone,
  Mail,
  Edit,
  X,
  Utensils,
  Lock,
  Image as ImageIcon,
  Trash2,
  Upload
} from 'lucide-react';
import Sidebar from "../../ui/Sidebar";
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    restaurantName: '',
    address: '',
    cuisineType: '',
    phoneNumber: '',
    restaurantImage: null,
    imagePreview: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Load profile data
useEffect(() => {
  const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
  if (!currentAdmin) {
    navigate('/admin');
    return;
  }

  const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
  const admin = admins.find(a => a.username === currentAdmin.username);
  
  const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
  const restaurant = restaurants.find(r => r.id === currentAdmin.restaurantId);
  
  if (restaurant && admin) {
    setProfileData({
      username: currentAdmin.username,
      email: currentAdmin.email || admin.email,
      restaurantName: restaurant.name,
      address: restaurant.address,
      cuisineType: restaurant.cuisine,
      phoneNumber: restaurant.phoneNumber,
      restaurantImage: null,
      imagePreview: restaurant.image || (admin.profileData?.coverImage || '')
    });
  }
}, [navigate]);

  // Form handling
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'restaurantImage' && files && files[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Image size should be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Only JPEG, JPG, or PNG images are allowed');
        return;
      }
      
      setProfileData(prev => ({
        ...prev,
        restaurantImage: file,
        imagePreview: URL.createObjectURL(file)
      }));
      setError('');
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const removeImage = () => {
    setProfileData(prev => ({
      ...prev,
      restaurantImage: null,
      imagePreview: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!profileData.restaurantName || !profileData.address || !profileData.phoneNumber || !profileData.email) {
      setError('Please fill in all required fields');
      return;
    }

    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
    
    const restaurantIndex = restaurants.findIndex(r => r.id === currentAdmin.restaurantId);
    const adminIndex = admins.findIndex(a => a.username === currentAdmin.username);

    if (restaurantIndex === -1 || adminIndex === -1) {
      setError('Restaurant or admin not found!');
      return;
    }

    // Update admin email in credentials
    admins[adminIndex].email = profileData.email;
    localStorage.setItem('adminCredentials', JSON.stringify(admins));

    // Update current admin email in session
    currentAdmin.email = profileData.email;
    localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));

    // Prepare image data (convert to base64 if new image was uploaded)
    const updateRestaurantData = () => {
      const updatedRestaurant = {
        ...restaurants[restaurantIndex],
        name: profileData.restaurantName,
        address: profileData.address,
        cuisine: profileData.cuisineType,
        phoneNumber: profileData.phoneNumber,
        image: profileData.imagePreview
      };

      restaurants[restaurantIndex] = updatedRestaurant;
      localStorage.setItem('restaurants', JSON.stringify(restaurants));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    };

    if (profileData.restaurantImage) {
      const reader = new FileReader();
      reader.readAsDataURL(profileData.restaurantImage);
      reader.onloadend = () => {
        profileData.imagePreview = reader.result;
        updateRestaurantData();
      };
      reader.onerror = () => {
        setError('Error processing image');
      };
    } else {
      updateRestaurantData();
    }
  };

  // Password change handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setError('');
    setSuccess('');

    // Validate passwords
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match!");
      return;
    }

    // Get current admin
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
    const adminIndex = admins.findIndex(a => a.username === currentAdmin.username);

    if (adminIndex === -1) {
      setPasswordError('Admin not found!');
      return;
    }

    // Verify current password
    if (admins[adminIndex].password !== passwordData.currentPassword) {
      setPasswordError('Current password is incorrect!');
      return;
    }

    // Update password
    admins[adminIndex].password = passwordData.newPassword;
    localStorage.setItem('adminCredentials', JSON.stringify(admins));
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setShowPasswordForm(false);
    setSuccess('Password changed successfully!');
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
          <div className="max-w-4xl mx-auto">
            {/* Header and Actions */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <User className="text-blue-600" />
                  Admin Profile
                </h1>
                <p className="text-gray-500">
                  Manage your account and restaurant details
                </p>
              </div>
              
              {!isEditing && !showPasswordForm ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                !showPasswordForm && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                )
              )}
            </div>

            {/* Success and Error Messages */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Profile Content */}
            {!showPasswordForm ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Restaurant Logo and Basic Info */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-32 w-32 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                        {profileData.imagePreview ? (
                          <img 
                            src={profileData.imagePreview} 
                            alt="Restaurant" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      {isEditing && (
                        <div className="mt-2 flex flex-col gap-2">
                          <label className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            <Upload className="h-4 w-4" />
                            Upload Image
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={handleChange}
                              accept="image/*"
                              name="restaurantImage"
                            />
                          </label>
                          {profileData.imagePreview && (
                            <button 
                              onClick={removeImage}
                              className="flex items-center justify-center gap-1 text-sm text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Image
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {isEditing ? (
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                  type="text"
                                  name="username"
                                  value={profileData.username}
                                  onChange={handleChange}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                  disabled
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={profileData.email}
                                  onChange={handleChange}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name *</label>
                              <input
                                type="text"
                                name="restaurantName"
                                value={profileData.restaurantName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                                <input
                                  type="text"
                                  name="cuisineType"
                                  value={profileData.cuisineType}
                                  onChange={handleChange}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-3 text-gray-500">
                                    <Phone className="h-4 w-4" />
                                  </span>
                                  <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={profileData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">
                                  <MapPin className="h-4 w-4" />
                                </span>
                                <input
                                  type="text"
                                  name="address"
                                  value={profileData.address}
                                  onChange={handleChange}
                                  className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors border border-gray-300 text-gray-700"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2.5 rounded-lg flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
                              >
                                <Save className="h-4 w-4" />
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-gray-500">Username</h4>
                              <p className="text-lg text-gray-700">{profileData.username}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-gray-500">Email</h4>
                              <p className="text-lg text-gray-700">{profileData.email}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1 text-gray-500">Restaurant Name</h4>
                            <p className="text-lg text-gray-700">{profileData.restaurantName}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-gray-500">Cuisine Type</h4>
                              <p className="text-lg text-gray-700">{profileData.cuisineType || 'Not specified'}</p>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium mb-1 text-gray-500">Phone Number</h4>
                                <p className="text-lg text-gray-700">{profileData.phoneNumber}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-gray-500">Address</h4>
                              <p className="text-lg text-gray-700">{profileData.address}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Change Section */}
                {!isEditing && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lock className="text-blue-600" />
                      Password Settings
                    </h3>
                    
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Lock className="h-4 w-4" />
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Password Change Form */
              <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="text-blue-600" />
                  Change Password
                </h3>
                
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {passwordError}
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs mt-1 text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;