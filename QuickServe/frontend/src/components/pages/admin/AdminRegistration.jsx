import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Utensils, 
  MapPin, 
  Phone, 
  Mail, 
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Upload
} from 'lucide-react';

const saveAdminCredentials = (username, email, password, restaurantId, profileData) => {
  const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
  if (admins.some(admin => admin.username === username)) {
    return { success: false, error: 'Username already exists' };
  }
  if (admins.some(admin => admin.email === email)) {
    return { success: false, error: 'Email already exists' };
  }
  
  const adminProfile = {
    username,
    email,
    password,
    restaurantId,
    profileData: {
      ...profileData
    }
  };
  
  admins.push(adminProfile);
  localStorage.setItem('adminCredentials', JSON.stringify(admins));
  return { success: true };
};

const saveRestaurant = (restaurantData) => {
  const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
  restaurantData.id = Date.now().toString();
  restaurantData.categories = [];
  restaurantData.menuItems = [];
  restaurants.push(restaurantData);
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
  return restaurantData.id;
};

const AdminRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    address: '',
    cuisineType: '',
    phoneNumber: '',
    coverImage: null,
    imagePreview: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'coverImage' && files && files[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Only JPEG, JPG, or PNG images are allowed');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        coverImage: file,
        imagePreview: URL.createObjectURL(file)
      }));
      setError('');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null,
      imagePreview: ''
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setError('');
  
  if (step === 1) {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setStep(2);
  } else {
    if (!formData.coverImage) {
      setError('Restaurant image is required');
      return;
    }

    // Convert image to base64 before saving
    const reader = new FileReader();
    reader.readAsDataURL(formData.coverImage);
    reader.onload = () => {
      const base64Image = reader.result;

      const restaurantId = saveRestaurant({
        name: formData.restaurantName,
        cuisine: formData.cuisineType,
        rating: 0,
        deliveryTime: '30-45 min',
        minOrder: 200,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        image: base64Image,  // Store as base64 string
        menuItems: []
      });
      
      const { success, error } = saveAdminCredentials(
        formData.username, 
        formData.email,
        formData.password, 
        restaurantId,
        {
          restaurantName: formData.restaurantName,
          address: formData.address,
          cuisineType: formData.cuisineType,
          phoneNumber: formData.phoneNumber,
          coverImage: base64Image  // Store as base64 string
        }
      );
      
      if (!success) {
        setError(error || 'Registration failed');
        return;
      }
      
      localStorage.setItem('currentAdmin', JSON.stringify({
        username: formData.username,
        email: formData.email,
        restaurantId: restaurantId
      }));
      
      navigate('/dashboard');
    };

    reader.onerror = () => {
      setError('Error processing image. Please try again.');
    };
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Utensils className="text-blue-600 h-8 w-8" />
            <span className="text-2xl font-bold text-gray-800">QuickServe</span>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/admin" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Admin Login
            </Link>
            <Link 
              to="/customer" 
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Customer Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {step === 1 ? 'Create Admin Account' : 'Restaurant Details'}
              </h2>
              <div className="flex justify-center mt-6 mb-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${step === 1 ? 'bg-gray-300' : 'bg-blue-600'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm password"
                      required
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/admin" className="text-blue-600 hover:underline font-medium">
                      Log in
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter restaurant name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter full address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-1">
                      Cuisine Type *
                    </label>
                    <input
                      type="text"
                      id="cuisineType"
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Italian, Indian, Chinese"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Image *
                    </label>
                    <div className="flex flex-col items-center justify-center w-full">
                      {formData.imagePreview ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 mb-2">
                          <img 
                            src={formData.imagePreview} 
                            alt="Restaurant preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload image</p>
                          </div>
                          <input 
                            id="coverImage" 
                            name="coverImage" 
                            type="file" 
                            className="hidden" 
                            onChange={handleChange}
                            accept="image/*"
                            required
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 flex justify-center items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg transition-colors"
                    >
                      Complete Registration
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRegistration;