import React, { useState } from 'react';
import { Phone, MapPin, Navigation, Clock, Shield, Menu, User, Truck, Loader2, UserPlus, FileText } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const OperatorView = () => {
  const [selectedTrip, setSelectedTrip] = useState('short');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Trip Constants
  const fares = {
    short: { name: 'Safar Dhow', price: 0.4, driver: 0.3, fee: 0.1, text: 'Driver $0.3 + Fee $0.1' },
    course: { name: 'Koorso/Fog', price: 1.2, driver: 1.0, fee: 0.2, text: 'Driver $1.0 + Fee $0.2' }
  };

  const currentFare = fares[selectedTrip];

  const handleBooking = async () => {
    // Validation
    if (!phoneNumber || !userLocation || !customerName) {
        alert('Fadlan gali magaca, lambarka, iyo xaafadda.');
        return;
    }

    setIsBooking(true);

    // Prepare payload
    const bookingPayload = {
        customer_name: customerName,
        phone: phoneNumber,
        location: userLocation,
        trip_type: currentFare.name,
        price: currentFare.price,
        status: 'pending' // Default status for new bookings
    };

    try {
        console.log("Operator Sending Payload:", bookingPayload);

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingPayload]);

        if (error) {
            throw error;
        }

        console.log('Booking successful:', data);
        alert('Dalabka waa la diiwaangeliyay!');
        
        // Reset form
        setCustomerName('');
        setPhoneNumber('');
        setUserLocation('');
        
    } catch (err) {
        console.error("Supabase Error:", err);
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
                    <h1 className="font-extrabold text-lg leading-tight tracking-wide">Operator Panel</h1>
                    <p className="text-xs text-blue-200">Garowe Hub Dispatch</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                 <Link to="/drivers" className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wide">View Drivers</span>
                 </Link>
                <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 backdrop-blur-sm">
                    <span className="relative flex h-2.5 w-2.5 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">Live</span>
                </div>
            </div>
        </div>
      </header>

      {/* Map Placeholder */}
      <div className="h-[35vh] w-full bg-blue-50 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 bg-deep-blue/5 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [animation-duration:3s]"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
                <Shield size={48} className="text-deep-blue drop-shadow-2xl filter" fill="#FFC107" />
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[2px]"></div>
            </div>
            <div className="text-center mt-2">
                 <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-deep-blue shadow-md border border-gray-100">
                    Xarunta Dhexe
                 </span>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative -mt-10 px-5 z-20">
        
        {/* Booking Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-deep-blue">Diiwaangeli Dalab Cusub</h3>
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    <FileText size={12} />
                    <span>Booking Form</span>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
                 {/* Customer Name */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bajaaj-yellow focus:border-transparent transition-all bg-gray-50"
                        placeholder="Magaca Macmiilka"
                    />
                </div>

                {/* Phone */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bajaaj-yellow focus:border-transparent transition-all bg-gray-50"
                        placeholder="Lambarka Macmiilka"
                    />
                </div>

                {/* Location */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bajaaj-yellow focus:border-transparent transition-all bg-gray-50"
                        placeholder="Xaafadda / Goobta"
                    />
                </div>
            </div>

            {/* Fare Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(fares).map(([key, data]) => (
                    <button 
                        key={key}
                        onClick={() => setSelectedTrip(key)}
                        className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            selectedTrip === key 
                            ? 'border-bajaaj-yellow bg-yellow-50 shadow-md ring-1 ring-bajaaj-yellow/50' 
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {selectedTrip === key && (
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
                        <span>Diiwaangelinaya...</span>
                    </>
                ) : (
                    <>
                        <span>Dir Dalabka</span>
                        <UserPlus size={18} className="ml-2" />
                    </>
                )}
            </button>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-400">
            <p className="text-[10px] font-medium mb-1">
                <Shield size={10} className="inline mr-1 mb-0.5" />
                Operator Interface • Authorized Access Only
            </p>
        </div>
      </main>
    </div>
  );
};

export default OperatorView;
