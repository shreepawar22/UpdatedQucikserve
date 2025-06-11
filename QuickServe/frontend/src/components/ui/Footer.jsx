import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* QuickServe Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-quickserve-400">QuickServe</h3>
            <p className="text-gray-400">
              Revolutionizing restaurant management and food ordering experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-quickserve-400 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-quickserve-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-quickserve-400 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-quickserve-400 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-quickserve-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurantPage" className="text-gray-400 hover:text-quickserve-400 transition">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-quickserve-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-quickserve-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-quickserve-400 transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-quickserve-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-quickserve-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-quickserve-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-quickserve-400 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-400 hover:text-quickserve-400 transition">
                  For Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-quickserve-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Food Street, Restaurant District<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-quickserve-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-quickserve-400" />
                <span className="text-gray-400">support@quickserve.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-quickserve-400" />
                <span className="text-gray-400">24/7 Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} QuickServe. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-500 hover:text-quickserve-400 text-sm transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-quickserve-400 text-sm transition">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-500 hover:text-quickserve-400 text-sm transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;