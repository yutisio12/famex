// import * as faceapi from 'face-api.js';
import * as faceapi from 'face-api.js/dist/face-api.min.js';

export async function loadFaceModels() {
  // Menggunakan CDN karena file lokal tidak lengkap (shard2 hilang)
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}
