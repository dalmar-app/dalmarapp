import React, { useState } from 'react';
import { Search, MapPin, Phone, Home, Building, Truck, Camera, ChevronRight, Star, CheckCircle, Globe, ChevronDown, Menu } from 'lucide-react';

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState('Dhamaan');
  const [currentCity, setCurrentCity] = useState('Garowe');
  const [language, setLanguage] = useState('SO');

  // Scalability: Cities config for future expansion
  const cities = ['Garowe', 'Gaalkacyo', 'Boosaaso', 'Mogadishu'];

  const filters = [
    { name: 'Dhamaan', icon: null },
    { name: 'Hoteello', icon: <Building size={14} /> },
    { name: 'Bajaaj', icon: <Truck size={14} /> },
    { name: 'Eyl Tours', icon: <Camera size={14} /> },
    { name: 'Kiree Guri', icon: <Home size={14} /> },
    { name: 'Iibso Guri', icon: <Home size={14} /> },
    { name: 'Dhul/Boos', icon: <MapPin size={14} /> },
  ];

  // Dummy Data (Localized)
  const hotels = [
    { id: 1, name: 'Martisoor Hotel', location: '1st August, Garowe', price: '$40/habeen', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300&h=200', rating: 4.8 },
    { id: 2, name: 'Hodan Hotel', location: 'Hodan, Garowe', price: '$35/habeen', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=300&h=200', rating: 4.5 },
    { id: 3, name: 'Juba Hotel', location: 'Wadaaga, Garowe', price: '$50/habeen', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=300&h=200', rating: 4.7 },
  ];

  const rentals = [
    { id: 1, name: 'Dabaq Cusub', location: 'Hodan, Garowe', price: '$200/bishii', specs: '3 Qol • 2 Suuli', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 2, name: 'Guri Weyn', location: 'Waaberi', price: '$350/bishii', specs: '5 Qol • 3 Suuli', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=300&h=200' },
  ];

  const realEstate = [
    { id: 1, type: 'Boos Iib ah', size: 'Cabirka: 20x20m', location: 'New Garowe', price: '$8,000', verified: true, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 2, type: 'Guri Iib ah', size: 'Cabirka: 4 Qol', location: 'Hodon', price: '$45,000', verified: true, image: 'https://images.unsplash.com/photo-1600596542815-22b5c1275efb?auto=format&fit=crop&q=80&w=300&h=200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Header & Search */}
      <header className="bg-deep-blue text-white p-5 sticky top-0 z-50 rounded-b-3xl shadow-xl">
        {/* Top Bar: Brand, City, Language */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white text-deep-blue rounded-full flex items-center justify-center shadow-md">
              <span className="text-lg font-extrabold tracking-tighter">D</span>
            </div>
            <div>
               <h1 className="text-xl font-bold tracking-tight leading-none">DALMAR</h1>
               <div className="flex items-center text-xs text-white/80 cursor-pointer hover:text-white mt-0.5">
                  <MapPin size={10} className="mr-0.5"/>
                  <span>{currentCity}</span>
                  <ChevronDown size={10} className="ml-0.5"/>
               </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <button className="flex items-center bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm hover:bg-white/20 transition-all border border-white/10">
                <Globe size={12} className="mr-1.5"/>
                <span>{language === 'SO' ? 'Somali' : 'English'}</span>
             </button>
             <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Menu size={20} />
             </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border-none rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md text-sm"
            placeholder="Raadi hoteel, guri, boos..."
          />
        </div>

        {/* Categories / Filters */}
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setActiveFilter(filter.name)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                activeFilter === filter.name
                  ? 'bg-white text-deep-blue shadow-md border-white scale-105'
                  : 'bg-white/5 text-white/90 border-white/10 hover:bg-white/15'
              }`}
            >
              {filter.icon}
              <span>{filter.name}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="p-5 space-y-8">
        
        {/* Bajaaj Section - Localized */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Gaadiidka (Transport)</h2>
            <span className="text-[10px] font-bold text-deep-blue bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wide">Deg-deg</span>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-deep-blue rounded-3xl p-6 shadow-lg text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center mb-2 text-white/80 text-xs font-medium">
                 <MapPin size={12} className="mr-1"/> Goobta aad joogto
              </div>
              <h3 className="text-2xl font-bold mb-1">Dalbo Bajaaj</h3>
              <p className="text-white/70 text-sm mb-5">Qiimaha: $0.5 - $1.5</p>
              <button className="bg-white text-deep-blue px-6 py-3 rounded-xl font-bold text-sm shadow-xl hover:bg-gray-50 hover:scale-105 transition-all flex items-center">
                Dalbo Hada <ChevronRight size={16} className="ml-1"/>
              </button>
            </div>
            {/* Decorative Icon */}
            <Truck className="absolute -bottom-6 -right-6 w-40 h-40 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </section>

        {/* Accommodation Section - Localized */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Hoteello & Deganaansho</h2>
            <button className="text-xs text-deep-blue font-bold hover:underline">Arag Dhamaan</button>
          </div>
          <div className="flex space-x-5 overflow-x-auto pb-6 -mx-5 px-5 scrollbar-hide">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="min-w-[240px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                <div className="h-36 bg-gray-200 relative group">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center shadow-sm">
                    <Star size={10} className="text-amber-400 mr-1 fill-amber-400" />
                    <span className="text-xs font-extrabold text-gray-800">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{hotel.name}</h3>
                  <div className="flex items-center text-gray-500 text-xs mt-1.5 mb-3">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{hotel.location}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <span className="font-bold text-deep-blue text-sm">{hotel.price}</span>
                    <button className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors">Goobso</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real Estate Marketplace - Localized */}
        <section>
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Suuqa Guryaha & Dhulka</h2>
             <button className="text-xs text-deep-blue font-bold hover:underline">Arag Dhamaan</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {realEstate.map((item) => (
                 <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
                    <div className="h-32 bg-gray-200 relative">
                        <img src={item.image} alt={item.type} className="w-full h-full object-cover" />
                        {item.verified && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md flex items-center shadow-sm tracking-wider">
                                <CheckCircle size={10} className="mr-1" /> Saxan
                            </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-md">
                            {item.size.split(': ')[1]}
                        </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                         <h3 className="font-bold text-gray-900 text-sm">{item.type}</h3>
                         <p className="text-gray-500 text-xs mb-3 mt-1 flex-1">{item.location}</p>
                         <div className="mt-auto">
                            <span className="block font-bold text-deep-blue text-sm mb-2">{item.price}</span>
                            <button className="w-full py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors flex items-center justify-center">
                                <Phone size={12} className="mr-1.5" /> Wac Milkiilaha
                            </button>
                         </div>
                    </div>
                 </div>
             ))}
          </div>
        </section>

        {/* Eyl Tourism - Localized */}
        <section className="pb-4">
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Dalxiiska Eyl</h2>
          </div>
          <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative h-64 group isolate">
             <img src="https://plus.unsplash.com/premium_photo-1661962360803-3453b1b6c085?auto=format&fit=crop&q=80&w=600&h=300" alt="Eyl Beach" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
             
             <div className="absolute inset-0 flex flex-col items-start justify-end p-7">
                <div className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg mb-2 uppercase tracking-wide border border-white/10">Historical Site</div>
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Booqo Qalcadda Daawa</h3>
                <p className="text-gray-200 text-sm mb-5 max-w-xs font-medium">Ku raaxayso xeebta quruxda badan ee Eyl iyo taariikhda faca weyn.</p>
                <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold text-xs shadow-lg hover:bg-gray-100 transition-colors">
                    Arag Xirmooyinka
                </button>
             </div>
          </div>
        </section>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-end z-50 text-gray-400 pb- bezpieczne-area-inset-bottom">
          <button className="flex flex-col items-center text-deep-blue p-2">
            <Home size={24} className="mb-1" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Hoy</span>
          </button>
          <button className="flex flex-col items-center hover:text-deep-blue transition-colors p-2">
            <Search size={24} className="mb-1" />
            <span className="text-[10px] font-medium">Raadi</span>
          </button>
          <button className="flex flex-col items-center hover:text-deep-blue transition-colors p-2 relative -top-5">
            <div className="w-14 h-14 bg-deep-blue rounded-full border-[5px] border-gray-50 flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform bg-gradient-to-br from-deep-blue to-blue-900">
                 <Truck size={24} />
            </div>
          </button>
           <button className="flex flex-col items-center hover:text-deep-blue transition-colors p-2">
            <Building size={24} className="mb-1" />
            <span className="text-[10px] font-medium">Boosaska</span>
          </button>
           <button className="flex flex-col items-center hover:text-deep-blue transition-colors p-2">
            <Phone size={24} className="mb-1" />
            <span className="text-[10px] font-medium">Xiriir</span>
          </button>
      </nav>
    </div>
  );
};

export default HomePage;
