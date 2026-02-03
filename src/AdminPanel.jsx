import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfhzzympuvilshvxsnhd.supabase.co', 
  'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'
);

const AdminPanel = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    const { data } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
    setDrivers(data || []);
  };

  const deleteDriver = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto darawalkan?")) {
      await supabase.from('drivers').delete().eq('id', id);
      fetchDrivers();
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Maamulka Darawallada</h2>
      <div style={{ marginTop: '20px' }}>
        {drivers.map((d) => (
          <div key={d.id} style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' }}>
            <div>
              <h4 style={{ margin: 0 }}>{d.name}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Tel: {d.phone} | PIN: {d.pin}</p>
            </div>
            <button onClick={() => deleteDriver(d.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>TIRTIR</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
