import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useI18n } from '../i18n/I18nContext';

const Footer = () => {
  const { t } = useI18n();
  const [footerData, setFooterData] = useState({
    tagline: 'STEM Kiến Tạo Thế Giới Xanh 2025-2026',
    email: 'info@ngoisaocaohanoi.edu.vn',
    hotline: '1900 xxxx'
  });

  useEffect(() => {
    const fetchFooter = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setFooterData(data);
    };
    fetchFooter();
  }, []);

  return (
    <footer style={{ background: 'var(--text-main)', color: 'white', padding: '3rem 1rem 1rem' }}>
      <div className="container grid grid-cols-3 gap-8" style={{ marginBottom: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--nshm-red)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{background: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}}>NSHM</span>
            {t('footer.stem_title')}
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>{footerData.tagline}</p>
        </div>
        <div>
          <h4 style={{ color: 'white' }}>{t('footer.contact')}</h4>
          <p style={{ color: 'var(--text-muted)' }}>Email: {footerData.email}</p>
          <p style={{ color: 'var(--text-muted)' }}>Hotline: {footerData.hotline}</p>
        </div>
        <div>
          <h4 style={{ color: 'white' }}>{t('footer.support')}</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/gioi-thieu" style={{color: '#94a3b8', transition: 'color 0.3s'}} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{t('footer.rules')}</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/faq" style={{color: '#94a3b8', transition: 'color 0.3s'}} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{t('footer.faq')}</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/mentor" style={{color: '#94a3b8', transition: 'color 0.3s'}} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{t('footer.mentor')}</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/lich-trinh" style={{color: '#94a3b8', transition: 'color 0.3s'}} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{t('footer.schedule')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
        <p>&copy; 2025 {t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
