import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HairstyleRecommendation {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
}

// 5 set rekomendasi gaya rambut wanita
const recommendationSets = [
  // Set 1: Gaya Klasik Wanita
  [
    {
      id: 1,
      name: "Long Layered Cut",
      description: "Potongan berlapis panjang yang membingkai wajah dengan anggun.",
      imageUrl: "https://i.pinimg.com/564x/8c/b5/8b/8cb58b5c8e3a6d6a3f6d17c4def9c2d0.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "Classic Bob",
      description: "Potongan bob klasik sebahu yang cocok untuk semua bentuk wajah.",
      imageUrl: "https://i.pinimg.com/564x/c7/8f/c6/c78fc6d8e71d4cde31d05e3e123e96f3.jpg", 
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Side-Swept Bangs",
      description: "Poni menyamping yang lembut dan feminin.",
      imageUrl: "https://i.pinimg.com/564x/d7/7c/17/d77c17d6148906a8318294562d0660c1.jpg",
      price: "Rp 60.000"
    }
  ],
  // Set 2: Gaya Modern Wanita
  [
    {
      id: 1,
      name: "Pixie Cut",
      description: "Potongan pendek modern yang berani dan chic.",
      imageUrl: "https://i.pinimg.com/564x/f5/c9/16/f5c916e0f7b16ad0ed73d1742f0e9a76.jpg",
      price: "Rp 65.000"
    },
    {
      id: 2, 
      name: "Textured Lob",
      description: "Long bob bertekstur yang trendy dan mudah diatur.",
      imageUrl: "https://i.pinimg.com/564x/e9/e8/7c/e9e87c60b15ebcf0d9957f1c87d53e9d.jpg",
      price: "Rp 65.000"
    },
    {
      id: 3,
      name: "Shaggy Layers",
      description: "Layer bertingkat yang memberikan volume dan gerakan.",
      imageUrl: "https://i.pinimg.com/564x/b0/13/33/b01333f5ea13f15459e40c464b12a101.jpg",
      price: "Rp 65.000"
    }
  ],
  // Set 3: Gaya Korea Wanita
  [
    {
      id: 1,
      name: "Korean See-Through Bangs",
      description: "Poni tipis transparan ala Korea yang lembut.",
      imageUrl: "https://i.pinimg.com/564x/e9/0a/a0/e90aa0666b831f0f9e7d5f9138d67b6c.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "C-Curl Bob",
      description: "Bob pendek dengan ujung melengkung ke dalam.",
      imageUrl: "https://i.pinimg.com/564x/b7/f7/3d/b7f73d9f4f3c2c6b0f3c8d0f9c9b8c7a.jpg",
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Air Bangs",
      description: "Poni ringan dan natural yang membingkai wajah.",
      imageUrl: "https://i.pinimg.com/564x/d8/e9/f0/d8e9f0b3c7d6f5c4b2c1d0f8c7b6a5d4.jpg",
      price: "Rp 60.000"
    }
  ],
  // Set 4: Gaya Elegan Wanita
  [
    {
      id: 1,
      name: "Sleek Straight",
      description: "Rambut lurus mengkilap yang elegan dan sophisticated.",
      imageUrl: "https://i.pinimg.com/564x/c6/d5/e4/c6d5e4b3c2d1f8c7b6a5d4c3b2a1f8e7.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "Soft Waves",
      description: "Gelombang lembut yang romantis dan feminin.",
      imageUrl: "https://i.pinimg.com/564x/a9/b8/c7/a9b8c7d6e5f4c3b2a1d0f8c7b6a5d4c3.jpg",
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Elegant Updo",
      description: "Sanggul modern yang cocok untuk acara formal.",
      imageUrl: "https://i.pinimg.com/564x/f4/e3/d2/f4e3d2b1c0d9e8a7b6a5d4c3b2a1f8e7.jpg",
      price: "Rp 60.000"
    }
  ],
  // Set 5: Gaya Trendy Wanita
  [
    {
      id: 1,
      name: "Curtain Bangs",
      description: "Poni terbelah tengah yang sedang tren.",
      imageUrl: "https://i.pinimg.com/564x/b5/c4/d3/b5c4d3b1c0d9e8a7b6a5d4c3b2a1f8e7.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "Butterfly Cut",
      description: "Layer bertingkat yang memberikan efek kupu-kupu.",
      imageUrl: "https://i.pinimg.com/564x/e2/d1/c0/e2d1c0b1c0d9e8a7b6a5d4c3b2a1f8e7.jpg",
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Wolf Cut",
      description: "Potongan edgy dengan layer bertingkat yang trendy.",
      imageUrl: "https://i.pinimg.com/564x/a1/b2/c3/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5.jpg",
      price: "Rp 60.000"
    }
  ]
];

const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = useState<HairstyleRecommendation[]>([]);

  useEffect(() => {
    // Pilih set rekomendasi secara random saat komponen dimount
    const randomIndex = Math.floor(Math.random() * recommendationSets.length);
    setSelectedSet(recommendationSets[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Rekomendasi Gaya Rambut untuk Anda
          </h1>
          <p className="text-gray-600">
            Berdasarkan analisis bentuk wajah Anda, berikut adalah gaya rambut yang kami rekomendasikan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedSet.map((style) => (
            <div key={style.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-12">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center p-4">
                    <p className="font-semibold">{style.name}</p>
                    <p className="text-sm">Gambar tidak tersedia</p>
                  </div>
                  <img 
                    src={style.imageUrl} 
                    alt={style.name}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{style.name}</h3>
                <p className="text-gray-600 mb-4">{style.description}</p>
                <p className="text-lg font-bold text-amber-600 mb-4">{style.price}</p>
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

export default RecommendationPage; 