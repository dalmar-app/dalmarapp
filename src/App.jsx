import React, { useState } from 'react';
import { Phone, MapPin, Navigation, Clock, Shield, Menu, User, MessageCircle, Truck, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';

const App = () => {
  const [selectedTrip, setSelectedTrip] = useState('short'); // was tripType
  const [phoneNumber, setPhoneNumber] = useState(''); // was phone
  const [userLocation, setUserLocation] = useState(''); // was location
  const [isBooking, setIsBooking] = useState(false);

  // Trip Constants
  const fares = {
    short: { name: 'Safar Dhow', price: 0.4, driver: 0.3, fee: 0.1, text: 'Driver $0.3 + Fee $0.1' },
    course: { name: 'Koorso/Fog', price: 1.2, driver: 1.0, fee: 0.2, text: 'Driver $1.0 + Fee $0.2' }
  };

  const currentFare = fares[selectedTrip];

  const handleBooking = async () => {
    // Validation
    if (!phoneNumber || !userLocation) {
        alert('Fadlan gali lambarkaaga iyo xaafadda aad joogto.');
        return;
    }

    setIsBooking(true);

    // Prepare payload explicitly
    const bookingPayload = {
        phone: phoneNumber,
        location: userLocation,
        trip_type: currentFare.name,
        price: currentFare.price
    };

    try {
        console.log("Sending Payload:", bookingPayload); // Debug log

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingPayload]);

        if (error) {
            throw error;
        }

        console.log('Booking successful:', data);
        alert('Dalabkaaga waa la diray! Waan ku soo wici doonaa.');
        
        // Reset form
        setPhoneNumber('');
        setUserLocation('');
        
    } catch (err) {
        console.error("DEBUG SUPABASE ERROR:", err);
        console.log('Supabase Error Object:', err);
        alert('Cillad: ' + (err.message || "Unknown error"));
    } finally {
        setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative pb-20">
      
      {/* Header */}
      <header className="bg-deep-blue text-white p-4 shadow-lg rounded-b-3xl absolute top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
                <div className="bg-bajaaj-yellow p-1.5 rounded-lg">
                    <Navigation size={20} className="text-deep-blue" />
                </div>
                <div>
                    <h1 className="font-extrabold text-lg leading-tight tracking-wide">DALMAR - Dalbo Bajaaj</h1>
                </div>
            </div>
            <div className="flex items-center bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide">Online</span>
            </div>
        </div>
      </header>

      {/* Map Placeholder */}
      <div className="h-[45vh] w-full bg-blue-50 relative overflow-hidden group">
        {/* Mock Map Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Animated Rings/Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 bg-deep-blue/5 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [animation-duration:3s]"></div>
            <div className="w-48 h-48 bg-deep-blue/10 rounded-full animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Central Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform hover:scale-110 transition-transform cursor-pointer z-10">
            <div className="relative">
                <MapPin size={48} className="text-deep-blue drop-shadow-2xl filter" fill="#FFC107" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[2px]"></div>
            </div>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap border-b-2 border-bajaaj-yellow">
                <span className="text-xs font-bold text-gray-800">Goobtaada</span>
            </div>
        </div>

        {/* Nearby Bajaajs (Mock) */}
        <div className="absolute top-1/3 left-1/4 animate-bounce [animation-duration:4s]">
             <img src="https://cdn-icons-png.flaticon.com/512/3063/3063823.png" className="w-8 h-8 opacity-80" alt="Bajaaj" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-bounce [animation-duration:5s]">
             <img src="https://cdn-icons-png.flaticon.com/512/3063/3063823.png" className="w-8 h-8 opacity-80" alt="Bajaaj" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative -mt-10 px-5 z-20">
        
        {/* Action Buttons Container */}
        <div className="mb-6 space-y-3">
            {/* Call Button (Hero) */}
            <a href="tel:0906635679" className="block w-full group">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-1 shadow-lg shadow-green-200 transform group-hover:scale-[1.02] transition-all animate-breathe">
                    <div className="bg-white/10 rounded-xl py-4 flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-white/20">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <div className="bg-white p-2.5 rounded-full mr-3 shadow-md group-hover:rotate-12 transition-transform">
                            <Phone size={24} className="text-green-600 fill-green-100" />
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">Wac 3000 (Bilaash)</span>
                        </div>
                        {/* Pulsing Ring */}
                        <span className="absolute right-[-10px] top-[-10px] flex h-5 w-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
                        </span>
                    </div>
                </div>
            </a>

            {/* WhatsApp Button */}
            <a href="https://wa.me/252906635679" target="_blank" rel="noopener noreferrer" className="block w-full group">
                <div className="bg-white border-2 border-green-500 rounded-2xl p-3 shadow-md hover:bg-green-50 transition-colors flex items-center justify-center">
                    <MessageCircle size={20} className="text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">Nagala hadal WhatsApp</span>
                </div>
            </a>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-deep-blue">Buuxiyo Foomka</h3>
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    <Clock size={12} />
                    <span>~2 min</span>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        value={userLocation} // Updated variable
                        onChange={(e) => setUserLocation(e.target.value)} // Updated variable
                        className="block w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bajaaj-yellow focus:border-transparent transition-all bg-gray-50"
                        placeholder="Xaafadda aad joogto"
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="tel" 
                        value={phoneNumber} // Updated variable
                        onChange={(e) => setPhoneNumber(e.target.value)} // Updated variable
                        className="block w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bajaaj-yellow focus:border-transparent transition-all bg-gray-50"
                        placeholder="Lambarkaaga moobiilka"
                    />
                </div>
            </div>

            {/* Fare Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(fares).map(([key, data]) => (
                    <button 
                        key={key}
                        onClick={() => setSelectedTrip(key)} // Updated variable
                        className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            selectedTrip === key // Updated variable
                            ? 'border-bajaaj-yellow bg-yellow-50 shadow-md ring-1 ring-bajaaj-yellow/50' 
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {selectedTrip === key && ( // Updated variable
                            <div className="absolute -top-2 -right-2 bg-deep-blue text-white rounded-full p-0.5 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{data.name}</span>
                        <span className="block text-xl font-extrabold text-deep-blue mb-1">${data.price.toFixed(1)}</span>
                        <span className="block text-[10px] text-gray-400 font-medium leading-tight">{data.text}</span>
                    </button>
                ))}
            </div>

            {/* Action Button */}
            <button 
                className="w-full bg-deep-blue text-white font-bold py-4 rounded-xl shadow-xl hover:bg-[#002850] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleBooking}
                disabled={isBooking}
            >
                {isBooking ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Diraya...</span>
                    </>
                ) : (
                    <>
                        <span>Dalbo Haatan</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">${currentFare.price.toFixed(1)}</span>
                    </>
                )}
            </button>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-400">
            <p className="text-[10px] font-medium mb-1">
                <Shield size={10} className="inline mr-1 mb-0.5" />
                Amaankaagu waa muhiimada koowaad ee DALMAR
            </p>
            <p className="text-[9px] opacity-70">
                Ver 2.1.0 • Made in Garowe
            </p>
        </div>
      </main>

      {/* Sticky Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around py-3 pb-8 text-gray-400 text-[10px] font-bold z-50 rounded-t-2xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
        <button className="flex flex-col items-center text-deep-blue">
            <div className="p-1 px-4 rounded-full bg-blue-50">
               <Truck size={22} className="mb-0.5" />
            </div>
            <span className="mt-1">Dalbo Bajaaj</span>
        </button>
        <button className="flex flex-col items-center hover:text-deep-blue transition-colors">
            <Clock size={22} className="mb-0.5" />
            <span>Taariikh</span>
        </button>
        <button className="flex flex-col items-center hover:text-deep-blue transition-colors">
            <User size={22} className="mb-0.5" />
            <span>Koontada</span>
        </button>
        <button className="flex flex-col items-center hover:text-deep-blue transition-colors">
            <Menu size={22} className="mb-0.5" />
            <span>More</span>
        </button>
      </nav>

    </div>
  );
};

export default App;
