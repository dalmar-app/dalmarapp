import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Hubi in xogtan ay la mid tahay tan Admin-kaaga
const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const Login = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Halkan waxaan ka baaraynaa Supabase haddii PIN-ku jiro
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('pin', pin)
      .single();

    if (data) {
      // Haddii PIN-ku sax yahay
      localStorage.setItem('driverAuth', 'true');
      localStorage.setItem('driverCity', data.city); // Magaalada darawalka ayuu xasuusanayaa
      navigate('/drivers');
    } else {
      // Haddii PIN-ka la waayo ama uu khaldan yahay
      alert("PIN-ka darawalku waa khaldan yahay!");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={{color: '#38bdf8', fontSize: '24px'}}>DALMAR 🛺</h1>
        <h2 style={{fontSize: '18px', marginBottom: '20px'}}>DRIVER LOGIN</h2>
        
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Gali PIN-kaaga (4 Digits)" 
            value={pin}
            onChange={(e) => setPin(e.target.value)} 
            style={styles.input} 
            maxLength="4"
            required
          /> 
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Checking..." : "GALA"}
          </button>
        </form>
        
        <p style={{fontSize: '12px', marginTop: '15px', color: '#94a3b8'}}>
          Haddii aad PIN-ka qalday la xiriir Admin-ka.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#0f172a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' },
  loginBox: { padding: '30px', border: '1px solid #334155', borderRadius: '25px', backgroundColor: '#1e293b', width: '320px' },
  input: { padding: '15px', borderRadius: '12px', marginBottom: '15px', width: '100%', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', textAlign: 'center', fontSize: '18px' },
  btn: { padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '12px', fontWeight: 'bold', width: '100%', cursor: 'pointer', color: '#0f172a' }
};

export default Login;
