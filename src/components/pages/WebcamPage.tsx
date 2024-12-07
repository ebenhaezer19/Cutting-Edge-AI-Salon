'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
      
      stopCamera();

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
          deviceId: cameras[0].deviceId
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) return reject(new Error('Video element tidak ditemukan'));
          
          const timeoutId = setTimeout(() => {
            reject(new Error('Timeout menunggu video siap'));
          }, 5000);
          
          videoRef.current.onloadedmetadata = () =>{
            clearTimeout(timeoutId);
            resolve();
          };
          
          videoRef.current.onerror = (e) => {
            clearTimeout(timeoutId);
            reject(new Error(`Error loading video: ${e}`));
          };
        });

        let retryCount = 0;
        const maxRetries= 3;
        
        while (retryCount < maxRetries) {
          try {
            await videoRef.current.play();
            setCameraPermission(true);
            break;
          } catch (playError) {
            console.warn(`Play attempt ${retryCount + 1} failed:`, playError);
            retryCount++;
            
            if (retryCount === maxRetries) {
              throw new Error('Gagal memulai video setelah beberapa percobaan');
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err instanceof Error ? err.message : 'Gagal mengakses kamera');
      setCameraPermission(false);
      stopCamera();
    } finally {
      setIsLoading(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    let mounted = true;
   let cleanupTimeout: ReturnType<typeof setTimeout>;

    const initCamera = async () => {
      if (!mounted) return;
      
      cleanupTimeout = setTimeout(async () => {
        if (mounted) {
          await startCamera();
        }
      }, 100);
    };

    initCamera();

    return () => {
      mounted = false;
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
      }
      stopCamera();
    };
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

  const handleRecommendation = () => {
    const serviceType = localStorage.getItem('serviceType');
    if (serviceType === 'color') {
      navigate('/color-recommendation');
    } else {
      navigate('/recommendation');
    }
  };

  return (
    <div className="webcam-container">
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => {
              setError('');
              setTimeout(startCamera, 100);
            }}
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
          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={handleCapture}
              className="capture-button bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded"
              disabled={!cameraPermission || isProcessing || isLoading}
            >
              {isProcessing ? 'Memproses...' : 'Ambil Foto'}
            </button>
            
            {faceData?.landmarks && Array.isArray(faceData.landmarks) && (
              <div className="results text-center">
                <p className="text-green-600 font-semibold mb-2">Wajah terdeteksi!</p>
                <p className="text-gray-600 mb-4">Jumlah landmark: {faceData.landmarks.length}</p>
                <button
                  onClick={handleRecommendation}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                  Lihat Rekomendasi
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WebcamPage; 

