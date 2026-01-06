import { useEffect, useRef, useState } from 'react';
import { loadFaceModels } from '../../face/loadModels';
import { getFaceDescriptor } from '../../face/getDescriptor';
import { showNotification } from '@mantine/notifications';
import { authService } from '../../services/auth';
import { IconFaceId } from '@tabler/icons-react';

export default function RegisterFace() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      await loadFaceModels();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setReady(true);
    }
    init();
  }, []);

  async function handleRegister() {
    try {
      setLoading(true);
      const descriptor = await getFaceDescriptor(videoRef);
      const payloadUpdate = {
        face_id: descriptor,
      };
      await authService.update_profile(payloadUpdate);
      showNotification({
        title: 'Success',
        message: 'Face Has Been Registered',
        color: 'green',
      });
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h2>Register Face</h2>

      <video ref={videoRef} autoPlay muted width="520" height="420" />

      <br />
      <button
        disabled={!ready || loading}
        onClick={handleRegister}
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
