import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { createClient } from '@supabase/supabase-js'; 

const supabase = createClient('https://nfhzzympuvilshvxsnhd.supabase.co', 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'); 

const HomePage = () => { 
  const [phone, setPhone] = useState(''); 
  const [isOrdered, setIsOrdered] = useState(false); 
  const [clickCount, setClickCount] = useState(0); 
  const [profileImage, setProfileImage] = useState(""); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const [deferredPrompt, setDeferredPrompt] = useState(null); 
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => { 
    // 1. Soo qaado sawirka Profile-ka
    const fetchProfile = async () => { 
      let { data } = await supabase 
        .from('profiles') 
        .select('image_url') 
        .eq('owner_name', 'Eng Ahmed') 
        .single(); 
       
      if (data?.image_url) setProfileImage(data.image_url); 
    }; 
    fetchProfile();

    // 2. PWA: Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    // 3. PWA: Check if already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []); 

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      alert("Si aad u shubato: Browser-ka (Chrome) ka dooro 'Install App'.");
    }
  };

  const handleImageUpload = async (e) => { 
    const file = e.target.files[0]; 
    if (!file) return; 

    const reader = new FileReader(); 
    reader.onloadend = async () => { 
      const base64Image = reader.result; 
      setProfileImage(base64Image);  
      await supabase.from('profiles').update({ image_url: base64Image }).eq('owner_name', 'Eng Ahmed'); 
      alert("Sawirka waa la kaydiyay! ✅"); 
    }; 
    reader.readAsDataURL(file); 
  }; 

  const handleBooking = async () => { 
    if (phone.length < 7) return alert("Fadlan nambar sax ah geli!"); 
    setIsOrdered(true); 
    await supabase.from('bookings').insert([{ phone, city: 'Garowe', status: 'pending' }]); 
  }; 

  // QAYBTII AAD II QAYLISAY: ADMIN & DRIVER CLICKS
  const handleNameClick = () => { 
    const newCount = clickCount + 1; 
    setClickCount(newCount); 

    if (newCount === 3) { 
      setIsAdmin(true); 
      alert("Admin Mode: Hadda sawirka waad beddeli kartaa! ✅"); 
    } 
    if (newCount === 5) { 
      navigate('/driver-login'); 
    } 
  }; 

  return ( 
    <div style={styles.container}> 
      <style> 
        {` 
          @keyframes glow { 
            0% { box-shadow: 0 0 10px #38bdf8; border-color: #38bdf8; } 
            50% { box-shadow: 0 0 25px #38bdf8; border-color: #ffffff; } 
            100% { box-shadow: 0 0 10px #38bdf8; border-color: #38bdf8; } 
          } 
          .profile-img-container { 
            width: 200px; height: 200px; border-radius: 50%; border: 4px solid #38bdf8; 
            overflow: hidden; animation: glow 3s infinite; display: flex; 
            justify-content: center; align-items: center; background-color: #0f172a; 
            position: relative; cursor: pointer; 
          } 
          .profile-img { width: 100%; height: 100%; object-fit: cover; } 
          .admin-overlay { 
            position: absolute; bottom: 0; background: rgba(0, 0, 0, 0.7); 
            color: #38bdf8; width: 100%; font-size: 11px; padding: 8px 0; 
            text-align: center; font-weight: bold; 
          } 
        `} 
      </style> 

      <div style={styles.heroSection}> 
        <div style={styles.imageWrapper}> 
          <label className="profile-img-container"> 
            {isAdmin && <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />} 
            <img src={profileImage || "https://avatars.githubusercontent.com/u/197945084?v=4"} alt="Eng Ahmed" className="profile-img" /> 
            {isAdmin && <div className="admin-overlay">GUJI SI AAD U BEDDESHO</div>} 
          </label> 
        </div> 
        
        {/* HALKAN AYAY CLICKS-KU KA SHAQAYNAYAAN */}
        <h1 onClick={handleNameClick} style={styles.name}>
          Eng Ahmed Abdirisak Ali
        </h1> 
        
        <p style={styles.title}>Fullstack Developer (Senior)</p> 
        <div style={styles.bioCard}> 
          <p style={styles.bioText}>App-ka <strong>DALMAR</strong> waa xal casri ah oo u adeegaya magaalada Garowe. 8 bilood oo shaqo adag ah ka dib, waa diyaar!</p> 
        </div> 
      </div> 

      <div style={styles.appZone}> 
        {!isOrdered ? ( 
          <div style={styles.card}> 
            <h2 style={{color: '#38bdf8', marginBottom: '15px'}}>Dalbo Bajaaj</h2> 
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} placeholder="Nambarkaaga..." /> 
            <button onClick={handleBooking} style={styles.btn}>GUD BI DALABKA</button> 
            
            {/* INSTALL BUTTON */}
            {!isInstalled && (
              <button onClick={handleInstallClick} style={styles.installBtn}>📥 INSTALL APP (DIRECT)</button>
            )}
          </div> 
        ) : ( 
          <div style={styles.successCard}><h3>MAHADSANID! ✅</h3><p>Darawal ayaa kusoo wacaya.</p></div> 
        )} 
      </div> 
    </div> 
  ); 
}; 

const styles = { 
  container: { padding: '40px 20px', backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }, 
  heroSection: { textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }, 
  imageWrapper: { marginBottom: '20px' }, 
  name: { fontSize: '26px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }, 
  title: { color: '#38bdf8', fontSize: '14px', marginTop: '5px' }, 
  bioCard: { backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', marginTop: '20px', maxWidth: '400px', border: '1px solid #1e293b' }, 
  bioText: { color: '#94a3b8', fontSize: '15px' }, 
  appZone: { width: '100%', maxWidth: '350px' }, 
  card: { backgroundColor: '#1e293b', padding: '25px', borderRadius: '20px', textAlign: 'center' }, 
  input: { padding: '12px', width: '100%', borderRadius: '10px', marginBottom: '15px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }, 
  btn: { padding: '14px', width: '100%', backgroundColor: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }, 
  installBtn: { padding: '10px', width: '100%', backgroundColor: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  successCard: { backgroundColor: '#16a34a', padding: '25px', borderRadius: '20px', textAlign: 'center' } 
}; 

export default HomePage;
