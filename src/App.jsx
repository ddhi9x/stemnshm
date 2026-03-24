import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Mentors from './pages/Mentors';
import Schedule from './pages/Schedule';
import News from './pages/News';
import FinalEvent from './pages/FinalEvent';
import FAQ from './pages/FAQ';
import AdminDashboard from './admin/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="flex flex-col" style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, paddingBottom: '3rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gioi-thieu" element={<About />} />
            <Route path="/mentor" element={<Mentors />} />
            <Route path="/lich-trinh" element={<Schedule />} />
            <Route path="/tin-tuc" element={<News />} />
            <Route path="/chung-ket" element={<FinalEvent />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
