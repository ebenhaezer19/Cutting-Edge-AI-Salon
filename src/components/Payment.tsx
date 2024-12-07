import React, { useState, useEffect } from 'react';
import { QrCode, Shield, X } from 'lucide-react';
import { Button } from './ui/Button';

export default function Payment() {
  const [showQR, setShowQR] = useState<boolean>(false);
  const [paymentSimulation, setPaymentSimulation] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<boolean>(false);

  useEffect(() => {
    // Cek apakah ada service yang dipilih dari popup Services
    const checkSelectedService = () => {
      if (localStorage.getItem('selectedService') === 'true') {
        setSelectedService(true);
      }
    };

    window.addEventListener('storage', checkSelectedService);
    checkSelectedService(); // Cek saat komponen dimount

    return () => {
      window.removeEventListener('storage', checkSelectedService);
    };
  }, []);

  const handleShowQR = () => {
    // Jika belum memilih layanan, arahkan ke bagian Our Services
    if (!selectedService) {
      window.location.href = '/#services';
      return;
    }

    setShowQR(true);
    
    // Mulai simulasi pembayaran setelah QR code ditampilkan
    setTimeout(() => {
      setPaymentSimulation(true);
    }, 1000);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (paymentSimulation) {
      timer = setTimeout(() => {
        localStorage.setItem('fromPayment', 'true');
        localStorage.removeItem('selectedService');
        window.location.href = '/payment-success';
      }, 7000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [paymentSimulation]);

  return (
    <section id="payment" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Pembayaran Mudah & Aman</h2>
          
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col items-center justify-center gap-8">
              <div>
                <QrCode className="h-24 w-24 text-amber-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pembayaran QRIS</h3>
                <p className="text-gray-600 mb-4">
                  Scan, bayar, dan selesai! Kami menerima semua metode pembayaran yang mendukung QRIS untuk kenyamanan Anda.
                </p>
                <Button
                  variant="primary"
                  onClick={handleShowQR}
                  className="px-6 py-2"
                >
                  Tampilkan Kode QRIS
                </Button>
                {!selectedService && (
                  <p className="text-sm text-red-500 mt-2">
                    Silakan pilih layanan terlebih dahulu di bagian Layanan Kami
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-amber-700" />
                <p className="text-gray-600">
                  Pembayaran Anda dilindungi dengan keamanan standar industri
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QRIS */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
            <Button
              variant="ghost"
              onClick={() => setShowQR(false)}
              className="absolute right-4 top-4"
            >
              <X className="h-6 w-6" />
            </Button>
            
            {!paymentSimulation ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Pindai untuk Membayar</h3>
                <img
                  src="images/QRIS.jpg"
                  alt="Kode QRIS"
                  className="w-64 h-64 mx-auto mb-4"
                />
                <p className="text-sm text-gray-600">
                  Pindai kode QRIS ini menggunakan aplikasi pembayaran pilihan Anda
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Memproses Pembayaran</h3>
                <div className="flex justify-center items-center mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-700"></div>
                </div>
                <p className="text-sm text-gray-600">
                  Pembayaran sedang diproses... Mohon tunggu
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}