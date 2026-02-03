import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [driverName, setDriverName] = useState('');

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

  // --- LOGIN-KA DHABTA AH (DB Check) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('Baarayaa...');

    const { data, error } = await supabase
      .from('drivers')
      .select('name')
      .eq('pin', pin)
      .single();

    if (data) {
      setDriverName(data.name);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('PIN-kaas ma diiwaangashna!');
      setPin('');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ma hubtaa inaad dhameeyay dalabkan?")) {
      await supabase.from('bookings').delete().eq('id', id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#ffc107', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', border: '3px solid #000' }}>
            <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#000' }}>D</span>
          </div>
          <h2 style={{ color: '#38bdf8', marginBottom: '10px' }}>Dalmar Driver</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Geli PIN-kaaga si aad u gasho</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" value={pin} onChange={(e) => setPin(e.target.value)}
              placeholder="Geli PIN-ka"
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '20px', textAlign: 'center', marginBottom: '15px', outline: 'none' }}
            />
            {loginError && <p style={{ color: loginError === 'Baarayaa...' ? '#38bdf8' : '#ef4444', fontSize: '14px', marginBottom: '15px' }}>{loginError}</p>}
            <button style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>GIRIK !</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '20px', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '18px' }}>Admin: {driverName}</h2>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Diiwaangashan</span>
        </div>
        <div style={{ color: '#34d399', fontSize: '12px', fontWeight: 'bold' }}>● LIVE</div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Inta kale ee koodhkii hore halkan ayay geli (Statistics iyo Bookings) */}
        <p style={{ opacity: 0.5 }}>Ku soo dhowaad, {driverName}. Waxaad hadda maamuli kartaa dalabaadka.</p>
        {/* ... (Halkan ku dar qaybta bookings-ka ee koodhkii hore) ... */}
      </div>
    </div>
  );
};

export default DriverDashboard;
