import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Footer = () => {
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
            Ngày Hội STEM
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>{footerData.tagline}</p>
        </div>
        <div>
          <h4 style={{ color: 'white' }}>Liên Hệ</h4>
          <p style={{ color: 'var(--text-muted)' }}>Email: {footerData.email}</p>
          <p style={{ color: 'var(--text-muted)' }}>Hotline: {footerData.hotline}</p>
        </div>
        <div>
          <h4 style={{ color: 'white' }}>Hỗ Trợ</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="/gioi-thieu">Thể lệ chi tiết</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/faq">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
        <p>&copy; 2025 Trường Ngôi Sao Hoàng Mai. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
