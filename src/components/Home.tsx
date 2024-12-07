import React from 'react';
import { Clock, Sparkles, Brain } from 'lucide-react';

export default function Home() {
  return (
    <section id="home" className="pt-24 pb-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
  Welcome to
  <span
    className="ml-2 text-25xl font-bold text-gray-800 hover:text-amber-700 transition-colors duration-300"
    style={{ fontFamily: "'Quotes Script', cursive", color: '#c1a88b' }}
  >
    Cutting Edge
  </span>
</h1>
          <p className="text-lg text-gray-600 mb-8 hover:text-amber-700 transition-colors duration-300">
            Experience the future of beauty with our AI-enhanced salon services
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-amber-50">
              <Brain className="h-12 w-12 text-amber-700 mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-2 hover:text-amber-700 transition-colors duration-300">AI Personalization</h3>
              <p className="text-gray-600 hover:text-amber-600 transition-colors duration-300">
                Our AI analyzes your facial features and preferences to recommend perfect styles
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-amber-50">
              <Sparkles className="h-12 w-12 text-amber-700 mx-auto mb-4 animate-pulse hover:animate-none" />
              <h3 className="text-xl font-semibold mb-2 hover:text-amber-700 transition-colors duration-300">Smart Styling</h3>
              <p className="text-gray-600 hover:text-amber-600 transition-colors duration-300">
                Virtual try-on technology lets you preview styles before committing
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-amber-50">
              <Clock className="h-12 w-12 text-amber-700 mx-auto mb-4 hover:rotate-180 transition-transform duration-500" />
              <h3 className="text-xl font-semibold mb-2 hover:text-amber-700 transition-colors duration-300">Business Hours</h3>
              <p className="text-gray-600 hover:text-amber-600 transition-colors duration-300">
                Open Daily<br />
                9:00 AM - 9:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}