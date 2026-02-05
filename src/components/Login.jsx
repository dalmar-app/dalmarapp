import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT');

const UnifiedLogin = () => {
  const [userInput, setUserInput] = useState(''); 
  const [pinInput, setPinInput] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    // 1. Hubi haddii uu yahay Admin
    if (userInput.toLowerCase() === 'ahmed' && pinInput === '2003') {
      localStorage.setItem('adminAuth', 'true');
      return navigate('/admin-panel');
    }

    // 2. Hubi haddii uu yahay Darawal
    const { data: driver, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('pin', pinInput)
      .single();

    if (driver) {
      // --- HALKAN AYAA ISBEDELKA LAGU DARAY ---
      if (driver.is_paid === false) {
        alert("ACCOUNT-KAAGA WAA XIRAN YAHAY! ❌\nFadlan bixi lacagta ka dibna la xiriir maamulka.");
        return; // Halkan ayuu ku joogsanayaa, Dashboard-ka ma geynayo
      }
      // ---------------------------------------

      localStorage.setItem('driverAuth', 'true');
      // Waxaan u baahanahay inaan xogta oo dhan keydino si Dashboard-ku u ogaado darawalka
      localStorage.setItem('dalmar_driver', JSON.stringify(driver));
      localStorage.setItem('driverName', driver.name);
      navigate('/driver-dashboard');
    } else {
      alert("PIN-ka ama Magaca waa khaldan yahay!");
    }
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '25px', textAlign: 'center', border: '1px solid #334155', width: '320px' }}>
        <h2 style={{ color: '#38bdf8' }}>🔐 LOGIN</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Gali macluumaadkaaga</p>
        <form onSubmit={handleAuth}>
          <input 
            type="text" placeholder="Magaca (Hadii aad Admin tahay)" 
            value={userInput} onChange={(e) => setUserInput(e.target.value)} 
            style={styles.input} 
          />
          <input 
            type="password" placeholder="PIN-kaaga" 
            value={pinInput} onChange={(e) => setPinInput(e.target.value)} 
            style={styles.input} required 
          />
          <button type="submit" style={styles.btn}>GASHLO SYSTEM-KA</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }
};

export default UnifiedLogin;
