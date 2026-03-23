import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="navbar glass">
      <div className="container flex justify-between items-center h-navbar">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="NSHM Logo" style={{height: '40px', objectFit: 'contain'}} />
          <span className="navbar-title" style={{marginLeft: '0.5rem', fontWeight: 800, color: 'var(--text-main)'}}>
            Ngày Hội <span className="text-primary">STEM</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="navbar-menu desktop-only">
          <Link to="/" className="nav-link">Trang Chủ</Link>
          <Link to="/gioi-thieu" className="nav-link">Giới Thiệu</Link>
          <Link to="/mentor" className="nav-link">Mentor</Link>
          <Link to="/tin-tuc" className="nav-link">Tin Tức</Link>
          <Link to="/chung-ket" className="nav-link">Chung Kết</Link>
          {/* Admin Login Button - very small */}
          <Link to="/admin" className="text-muted" style={{fontSize: '0.75rem', marginLeft: '1rem', opacity: 0.6}} title="Admin CMS">
             🔒
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu animate-fade-in">
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Trang Chủ</Link>
          <Link to="/gioi-thieu" className="nav-link" onClick={() => setIsOpen(false)}>Giới Thiệu</Link>
          <Link to="/mentor" className="nav-link" onClick={() => setIsOpen(false)}>Mentor</Link>
          <Link to="/tin-tuc" className="nav-link" onClick={() => setIsOpen(false)}>Tin Tức</Link>
          <Link to="/chung-ket" className="nav-link" onClick={() => setIsOpen(false)}>Chung Kết</Link>
          <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>Admin</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
