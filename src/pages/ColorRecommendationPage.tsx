import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HairColorRecommendation {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
}

// 5 set rekomendasi warna rambut
const colorRecommendationSets = [
  // Set 1: Warna Natural
  [
    {
      id: 1,
      name: "Chocolate Brown",
      description: "Warna coklat hangat yang natural dan cocok untuk kulit Asia.",
      imageUrl: "/images/colors/chocolate-brown.jpg",
      price: "Rp 350.000"
    },
    {
      id: 2,
      name: "Caramel Highlights",
      description: "Highlight karamel yang memberikan dimensi natural.",
      imageUrl: "/images/colors/caramel-highlights.jpg",
      price: "Rp 450.000"
    },
    {
      id: 3,
      name: "Ash Brown",
      description: "Coklat abu-abu yang elegan dan modern.",
      imageUrl: "/images/colors/ash-brown.jpg",
      price: "Rp 400.000"
    }
  ],
  // ... tambahkan set warna lainnya seperti yang ada di file sebelumnya
];

const ColorRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = useState<HairColorRecommendation[]>([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * colorRecommendationSets.length);
    setSelectedSet(colorRecommendationSets[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Rekomendasi Warna Rambut untuk Anda
          </h1>
          <p className="text-gray-600">
            Berdasarkan analisis warna kulit Anda, berikut adalah warna rambut yang kami rekomendasikan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedSet.map((color) => (
            <div key={color.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-12">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center p-4">
                    <p className="font-semibold">{color.name}</p>
                    <p className="text-sm">Gambar tidak tersedia</p>
                  </div>
                  <img 
                    src={color.imageUrl} 
                    alt={color.name}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{color.name}</h3>
                <p className="text-gray-600 mb-4">{color.description}</p>
                <p className="text-lg font-bold text-amber-600 mb-4">{color.price}</p>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/webcam')}
            className="text-amber-600 hover:text-amber-700 font-semibold"
          >
            ← Kembali ke Kamera
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorRecommendationPage;