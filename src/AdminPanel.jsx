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
  const [visiblePins, setVisiblePins] = useState({}); // Tani waxay kaydisaa PIN-nada la tusay

  const somaliCities = ["Garowe", "Galkacyo", "Muqdisho", "Beledweyne", "Kismaayo", "Baydhabo", "Hargeisa"];

  const fetchData = async () => {
    const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    const { data: dData } = await supabase.from('drivers').select('*').order('name', { ascending: true });
    setBookings(bData || []);
    setDrivers(dData || []);
  };

  const togglePin = (id) => {
    setVisiblePins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === "Ahmed" && adminPin === "2003") {
      setIsAdminLoggedIn(true);
      fetchData();
    } else { alert("Khaldan!"); }
  };

  const addDriver = async (e) => {
    e.preventDefault();
    const { data: existing } = await supabase.from('drivers').select('pin').eq('pin', newDriver.pin).single();
    if (existing) { alert("PIN-kan hore ayaa loo isticmaalay!"); return; }
    
    const { error } = await supabase.from('drivers').insert([newDriver]);
    if (!error) {
      alert("Waa la kaydiyey!");
      setNewDriver({ name: '', phone: '', pin: '', city: 'Garowe' });
      fetchData();
    }
  };

  const removeDriver = async (id, name) => {
    if (window.confirm(`Ma tirtirnaa ${name}?`)) {
      await supabase.from('drivers').delete().eq('id', id);
      fetchData();
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div style={styles.loginOverlay}>
        <div style={styles.loginCard}>
          <h2>🔐 Admin Login</h2>
          <form onSubmit={handleAdminLogin}>
            <input type="text" placeholder="Name" value={adminUser} onChange={e => setAdminUser(e.target.value)} style={styles.input} />
            <input type="password" placeholder="PIN" value={adminPin} onChange={e => setAdminPin(e.target.value)} style={styles.input} />
            <button type="submit" style={styles.btn}>LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminBody}>
      <h1>DALMAR ADMIN</h1>
      <div style={styles.grid}>
        <section style={styles.sectionCard}>
          <h3>➕ Diiwaangeli Darawal</h3>
          <form onSubmit={addDriver}>
            <input type="text" placeholder="Magaca" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Tel" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Unique PIN (4 digits)" value={newDriver.pin} onChange={e => setNewDriver({...newDriver, pin: e.target.value})} style={styles.input} required maxLength="4" />
            <select value={newDriver.city} onChange={e => setNewDriver({...newDriver, city: e.target.value})} style={styles.input}>
              {somaliCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" style={styles.btn}>SAVE</button>
          </form>
        </section>

        <section style={styles.sectionCard}>
          <h3>🚖 Liiska Darawallada</h3>
          <div style={styles.listContainer}>
            {drivers.map(d => (
              <div key={d.id} style={styles.listItem}>
                <div style={{flex: 1}}>
                  <p style={{margin: 0, fontWeight: 'bold'}}>{d.name}</p>
                  <p style={{margin: 0, fontSize: '13px', color: '#38bdf8'}}>
                    PIN: {visiblePins[d.id] ? <strong>{d.pin}</strong> : "****"} | {d.city}
                  </p>
                </div>
                <div style={{display: 'flex', gap: '5px'}}>
                   <button onClick={() => togglePin(d.id)} style={styles.showBtn}>
                     {visiblePins[d.id] ? 'Hide' : 'Show'}
                   </button>
                   <button onClick={() => removeDriver(d.id, d.name)} style={styles.delBtn}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  adminBody: { padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  sectionCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' },
  input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  listContainer: { maxHeight: '400px', overflowY: 'auto' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #334155' },
  showBtn: { backgroundColor: '#475569', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px' },
  delBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px' },
  loginOverlay: { height: '100vh', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loginCard: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '25px', textAlign: 'center' }
};

export default AdminPanel;
