import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleScanClick = () => {
    navigate('/webcam');
  };

  useEffect(() => {
    // Set status pembayaran berhasil hanya jika dari halaman payment
    const fromPayment = localStorage.getItem('fromPayment');
    if (fromPayment === 'true') {
      localStorage.setItem('paymentStatus', 'success');
      localStorage.removeItem('fromPayment');
      
      // Redirect ke services setelah 3 detik
      const timer = setTimeout(() => {
        window.location.href = '/#services';
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-[400px] h-[600px] bg-white rounded-[20px] shadow-lg flex flex-col justify-center items-center text-center px-6">
        <div className="text-[80px] text-green-700 animate-bounce transform hover:scale-110 transition-all duration-300 hover:rotate-12">✔️</div>
        <div className="mt-5 mb-5 text-[18px] font-bold text-gray-800">
          Pembayaran Anda Telah Berhasil
        </div>
        <button
          onClick={handleScanClick}
          className="mt-5 px-5 py-3 bg-amber-700 text-white text-base font-bold rounded-md shadow hover:bg-amber-800 transition-colors"
        >
          Scan Sekarang
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;