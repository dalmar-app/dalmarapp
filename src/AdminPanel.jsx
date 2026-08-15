import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nfhzzympuvilshvxsnhd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT';

const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPanel = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', pin: '', city: 'Garowe', is_paid: false });
  const [visiblePins, setVisiblePins] = useState({});

  const somaliCities = ["Garowe", "Galkacyo", "Muqdisho", "Beledweyne", "Kismaayo", "Baydhabo", "Hargeisa", "Borama", "Eyl"];

  useEffect(() => {
    if (isAdminLoggedIn) fetchData();
  }, [isAdminLoggedIn]);

  const fetchData = async () => {
    const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    const { data: dData } = await supabase.from('drivers').select('*').order('name', { ascending: true });
    setBookings(bData || []);
    setDrivers(dData || []);
  };

  const assignDriver = async (bookingId, driverPhone) => {
    const { error } = await supabase
      .from('bookings')
      .update({ driver_phone: driverPhone })
      .eq('id', bookingId);
    if (!error) fetchData();
    else alert("Khalad ayaa dhacay: " + error.message);
  };

  // ... (handleAdminLogin, togglePin, togglePaymentStatus, addDriver, removeDriver, deleteBooking remain same)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const VALID_USER = import.meta.env.VITE_ADMIN_USER || "ahmed";
    const VALID_PIN = import.meta.env.VITE_ADMIN_PIN || "2003";
    if (adminUser.toLowerCase() === VALID_USER && adminPin === VALID_PIN) setIsAdminLoggedIn(true);
    else alert("Magaca ama PIN-ka Admin-ka waa khaldan yahay!");
  };

  const togglePin = (id) => setVisiblePins(prev => ({ ...prev, [id]: !prev[id] }));

  const togglePaymentStatus = async (id, currentStatus) => {
    const { error } = await supabase.from('drivers').update({ is_paid: !currentStatus }).eq('id', id);
    if (!error) fetchData();
  };

  const addDriver = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('drivers').insert([newDriver]);
    if (!error) {
        setNewDriver({ name: '', phone: '', pin: '', city: 'Garowe', is_paid: false });
        fetchData();
    }
  };

  const removeDriver = async (id, name) => {
    if (window.confirm(`Ma hubtaa inaad tirtirto darawal ${name}?`)) {
      const { error } = await supabase.from('drivers').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto dalabkan?")) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) fetchData();
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
        <section style={styles.sectionCard}>
          <h3>➕ Diiwaangeli Darawal</h3>
          <form onSubmit={addDriver}>
            <input type="text" placeholder="Magaca" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Phone" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="PIN" value={newDriver.pin} onChange={e => setNewDriver({...newDriver, pin: e.target.value})} style={styles.input} required maxLength="4" />
            <select value={newDriver.city} onChange={e => setNewDriver({...newDriver, city: e.target.value})} style={styles.input}>
              {somaliCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" style={styles.btn}>SAVE DRIVER</button>
          </form>
        </section>

        <section style={styles.sectionCard}>
          <h3>🚖 Darawallada ({drivers.length})</h3>
          <div style={styles.listContainer}>
            {drivers.map(d => (
              <div key={d.id} style={styles.listItem}>
                <p>{d.name} ({d.phone})</p>
                <button onClick={() => togglePaymentStatus(d.id, d.is_paid)} style={{...styles.payBtn, backgroundColor: d.is_paid ? '#ef4444' : '#22c55e'}}>{d.is_paid ? 'Block' : 'Activate'}</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <h3 style={{marginTop: '40px'}}>📋 Dalabaadka</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#334155'}}>
              <th style={styles.th}>Tel Macmiilka</th>
              <th style={styles.th}>Qoondee Darawal</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{borderBottom: '1px solid #334155'}}>
                <td style={styles.td}>{b.phone}</td>
                <td style={styles.td}>
                  <select onChange={(e) => assignDriver(b.id, e.target.value)} value={b.driver_phone || ''} style={styles.input}>
                    <option value="">Lama qoondeyn</option>
                    {drivers.map(d => <option key={d.id} value={d.phone}>{d.name}</option>)}
                  </select>
                </td>
                <td style={styles.td}><button onClick={() => deleteBooking(b.id)} style={styles.delBtnTable}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ... (Styles remains as you defined)
const styles = { /* ... keep your existing styles object ... */ };

export default AdminPanel;
