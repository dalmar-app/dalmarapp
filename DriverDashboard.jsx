import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (data) setBookings(data);
    };

    fetchBookings();

    const subscription = supabase
      .channel('bookings-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
        setBookings((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Darawal: Dalabaadka Cusub</h1>
      {bookings.map((b) => (
        <div key={b.id} style={{ border: '2px solid #facc15', margin: '10px 0', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{color: '#facc15'}}>{b.customer_name || 'Macmiil aan magac lahayn'}</h3>
          <p>📞 {b.phone}</p>
          <p>📍 {b.location}</p>
          <button onClick={() => window.open(`tel:${b.phone}`)} style={{ padding: '10px', backgroundColor: '#facc15', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Wac Macmiilka</button>
        </div>
      ))}
    </div>
  );
};

export default DriverDashboard;

