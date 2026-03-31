import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './RecruitBanner.css';

const MINIMIZED_KEY = 'stem2026_recruit_banner_minimized';

export default function RecruitBanner() {
  const [enabled, setEnabled] = useState(false);   // admin gate
  const [visible, setVisible] = useState(false);    // entrance done
  const [minimized, setMinimized] = useState(false); // collapsed to icon
  const [closing, setClosing] = useState(false);     // exit animation
  const [expanded, setExpanded] = useState(false);   // detail toggle

  useEffect(() => {
    const init = async () => {
      // Check admin toggle
      try {
        const { data, error } = await supabase.from('settings').select('*').single();
        if (!error && data && data.show_recruit_banner === false) return;
      } catch { /* default to showing */ }

      // Was user previously minimized?
      const isMobile = window.innerWidth <= 768;
      if (localStorage.getItem(MINIMIZED_KEY) === 'true' || isMobile) {
        setEnabled(true);
        setMinimized(true);
        setVisible(true);
        return;
      }

      setEnabled(true);
      setTimeout(() => setVisible(true), 1200);
    };
    init();
  }, []);

  const handleMinimize = () => {
    setClosing(true);
    setTimeout(() => {
      setMinimized(true);
      setClosing(false);
      localStorage.setItem(MINIMIZED_KEY, 'true');
    }, 350);
  };

  const handleRestore = () => {
    setMinimized(false);
    localStorage.removeItem(MINIMIZED_KEY);
  };

  if (!enabled) return null;

  // ── Minimized: floating icon ──
  if (minimized && visible) {
    return (
      <button
        id="recruit-banner-fab"
        className="recruit-fab"
        onClick={handleRestore}
        aria-label="Mở thông báo tuyển thành viên"
        title="Tuyển thành viên BTC"
      >
        <span className="recruit-fab__icon">📢</span>
        <span className="recruit-fab__pulse" />
      </button>
    );
  }

  if (!visible) return null;

  return (
    <div
      id="recruit-banner"
      className={`recruit-banner ${closing ? 'recruit-banner--closing' : 'recruit-banner--open'} ${expanded ? 'recruit-banner--expanded' : ''}`}
      role="complementary"
      aria-label="Tuyển thành viên Ban tổ chức STEM 2026"
    >
      {/* Glowing accent bar */}
      <div className="recruit-banner__accent" />

      {/* Header row */}
      <div className="recruit-banner__header">
        <div className="recruit-banner__badge">
          <span className="recruit-banner__badge-dot" />
          ĐANG TUYỂN
        </div>
        <button
          id="recruit-banner-close"
          className="recruit-banner__close"
          onClick={handleMinimize}
          aria-label="Thu nhỏ thông báo"
        >
          ✕
        </button>
      </div>

      {/* Title */}
      <div className="recruit-banner__icon-row">
        <span className="recruit-banner__main-icon">🌟</span>
        <div>
          <h3 className="recruit-banner__title">Ban Tổ Chức</h3>
          <p className="recruit-banner__subtitle">Ngày Hội STEM 2026</p>
        </div>
      </div>

      {/* Teaser / Expanded body */}
      <div className="recruit-banner__body">
        {!expanded ? (
          <p className="recruit-banner__teaser">
            Cơ hội trực tiếp tổ chức sự kiện STEM lớn nhất năm – rèn kỹ năng, toả sáng cùng đồng đội!
          </p>
        ) : (
          <div className="recruit-banner__detail animate-fade-in">
            <p>
              BTC mở đơn tuyển thành viên tham gia <strong>Ban hỗ trợ trải nghiệm STEM 2026</strong>. Đây là cơ hội để các bạn:
            </p>
            <ul>
              <li>🔬 Đồng hành cùng hoạt động trải nghiệm khoa học – công nghệ</li>
              <li>🤝 Phát triển kỹ năng tổ chức, điều phối và xử lý tình huống thực tế</li>
              <li>🏆 Góp phần tạo nên sự kiện học thuật xứng tầm cho cộng đồng học sinh</li>
            </ul>
          </div>
        )}
      </div>

      {/* Toggle more / less */}
      <button
        id="recruit-banner-toggle"
        className="recruit-banner__toggle"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
      </button>

      {/* CTA primary – form đăng ký BTC */}
      <a
        id="recruit-banner-cta"
        className="recruit-banner__cta"
        href="https://forms.office.com/pages/responsepage.aspx?id=CvKer1gxoEOhq61yoD60xX1lDaEXEj5KnLmplyrUSqFUNUFMT0o5QTZFWFpESlJXODNWMUJGNjgxSi4u&route=shorturl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>📋 Điền form đăng ký</span>
      </a>

      {/* Secondary link – bài viết chi tiết */}
      <a
        id="recruit-banner-news"
        className="recruit-banner__news-link"
        href="/tin-tuc"
        target="_self"
      >
        📰 Xem bài viết chi tiết
      </a>

      {/* Decorative particles */}
      <div className="recruit-banner__particles" aria-hidden="true">
        <span>⚗️</span>
        <span>🧬</span>
        <span>💡</span>
      </div>
    </div>
  );
}
