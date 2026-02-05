import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const driverName = localStorage.getItem('driverName') || 'Darawal';

  useEffect(() => {
    // 1. Amniga: Hubi in qofka soo galay uu yahay darawal sax ah
    if (localStorage.getItem('driverAuth') !== 'true') {
      navigate('/driver-login');
    }

    fetchOrders();

    // 2. Real-time Listen: Markuu dalab cusub soo dhaco
    const channel = supabase
      .channel('driver-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          fetchOrders();
          // Halkan waxaad ku dari kartaa dhawaaq: new Audio('/notification.mp3').play();
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'bookings' },
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
    
    if (!error) setOrders(data || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ma tirtirtaa dalabkan markaad dhamaystirto?")) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) fetchOrders();
    }
  };

  return (
    <div style={{padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif'}}>
      
      {/* Header-ka Dashboard-ka */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px'}}>
        <div>
          <h2 style={{color: '#38bdf8', margin: 0, fontSize: '18px'}}>🛺 {driverName}</h2>
          <span style={{fontSize: '12px', color: '#22c55e'}}>Online & Diyaar</span>
        </div>
        <button 
          onClick={() => {
            localStorage.clear(); // Wax walba masax markuu Logout dhaho
            navigate('/');
          }} 
          style={{color: '#ef4444', background: 'none', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}
        >
          LOGOUT
        </button>
      </div>

      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Dalabyada yaalla:</h3>

      {orders.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '100px'}}>
          <p style={{color: '#94a3b8'}}>Hadda wax dalab ah ma jiraan.</p>
          <p style={{fontSize: '12px', color: '#475569'}}>App-ka ha xirin si aad dalab u hesho...</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <p style={{fontSize: '18px', margin: 0}}>📞 <strong>{order.phone}</strong></p>
              <span style={{fontSize: '11px', backgroundColor: '#334155', padding: '3px 8px', borderRadius: '5px'}}>{order.city}</span>
            </div>
            
            <p style={{fontSize: '11px', color: '#94a3b8', marginTop: '5px'}}>
              Saacadda: {new Date(order.created_at).toLocaleTimeString()}
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px'}}>
              <a href={`tel:${order.phone}`} style={{backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold'}}>WAC</a>
              
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${order.lat},${order.lng}`, '_blank')} 
                style={{backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}
              >
                MAP 📍
              </button>
            </div>
            
            <button 
              onClick={() => handleDelete(order.id)} 
              style={{width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'}}
            >
              DHAMAYSTIR (TIRTIR)
            </button>
          </div>
        ))
      )}

      {/* Footer Navigation (Optional) */}
      <div style={{position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: '90%'}}>
         <button onClick={() => navigate('/')} style={{width: '100%', padding: '10px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', borderRadius: '10px', fontSize: '12px'}}>
           Gudbi Bogga Hore (Macaamiisha)
         </button>
      </div>
    </div>
  );
};

export default DriverDashboard;
