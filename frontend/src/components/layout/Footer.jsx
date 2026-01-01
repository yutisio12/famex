// import React from "react";
const Footer = () => {
  return (
    <footer 
      style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '20px 0',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          // display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          textAlign: 'center',
        }} 
      >
        <p>&copy; 2025 Famex. All rights reserved.</p>
      </div>
    </footer>
  )
}
export default Footer