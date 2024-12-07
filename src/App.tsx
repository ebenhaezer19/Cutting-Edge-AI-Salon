import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Services from './components/Services';
import Payment from './components/Payment';
import Location from './components/Location';
import Footer from './components/Footer';
import PaymentSuccess from './pages/payment-success';
import WebcamPage from './pages/WebcamPage';
import ErrorBoundary from './components/ErrorBoundary';

function MainContent() {
  return (
    <>
      <Header/>
      <Home />
      <Services />
      <Payment />
      <Location />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen">
          <main>
            <Routes>
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/" element={<MainContent />} />
              <Route path="/webcam" element={<WebcamPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;