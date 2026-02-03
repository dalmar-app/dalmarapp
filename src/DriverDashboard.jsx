import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchInitial();

    const channel = supabase.channel('realtime-bookings')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'bookings' 
      }, (payload) => {
        setBookings((prev) => [payload.new, ...prev]);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2505/2505-preview.mp3');
        audio.play().catch(e => console.log("Audio play failed", e));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchInitial = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
  };

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      minHeight: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", sans-serif' 
    }}>
      
      {/* Header-ka Dashboard-ka */}
      <div style={{ 
        padding: '20px',
        borderBottom: '1px solid #1e293b',
        backgroundColor: '#1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🛺</span>
          <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '20px' }}>Dalmar Admin</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#34d399' }}>
          <span style={{ height: '8px', width: '8px', backgroundColor: '#34d399', borderRadius: '50%' }}></span>
          LIVE
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px', flex: 1 }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
            <div style={{ fontSize: '60px' }}>📡</div>
            <p>Ma jiraan dalabaad hadda...</p>
          </div>
        ) : (
          bookings.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#1e293b', 
              padding: '20px', 
              borderRadius: '20px', 
              marginBottom: '20px', 
              border: '1px solid #334155',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>📞 {item.phone}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Khariidadda (OpenStreetMap) */}
              <div style={{ width: '100%', height: '180px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #000', marginBottom: '15px' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=48.47,8.39,48.51,8.43&layer=mapnik&marker=${item.location}`}
                  style={{ border: 0 }}
                ></iframe>
              </div>

              <button 
                onClick={() => window.open(`http://maps.google.com/maps?q=${item.location}`, '_blank')}
                style={{ 
                  width: '100%', 
                  backgroundColor: '#38bdf8', 
                  color: '#0f172a', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer' 
                }}
              >
                HAGI (GOOGLE MAPS) 🚗
              </button>
            </div>
          ))
        )}
      </div>

      {/* Copyright Bottom */}
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        fontSize: '13px', 
        color: '#94a3b8', 
        backgroundColor: '#1e293b' 
      }}>
        © {new Date().getFullYear()} Ahmed Abdirisak. All Rights Reserved.
        <br />
        <span style={{ fontSize: '10px', opacity: 0.5, marginTop: '5px', display: 'block' }}>DEVELOPED BY AHMED</span>
      </div>
    </div>
  );
};

export default DriverDashboard;
