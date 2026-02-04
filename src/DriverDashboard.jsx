import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);

  // 1. Shaqada soo xigashada xogta
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setBookings(data);
    if (error) console.error("Error fetching:", error);
  };

  useEffect(() => {
    fetchOrders();

    // 2. REAL-TIME: Si dalabku ugu soo muuqdo mobile kasta isla markiiba
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        () => fetchOrders()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // 3. Shaqada Tirtirista (Delete)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Ma hubtaa inaad tirtirayso dalabkan?");
    if (confirmDelete) {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) alert("Cilad: " + error.message);
      else fetchOrders();
    }
  };

  const openMap = (lat, lng) => {
    if (!lat || !lng) return alert("GPS-ka macmiilka lama hayo!");
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div style={styles.body}>
      <style>
        {`
          @keyframes drive {
            0% { transform: translateX(-50px); }
            100% { transform: translateX(50px); }
          }
          .bajaaj { display: inline-block; animation: drive 2s infinite alternate; font-size: 40px; }
        `}
      </style>

      <header style={{textAlign: 'center', marginBottom: '30px'}}>
        <div className="bajaaj">🛺</div>
        <h2 style={{color: '#38bdf8'}}>DARAWAL DASHBOARD</h2>
        <p>{bookings.length} Dalab ayaa diyaar ah</p>
      </header>

      {bookings.length === 0 ? (
        <p style={{textAlign: 'center', color: '#475569'}}>Ma jiro dalab hadda...</p>
      ) : (
        bookings.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={{marginBottom: '15px'}}>
              <p>📞 <strong>Tel:</strong> {order.phone}</p>
              <p>📍 <strong>Magaalo:</strong> {order.city}</p>
              <p style={{fontSize: '11px', color: '#94a3b8'}}>{new Date(order.created_at).toLocaleTimeString()}</p>
            </div>

            <div style={styles.grid}>
              <a href={`tel:${order.phone}`} style={styles.callBtn}>WAC</a>
              <button onClick={() => openMap(order.lat, order.lng)} style={styles.mapBtn}>MAP</button>
            </div>

            {/* BATOONKA TIRTIRISTA */}
            <button onClick={() => handleDelete(order.id)} style={styles.deleteBtn}>
              TIRTIR DALABKAN 🗑️
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  body: { padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' },
  card: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
  callBtn: { backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' },
  mapBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  deleteBtn: { width: '100%', padding: '10px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }
};

export default DriverDashboard;
