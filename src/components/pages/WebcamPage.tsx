'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Landmark {
  x: number;
  y: number;
}

interface FaceData {
  success: boolean;
  landmarks: Landmark[];
  face: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

const WebcamPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Stop existing stream
      stopCamera();

      // Cek apakah kamera sedang digunakan
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        
        if (cameras.length === 0) {
          throw new Error('Tidak ada kamera yang terdeteksi');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
            deviceId: cameras[0].deviceId // Gunakan kamera pertama yang tersedia
          },
          audio: false
        });

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraPermission(true);
        }

      } catch (mediaError: any) {
        if (mediaError.name === 'NotReadableError') {
          throw new Error('Kamera sedang digunakan aplikasi lain. Mohon tutup aplikasi tersebut terlebih dahulu.');
        }
        throw mediaError;
      }

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err instanceof Error ? err.message : 'Gagal mengakses kamera');
      setCameraPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  const drawFaceLandmarks = useCallback(() => {
    if (!canvasRef.current || !faceData?.landmarks || !Array.isArray(faceData.landmarks)) {
      return;
    }
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (videoRef.current) {
      context.drawImage(videoRef.current, 0, 0);
    }
    
    context.fillStyle = '#00ff00';
    faceData.landmarks.forEach(point => {
      if (typeof point.x === 'number' && typeof point.y === 'number') {
        context.beginPath();
        context.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        context.fill();
      }
    });
  }, [faceData]);

  useEffect(() => {
    if (faceData?.landmarks) {
      drawFaceLandmarks();
    }
  }, [faceData, drawFaceLandmarks]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    setIsProcessing(true);
    setFaceData(null);
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');
      
      context.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');

      const response = await fetch('http://127.0.0.1:5000/analyze-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data: FaceData = await response.json();
      
      if (!data.landmarks || !Array.isArray(data.landmarks)) {
        throw new Error('Invalid landmark data received');
      }
      
      setFaceData(data);
      setError('');
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err instanceof Error ? err.message : 'Error memproses gambar');
      setFaceData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="webcam-container">
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={startCamera}
            disabled={isLoading}
            className="retry-button"
          >
            {isLoading ? 'Memulai ulang...' : 'Coba Lagi'}
          </button>
        </div>
      ) : (
        <>
          <div className="video-container">
            {isLoading && (
              <div className="loading-overlay">
                <p>Memuat kamera...</p>
              </div>
            )}
            <video
              ref={videoRef}
              className="webcam-video"
              playsInline
              autoPlay
            />
            <canvas
              ref={canvasRef}
              className="landmark-canvas"
            />
          </div>
          <button 
            onClick={handleCapture}
            className="capture-button"
            disabled={!cameraPermission || isProcessing || isLoading}
          >
            {isProcessing ? 'Memproses...' : 'Ambil Foto'}
          </button>
          {faceData?.landmarks && Array.isArray(faceData.landmarks) && (
            <div className="results">
              <p>Wajah terdeteksi!</p>
              <p>Jumlah landmark: {faceData.landmarks.length}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WebcamPage; 