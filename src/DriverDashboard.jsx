import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const DriverDashboard = () => {
  const [currentDriver, setCurrentDriver] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Garowe');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  // Magaalooyinka aad codsatay
  const somaliCities = ["Garowe", "Galkacyo", "Muqdisho", "Beledweyne", "Kismaayo", "Eyl", "Baydhabo"];

  const loginDriver = async () => {
    if (!phone || !pin) {
      alert("Fadlan geli Tel iyo PIN");
      return;
    }
    setLoading(true);
    
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('phone', phone)
      .eq('pin', pin)
      .eq('city', selectedCity)
      .single();

    if (data) {
      setCurrentDriver(data);
      fetchBookings(selectedCity);
    } else {
      alert("Xogtaada lama helin! Hubi Magaalada, Telka iyo PIN-ka.");
    }
    setLoading(false);
  };

  const fetchBookings = async (city) => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('city', city)
      .eq('status', 'pending');
    setBookings(data || []);
  };

  if (!currentDriver) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '350px', border: '1px solid #334155' }}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>Darawal Login</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#38bdf8', display: 'block', marginBottom: '5px' }}>1. Dooro Magaalada:</label>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#334155', color: 'white', border: 'none' }}
            >
              {somaliCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#38bdf8', display: 'block', marginBottom: '5px' }}>2. Telkaaga:</label>
            <input 
              type="text" 
              placeholder="090..." 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#38bdf8', display: 'block', marginBottom: '5px' }}>3. PIN-kaaga:</label>
            <input 
              type="password" 
              placeholder="****" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            onClick={loginDriver} 
            disabled={loading}
            style={{ width: '100%', padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}
          >
            {loading ? 'Hubinaya...' : 'BILOW SHAQADA'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div style={{ borderBottom: '2px solid #334155', paddingBottom: '10px', marginBottom: '20px' }}>
        <h3>Soo dhowow, {currentDriver.name}</h3>
        <p>Magaalada aad ka shaqaynayso: <b style={{color: '#38bdf8'}}>{selectedCity}</b></p>
      </div>

      <h4>Dalabaadka Macamiisha:</h4>
      {bookings.length === 0 ? <p>Ma jiraan dalabaad ka jira {selectedCity} hadda.</p> : 
        bookings.map(b => (
          <div key={b.id} style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', marginBottom: '10px' }}>
            <p>📞 Tel: {b.phone}</p>
            <a href={`https://www.google.com/maps?q=${b.location}`} target="_blank" style={{ color: '#38bdf8', textDecoration: 'none' }}>📍 Arag Khariidada</a>
            <button style={{ display: 'block', width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#34d399', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Qabo Dalabka</button>
          </div>
        ))
      }
    </div>
  );
};

export default DriverDashboard;
