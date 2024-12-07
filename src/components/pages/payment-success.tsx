import React from 'react';

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-green-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Pembayaran Berhasil!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Terima kasih telah melakukan pembayaran. Transaksi Anda telah diproses dengan sukses.
        </p>
        <a href="/" className="text-blue-500 hover:underline">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess; 