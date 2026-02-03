import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Xogtaada Supabase ee rasmiga ah
const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchInitial();

    // DHAGAYSI LIVE AH (REALTIME)
    const channel = supabase.channel('realtime-bookings')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'bookings' 
      }, (payload) => {
        setBookings((prev) => [payload.new, ...prev]);
        
        // Dhawaaq ogeysiis ah (BIIB!) marka dalab yimaado
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2505/2505-preview.mp3');
        audio.play().catch(e => console.log("Audio play failed", e));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchInitial = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.log("Error fetching:", error);
    setBookings(data || []);
  };

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      minHeight: '100vh', 
      padding: '20px', 
      fontFamily: '"Inter", sans-serif' 
    }}>
      {/* Header-ka Dashboard-ka */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #1e293b', 
        paddingBottom: '15px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '24px' }}>Dalmar Driver 🚖</h2>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Garoowe, Nugaal</p>
        </div>
        <div style={{ 
          backgroundColor: '#065f46', 
          color: '#34d399', 
          padding: '6px 15px', 
          borderRadius: '50px', 
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ height: '8px', width: '8px', backgroundColor: '#34d399', borderRadius: '50%' }}></span>
          LIVE ONLINE
        </div>
      </div>

      {/* List-ka Dalabaadka */}
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.6 }}>
          <div style={{ fontSize: '60px', marginBottom: '10px' }}>📡</div>
          <h3>Ma jiraan dalabaad hadda...</h3>
          <p>Iska deji, marka uu macaamiil soo waco halkan ayay ka soo muuqan doontaa.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {bookings.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#1e293b', 
              padding: '20px', 
              borderRadius: '24px', 
              border: '1px solid #334155',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ backgroundColor: '#38bdf8', padding: '10px', borderRadius: '12px', fontSize: '20px' }}>👤</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{item.phone}</h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Macaamiil Cusub</span>
                  </div>
                </div>
                <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '500' }}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '5px' }}>📍 Meesha uu joogo:</p>
                <div style={{ color: '#f1f5f9', fontWeight: '500' }}>{item.location}</div>
              </div>

              {/* Khariidadda (OpenStreetMap) */}
              <div style={{ 
                width: '100%', 
                height: '200px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid #000',
                marginBottom: '15px' 
              }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=48.47,8.39,48.51,8.43&layer=mapnik&marker=8.4116,48.4918`}
                  style={{ border: 0 }}
                  title="Location Map"
                ></iframe>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`, '_blank')}
                  style={{ 
                    flex: 1,
                    backgroundColor: '#38bdf8', 
                    color: '#0f172a', 
                    border: 'none', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: '0.3s'
                  }}
                >
                  FURI GOOGLE MAPS 🚗
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
