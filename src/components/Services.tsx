import { Scissors } from 'lucide-react';
import { PaintBrush } from './icons/PaintBrush';
import { useState, useEffect } from 'react';

export default function Services() {
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);

  const services = [
    {
      icon: <Scissors className="h-8 w-8 transform group-hover:rotate-45 transition-transform duration-300" />,
      name: "Potong Rambut dengan AI",
      description: "Potongan presisi dipandu oleh analisis AI untuk bentuk dan fitur wajah Anda",
      price: "Rp 70.000",
      type: "haircut"
    },
    {
      icon: <PaintBrush className="h-8 w-8 transform group-hover:scale-110 transition-transform duration-300" />,
      name: "Pewarnaan Rambut Pintar",
      description: "Warna rambut yang direkomendasikan AI sesuai dengan warna kulit Anda",
      price: "Rp 150.000",
      type: "color"
    }
  ];

  const handleService = (type: string) => {
    localStorage.setItem('serviceType', type);
    localStorage.setItem('selectedService', 'true');
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/#payment';
  };

  useEffect(() => {
    const paymentStatus = localStorage.getItem('paymentStatus');
    if (paymentStatus === 'success') {
      localStorage.removeItem('paymentStatus');
      const serviceType = localStorage.getItem('serviceType');
      if (serviceType) {
        window.location.href = '/webcam';
      }
    }
  }, []);

  return (
    <section id="services" className="py-16 bg-amber-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 hover:text-amber-700 transition-colors duration-300">Layanan Kami</h2>
          <p className="text-gray-600 hover:text-amber-600 transition-colors duration-300">Rasakan layanan kecantikan berbasis AI kami</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-amber-50">
              <div className="text-amber-700 mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-700 transition-colors duration-300">{service.name}</h3>
              <p className="text-gray-600 mb-4 group-hover:text-amber-600 transition-colors duration-300">{service.description}</p>
              <p className="text-lg font-bold text-amber-700">{service.price}</p>
              <button 
                className="mt-4 inline-block bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-600 transform hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300" 
                onClick={() => {
                  if(index === 0) {
                    setShowPopup1(true);
                  } else {
                    setShowPopup2(true);
                  }
                }}
              >
                Mulai Sekarang
              </button>
            </div>
          ))}
        </div>
      </div>

      {showPopup1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all duration-300" onClick={() => setShowPopup1(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative transform hover:scale-105 transition-transform duration-300" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 hover:text-amber-700 transition-colors duration-300">Potong Rambut dengan AI</h3>
              <p className="text-gray-600 mb-4 hover:text-amber-600 transition-colors duration-300">
                Lanjutkan ke pembayaran untuk memulai analisis.
              </p>
              <button 
                className="inline-block bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-600 transform hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300"
                onClick={() => handleService('haircut')}
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all duration-300" onClick={() => setShowPopup2(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative transform hover:scale-105 transition-transform duration-300" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 hover:text-amber-700 transition-colors duration-300">Pewarnaan Rambut Pintar</h3>
              <p className="text-gray-600 mb-4 hover:text-amber-600 transition-colors duration-300">
                Lanjutkan ke pembayaran untuk memulai analisis.
              </p>
              <button
                className="inline-block bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-600 transform hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300"
                onClick={() => handleService('color')}
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}