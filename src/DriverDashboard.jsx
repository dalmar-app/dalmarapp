import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', pin: '' });
  const [msg, setMsg] = useState('');
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('dalmar_user');
    if (saved) { setDriver(JSON.parse(saved)); setIsAuthenticated(true); }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const sub = supabase.channel('any')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
        .subscribe();
      return () => supabase.removeChannel(sub);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
  };

  // --- FUNCTION-KA MASAXIDDA (DHAMEEYAY) ---
  const handleComplete = async (id) => {
    const confirmDelete = window.confirm("Ma hubtaa in dalabkan uu dhammaaday oo aad tirtirayso?");
    if (confirmDelete) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) {
        alert("Cilad ayaa dhacday markii la tirtirayay!");
      } else {
        // Si degdeg ah looga saaro shaashadda adigoon refresh dhihin
        setBookings(bookings.filter(b => b.id !== id));
      }
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('Checking...');
    if (isRegistering) {
      const { data, error } = await supabase.from('drivers').insert([form]).select();
      if (error) setMsg('Nambarkan waa diiwaangashan yahay!');
      else { localStorage.setItem('dalmar_user', JSON.stringify(data[0])); setDriver(data[0]); setIsAuthenticated(true); }
    } else {
      const { data } = await supabase.from('drivers').select('*').eq('phone', form.phone).eq('pin', form.pin).single();
      if (data) { localStorage.setItem('dalmar_user', JSON.stringify(data)); setDriver(data); setIsAuthenticated(true); }
      else setMsg('Xogtu waa khalad!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
          <div style={{ width: '70px', height: '70px', backgroundColor: '#ffc107', borderRadius: '15px', margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '30px', border: '3px solid #000' }}>D</div>
          <h2 style={{ color: '#fff' }}>{isRegistering ? 'Abuur Account' : 'Darawal Gal'}</h2>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {isRegistering && <input type="text" placeholder="Magacaaga" onChange={(e) => setForm({...form, name: e.target.value})} style={s.input} required />}
            <input type="tel" placeholder="Teleefanka" onChange={(e) => setForm({...form, phone: e.target.value})} style={s.input} required />
            <input type="password" placeholder="PIN-kaaga" onChange={(e) => setForm({...form, pin: e.target.value})} style={s.input} required />
            <p style={{ color: '#ef4444', fontSize: '13px' }}>{msg}</p>
            <button style={s.btn}>{isRegistering ? 'DIIWAANGELI' : 'GAL'}</button>
          </form>
          <p onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#94a3b8', marginTop: '20px', cursor: 'pointer' }}>{isRegistering ? 'Account ma leedahay? Gal' : 'Account ma haysatid? Ku biir'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155' }}>
        <span>Walaal, <b>{driver?.name}</b></span>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Ka Bax</button>
      </header>

      <div style={{ padding: '20px' }}>
        {bookings.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '50px' }}>Ma jiraan dalabaad cusub...</p>
        ) : (
          bookings.map(b => (
            <div key={b.id} style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '18px' }}>📞 {b.phone}</span>
                {/* BATOONKA DHAMEEYAY OO SHAYGII MASAXAYA */}
                <button 
                  onClick={() => handleComplete(b.id)} 
                  style={{ backgroundColor: '#ef4444', border: 'none', color: '#fff', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                >
                  Dhameeyay
                </button>
              </div>
              <iframe 
                title={`map-${b.id}`} 
                width="100%" height="150" 
                style={{ borderRadius: '10px', border: '1px solid #000' }} 
                src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${b.location}`}
              ></iframe>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${b.location}`, '_blank')}
                style={{ width: '100%', marginTop: '10px', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}
              >
                HAGI (GOOGLE MAPS) 🚗
              </button>
            </div>
          ))
        )}
      </div>

      {/* COPYRIGHT SECTION - HADA KAASOO BAXAYA */}
      <footer style={{ padding: '30px 20px', textAlign: 'center', borderTop: '1px solid #334155', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', margin: 0, color: '#94a3b8' }}>© {new Date().getFullYear()} Ahmed Abdirisak. All Rights Reserved.</p>
        <p style={{ fontSize: '10px', marginTop: '5px', color: '#64748b', letterSpacing: '1px' }}>DEVELOPED BY AHMED</p>
      </footer>
    </div>
  );
};

const s = {
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center' },
  btn: { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }
};

export default DriverDashboard;
