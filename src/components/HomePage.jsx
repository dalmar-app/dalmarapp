import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const phoneNumber = "0906635679";

  const sendBooking = async (locDescription) => {
    const { error } = await supabase.from('bookings').insert([
      { 
        phone: '0906635679', 
        location: locDescription,
        trip_type: 'Bajaaj' 
      }
    ]);
    if (error) console.error("Supabase Error:", error);
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleCall = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Haddii uu ogolaado, xogta saxda ah u dir
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          sendBooking(coords);
        },
        (error) => {
          // Haddii uu diido, u sheeg darawalka inaan la helin location-ka
          console.warn("Location denied:", error);
          sendBooking("Location Diidmo (Garoowe)");
        },
        { timeout: 10000 }
      );
    } else {
      sendBooking("Browser-ka ma taageero GPS");
    }
  };

  return (
    <div style={{ backgroundColor: '#ffc107', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '50px', fontWeight: 'bold' }}>DALMAR 🚕</h1>
      <button 
        onClick={handleCall}
        style={{ backgroundColor: '#000', color: '#ffc107', padding: '25px 50px', borderRadius: '50px', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
      >
        📞 WAC HADDA
      </button>
      <p style={{ marginTop: '20px' }}>Markaad riixdo, ogolaaw Location-ka</p>
    </div>
  );
};

export default HomePage;
