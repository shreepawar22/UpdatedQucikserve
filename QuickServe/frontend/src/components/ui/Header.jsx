import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, Utensils } from "lucide-react";
import { useState, useEffect } from "react";

const Header = ({ transparent = false }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // Get current route location

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine header classes based on props and scroll state
  const getHeaderClasses = () => {
    if (transparent) {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-sm border-b border-gray-200" 
          : "bg-transparent border-transparent"
      }`;
    }
    return "sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm";
  };

  // Determine text color based on transparency and scroll state
  const getTextColor = () => {
    if (transparent && !isScrolled) {
      return "text-white";
    }
    return "text-gray-900";
  };

  // Determine hover text color based on transparency and scroll state
  const getHoverTextColor = () => {
    if (transparent && !isScrolled) {
      return "hover:text-blue-300";
    }
    return "hover:text-blue-600";
  };

  const getLoginButtonText = () => {
  if (location.pathname === "/" || location.pathname.startsWith("/home")) {
    return "User Login";
  }
  return "Restaurant Login";
};

const getLoginButtonLink = () => {
  if (location.pathname === "/" || location.pathname.startsWith("/home")) {
    return "/customer";
  }
  return "/register";
};

  return (
    <header className={getHeaderClasses()}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className={`text-2xl font-bold inline-flex items-center gap-2 ${
            transparent && !isScrolled ? "text-white" : "text-blue-600"
          }`}
        >
          <Utensils size={24} />
          QuickServe
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className={`text-lg transition ${getTextColor()} ${getHoverTextColor()}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/restaurants" 
                className={`text-lg transition ${getTextColor()} ${getHoverTextColor()}`}
              >
                Restaurants
              </Link>
            </li>
            <li>
              <Link 
                to="/guide" 
                className={`text-lg transition ${getTextColor()} ${getHoverTextColor()}`}
              >
                Guide
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center gap-6">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${
              transparent && !isScrolled 
                ? "text-white hover:bg-white/20" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
          
          {/* Login Button */}
          <Link to={getLoginButtonLink()}>
            <button className={`hidden md:flex items-center justify-center h-12 px-6 rounded-lg font-medium transition-colors ${
              transparent && !isScrolled
                ? "border border-white/30 text-white hover:bg-white/20"
                : "border border-gray-300 text-gray-800 hover:bg-gray-50"
            }`}>
              {getLoginButtonText()}
            </button>
          </Link>
          
          {/* Mobile Menu Toggle Button */}
          <button
            className={`md:hidden p-2 rounded-full transition-colors ${
              transparent && !isScrolled 
                ? "text-white hover:bg-white/20" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} ${
          transparent && !isScrolled ? "bg-white/95" : "bg-white"
        } pb-6 px-6 transition-all border-t border-gray-200`}
      >
        <div className="flex flex-col space-y-4">
          <Link 
            to="/" 
            className="px-4 py-3 text-lg text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/restaurants" 
            className="px-4 py-3 text-lg text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Restaurants
          </Link>
          <Link 
            to="/guide" 
            className="px-4 py-3 text-lg text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Guide
          </Link>
          <Link 
            to={getLoginButtonLink()} 
            className="px-4 py-3 text-lg text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {getLoginButtonText()}
          </Link>
        </div> 
      </div>
    </header>
  );
};

export default Header;