import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('URL_KAAGA', 'KEY_GAAGA');

const DriverPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase.from('bookings').select('*').eq('status', 'pending');
      setBookings(data || []);
    };
    fetchBookings();
  }, []);

  const openMap = (lat, lng) => {
    // Waxay furaysaa Google Maps-ka taleefanka si toos ah
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div style={styles.body}>
      <h3>Soo dhowow Darawal! 👋</h3>
      <p>Dalabaadka ka furan magaaladaada:</p>

      {bookings.map(order => (
        <div key={order.id} style={styles.orderCard}>
          <p><strong>📞 Macmiilka:</strong> {order.phone}</p>
          <p>📍 Meesha: {order.city}</p>

          <div style={styles.actionGrid}>
            {/* Batoonka Wicitaanka Tooska ah */}
            <a href={`tel:${order.phone}`} style={styles.callBtn}>
               WAC MACMIILKA
            </a>

            {/* Batoonka Khariidada (GPS) */}
            <button onClick={() => openMap(order.lat, order.lng)} style={styles.mapBtn}>
               ARAG KHARIIDADA
            </button>
          </div>

          <button style={styles.acceptBtn}>QABO DALABKA</button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  body: { padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' },
  orderCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
  callBtn: { backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' },
  mapBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  acceptBtn: { width: '100%', padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold' }
};

export default DriverPage;
