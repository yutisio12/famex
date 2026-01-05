// import * as faceapi from 'face-api.js';
import * as faceapi from 'face-api.js/dist/face-api.min.js';

export async function getFaceDescriptor(videoRef, isUpload = false) {
  const img = isUpload === true ? await faceapi.bufferToImage(videoRef) : videoRef.current // set between upload and capture
  const detection = await faceapi
    .detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 160,
        scoreThreshold: 0.5,
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error('No Face detected');
  }

  return Array.from(detection.descriptor);
}
