import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Hubi in xogtan ay u dhigantaa Supabase-kaaga
const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'GELI_ANON_KEY_GAAGA');

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchInitial();
    const channel = supabase.channel('realtime-bookings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, 
      (payload) => {
        setBookings((prev) => [payload.new, ...prev]);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2505/2505-preview.mp3');
        audio.play();
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fetchInitial = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
  };

  return (
    <div style={{ backgroundColor: '#0b0f1a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>Dalmar Admin 🚕</h2>
        <span style={{ backgroundColor: '#065f46', color: '#34d399', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>LIVE ON</span>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
          <div style={{ fontSize: '50px' }}>📡</div>
          <p>Sugaya dalabaadka cusub...</p>
        </div>
      ) : (
        bookings.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '20px', marginTop: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{item.phone}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>📍 {item.location}</p>
              </div>
              <span style={{ color: '#38bdf8', fontSize: '12px' }}>{new Date(item.created_at).toLocaleTimeString()}</span>
            </div>

            {/* Khariidad Bilaash ah (OpenStreetMap) */}
            <div style={{ width: '100%', height: '180px', borderRadius: '15px', marginTop: '15px', overflow: 'hidden', border: '1px solid #000' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.openstreetmap.org/export/embed.html?bbox=48.47,8.39,48.51,8.43&layer=mapnik&marker=8.4116,48.4918`}
                style={{ border: 0 }}
              ></iframe>
            </div>

            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`, '_blank')}
              style={{ width: '100%', backgroundColor: '#38bdf8', color: '#000', border: 'none', padding: '15px', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              FURI GOOGLE MAPS 🚗
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DriverDashboard;
