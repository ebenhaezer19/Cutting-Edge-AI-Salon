import React, { useEffect } from 'react';

const BookingSuccess = () => {
  useEffect(() => {
    // Bersihkan semua state dan flags yang mungkin menyebabkan redirect
    const cleanupState = () => {
      // Hapus semua data booking
      localStorage.removeItem('isColorService');
      localStorage.removeItem('isHaircutService');
      localStorage.removeItem('selectedColor');
      localStorage.removeItem('selectedHairstyle');
      localStorage.removeItem('selectedPrice');
      
      // Hapus state routing dan flags lainnya
      localStorage.removeItem('fromPayment');
      localStorage.removeItem('paymentStatus');
      localStorage.removeItem('selectedService');
      sessionStorage.clear(); // Bersihkan semua session storage
      
      // Hard redirect ke localhost:5173
      window.location.href = 'http://localhost:5173';
    };

    // Set timer untuk cleanup dan redirect
    const timer = setTimeout(cleanupState, 10000);

    return () => {
      clearTimeout(timer);
      cleanupState(); // Pastikan state dibersihkan saat component unmount
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-[400px] h-[600px] bg-white rounded-[20px] shadow-lg flex flex-col justify-center items-center text-center px-6">
        <div className="text-[80px] text-amber-600 animate-bounce transform hover:scale-110 transition-all duration-300 hover:rotate-12">🎉</div>
        <div className="mt-5 mb-5 text-[18px] font-bold text-gray-800">
          Terima Kasih Sudah Memesan!
        </div>
        <p className="text-gray-600 mb-8">
          Pesanan Anda telah kami terima. Silakan menunggu para pelayan kami untuk melayani Anda.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Halaman akan kembali ke beranda dalam 5 detik...
        </p>
      </div>
    </div>
  );
};

export default BookingSuccess; 