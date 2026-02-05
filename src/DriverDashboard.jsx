import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Hubi in URL-ka iyo Key-ga ay sax yihiin
const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // 1. Hubi in darawalku login yahay
    if (localStorage.getItem('driverAuth') !== 'true') {
      navigate('/driver-login');
    }

    fetchOrders();

    // 2. Real-time: In dalabku isla markiiba soo muuqdo isagoon refresh la dhihib
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ma tirtirtaa dalabkan markaad dhamaystirto?")) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) fetchOrders();
    }
  };

  return (
    <div style={{padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{color: '#38bdf8', margin: 0}}>🛺 DALABYADA CUSUB</h2>
        <button 
          onClick={() => {localStorage.removeItem('driverAuth'); navigate('/driver-login');}} 
          style={{color: '#ef4444', background: '#1e293b', padding: '8px 15px', borderRadius: '8px', border: '1px solid #ef4444', cursor: 'pointer'}}
        >
          LOGOUT
        </button>
      </div>
      
      {orders.length === 0 ? (
        <p style={{textAlign: 'center', marginTop: '50px', color: '#94a3b8'}}>Ma jiraan dalabyo hadda furan...</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
            <p style={{fontSize: '18px', margin: '0 0 10px 0'}}>📞 <strong>Tel:</strong> {order.phone}</p>
            <p style={{fontSize: '12px', color: '#94a3b8'}}>Waqtiga: {new Date(order.created_at).toLocaleString()}</p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px'}}>
              <a href={`tel:${order.phone}`} style={{backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold'}}>WAC</a>
              
              {/* SAXIDDA MAP-KA: Google Maps link sax ah */}
              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${order.lat},${order.lng}`, '_blank')} 
                style={{backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}
              >
                MAP 📍
              </button>
            </div>
            
            <button 
              onClick={() => handleDelete(order.id)} 
              style={{width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
            >
              DHAMAYSTIR (TIRTIR)
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DriverDashboard;
