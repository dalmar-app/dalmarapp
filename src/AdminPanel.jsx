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
  const [visiblePins, setVisiblePins] = useState({});

  const somaliCities = ["Garowe", "Galkacyo", "Muqdisho", "Beledweyne", "Kismaayo", "Baydhabo", "Hargeisa", "Borama", "Eyl"];

  const fetchData = async () => {
    const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    const { data: dData } = await supabase.from('drivers').select('*').order('name', { ascending: true });
    setBookings(bData || []);
    setDrivers(dData || []);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // 1. LOGIN FIX: Ma kala saarayso xarfaha waaweyn iyo kuwa yar
    if (adminUser.toLowerCase() === "ahmed" && adminPin === "2003") {
      setIsAdminLoggedIn(true);
      fetchData();
    } else {
      alert("Magaca ama PIN-ka Admin-ka waa khaldan yahay!");
    }
  };

  const togglePin = (id) => {
    setVisiblePins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addDriver = async (e) => {
    e.preventDefault();
    // 2. UNIQUE PIN: Hubi haddii PIN-kaas darawal kale hore u lahaa
    const { data: existing } = await supabase.from('drivers').select('pin').eq('pin', newDriver.pin).single();
    if (existing) {
      alert("PIN-kan hore ayaa loo isticmaalay! Fadlan darawalka u samee PIN ka duwan.");
      return;
    }
    const { error } = await supabase.from('drivers').insert([newDriver]);
    if (!error) {
      alert("Darawal cusub waa la kaydiyey!");
      setNewDriver({ name: '', phone: '', pin: '', city: 'Garowe' });
      fetchData();
    }
  };

  // 3. REMOVE DRIVER: Shaqada lagu tirtirayo darawalka
  const removeDriver = async (id, name) => {
    if (window.confirm(`Ma hubtaa inaad gabi ahaanba tirtirto darawal ${name}?`)) {
      const { error } = await supabase.from('drivers').delete().eq('id', id);
      if (!error) {
        fetchData();
      } else {
        alert("Cilad: " + error.message);
      }
    }
  };

  // 4. DELETE BOOKING: Shaqada lagu tirtirayo dalabaadka (Recent Bookings)
  const deleteBooking = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto dalabkan?")) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) {
        fetchData();
      }
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div style={styles.loginOverlay}>
        <div style={styles.loginCard}>
          <h2 style={{color: '#38bdf8'}}>🔐 Admin Access</h2>
          <form onSubmit={handleAdminLogin}>
            <input type="text" placeholder="Admin Name" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} style={styles.input} required />
            <input type="password" placeholder="Admin PIN" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} style={styles.input} required />
            <button type="submit" style={styles.btn}>GASHLO SYSTEM-KA</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminBody}>
      <div style={styles.header}>
        <h1 style={{color: '#38bdf8'}}>DALMAR ADMIN</h1>
        <button onClick={() => setIsAdminLoggedIn(false)} style={styles.logoutBtn}>LOGOUT</button>
      </div>

      <div style={styles.grid}>
        {/* Qaybta Diiwaangelinta Darawalka */}
        <section style={styles.sectionCard}>
          <h3>➕ Diiwaangeli Darawal</h3>
          <form onSubmit={addDriver}>
            <input type="text" placeholder="Magaca Darawalka" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Tel (tusaale 666...)" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Unique PIN (4 digits)" value={newDriver.pin} onChange={e => setNewDriver({...newDriver, pin: e.target.value})} style={styles.input} required maxLength="4" />
            <select value={newDriver.city} onChange={e => setNewDriver({...newDriver, city: e.target.value})} style={styles.input}>
              {somaliCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" style={styles.btn}>SAVE DRIVER</button>
          </form>
        </section>

        {/* Liiska Darawallada leh Show/Hide & Delete */}
        <section style={styles.sectionCard}>
          <h3>🚖 Liiska Darawallada ({drivers.length})</h3>
          <div style={styles.listContainer}>
            {drivers.map(d => (
              <div key={d.id} style={styles.listItem}>
                <div style={{flex: 1}}>
                  <p style={{margin: 0, fontWeight: 'bold'}}>{d.name}</p>
                  <p style={{margin: 0, fontSize: '12px', color: '#94a3b8'}}>
                    PIN: {visiblePins[d.id] ? <span style={{color: '#38bdf8', fontWeight: 'bold'}}>{d.pin}</span> : "****"} | {d.city}
                  </p>
                </div>
                <div style={{display: 'flex', gap: '5px'}}>
                  <button onClick={() => togglePin(d.id)} style={styles.showBtn}>{visiblePins[d.id] ? 'Hide' : 'Show'}</button>
                  <button onClick={() => removeDriver(d.id, d.name)} style={styles.delBtnSmall}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* TAABALKA DALABAADKA (Recent Bookings) */}
      <h3 style={{marginTop: '40px'}}>📋 Dalabaadka u dambeeyay (Recent Bookings)</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#334155'}}>
              <th style={styles.th}>Magaalada</th>
              <th style={styles.th}>Tel Macmiilka</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{borderBottom: '1px solid #334155'}}>
                <td style={styles.td}>{b.city}</td>
                <td style={styles.td}>{b.phone}</td>
                <td style={styles.td}>{b.status}</td>
                <td style={styles.td}>
                  <button onClick={() => deleteBooking(b.id)} style={styles.delBtnTable}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  adminBody: { padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' },
  sectionCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' },
  input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#0f172a' },
  logoutBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  listContainer: { maxHeight: '300px', overflowY: 'auto', marginTop: '10px' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #334155' },
  showBtn: { backgroundColor: '#475569', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px' },
  delBtnSmall: { backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px' },
  tableWrapper: { overflowX: 'auto', marginTop: '10px', backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', color: '#38bdf8' },
  td: { padding: '15px' },
  delBtnTable: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  loginOverlay: { height: '100vh', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loginCard: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '25px', textAlign: 'center', border: '1px solid #334155' }
};

export default AdminPanel;
