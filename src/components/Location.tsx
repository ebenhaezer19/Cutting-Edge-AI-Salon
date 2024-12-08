// import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Location() {
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const iframe = document.querySelector('#location-map') as HTMLIFrameElement;
    if (iframe) {
      iframe.onerror = () => setMapError(true);
    }
  }, []);

  return (
    <section id="location" className="py-16 bg-amber-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lokasi Salon Kami</h2>
            <p className="text-gray-600">Temukan kami di lokasi yang strategis</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              {!mapError ? (
                <iframe
                  id="location-map"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d991.6563267379602!2d106.82692516044855!3d-6.180879337007884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1733663792604!5m2!1sen!2sid"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="salon-location"
                  className="w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-[450px] bg-gray-100">
                  <div className="text-center p-6">
                    <p className="text-gray-600 mb-2">Peta tidak dapat dimuat</p>
                    <a 
                      href="https://goo.gl/maps/YOUR-LOCATION-LINK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-800 underline"
                    >
                      Buka di Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="h-6 w-6 text-amber-700 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Alamat</h3>
                  <p className="text-gray-600">Jl. Medan Merdeka Sel. No.10, RT.11/RW.2, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10110</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Navigation className="h-6 w-6 text-amber-700 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Petunjuk Arah</h3>
                  <p className="text-gray-600">Terletak dekat Perpustakaan Nasional, mudah diakses dengan transportasi umum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}