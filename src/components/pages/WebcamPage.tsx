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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingCamera, setIsUsingCamera] = useState<boolean>(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Matikan kamera saat upload gambar
    stopCamera();
    setIsUsingCamera(false);
    setFaceData(null);

    // Validasi tipe file
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Hanya file PNG dan JPEG yang diperbolehkan');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Baca file sebagai URL data
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!canvasRef.current || !e.target?.result) return;
        
        // Simpan gambar yang diupload
        setUploadedImage(e.target.result as string);
        
        // Buat image element untuk menampilkan gambar
        const img = new Image();
        img.onload = async () => {
          const canvas = canvasRef.current!;
          canvas.width = img.width;
          canvas.height = img.height;
          
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Could not get canvas context');
          
          // Gambar image ke canvas
          context.drawImage(img, 0, 0);
          const imageData = canvas.toDataURL('image/jpeg');

          // Kirim ke server untuk analisis
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

          // Gambar landmarks di atas gambar
          context.fillStyle = '#00ff00';
          data.landmarks.forEach(point => {
            if (typeof point.x === 'number' && typeof point.y === 'number') {
              context.beginPath();
              context.arc(point.x, point.y, 2, 0, 2 * Math.PI);
              context.fill();
            }
          });
        };
        
        img.src = e.target.result as string;
      };
      
      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err instanceof Error ? err.message : 'Error memproses gambar');
      setFaceData(null);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input file
      }
    }
  };

  const switchToCamera = async () => {
    setIsUsingCamera(true);
    setFaceData(null);
    setUploadedImage(null);
    await startCamera();
  };

  return (
    <div className="webcam-container p-4">
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
          <div className="flex flex-col items-center gap-6">
            <div className="video-container relative w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
              {isLoading && isUsingCamera && (
                <div className="loading-overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                  <p>Memuat kamera...</p>
                </div>
              )}
              {isUsingCamera ? (
                <video
                  ref={videoRef}
                  className="webcam-video w-full"
                  playsInline
                  autoPlay
                />
              ) : uploadedImage && (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full"
                  />
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="landmark-canvas absolute top-0 left-0 w-full h-full"
              />
            </div>

            <div className="flex flex-col gap-4 items-center">
              <div className="flex gap-4">
                {isUsingCamera ? (
                  <button 
                    onClick={handleCapture}
                    className="capture-button bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded"
                    disabled={!cameraPermission || isProcessing || isLoading}
                  >
                    {isProcessing ? 'Memproses...' : 'Ambil Foto'}
                  </button>
                ) : (
                  <button 
                    onClick={switchToCamera}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded"
                    disabled={isProcessing}
                  >
                    Gunakan Kamera
                  </button>
                )}
                
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessing}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Memproses...' : 'Upload Gambar'}
                  </button>
                </div>
              </div>
              
              {faceData?.landmarks && Array.isArray(faceData.landmarks) && (
                <div className="results text-center p-4 bg-white rounded-lg shadow-md">
                  <p className="text-green-600 font-semibold mb-2">✅ Wajah terdeteksi!</p>
                  <p className="text-gray-600 mb-4">
                    {faceData.landmarks.length} titik landmark terdeteksi pada wajah Anda
                  </p>
                  <button
                    onClick={handleRecommendation}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
                  >
                    Lihat Rekomendasi
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WebcamPage; 

