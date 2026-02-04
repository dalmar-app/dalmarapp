import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);

  const fetchOrders = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (data) setBookings(data);
  };

  useEffect(() => {
    fetchOrders();
    // REAL-TIME SUBSCRIPTION
    const sub = supabase.channel('any').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchOrders()).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Ma tirtirtaa?")) {
      await supabase.from('bookings').delete().eq('id', id);
      fetchOrders();
    }
  };

  const openMap = (lat, lng) => {
    if (!lat) return alert("GPS la'aan!");
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div style={styles.body}>
      <header style={{textAlign: 'center', marginBottom: '20px'}}>
        <h2 style={{color: '#38bdf8'}}>🛺 DARAWAL DASHBOARD</h2>
        <p>{bookings.length} Dalab ayaa yaalla</p>
      </header>

      {bookings.map(order => (
        <div key={order.id} style={styles.card}>
          <p>📞 <strong>Tel:</strong> {order.phone}</p>
          <div style={styles.grid}>
            <a href={`tel:${order.phone}`} style={styles.callBtn}>WAC</a>
            <button onClick={() => openMap(order.lat, order.lng)} style={styles.mapBtn}>MAP</button>
          </div>
          <button onClick={() => handleDelete(order.id)} style={styles.deleteBtn}>TIRTIR 🗑️</button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  body: { padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' },
  card: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
  callBtn: { backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' },
  mapBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' },
  deleteBtn: { width: '100%', padding: '10px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' }
};

export default DriverDashboard;
