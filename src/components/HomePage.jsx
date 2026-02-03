import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Xogtaada Supabase
const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const phoneNumber = "0906635679";

  const handleCall = async () => {
    // 1. Weydiisashada Location-ka Macaamiilka
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

        // 2. Xogta u dir Supabase (Tan ayaa darawalka u muuqan doonta)
        const { error } = await supabase.from('bookings').insert([
          { 
            phone: phoneNumber, 
            location: mapLink, // Halkan waxaa darawalka ugu dhacaya link-ga map-ka
            trip_type: 'Bajaaj' 
          }
        ]);

        if (error) console.error("Database error:", error);

        // 3. Markay xogtu baxdo, hadda wac
        window.location.href = `tel:${phoneNumber}`;
      }, (error) => {
        // Haddii uu qofku Location-ka diido, wicitaanka uun samee
        console.warn("Location denied");
        window.location.href = `tel:${phoneNumber}`;
      });
    } else {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#ffc107', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px' 
    }}>
      <div style={{ fontSize: '100px', marginBottom: '10px' }}>🚕</div>
      <h1 style={{ fontSize: '40px', fontWeight: '900', margin: '0 0 10px 0' }}>DALMAR</h1>
      <p style={{ fontSize: '18px', color: '#333', marginBottom: '30px', textAlign: 'center' }}>
        Ma u baahantahay Bajaaj degdeg ah? <br/> Guji batoonka hoose.
      </p>
      
      <button 
        onClick={handleCall}
        style={{
          backgroundColor: '#000',
          color: '#ffc107',
          border: 'none',
          padding: '20px 40px',
          borderRadius: '50px',
          fontSize: '22px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '300px'
        }}
      >
        📞 WAC HADDA
      </button>
      
      <p style={{ marginTop: '20px', fontSize: '12px', color: '#555' }}>
        * Markaad riixdo, ogolaaw "Share Location" si uu darawalku kuugu yimaado.
      </p>
    </div>
  );
};

export default HomePage;
