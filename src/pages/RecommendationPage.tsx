import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HairstyleRecommendation {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
}

const recommendationSets = [
  // Set 1: Gaya Klasik
  [
    {
      id: 1,
      name: "Long Layered Cut",
      description: "Potongan berlapis panjang yang membingkai wajah dengan anggun.",
      imageUrl: "/images/hairstyles/long-layered.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "Classic Bob",
      description: "Potongan bob klasik sebahu yang cocok untuk semua bentuk wajah.",
      imageUrl: "/images/hairstyles/classic-bob.jpg",
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Side-Swept Bangs",
      description: "Poni menyamping yang lembut dan feminin.",
      imageUrl: "/images/hairstyles/side-swept.jpg",
      price: "Rp 60.000"
    }
  ],
  // Set 2: Gaya Modern
  [
    {
      id: 1,
      name: "Pixie Cut",
      description: "Potongan pendek modern yang berani dan chic.",
      imageUrl: "/images/hairstyles/pixie.jpg",
      price: "Rp 65.000"
    },
    {
      id: 2,
      name: "Textured Lob",
      description: "Long bob bertekstur yang trendy dan mudah diatur.",
      imageUrl: "/images/hairstyles/textured-lob.jpg",
      price: "Rp 65.000"
    },
    {
      id: 3,
      name: "Shaggy Layers",
      description: "Layer bertingkat yang memberikan volume dan gerakan.",
      imageUrl: "/images/hairstyles/shaggy.jpg",
      price: "Rp 65.000"
    }
  ],
  // Set 3: Gaya Korea
  [
    {
      id: 1,
      name: "Korean See-Through Bangs",
      description: "Poni tipis transparan ala Korea yang lembut.",
      imageUrl: "/images/hairstyles/see-through.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "C-Curl Bob",
      description: "Bob pendek dengan ujung melengkung ke dalam.",
      imageUrl: "/images/hairstyles/c-curl.jpg",
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Air Bangs",
      description: "Poni ringan dan natural yang membingkai wajah.",
      imageUrl: "/images/hairstyles/air-bangs.jpg",
      price: "Rp 60.000"
    }
  ],
  // Set 4: Gaya Elegan
  [
    {
      id: 1,
      name: "Sleek Straight",
      description: "Rambut lurus mengkilap yang elegan.",
      imageUrl: "/images/hairstyles/sleek.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "Soft Waves",
      description: "Gelombang lembut yang romantis.",
      imageUrl: "/images/hairstyles/soft-waves.jpg",
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Elegant Updo",
      description: "Sanggul modern yang cocok untuk acara formal.",
      imageUrl: "/images/hairstyles/updo.jpg",
      price: "Rp 60.000"
    }
  ],
  // Set 5: Gaya Trendy
  [
    {
      id: 1,
      name: "Curtain Bangs",
      description: "Poni terbelah tengah yang sedang tren.",
      imageUrl: "/images/hairstyles/curtain.jpg",
      price: "Rp 60.000"
    },
    {
      id: 2,
      name: "Butterfly Cut",
      description: "Layer bertingkat yang memberikan efek kupu-kupu.",
      imageUrl: "/images/hairstyles/butterfly.jpg",
      price: "Rp 60.000"
    },
    {
      id: 3,
      name: "Wolf Cut",
      description: "Potongan edgy dengan layer bertingkat yang trendy.",
      imageUrl: "/images/hairstyles/wolf.jpg",
      price: "Rp 60.000"
    }
  ]
];

const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = useState<HairstyleRecommendation[]>([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * recommendationSets.length);
    setSelectedSet(recommendationSets[randomIndex]);
  }, []);

  const handleBooking = (style: HairstyleRecommendation) => {
    // Simpan informasi gaya yang dipilih
    localStorage.setItem('selectedHairstyle', style.name);
    localStorage.setItem('selectedPrice', style.price);
    localStorage.setItem('isHaircutService', 'true');
    navigate('/booking-success');
  };

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
                  onClick={() => handleBooking(style)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage; 