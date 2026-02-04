import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const AdminPanel = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPin, setAdminPin] = useState('');
  
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', pin: '', city: 'Garowe' });
  const somaliCities = ["Garowe", "Galkacyo", "Muqdisho", "Beledweyne", "Kismaayo", "Eyl", "Baydhabo"];

  // 1. Xaqiijinta Login-ka Admin-ka
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === "Ahmed" && adminPin === "2003") {
      setIsAdminLoggedIn(true);
      fetchData();
    } else {
      alert("Magaca ama PIN-ka Admin-ka waa khaldan yahay!");
    }
  };

  const fetchData = async () => {
    const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    const { data: dData } = await supabase.from('drivers').select('*');
    setBookings(bData || []);
    setDrivers(dData || []);
  };

  const addDriver = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('drivers').insert([newDriver]);
    if (!error) {
      alert("Darawal cusub waa la diiwaangeliyey!");
      setNewDriver({ name: '', phone: '', pin: '', city: 'Garowe' });
      fetchData();
    } else {
      alert("Cilad: " + error.message);
    }
  };

  // --- BOGGA LOGIN-KA ADMIN-KA ---
  if (!isAdminLoggedIn) {
    return (
      <div style={styles.loginOverlay}>
        <div style={styles.loginCard}>
          <h2 style={{color: '#38bdf8', marginBottom: '20px'}}>🔐 Admin Access</h2>
          <form onSubmit={handleAdminLogin}>
            <input 
              type="text" 
              placeholder="Admin Name" 
              value={adminUser} 
              onChange={(e) => setAdminUser(e.target.value)} 
              style={styles.input}
              required
            />
            <input 
              type="password" 
              placeholder="Admin PIN" 
              value={adminPin} 
              onChange={(e) => setAdminPin(e.target.value)} 
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btn}>GASHLO SYSTEM-KA</button>
          </form>
          <p style={{color: '#64748b', fontSize: '12px', marginTop: '15px'}}>Kaliya Ahmed ayaa geli kara qaybtan.</p>
        </div>
      </div>
    );
  }

  // --- BOGGA ADMIN-KA (MARKUU LOGIN SAMEEYO) ---
  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{ color: '#38bdf8' }}>DALMAR ADMIN CONTROL</h1>
        <button onClick={() => setIsAdminLoggedIn(false)} style={styles.logoutBtn}>XIR (LOGOUT)</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <section style={styles.sectionCard}>
          <h3>➕ Diiwaangeli Darawal Cusub</h3>
          <form onSubmit={addDriver}>
            <input type="text" placeholder="Magaca" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Tel (666635679)" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="PIN (1234)" value={newDriver.pin} onChange={e => setNewDriver({...newDriver, pin: e.target.value})} style={styles.input} required />
            <select value={newDriver.city} onChange={e => setNewDriver({...newDriver, city: e.target.value})} style={styles.input}>
              {somaliCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" style={styles.btn}>DIYYAARI DARAWALKAN</button>
          </form>
        </section>

        <section style={styles.sectionCard}>
          <h3>📊 Warbixinta Guud</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div style={styles.statBox}><h4>{bookings.length}</h4><p>Dalabaad</p></div>
            <div style={styles.statBox}><h4>{drivers.length}</h4><p>Darawallo</p></div>
          </div>
        </section>
      </div>

      <h3 style={{ marginTop: '40px' }}>📋 Dalabaadka u dambeeyay</h3>
      <div style={{overflowX: 'auto'}}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#334155' }}>
              <th style={styles.th}>Magaalada</th>
              <th style={styles.th}>Telka Macmiilka</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Taariikhda</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={styles.td}>{b.city}</td>
                <td style={styles.td}>{b.phone}</td>
                <td style={styles.td}>{b.status}</td>
                <td style={styles.td}>{new Date(b.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  loginOverlay: { height: '100vh', width: '100%', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loginCard: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '25px', width: '100%', maxWidth: '350px', textAlign: 'center', border: '1px solid #334155' },
  sectionCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '15px', backgroundColor: '#38bdf8', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  statBox: { textAlign: 'center', backgroundColor: '#334155', padding: '20px', borderRadius: '10px', width: '40%' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { padding: '12px', textAlign: 'left', color: '#38bdf8' },
  td: { padding: '12px' }
};

export default AdminPanel;
