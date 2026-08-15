import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nfhzzympuvilshvxsnhd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT';

const supabase = createClient(supabaseUrl, supabaseKey);

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  // Hel xogta darawalka oo laga soo qaatay localStorage
  const driverPhone = localStorage.getItem('driverPhone'); 
  const driverName = localStorage.getItem('driverName') || 'Darawal';

  useEffect(() => {
    // Hubi in darawalku login yahay
    if (localStorage.getItem('driverAuth') !== 'true') {
      navigate('/driver-login');
      return;
    }

    // Soo qaado dalabyada marka uu boggu furmo
    fetchDriverOrders();

    // Ku xir Real-time updates si marka dalab cusub yimaado loogu wargeliyo
    const channel = supabase
      .channel('driver-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings', filter: `driver_phone=eq.${driverPhone}` },
        (payload) => {
          // Dhawaaq marka dalab cusub yimaado
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
          audio.play().catch(e => console.log("Audio play prevented"));
          fetchDriverOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, driverPhone]);

  const fetchDriverOrders = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('driver_phone', driverPhone)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ma xaqiijinaysaa in dalabkan la dhamaystiray?")) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) {
        fetchDriverOrders();
      } else {
        alert("Waa dhacday khalad markii la tirtirayey.");
      }
    }
  };

  return (
    <div style={{padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif'}}>
      
      {/* Header-ka Dashboard-ka */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px'}}>
        <div>
          <h2 style={{color: '#38bdf8', margin: 0, fontSize: '18px'}}>🛺 {driverName}</h2>
          <span style={{fontSize: '12px', color: '#22c55e'}}>● Online & Diyaar</span>
        </div>
        <button 
          onClick={() => { localStorage.clear(); navigate('/'); }} 
          style={{color: '#ef4444', background: 'none', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}
        >
          LOGOUT
        </button>
      </div>

      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Dalabyada yaalla:</h3>

      {orders.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '100px'}}>
          <p style={{color: '#94a3b8'}}>Hadda wax dalab ah oo laguugu talagalay ma jiraan.</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <p style={{fontSize: '18px', margin: 0}}>📞 <strong>{order.phone}</strong></p>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px'}}>
              <a href={`tel:${order.phone}`} style={{backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold'}}>WAC</a>
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
