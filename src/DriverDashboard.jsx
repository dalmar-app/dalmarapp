import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('driverAuth') !== 'true') {
      navigate('/driver-login');
    }
    fetchOrders();
    const sub = supabase.channel('any').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchOrders()).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ma tirtirtaa dalabkan?")) {
      await supabase.from('bookings').delete().eq('id', id);
      fetchOrders();
    }
  };

  return (
    <div style={{padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white'}}>
      <h2 style={{color: '#38bdf8'}}>🛺 DARAWAL DASHBOARD</h2>
      <button onClick={() => {localStorage.removeItem('driverAuth'); navigate('/driver-login');}} style={{color: '#ef4444', background: 'none', border: 'none', float: 'right'}}>LOGOUT</button>
      
      {orders.map(order => (
        <div key={order.id} style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginTop: '15px', border: '1px solid #334155'}}>
          <p>📞 <strong>Tel:</strong> {order.phone}</p>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px'}}>
            <a href={`tel:${order.phone}`} style={{backgroundColor: '#22c55e', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none'}}>WAC</a>
            <button onClick={() => window.open(`https://www.google.com/maps?q=${order.lat},${order.lng}`)} style={{backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px'}}>MAP</button>
          </div>
          <button onClick={() => handleDelete(order.id)} style={{width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px'}}>TIRTIR</button>
        </div>
      ))}
    </div>
  );
};

export default DriverDashboard;
