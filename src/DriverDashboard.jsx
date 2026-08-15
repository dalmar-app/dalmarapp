import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nfhzzympuvilshvxsnhd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT';

const supabase = createClient(supabaseUrl, supabaseKey);

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  
  const driverPhone = localStorage.getItem('driverPhone'); 
  const driverName = localStorage.getItem('driverName') || 'Darawal';
  const driverCity = localStorage.getItem('driverCity') || 'Garowe';

  // Isticmaalka useRef si loo xasuusto tiradii hore ee dalabyada
  const prevOrdersCount = useRef(0);

  // Shaqada soo saaraysa codka ogaysiiska (Web Audio API)
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log("Audio context error:", e);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('driverAuth') !== 'true') {
      navigate('/driver-login');
      return;
    }

    fetchOrders();

    // Real-time: Dhageyso dalabaadka cusub ama kuwa isbeddelaya
    const channel = supabase
      .channel('automatic-driver-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, driverPhone]);

  const fetchOrders = async () => {
    // 1. Soo qaado dhammaan dalabyada status-koodu yahay pending
    const { data: pendingData, error: pendingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (pendingError) {
      console.log("Error fetching orders:", pendingError.message);
    }

    // Shaandhee JavaScript si ay u soo qabato haddii driver_phone uu yahay null ama madhan
    const available = (pendingData || []).filter(
      order => !order.driver_phone || order.driver_phone === ''
    );

    // Haddii dalabyadu kordheen (dalab cusub soo galay), garaac codka ogaysiiska!
    if (available.length > prevOrdersCount.current && prevOrdersCount.current !== 0) {
      playNotificationSound();
    }
    prevOrdersCount.current = available.length;

    setAvailableOrders(available);

    // 2. Soo qaado dalabaadka uu darawalkan laftiisa gacanta ku hayo (Active Rides)
    const { data: myData } = await supabase
      .from('bookings')
      .select('*')
      .eq('driver_phone', driverPhone)
      .neq('status', 'completed')
      .order('created_at', { ascending: false });

    setMyOrders(myData || []);
  };

  // Darawalku wuxuu qaadanayaa dalabka
  const acceptOrder = async (orderId) => {
    const { error } = await supabase
      .from('bookings')
      .update({ driver_phone: driverPhone, status: 'accepted' })
      .eq('id', orderId);

    if (error) {
      alert("Cilad ayaa dhacday: " + error.message);
    } else {
      alert("Hambalyo! Si guul leh ayaad u qaadatay dalabkan.");
      fetchOrders();
    }
  };

  const completeOrder = async (id) => {
    if (window.confirm("Ma xaqiijinaysaa in safarkii la dhammeeyay?")) {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', id);
        
      if (!error) {
        fetchOrders();
      } else {
        alert("Cilad ayaa dhacday.");
      }
    }
  };

  return (
    <div style={{padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif'}}>
      
      {/* Header-ka Dashboard-ka */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px'}}>
        <div>
          <h2 style={{color: '#38bdf8', margin: 0, fontSize: '18px'}}>🚖 {driverName}</h2>
          <span style={{fontSize: '12px', color: '#22c55e'}}>● Online ({driverCity})</span>
        </div>
        <button 
          onClick={() => { localStorage.clear(); navigate('/'); }} 
          style={{color: '#ef4444', background: 'none', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}
        >
          LOGOUT
        </button>
      </div>

      {/* DALABAADKA UU DARAWALKAN HADA WADO (ACTIVE RIDES) */}
      {myOrders.length > 0 && (
        <div style={{marginBottom: '30px'}}>
          <h3 style={{fontSize: '16px', color: '#22c55e', marginBottom: '10px'}}>🟢 Safarkaaga Aqoonsan:</h3>
          {myOrders.map(order => (
            <div key={order.id} style={{backgroundColor: '#064e3b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #059669'}}>
              <p style={{fontSize: '18px', margin: '0 0 10px 0'}}>📞 Macmiilka: <strong>{order.phone}</strong></p>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px'}}>
                <a href={`tel:${order.phone}`} style={{backgroundColor: '#22c55e', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold'}}>WAC MACMIILKA</a>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps?q=${order.lat},${order.lng}`, '_blank')} 
                  style={{backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}
                >
                  MAP 📍
                </button>
              </div>
              
              <button 
                onClick={() => completeOrder(order.id)} 
                style={{width: '100%', marginTop: '15px', padding: '12px', backgroundColor: '#eab308', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}
              >
                DHAMAYSTIR SAFARKA ✅
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DALABAADKA SUUQA / CUSUB EE SOO GALAY */}
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>📡 Dalabyada cusub ee la heli karo:</h3>

      {availableOrders.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '40px', backgroundColor: '#1e293b', padding: '30px', borderRadius: '15px'}}>
          <p style={{color: '#94a3b8', margin: 0}}>Hadda ma jiraan dalabyo sugaya darawal.</p>
        </div>
      ) : (
        availableOrders.map(order => (
          <div key={order.id} style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #334155'}}>
            <p style={{fontSize: '16px', margin: '0 0 10px 0'}}>📞 Tel: <strong>{order.phone}</strong></p>
            <p style={{fontSize: '13px', color: '#94a3b8', margin: '0 0 15px 0'}}>Magaalada: {order.city}</p>
            
            {/* Badhanka Map-ka ee dalabka cusub */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${order.lat},${order.lng}`, '_blank')} 
                style={{backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'}}
              >
                FIIRI MAP-KA 📍
              </button>
              <a href={`tel:${order.phone}`} style={{backgroundColor: '#334155', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>WAC 📞</a>
            </div>

            <button 
              onClick={() => acceptOrder(order.id)} 
              style={{width: '100%', padding: '14px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'}}
            >
              QAADO DALABKAN 🚖
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DriverDashboard;
