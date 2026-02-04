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
    <div style={{padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif'}}>
      
      {/* CSS Animation loogu talagalay Bajaajta */}
      <style>
        {`
          @keyframes moveBajaaj {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          .road {
            width: 100%;
            height: 40px;
            position: relative;
            overflow: hidden;
            margin: 10px 0 20px 0;
            display: flex;
            align-items: center;
          }
          .bajaaj-icon {
            font-size: 30px;
            position: absolute;
            animation: moveBajaaj 15s infinite linear; /* Aad u slow ah */
          }
          .line {
            width: 100%;
            height: 1px;
            background: #1e293b;
            position: absolute;
            bottom: 5px;
          }
        `}
      </style>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2 style={{color: '#38bdf8', fontSize: '20px'}}>🛺 DARAWAL DASHBOARD</h2>
        <button 
          onClick={() => {localStorage.removeItem('driverAuth'); navigate('/driver-login');}} 
          style={{color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer'}}
        >
          LOGOUT
        </button>
      </div>

      {/* Qaybta Animation-ka Bajaajta */}
      <div className="road">
        <div className="bajaaj-icon">🛺</div>
        <div className="line"></div>
      </div>

      {orders.length === 0 ? (
        <p style={{textAlign: 'center', marginTop: '50px', color: '#475569'}}>Ma jiro dalab cusub hadda...</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155', boxShadow: '0 4px 6px rgba(0,0,0,0.2)'}}>
            <p style={{fontSize: '18px'}}>📞 <strong>Tel:</strong> {order.phone}</p>
            <p style={{fontSize: '14px', color: '#94a3b8', marginTop: '5px'}}>📍 <strong>Magaalada:</strong> {order.city}</p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px'}}>
              <a href={`tel:${order.phone}`} style={{backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold'}}>WAC</a>
              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${order.lat},${order.lng}`)} 
                style={{backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}
              >
                MAP
              </button>
            </div>
            
            <button 
              onClick={() => handleDelete(order.id)} 
              style={{width: '100%', marginTop: '10px', padding: '12px', backgroundColor: '#ef4444', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer'}}
            >
              TIRTIR DALABKA 🗑️
            </button>
          </div>
        ))
      )}

      <footer style={{textAlign: 'center', color: '#475569', marginTop: '40px', fontSize: '12px'}}>
        Designed by Eng Ahmed Abdirisak Ali <br/>
        <span style={{opacity: 0.6}}>© 2026 Dalmar App</span>
      </footer>
    </div>
  );
};

export default DriverDashboard;
