import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useI18n } from '../i18n/I18nContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [registerLink, setRegisterLink] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const { lang, switchLang, t } = useI18n();

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const { data } = await supabase.from('links').select('register').single();
        if (data && data.register) setRegisterLink(data.register);
        else setRegisterLink('#');
      } catch (e) {
        setRegisterLink('#');
      }
    };
    fetchLink();
  }, []);

  const langOptions = [
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'zh', flag: '🇨🇳', label: '中文' },
  ];

  const currentFlag = langOptions.find(l => l.code === lang)?.flag || '🇻🇳';

  return (
    <nav className="navbar glass">
      <div className="container flex justify-between items-center h-navbar">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="NSHM Logo" style={{height: '40px', objectFit: 'contain'}} />
          <span className="navbar-title" style={{marginLeft: '0.5rem', fontWeight: 800, color: 'var(--text-main)'}}>
            {t('nav.home') === 'Home' ? 'STEM' : 'Ngày Hội'} <span className="text-primary">STEM</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="navbar-menu desktop-only" style={{alignItems: 'center'}}>
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/gioi-thieu" className="nav-link">{t('nav.about')}</Link>
          <Link to="/mentor" className="nav-link">{t('nav.mentor')}</Link>
          <Link to="/lich-trinh" className="nav-link">{t('nav.schedule')}</Link>
          <Link to="/tin-tuc" className="nav-link">{t('nav.news')}</Link>
          <Link to="/faq" className="nav-link">{t('nav.faq')}</Link>
          
          {/* Explore Dropdown */}
          <div className="nav-item-dropdown" style={{position: 'relative'}}>
            <div className="nav-link cursor-pointer" style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}} onClick={() => setShowExplore(!showExplore)}>
              Khám Phá <ChevronDown size={14} style={{transition: 'transform 0.2s', transform: showExplore ? 'rotate(180deg)' : 'rotate(0)'}}/>
            </div>
            {showExplore && (
              <div style={{position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', minWidth: '190px', overflow: 'hidden', zIndex: 50}}>
                <Link to="/thu-vien" onClick={() => setShowExplore(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors border-b border-gray-100" style={{textDecoration: 'none'}}>📸 {t('nav.gallery') || 'Thư Viện Ảnh'}</Link>
                <Link to="/ket-qua" onClick={() => setShowExplore(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b border-gray-100" style={{textDecoration: 'none'}}>🏆 {t('nav.results') || 'Đội Thi & Kết Quả'}</Link>
                <Link to="/passport" onClick={() => setShowExplore(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors" style={{textDecoration: 'none'}}>🛂 {t('nav.passport') || 'Passport STEM'}</Link>
              </div>
            )}
          </div>
          {registerLink && (
            <a href={registerLink} target="_blank" rel="noreferrer" className="btn btn-nshm" style={{padding: '0.5rem 1.2rem', fontSize: '0.8rem', marginLeft: '0.8rem', borderRadius: '10px'}} onClick={() => supabase.rpc('increment_click', { btn: 'clicks_register' })}>
              {t('nav.register')}
            </a>
          )}
          {/* Language Switcher */}
          <div style={{position: 'relative', marginLeft: '0.5rem'}}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.3rem 0.5rem', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
              {currentFlag}
            </button>
            {showLangMenu && (
              <div style={{position: 'absolute', top: '100%', right: 0, marginTop: '0.3rem', background: 'white', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden', zIndex: 100, minWidth: '140px'}}>
                {langOptions.map(opt => (
                  <button key={opt.code} onClick={() => { 
                    switchLang(opt.code); 
                    setShowLangMenu(false);
                    // Handle Google Translate
                    const googCode = opt.code === 'zh' ? 'zh-CN' : opt.code;
                    const select = document.querySelector('.goog-te-combo');
                    if (select) {
                      select.value = googCode;
                      select.dispatchEvent(new Event('change'));
                    }
                  }} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.8rem', width: '100%', border: 'none', background: lang === opt.code ? '#f0fdf4' : 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: lang === opt.code ? 700 : 400}}>
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                    {lang === opt.code && <span style={{marginLeft: 'auto', color: '#22c55e'}}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/admin" className="text-muted" style={{fontSize: '0.75rem', marginLeft: '0.3rem', opacity: 0.4}} title="Admin CMS">
             🔒
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile lang switcher */}
          <div className="mobile-only" style={{position: 'relative'}}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.25rem 0.4rem', cursor: 'pointer', fontSize: '0.9rem'}}>
              {currentFlag}
            </button>
            {showLangMenu && (
              <div style={{position: 'absolute', top: '100%', right: 0, marginTop: '0.3rem', background: 'white', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden', zIndex: 100, minWidth: '130px'}}>
                {langOptions.map(opt => (
                  <button key={opt.code} onClick={() => { 
                    switchLang(opt.code); 
                    setShowLangMenu(false); 
                    // Handle Google Translate
                    const googCode = opt.code === 'zh' ? 'zh-CN' : opt.code;
                    const select = document.querySelector('.goog-te-combo');
                    if (select) { select.value = googCode; select.dispatchEvent(new Event('change')); }
                  }} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.8rem', width: '100%', border: 'none', background: lang === opt.code ? '#f0fdf4' : 'white', cursor: 'pointer', fontSize: '0.82rem'}}>
                    <span>{opt.flag}</span> <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu animate-fade-in">
          {registerLink && (
            <a href={registerLink} target="_blank" rel="noreferrer" className="btn btn-nshm" style={{width: '100%', marginBottom: '0.8rem', padding: '0.8rem', fontSize: '0.95rem', textAlign: 'center'}} onClick={() => { supabase.rpc('increment_click', { btn: 'clicks_register' }); setIsOpen(false); }}>
              {t('nav.register')}
            </a>
          )}
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>{t('nav.home')}</Link>
          <Link to="/gioi-thieu" className="nav-link" onClick={() => setIsOpen(false)}>{t('nav.about')}</Link>
          <Link to="/mentor" className="nav-link" onClick={() => setIsOpen(false)}>{t('nav.mentor')}</Link>
          <Link to="/lich-trinh" className="nav-link" onClick={() => setIsOpen(false)}>{t('nav.schedule')}</Link>
          <Link to="/tin-tuc" className="nav-link" onClick={() => setIsOpen(false)}>{t('nav.news')}</Link>
          <Link to="/thu-vien" className="nav-link" onClick={() => setIsOpen(false)}>📸 {t('nav.gallery') || 'Thư Viện'}</Link>
          <Link to="/ket-qua" className="nav-link" onClick={() => setIsOpen(false)}>🏆 {t('nav.results') || 'Kết Quả'}</Link>
          <Link to="/passport" className="nav-link" onClick={() => setIsOpen(false)}>🛂 {t('nav.passport') || 'Passport'}</Link>
          <Link to="/faq" className="nav-link" onClick={() => setIsOpen(false)}>{t('nav.faq')}</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
