import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaCamera, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    photo: null,
    photoPreview: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load profile data on component mount
  useEffect(() => {
    // Get mobile number from login
    const loginMobile = localStorage.getItem('customerMobile') || '';
    
    // Load saved profile or create default with mobile from login
    const savedProfile = JSON.parse(localStorage.getItem('customerProfile')) || {
      name: '',
      mobile: loginMobile,
      email: '',
      address: '',
      photo: null
    };
    
    setProfile(savedProfile);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = 'Name is required';
    if (!profile.address.trim()) errors.address = 'Address is required';
    if (!profile.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Please enter a valid email';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('customerProfile', JSON.stringify(profile));
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('customerMobile');
    localStorage.removeItem('customerToken');
    navigate('/home');
  };

  const getDisplayName = () => {
    return profile.name.trim() || `+91 ${profile.mobile}`;
  };

  return (
    <div className="font-sans min-h-screen min-w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden mx-auto">
                {profile.photoPreview ? (
                  <img 
                    src={profile.photoPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <FaUser className="text-gray-500 text-4xl" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <FaCamera className="text-blue-600" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">
              {getDisplayName()}
            </h2>
            <p className="text-blue-100">{profile.email || 'Email'}</p>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Mobile Number</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                      <span className="px-3 bg-gray-100">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={profile.mobile}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2 focus:outline-none bg-gray-100"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        readOnly
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">Mobile number can't be changed</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      rows="3"
                      required
                    />
                    {validationErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setValidationErrors({});
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-75 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Full Name</h3>
                    <p className="text-gray-800 font-medium">{profile.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Mobile Number</h3>
                    <p className="text-gray-800 font-medium">+91 {profile.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaEnvelope className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Email</h3>
                    <p className="text-gray-800 font-medium">{profile.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full mt-1">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Address</h3>
                    <p className="text-gray-800 font-medium">{profile.address || 'Not provided'}</p>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FaEdit /> <span>Edit Profile</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <FaSignOutAlt /> <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;