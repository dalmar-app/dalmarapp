import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [lastBookingCount, setLastBookingCount] = useState(0);

  // 1. Shaqada soo xigashada dalabaadka
  const fetchOrders = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) {
      // 2. DHAAWAQA OGEAYSIISKA: Haddii dalab cusub yimaado
      if (data.length > lastBookingCount) {
        playNotificationSound();
      }
      setBookings(data);
      setLastBookingCount(data.length);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    audio.play().catch(err => console.log("Audio play blocked by browser"));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Is-cusboonaysiin 5-tii ilbiriqsiba
    return () => clearInterval(interval);
  }, [lastBookingCount]);

  // 3. Shaqada Khariidada (Google Maps)
  const openGoogleMaps = (lat, lng) => {
    if (!lat || !lng) {
      alert("Macmiilkan ma soo dirin GPS-kiisa!");
      return;
    }
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  // 4. Shaqada Qabashada Dalabka
  const handleAccept = async (id) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'accepted' })
      .eq('id', id);
    
    if (!error) {
      alert("Dalabka waad aqbashay! Fadlan u tag macmiilka.");
      fetchOrders();
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <h2>Driver Dashboard 🚖</h2>
        <p style={{color: '#38bdf8'}}>{bookings.length} Dalab ayaa furan</p>
      </div>

      {bookings.length === 0 ? (
        <div style={styles.noOrders}>Hadda wax dalab ah ma jiraan...</div>
      ) : (
        bookings.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.info}>
              <p><strong>📞 Tel:</strong> {order.phone}</p>
              <p><strong>📍 Meesha:</strong> {order.city}</p>
              <p style={{fontSize: '11px', color: '#94a3b8'}}>Saacadda: {new Date(order.created_at).toLocaleTimeString()}</p>
            </div>

            <div style={styles.actionGrid}>
              {/* BATOONKA WICITAANKA */}
              <a href={`tel:${order.phone}`} style={styles.callBtn}>
                WAC MACMIILKA
              </a>
              
              {/* BATOONKA KHARIIDADA */}
              <button onClick={() => openGoogleMaps(order.lat, order.lng)} style={styles.mapBtn}>
                ARAG KHARIIDADA
              </button>
            </div>

            <button onClick={() => handleAccept(order.id)} style={styles.acceptBtn}>
              QABO DALABKA
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  body: { padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '20px' },
  card: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  info: { marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
  callBtn: { backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '12px' },
  mapBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' },
  acceptBtn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' },
  noOrders: { textAlign: 'center', marginTop: '50px', color: '#94a3b8' }
};

export default DriverDashboard;
