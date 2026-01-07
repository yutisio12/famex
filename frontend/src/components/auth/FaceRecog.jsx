import { useEffect, useRef, useState } from 'react';
import { loadFaceModels } from '../../face/loadModels';
import { getFaceDescriptor } from '../../face/getDescriptor';
import { showNotification } from '@mantine/notifications';
import { IconFaceId } from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth'; 

export default function FaceRecog() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { face_login } = useAuth();

  useEffect(() => {
    async function init() {
      await loadFaceModels();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      try {
        await videoRef.current.play();
      } catch (err) {
        // some browsers may block autoplay; video may still produce frames
        // but play() can fail — fall back to marking ready
        // eslint-disable-next-line no-console
        console.warn('video play failed', err);
      }
      setReady(true);
    }
    init();
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);
      const descriptor = await getFaceDescriptor(videoRef);
      const payloadUpdate = {
        faceDescriptor: descriptor,
      };
      
      const result = await face_login(payloadUpdate);
      if (!result.success) {
        showNotification({
          title: 'Login Failed',
          message: result.message,
          color: 'red',
        });
      }
  
      setLoading(false);
    } catch (err) {
      showNotification({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Login Face</h2>

      <video ref={videoRef} autoPlay muted width="520" height="420" />

      <br />
      <button
        disabled={!ready || loading}
        onClick={handleLogin}
        style={{
          width: '30%',
          height: '53px',
          // padding: '16px',
          fontSize: '15px',
          fontWeight: '600',
          color: 'white',
          background: loading
            ? 'linear-gradient(135deg, #8a9cee 0%, #9370b8 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: 'inherit',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          opacity: loading ? 0.8 : 1,
          transform: loading ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        <IconFaceId size={50} />
      </button>
    </div>
  );
}
