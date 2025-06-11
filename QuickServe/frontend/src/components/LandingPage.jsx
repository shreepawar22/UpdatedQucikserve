import { Link } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { ArrowRight, MapPin, Clock, Star, ShieldCheck, Smartphone, Bike, CheckCircle } from "lucide-react";

const CustomerLandingPage = () => {
  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Mangesh Rane",
      rating: 5,
      comment: "QuickServe made my dining experience so smooth! Ordered ahead and my food was ready exactly when I arrived.",
      location: "Mahad"
    },
    {
      id: 2,
      name: "Ashok Bhonkar",
      rating: 4,
      comment: "Love the variety of restaurants available. The delivery is always on time and food arrives fresh.",
      location: "Mangoan"
    },
    {
      id: 3,
      name: "Janu Shelar",
      rating: 5,
      comment: "As someone who's always on the go, QuickServe saves me so much time. The app is intuitive and reliable.",
      location: "Mangoan"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="absolute top-0 left-0 right-0 z-50">
        <Header transparent={true} />
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://res.cloudinary.com/ddv7mqqje/image/upload/v1746645692/QuickServe_bg.jpg" 
              alt="Delicious food delivery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-gray-900/10"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-6 text-white">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                  Delicious Food Delivered to Your Doorstep
                </h1>
                <p className="text-lg text-white/90 drop-shadow-md">
                  Discover the best restaurants in your area, order for delivery or pickup, 
                  and enjoy a seamless dining experience with QuickServe.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link 
                    to="/restaurants"
                    className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Order Now
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                  <Link 
                    to="/about"
                    className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>
              {/* Empty div to maintain layout balance */}
              <div className="md:w-1/2"></div>
            </div>
          </div>
        </section>

        {/* Reachability Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">We're Available In</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Serving food lovers across major cities with plans to expand further
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {["Khed", "Poladpur", "Mahad", "Mangoan"].map((city, index) => (
                <div key={index} className="flex items-center justify-center gap-2 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <MapPin className="text-blue-600" size={20} />
                  <span className="font-medium text-gray-800">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Customers Love QuickServe</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Features designed to make your food ordering experience exceptional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock className="text-blue-600" size={24} />,
                  title: "Fast Delivery",
                  description: "Get your food delivered in record time with our optimized delivery network."
                },
                {
                  icon: <Star className="text-blue-600" size={24} />,
                  title: "Verified Reviews",
                  description: "Read authentic customer reviews to make informed choices."
                },
                {
                  icon: <ShieldCheck className="text-blue-600" size={24} />,
                  title: "Secure Payments",
                  description: "Multiple payment options with bank-grade security for your peace of mind."
                },
                {
                  icon: <Smartphone className="text-blue-600" size={24} />,
                  title: "Easy Tracking",
                  description: "Real-time order tracking from kitchen to your doorstep."
                },
                {
                  icon: <MapPin className="text-blue-600" size={24} />,
                  title: "Accurate Delivery",
                  description: "Precise location tracking ensures your food arrives exactly where you are."
                },
                {
                  icon: <CheckCircle className="text-blue-600" size={24} />,
                  title: "Satisfaction Guarantee",
                  description: "Not happy? We'll make it right with our customer-first policy."
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

        {/* How It Works for Customers */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How QuickServe Works for You</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Get your favorite food in just a few taps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  icon: <MapPin className="text-blue-600 mx-auto" size={32} />,
                  title: "Set Your Location",
                  description: "Enter your delivery address or allow us to detect your location."
                },
                {
                  step: "2",
                  icon: <Smartphone className="text-blue-600 mx-auto" size={32} />,
                  title: "Browse Restaurants",
                  description: "Explore menus from top-rated restaurants near you."
                },
                {
                  step: "3",
                  icon: <CheckCircle className="text-blue-600 mx-auto" size={32} />,
                  title: "Place Your Order",
                  description: "Customize your order and checkout securely."
                },
                {
                  step: "4",
                  icon: <Bike className="text-blue-600 mx-auto" size={32} />,
                  title: "Track & Enjoy",
                  description: "Follow your order in real-time until delivery."
                }
              ].map((item, index) => (
                <div key={index} className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-6">
                    {item.step}
                  </div>
                  <div className="mb-6">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Don't just take our word for it - hear from our satisfied customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-5 h-5`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{review.rating}.0</span>
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{review.comment}"</p>
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mr-4">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {review.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link 
                to="/customer/reviews"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
              >
                See More Reviews
                <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link 
                to="/customer/write-review"
                className="ml-4 inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Hungry? You're in the Right Place</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join millions of satisfied customers enjoying great food with QuickServe
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/restaurants"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold border border-transparent bg-white text-blue-600 hover:bg-gray-100 transition-colors"
              >
                Order Now
              </Link>
              <Link 
                to="/customer"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLandingPage;