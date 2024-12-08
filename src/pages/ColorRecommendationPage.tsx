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
  {
    title: "Warna Natural yang Mempesona dan Timeless",
    colors: [
      {
        id: 1,
        name: "Chocolate Brown",
        description: "Warna coklat hangat yang natural dan cocok untuk kulit Asia.",
        imageUrl: "/images/colors/chocolate-brown.jpg",
        price: "Rp 40.000"
      },
      {
        id: 2,
        name: "Caramel Highlights",
        description: "Highlight karamel yang memberikan dimensi natural.",
        imageUrl: "/images/colors/caramel-highlights.jpg",
        price: "Rp 40.000"
      },
      {
        id: 3,
        name: "Ash Brown",
        description: "Coklat abu-abu yang elegan dan modern.",
        imageUrl: "/images/colors/ash-brown.jpg",
        price: "Rp 40.000"
      }
    ]
  },
  // Set 2: Warna Bold
  {
    title: "Warna Bold yang Berani dan Menawan",
    colors: [
      {
        id: 1,
        name: "Burgundy Red",
        description: "Merah keunguan yang berani dan mewah.",
        imageUrl: "/images/colors/burgundy-red.jpg", 
        price: "Rp 45.000"
      },
      {
        id: 2,
        name: "Royal Purple",
        description: "Ungu kebiruan yang unik dan mencolok.",
        imageUrl: "/images/colors/royal-purple.jpg",
        price: "Rp 45.000"
      },
      {
        id: 3,
        name: "Deep Blue",
        description: "Biru gelap yang misterius dan edgy.",
        imageUrl: "/images/colors/deep-blue.jpg",
        price: "Rp 45.000"
      }
    ]
  },
  // Set 3: Warna Pastel
  {
    title: "Warna Pastel yang Lembut dan Romantis",
    colors: [
      {
        id: 1,
        name: "Rose Gold",
        description: "Pink keemasan yang lembut dan feminin.",
        imageUrl: "/images/colors/rose-gold.jpg",
        price: "Rp 50.000"
      },
      {
        id: 2,
        name: "Lavender Grey",
        description: "Abu-abu keunguan yang soft dan trendy.",
        imageUrl: "/images/colors/lavender-grey.jpg",
        price: "Rp 50.000"
      },
      {
        id: 3,
        name: "Mint Green",
        description: "Hijau mint yang segar dan unik.",
        imageUrl: "/images/colors/mint-green.jpg",
        price: "Rp 50.000"
      }
    ]
  },
  // Set 4: Warna Blonde
  {
    title: "Warna Blonde yang Glamor dan Sophisticated",
    colors: [
      {
        id: 1,
        name: "Honey Blonde",
        description: "Pirang madu yang hangat dan manis.",
        imageUrl: "/images/colors/honey-blonde.jpg",
        price: "Rp 55.000"
      },
      {
        id: 2,
        name: "Platinum Blonde",
        description: "Pirang pucat yang dramatis dan eye-catching.",
        imageUrl: "/images/colors/platinum-blonde.jpg",
        price: "Rp 55.000"
      },
      {
        id: 3,
        name: "Ash Blonde",
        description: "Pirang keabuan yang sophisticated.",
        imageUrl: "/images/colors/ash-blonde.jpg",
        price: "Rp 55.000"
      }
    ]
  },
  // Set 5: Warna Ombre
  {
    title: "Warna Ombre yang Trendy dan Artistic",
    colors: [
      {
        id: 1,
        name: "Caramel Ombre",
        description: "Gradasi dari coklat gelap ke karamel.",
        imageUrl: "/images/colors/caramel-ombre.jpg",
        price: "Rp 60.000"
      },
      {
        id: 2,
        name: "Silver Ombre",
        description: "Gradasi dari hitam ke abu-abu metalik.",
        imageUrl: "/images/colors/silver-ombre.jpg",
        price: "Rp 60.000"
      },
      {
        id: 3,
        name: "Rainbow Ombre",
        description: "Gradasi warna-warni yang playful.",
        imageUrl: "/images/colors/rainbow-ombre.jpg",
        price: "Rp 60.000"
      }
    ]
  }
];

const ColorRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = useState<{title: string, colors: HairColorRecommendation[]}>({title: '', colors: []});

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * colorRecommendationSets.length);
    setSelectedSet(colorRecommendationSets[randomIndex]);
  }, []);

  const handleBooking = (color: HairColorRecommendation) => {
    localStorage.setItem('selectedColor', color.name);
    localStorage.setItem('selectedPrice', color.price);
    localStorage.setItem('isColorService', 'true');
    navigate('/booking-success');
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {selectedSet.title}
          </h1>
          <p className="text-gray-600">
            Berdasarkan analisis warna kulit Anda, berikut adalah warna rambut yang kami rekomendasikan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedSet.colors.map((color) => (
            <div key={color.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center p-4">
                    <p className="font-semibold">{color.name}</p>
                    <p className="text-sm">Gambar tidak tersedia</p>
                  </div>
                </div>
                <img 
                  src={color.imageUrl} 
                  alt={color.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{color.name}</h3>
                <p className="text-gray-600 mb-4">{color.description}</p>
                <p className="text-lg font-bold text-amber-600 mb-4">{color.price}</p>
                <button 
                  onClick={() => handleBooking(color)}
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

export default ColorRecommendationPage;