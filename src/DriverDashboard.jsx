import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [lastCount, setLastCount] = useState(0);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) {
      if (data.length > lastCount) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.play().catch(() => console.log("Audio blocked"));
      }
      setBookings(data);
      setLastCount(data.length);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [lastCount]);

  const openMap = (lat, lng) => {
    if (!lat || !lng) {
      alert("Macmiilkan ma soo dirin GPS-kiisa!");
      return;
    }
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleAccept = async (id) => {
    const { error } = await supabase.from('bookings').update({ status: 'accepted' }).eq('id', id);
    if (!error) {
      alert("Dalabka waad aqbashay!");
      fetchOrders();
    }
  };

  return (
    <div style={styles.body}>
      {/* --- QAYBTA ANIMATION-KA CSS --- */}
      <style>
        {`
          @keyframes driveBajaaj {
            0% { transform: translateX(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100px); opacity: 0; }
          }
          .bajaaj-animation {
            display: inline-block;
            animation: driveBajaaj 3s infinite linear;
            font-size: 50px;
            filter: drop-shadow(0 0 10px #38bdf8);
          }
          .header-container {
            overflow: hidden; /* Si aysan bajaajta banaanka ugu bixin */
            width: 100%;
            text-align: center;
            padding: 20px 0;
          }
        `}
      </style>

      <header className="header-container">
        {/* ICON-KA BAJAAJTA EE SOCOTA */}
        <div className="bajaaj-animation">🛺</div>
        <h2 style={{color: '#38bdf8', marginTop: '10px'}}>DARAWAL DASHBOARD</h2>
        <p style={{color: '#94a3b8'}}>{bookings.length} Dalab ayaa furan hadda</p>
      </header>

      {bookings.length === 0 ? (
        <div style={styles.empty}>
           <p>Ma jiro dalab cusub hadda...</p>
           <div style={{fontSize: '80px', opacity: 0.1}}>🛺</div>
        </div>
      ) : (
        bookings.map(order => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.details}>
              <p><strong>📞 Tel:</strong> {order.phone}</p>
              <p><strong>📍 Magaalada:</strong> {order.city}</p>
              <p style={{fontSize: '12px', color: '#94a3b8'}}>
                {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>

            <div style={styles.grid}>
              <a href={`tel:${order.phone}`} style={styles.callBtn}>WAC MACMIILKA</a>
              <button onClick={() => openMap(order.lat, order.lng)} style={styles.mapBtn}>ARAG KHARIIDADA</button>
            </div>

            <button onClick={() => handleAccept(order.id)} style={styles.acceptBtn}>QABO DALABKA</button>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  body: { padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' },
  orderCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
  details: { marginBottom: '15px', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
  callBtn: { backgroundColor: '#22c55e', color: 'white', padding: '15px', borderRadius: '10px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' },
  mapBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  acceptBtn: { width: '100%', padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', color: '#0f172a' },
  empty: { textAlign: 'center', marginTop: '100px', color: '#475569' }
};

export default DriverDashboard;
