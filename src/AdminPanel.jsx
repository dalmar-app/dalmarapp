import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const AdminPanel = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setDrivers(data || []);
    setLoading(false);
  };

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Loading Admin Panel...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #38bdf8', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>Maamulka Darawallada (Admin)</h2>
        <span style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>
          {drivers.length} Darawal
        </span>
      </div>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {drivers.length === 0 ? <p>Ma jiraan darawalno diiwaangashan.</p> : 
          drivers.map((d) => (
            <div key={d.id} style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{d.name}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>📞 {d.phone}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#34d399' }}>🔑 PIN: {d.pin}</p>
              </div>
              <button 
                onClick={async () => {
                  if(window.confirm(`Ma hubtaa inaad tirtirto ${d.name}?`)) {
                    await supabase.from('drivers').delete().eq('id', d.id);
                    fetchDrivers();
                  }
                }}
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                TIRTIR
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default AdminPanel;
