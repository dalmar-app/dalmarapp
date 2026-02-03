import React from 'react';

const HomePage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50' }}>Dalmar App</h1>
      <p>Ku soo dhawaaw adeegga Dalmar. Fadlan dooro qaybta aad rabto.</p>
      <div style={{ marginTop: '30px' }}>
        <a href="/drivers" style={{ color: 'blue', textDecoration: 'underline' }}>Tag bogga Darawallada</a>
      </div>
    </div>
  );
};

export default HomePage;
