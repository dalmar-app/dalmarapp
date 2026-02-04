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

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === "Ahmed" && adminPin === "2003") {
      setIsAdminLoggedIn(true);
      fetchData();
    } else {
      alert("Magaca ama PIN-ka waa khaldan yahay!");
    }
  };

  const fetchData = async () => {
    const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    const { data: dData } = await supabase.from('drivers').select('*').order('name', { ascending: true });
    setBookings(bData || []);
    setDrivers(dData || []);
  };

  // SHAQADA CUSUB: Tirtirista Dalabka (Booking)
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Ma hubtaa inaad tirtirto dalabkan?");
    if (confirmDelete) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) {
        fetchData(); // Dib u cusboonaysii liiska
      } else {
        alert("Cilad: " + error.message);
      }
    }
  };

  const addDriver = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('drivers').insert([newDriver]);
    if (!error) {
      alert("Darawal waa la daray!");
      setNewDriver({ name: '', phone: '', pin: '', city: 'Garowe' });
      fetchData();
    }
  };

  const removeDriver = async (id, name) => {
    if (window.confirm(`Ma tirtirnaa darawal ${name}?`)) {
      await supabase.from('drivers').delete().eq('id', id);
      fetchData();
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
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h1 style={{color: '#38bdf8'}}>DALMAR ADMIN</h1>
        <button onClick={() => setIsAdminLoggedIn(false)} style={styles.logoutBtn}>LOGOUT</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Qaybta Darawallada */}
        <section style={styles.sectionCard}>
          <h3>🚖 Maamulka Darawallada</h3>
          <form onSubmit={addDriver}>
            <input type="text" placeholder="Magaca" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Tel" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} style={styles.input} required />
            <select value={newDriver.city} onChange={e => setNewDriver({...newDriver, city: e.target.value})} style={styles.input}>
              {somaliCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" style={styles.btn}>SAVE DRIVER</button>
          </form>
          <div style={{marginTop: '20px', maxHeight: '200px', overflowY: 'auto'}}>
            {drivers.map(d => (
              <div key={d.id} style={styles.listItem}>
                <span>{d.name} ({d.city})</span>
                <button onClick={() => removeDriver(d.id, d.name)} style={styles.delSmall}>Delete</button>
              </div>
            ))}
          </div>
        </section>

        {/* Tirakoobka */}
        <section style={styles.sectionCard}>
          <h3>📊 Statistics</h3>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '20px'}}>
            <div style={styles.statBox}><h2>{bookings.length}</h2><p>Dalabaad</p></div>
            <div style={styles.statBox}><h2>{drivers.length}</h2><p>Darawallo</p></div>
          </div>
        </section>
      </div>

      {/* TAABALKA DALABAADKA (Halkan ayaa Delete-ka lagu daray) */}
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
                  <button onClick={() => deleteBooking(b.id)} style={styles.deleteBtn}>Tirtir (Delete)</button>
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
  loginOverlay: { height: '100vh', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loginCard: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '25px', textAlign: 'center' },
  sectionCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' },
  input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  logoutBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' },
  statBox: { textAlign: 'center', backgroundColor: '#334155', padding: '15px', borderRadius: '10px', width: '45%' },
  tableWrapper: { overflowX: 'auto', marginTop: '10px', backgroundColor: '#1e293b', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', color: '#38bdf8' },
  td: { padding: '15px' },
  deleteBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #334155' },
  delSmall: { backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }
};

export default AdminPanel;
