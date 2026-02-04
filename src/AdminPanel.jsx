import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', pin: '', city: 'Garowe' });
  const somaliCities = ["Garowe", "Galkacyo", "Muqdisho", "Beledweyne", "Kismaayo", "Eyl", "Baydhabo"];

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#38bdf8' }}>DALMAR ADMIN CONTROL</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        
        {/* Qaybta lagu daro Darawalka (Amniga) */}
        <section style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px' }}>
          <h3>➕ Diiwaangeli Darawal Cusub</h3>
          <form onSubmit={addDriver}>
            <input type="text" placeholder="Magaca" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Tel (e.g 666635679)" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="PIN (e.g 1234)" value={newDriver.pin} onChange={e => setNewDriver({...newDriver, pin: e.target.value})} style={styles.input} required />
            <select value={newDriver.city} onChange={e => setNewDriver({...newDriver, city: e.target.value})} style={styles.input}>
              {somaliCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" style={styles.btn}>DIYYAARI DARAWALKAN</button>
          </form>
        </section>

        {/* Qaybta Tirakoobka */}
        <section style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px' }}>
          <h3>📊 Warbixinta Guud</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div style={styles.statBox}><h4>{bookings.length}</h4><p>Dalabaad</p></div>
            <div style={styles.statBox}><h4>{drivers.length}</h4><p>Darawallo</p></div>
          </div>
        </section>
      </div>

      {/* Liiska Dalabaadka Magaalooyinka */}
      <h3 style={{ marginTop: '40px' }}>📋 Dalabaadka u dambeeyay</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
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
  );
};

const styles = {
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  statBox: { textAlign: 'center', backgroundColor: '#334155', padding: '20px', borderRadius: '10px', width: '40%' },
  th: { padding: '12px', textAlign: 'left' },
  td: { padding: '12px' }
};

export default AdminPanel;
