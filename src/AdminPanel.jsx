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

  const addDriver = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('drivers').insert([newDriver]);
    if (!error) {
      alert("Darawal cusub waa la diiwaangeliyey!");
      setNewDriver({ name: '', phone: '', pin: '', city: 'Garowe' });
      fetchData();
    }
  };

  // --- SHAQADA CUSUB: KA SAARIDDA DARAWALKA ---
  const removeDriver = async (id, name) => {
    const confirmDelete = window.confirm(`Ma hubtaa inaad rabto inaad ka saarto darawal ${name}?`);
    if (confirmDelete) {
      const { error } = await supabase.from('drivers').delete().eq('id', id);
      if (!error) {
        alert("Darawalkii waa laga saaray nidaamka.");
        fetchData(); // Dib u cusboonaysii liiska
      } else {
        alert("Cilad ayaa dhacday: " + error.message);
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
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
        <h1>DALMAR ADMIN</h1>
        <button onClick={() => setIsAdminLoggedIn(false)} style={styles.logoutBtn}>LOGOUT</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {/* ADD DRIVER SECTION */}
        <section style={styles.sectionCard}>
          <h3>➕ Diiwaangeli Darawal</h3>
          <form onSubmit={addDriver}>
            <input type="text" placeholder="Magaca" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Tel" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} style={styles.input} required />
            <select value={newDriver.city} onChange={e => setNewDriver({...newDriver, city: e.target.value})} style={styles.input}>
              {somaliCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" style={styles.btn}>SAVE DRIVER</button>
          </form>
        </section>

        {/* DRIVERS LIST WITH REMOVE BUTTON */}
        <section style={styles.sectionCard}>
          <h3>🚖 Darawallada Diiwaangashan ({drivers.length})</h3>
          <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            {drivers.map(d => (
              <div key={d.id} style={styles.driverItem}>
                <div>
                  <p style={{margin: 0, fontWeight: 'bold'}}>{d.name}</p>
                  <p style={{margin: 0, fontSize: '12px', color: '#94a3b8'}}>{d.phone} - {d.city}</p>
                </div>
                <button onClick={() => removeDriver(d.id, d.name)} style={styles.removeBtn}>REMOVE</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <h3 style={{marginTop: '40px'}}>📋 Dalabaadka u dambeeyay</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#334155'}}>
              <th style={styles.th}>Magaalada</th>
              <th style={styles.th}>Tel Macmiilka</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{borderBottom: '1px solid #334155'}}>
                <td style={styles.td}>{b.city}</td>
                <td style={styles.td}>{b.phone}</td>
                <td style={styles.td}>{b.status}</td>
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
  input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  removeBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px' },
  driverItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #334155' },
  logoutBtn: { backgroundColor: '#475569', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  tableWrapper: { overflowX: 'auto', marginTop: '10px', backgroundColor: '#1e293b', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left' },
  td: { padding: '15px' }
};

export default AdminPanel;
