import * as faceapi from 'face-api.js';

export async function getFaceDescriptor(videoRef) {
  const detection = await faceapi
    .detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 160,
        scoreThreshold: 0.5,
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error('Wajah tidak terdeteksi');
  }

  return Array.from(detection.descriptor);
}
