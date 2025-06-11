import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Utensils, ChevronRight } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
    const admin = admins.find(a => a.username === username);
    
    if (admin && admin.password === password) {
      localStorage.setItem('currentAdmin', JSON.stringify({
        username,
        email: admin.email,
        restaurantId: admin.restaurantId
      }));
      
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
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
              to="/customer" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Customer Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Restaurant
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
              <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
              <p className="text-gray-500 mt-2">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors"
                >
                  Login <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register your restaurant
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;