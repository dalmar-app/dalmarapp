import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (pass === 'garowe2026') { 
      localStorage.setItem('driverAuth', 'true');
      navigate('/drivers');
    } else {
      alert("Password-ku waa khaldan yahay!");
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes moveBajaaj {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          .road { width: 100%; height: 40px; position: relative; overflow: hidden; margin-bottom: 20px; display: flex; align-items: center; }
          .bajaaj-icon { font-size: 30px; position: absolute; animation: moveBajaaj 10s infinite linear; }
          .line { width: 100%; height: 1px; background: #334155; position: absolute; bottom: 5px; }
        `}
      </style>

      <div style={styles.loginBox}>
        <h1 style={{color: '#38bdf8', fontSize: '24px'}}>DALMAR 🛺</h1>
        <div className="road">
          <div className="bajaaj-icon">🛺</div>
          <div className="line"></div>
        </div>
        <h2 style={{fontSize: '18px', marginBottom: '20px'}}>DRIVER LOGIN 🔐</h2>
        <input type="password" placeholder="Gali Password-ka" onChange={(e) => setPass(e.target.value)} style={styles.input} /> 
        <button onClick={handleLogin} style={styles.btn}>GALA</button>
        <footer style={styles.footer}>© 2026 Eng Ahmed Abdirisak Ali</footer>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#0f172a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' },
  loginBox: { padding: '30px', border: '1px solid #334155', borderRadius: '25px', backgroundColor: '#1e293b', width: '320px' },
  input: { padding: '15px', borderRadius: '12px', marginBottom: '15px', width: '100%', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', textAlign: 'center' },
  btn: { padding: '15px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '12px', fontWeight: 'bold', width: '100%', cursor: 'pointer' },
  footer: { fontSize: '10px', marginTop: '25px', color: '#475569' }
};

export default Login;
