import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const HomePage = () => {
  const phoneNumber = "0906635679";

  const handleCall = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coordString = `${lat},${lng}`;

          await supabase.from('bookings').insert([
            { phone: phoneNumber, location: coordString, trip_type: 'Bajaaj' }
          ]);

          window.location.href = `tel:${phoneNumber}`;
        },
        async (error) => {
          await supabase.from('bookings').insert([
            { phone: phoneNumber, location: "Location Wali waa Diidmo", trip_type: 'Bajaaj' }
          ]);
          window.location.href = `tel:${phoneNumber}`;
        },
        options
      );
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
      justifyContent: 'space-between', // Tan waxay copyright-ka dhigaysaa hoos
      fontFamily: 'sans-serif',
      padding: '40px 20px' 
    }}>
      {/* Qaybta Dhexe */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
        {/* Icon-ka Bajaajta */}
        <div style={{ fontSize: '100px', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))' }}>🛺</div>
        
        <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#000', margin: '10px 0', letterSpacing: '2px' }}>DALMAR</h1>
        <p style={{ fontSize: '18px', color: '#333', marginBottom: '30px', textAlign: 'center', fontWeight: '500' }}>
          Adeeg hufan iyo Bajaaj degdeg ah
        </p>

        <button 
          onClick={handleCall}
          style={{ 
            backgroundColor: '#000', 
            color: '#ffc107', 
            padding: '22px 50px', 
            borderRadius: '50px', 
            border: 'none', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            transition: 'transform 0.2s'
          }}
          onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          📞 WAC HADDA
        </button>

        <p style={{ marginTop: '25px', fontSize: '13px', color: '#444', textAlign: 'center', maxWidth: '250px', lineHeight: '1.5' }}>
          Fadlan dooro <b>"Allow"</b> marka lagu weydiiyo location-ka si darawalku kuu helo.
        </p>
      </div>

      {/* Qaybta Xuquuqda (Copyright) */}
      <div style={{ textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', width: '100%', paddingTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#000', fontWeight: '600', margin: 0 }}>
          © {new Date().getFullYear()} Ahmed Abdirisak. All Rights Reserved.
        </p>
        <p style={{ fontSize: '11px', color: '#555', marginTop: '5px', letterSpacing: '1px' }}>
          DEVELOPED BY AHMED
        </p>
      </div>
    </div>
  );
};

export default HomePage;
