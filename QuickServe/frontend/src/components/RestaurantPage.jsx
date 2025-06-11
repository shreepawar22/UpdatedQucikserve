import { Link } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { ArrowRight, UtensilsCrossed, Clock, Database, Users, Store, Bike, CheckCircle } from "lucide-react";

const RestaurantPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Streamline Your Restaurant Operations with QuickServe
              </h1>
              <p className="text-lg text-gray-700">
                A comprehensive solution for restaurants to manage orders and for customers 
                to enjoy seamless dining experiences - dine-in, takeaway, or delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  to="/register"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Register Your Restaurant
                </Link>
                
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-xl shadow-lg aspect-video flex items-center justify-center overflow-hidden">
                <span className="text-gray-500">Hero Image - Restaurant Management Dashboard</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-4 p-6">
                <Store className="mx-auto h-10 w-10" />
                <p className="text-4xl font-bold">1,250+</p>
                <p className="text-blue-100">Restaurants</p>
              </div>
              <div className="space-y-4 p-6">
                <Users className="mx-auto h-10 w-10" />
                <p className="text-4xl font-bold">500K+</p>
                <p className="text-blue-100">Customers</p>
              </div>
              <div className="space-y-4 p-6">
                <Bike className="mx-auto h-10 w-10" />
                <p className="text-4xl font-bold">30M+</p>
                <p className="text-blue-100">Orders Delivered</p>
              </div>
              <div className="space-y-4 p-6">
                <CheckCircle className="mx-auto h-10 w-10" />
                <p className="text-4xl font-bold">98%</p>
                <p className="text-blue-100">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Designed to simplify restaurant management and enhance customer experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <UtensilsCrossed className="text-blue-600" size={24} />,
                  title: "Menu Management",
                  description: "Easily create, update, and organize your menu items with categories and modifiers."
                },
                {
                  icon: <Clock className="text-blue-600" size={24} />,
                  title: "Real-time Analytics",
                  description: "Track sales, popular items, and customer trends with live dashboard updates."
                },
                {
                  icon: <Database className="text-blue-600" size={24} />,
                  title: "Inventory Control",
                  description: "Automatically update inventory levels as orders are placed and fulfilled."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="bg-blue-50 p-3 rounded-full inline-block mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How QuickServe Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                A simple process for restaurants and customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Restaurant Onboarding",
                    description: "Restaurants complete a simple setup process to get their menu online."
                  },
                  {
                    step: "2",
                    title: "Customer Ordering",
                    description: "Customers browse menus, place orders, and choose delivery options."
                  },
                  {
                    step: "3",
                    title: "Order Processing",
                    description: "Restaurants receive and prepare orders with real-time updates."
                  },
                  {
                    step: "4",
                    title: "Delivery & Feedback",
                    description: "Orders are fulfilled and customers can rate their experience."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                <div className="bg-gray-200 rounded-xl shadow-lg aspect-square flex items-center justify-center overflow-hidden">
                  <span className="text-gray-500">Order Process Illustration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the leading restaurant management platform today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold border border-transparent bg-white text-blue-600 hover:bg-gray-100 transition-colors"
              >
                Register Restaurant
              </Link>
              <Link 
                to="/customer/restaurants"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              >
                Browse Restaurants
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantPage;