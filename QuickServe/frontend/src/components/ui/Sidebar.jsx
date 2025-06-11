import { 
  Home,
  Utensils,
  UtensilsCrossed,
  ListOrdered,
  TableProperties,
  User,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed h-full z-10`}>
      <div className="p-4 border-b border-gray-200 flex items-center h-[66px]">
        <button 
          onClick={toggleSidebar}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="bg-blue-100 p-2 rounded-lg">
            <Utensils className="h-5 w-5 text-blue-600" />
          </div>
          {isOpen && <span className="font-bold text-lg">QuickServe</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <a href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 group">
            <Home className="flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            {isOpen && <span className="ml-3">Dashboard</span>}
          </a>

          <a href="/menu-management" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 group">
            <UtensilsCrossed className="flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            {isOpen && <span className="ml-3">Menu Management</span>}
          </a>

          <a href="/order-management" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 group">
            <ListOrdered className="flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            {isOpen && <span className="ml-3">Orders</span>}
          </a>

          <a href="/table-management" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 group">
            <TableProperties className="flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            {isOpen && <span className="ml-3">Table Management</span>}
          </a>

          <a href="/admin-profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 group">
            <User className="flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            {isOpen && <span className="ml-3">Restaurant Profile</span>}
          </a>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <a 
          href="/restaurantPage"
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 group"
        >
          <LogOut className="flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          {isOpen && <span className="ml-3">Logout</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;