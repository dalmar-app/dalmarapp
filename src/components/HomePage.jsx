import React, { useState } from 'react';

const Home = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Garowe'); // Tan waa tusaale

  const handleBooking = () => {
    if (phoneNumber.length < 7) {
      alert("Fadlan gali nambar sax ah!");
      return;
    }
    // Halkan waxaa ku xirmaya Database-kaaga (Supabase)
    console.log("Dalab ayaa la diray:", { phoneNumber, city });
    alert("Dalabkaaga waa la diray, darawal ayaa kugu soo wacaaya!");
  };

  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="Dalmar" style={{width: '100px'}} />
      <h2 style={{color: 'white'}}>DALMAR - AAMIN IYO DEGDEG</h2>
      
      <div style={styles.card}>
        <input 
          type="tel" 
          placeholder="Gali Nambarkaaga (tusaale: 061...)" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
        />
        <button 
          onClick={handleBooking} 
          style={{...styles.btn, opacity: phoneNumber.length < 7 ? 0.5 : 1}}
        >
          DALBO BAJAAJ {city.toUpperCase()}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', textAlign: 'center', backgroundColor: '#0f172a', minHeight: '100vh' },
  card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', marginTop: '20px' },
  input: { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #38bdf8', marginBottom: '15px', backgroundColor: '#0f172a', color: 'white' },
  btn: { width: '100%', padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Home;
