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
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, 
      (payload) => {
        setBookings((prev) => [payload.new, ...prev]);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2505/2505-preview.mp3').play().catch(e => {});
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookings' }, 
      (payload) => {
        // Marka xog laga tirtiro database-ka, Dashboard-kana ka saar
        setBookings((prev) => prev.filter(item => item.id !== payload.old.id));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchInitial = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
  };

  // Shaqada Tirtirka (Delete Function)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Ma hubtaa inaad dhameeyay dalabkan oo aad tirtirayso?");
    if (confirmDelete) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) alert("Wuu diiday tirtirka: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>🛺 Dalmar Admin</h2>
        <span style={{ color: '#34d399', fontSize: '12px' }}>● LIVE</span>
      </div>

      <div style={{ padding: '20px' }}>
        {bookings.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>Ma jiraan dalabaad hadda...</p> : 
          bookings.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '20px', marginBottom: '20px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>📞 {item.phone}</span>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  DHAMEEYAY (X)
                </button>
              </div>

              <div style={{ width: '100%', height: '180px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #000', marginBottom: '15px' }}>
                <iframe 
                  width="100%" height="100%" 
                  src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${item.location}`}
                  style={{ border: 0 }}
                ></iframe>
              </div>

              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${item.location}`, '_blank')}
                style={{ width: '100%', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                HAGI (GOOGLE MAPS) 🚗
              </button>
            </div>
          ))
        }
      </div>

      <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        © {new Date().getFullYear()} Ahmed Abdirisak. All Rights Reserved.
      </div>
    </div>
  );
};

export default DriverDashboard;
