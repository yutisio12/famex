const Footer = () => {
  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px 0',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0 }}>&copy; 2025 Famex. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer;