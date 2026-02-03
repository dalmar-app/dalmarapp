import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. Supabase Connection
const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // 2. Real-time Listener & Initial Fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchInitial();
      const channel = supabase.channel('realtime-bookings')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, 
        (payload) => {
          setBookings((prev) => [payload.new, ...prev]);
          new Audio('https://assets.mixkit.co/active_storage/sfx/2505/2505-preview.mp3').play().catch(() => {});
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookings' }, 
        (payload) => {
          setBookings((prev) => prev.filter(item => item.id !== payload.old.id));
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [isAuthenticated]);

  const fetchInitial = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
  };

  // 3. Functions
  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '2026') { // Pin-kaaga sirta ah
      setIsAuthenticated(true);
    } else {
      setLoginError('Pin-ka waa khalad!');
      setPin('');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ma hubtaa inaad dhameeyay dalabkan?")) {
      await supabase.from('bookings').delete().eq('id', id);
    }
  };

  // --- BOGGA LOGIN-KA ---
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '350px', textAlign: 'center', border: '1px solid #334155' }}>
          
          {/* DALMAR LOGO DESIGN */}
          <div style={{ 
            width: '80px', height: '80px', backgroundColor: '#ffc107', borderRadius: '20px', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)', border: '3px solid #000'
          }}>
            <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#000' }}>D</span>
          </div>

          <h2 style={{ color: '#38bdf8', margin: '0 0 10px 0' }}>Dalmar Driver</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Geli Pin-ka si aad u gasho</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" value={pin} onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', marginBottom: '15px', outline: 'none' }}
            />
            {loginError && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{loginError}</p>}
            <button style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}>GIRIK !</button>
          </form>
        </div>
      </div>
    );
  }

  // --- BOGGA DASHBOARD-KA ---
  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '20px', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', backgroundColor: '#ffc107', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #000' }}>
            <span style={{ color: '#000', fontWeight: 'bold', fontSize: '18px' }}>D</span>
          </div>
          <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '18px' }}>Dalmar Admin</h2>
        </div>
        <div style={{ color: '#34d399', fontSize: '12px', fontWeight: 'bold' }}>● LIVE</div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', border: '1px solid #334155', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Dalabaadka</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#34d399' }}>{bookings.length}</h3>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', border: '1px solid #334155', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Shaqada</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#38bdf8' }}>Online</h3>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', opacity: 0.5 }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>📡</div>
            <p>Ma jiraan dalabaad hadda...</p>
          </div>
        ) : (
          bookings.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '24px', marginBottom: '20px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>📞 {item.phone}</span>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  DHAMEEYAY
                </button>
              </div>

              {/* Map */}
              <div style={{ width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #000', marginBottom: '15px' }}>
                <iframe 
                  title="map"
                  width="100%" height="100%" 
                  src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${item.location}`}
                  style={{ border: 0 }}
                ></iframe>
              </div>

              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${item.location}`, '_blank')}
                style={{ width: '100%', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                HAGI (GOOGLE MAPS) 🚗
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer / Copyright */}
      <div style={{ padding: '30px 20px', textAlign: 'center', borderTop: '1px solid #334155', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', margin: 0, color: '#94a3b8' }}>© {new Date().getFullYear()} Ahmed Abdirisak. All Rights Reserved.</p>
        <p style={{ fontSize: '10px', marginTop: '5px', color: '#64748b', letterSpacing: '1px' }}>DEVELOPED BY AHMED</p>
        
        {/* Support Button for Somtel presentation */}
        <button 
          onClick={() => window.location.href = 'tel:0906635679'}
          style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#34d399', border: '1px solid #34d399', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px' }}
        >
          📞 Somtel Support Center
        </button>
      </div>
    </div>
  );
};

export default DriverDashboard;
