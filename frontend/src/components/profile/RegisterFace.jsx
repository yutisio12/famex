import { useEffect, useRef, useState } from 'react';
import { loadFaceModels } from '../../face/loadModels';
import { getFaceDescriptor } from '../../face/getDescriptor';
import { showNotification } from '@mantine/notifications';
import { authService } from '../../services/auth';

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
    <div>
      <h2>Daftarkan Wajah</h2>

      <video ref={videoRef} autoPlay muted width="320" height="240" />

      <br />
      <button disabled={!ready || loading} onClick={handleRegister}>
        Simpan Wajah
      </button>
    </div>
  );
}
