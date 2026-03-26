import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Leaf, Monitor, Cpu, Wrench, FunctionSquare, Hammer, Bot, FlaskConical } from 'lucide-react';

const STATIONS = [
  { id: 'science', name: 'Trạm Khoa Học', icon: '🔬', type: 'experience', color: '#22c55e' },
  { id: 'tech', name: 'Trạm Công Nghệ', icon: '💻', type: 'experience', color: '#3b82f6' },
  { id: 'math', name: 'Trạm Toán Học', icon: '📐', type: 'experience', color: '#9333ea' },
  { id: 'robot', name: 'Trạm Robotic', icon: '🤖', type: 'experience', color: '#06b6d4' },
  { id: 'wood', name: 'Trạm Mộc', icon: '🪵', type: 'experience', color: '#d97706' },
  { id: 'booth_s', name: 'Gian hàng S/T', icon: '🧪', type: 'competition', color: '#ef4444' },
  { id: 'booth_e', name: 'Gian hàng E/M', icon: '⚙️', type: 'competition', color: '#f97316' },
  { id: 'booth_vote', name: 'Bình chọn yêu thích', icon: '⭐', type: 'competition', color: '#eab308' },
];

const Passport = () => {
  const { t } = useI18n();
  const [completedStations, setCompletedStations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stem_passport') || '[]'); } catch { return []; }
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleStation = (id) => {
    let updated;
    if (completedStations.includes(id)) {
      updated = completedStations.filter(s => s !== id);
    } else {
      updated = [...completedStations, id];
      if (updated.length === STATIONS.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
    setCompletedStations(updated);
    localStorage.setItem('stem_passport', JSON.stringify(updated));
  };

  const progress = Math.round(completedStations.length / STATIONS.length * 100);
  const expStations = STATIONS.filter(s => s.type === 'experience');
  const compStations = STATIONS.filter(s => s.type === 'competition');

  return (
    <div className="container py-20" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="text-center mb-8 animate-fade-in">
        <div className="stem-section-badge" style={{background: '#fef3c7', color: '#d97706'}}>{t('passport_page.badge')}</div>
        <h1 className="section-title text-green-gradient">{t('passport_page.title')}</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">{t('passport_page.desc')}</p>
      </div>

      {/* Physical Passport Notice */}
      <div className="animate-fade-in" style={{animationDelay: '0.05s', marginBottom: '1.5rem'}}>
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{fontSize: '2.2rem', flexShrink: 0}}>📖</div>
          <div>
            <h4 style={{margin: 0, color: '#92400e', fontWeight: 800, fontSize: '0.95rem'}}>Passport chính thức sẽ được phát bản giấy tại sự kiện!</h4>
            <p style={{margin: '0.3rem 0 0', color: '#a16207', fontSize: '0.82rem', lineHeight: 1.5}}>
              Trang này là bản demo giúp bạn trải nghiệm trước. Vào ngày 22/04, mỗi học sinh sẽ nhận <strong>1 quyển Passport STEM in sẵn</strong> tại bàn đón tiếp. Thu thập đủ <strong>8 sticker</strong> từ tất cả các trạm để tham gia Quay Số May Mắn! 🎉
            </p>
          </div>
        </div>
      </div>

      <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
        <div className="card glass" style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #1e3a2f 0%, #0f2419 50%, #1e3a2f 100%)',
          color: 'white', borderRadius: '20px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)', pointerEvents: 'none'}}></div>

          <div className="text-center mb-6" style={{position: 'relative'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🛂</div>
            <h2 style={{fontSize: '1.1rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '0.3rem'}}>{t('passport_page.header')}</h2>
            <p style={{fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '2px'}}>{t('passport_page.school')}</p>
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <div className="flex justify-between" style={{fontSize: '0.8rem', marginBottom: '0.4rem'}}>
              <span style={{color: '#94a3b8'}}>{t('passport_page.progress')}</span>
              <span style={{color: '#fbbf24', fontWeight: 700}}>{completedStations.length}/{STATIONS.length} sticker</span>
            </div>
            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '10px', overflow: 'hidden'}}>
              <div style={{width: `${progress}%`, height: '100%', background: progress === 100 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '10px', transition: 'width 0.5s ease'}}></div>
            </div>
          </div>

          {/* Experience Stations */}
          <div style={{marginBottom: '1rem'}}>
            <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#22c55e', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.6rem'}}>🌿 5 Trạm Trải Nghiệm</div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.6rem'}}>
              {expStations.map((station, idx) => {
                const isDone = completedStations.includes(station.id);
                return (
                  <div key={station.id} onClick={() => toggleStation(station.id)} className="animate-fade-in"
                    style={{
                      animationDelay: `${idx * 0.06}s`, cursor: 'pointer', textAlign: 'center',
                      padding: '0.7rem 0.3rem', borderRadius: '12px',
                      border: `2px ${isDone ? 'solid' : 'dashed'} ${isDone ? station.color : 'rgba(255,255,255,0.15)'}`,
                      background: isDone ? `${station.color}22` : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.3s ease', position: 'relative',
                    }}>
                    <div style={{fontSize: '1.6rem', marginBottom: '0.2rem', filter: isDone ? 'none' : 'grayscale(1) opacity(0.4)'}}>
                      {station.icon}
                    </div>
                    <div style={{fontSize: '0.6rem', fontWeight: 600, color: isDone ? station.color : '#64748b', lineHeight: 1.2}}>
                      {station.name}
                    </div>
                    {isDone && (
                      <div style={{position: 'absolute', top: '-4px', right: '-4px', background: station.color, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white', fontWeight: 900, boxShadow: `0 2px 6px ${station.color}80`}}>✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competition Stations */}
          <div>
            <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.6rem'}}>🏆 3 Trạm Dự Thi</div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem'}}>
              {compStations.map((station, idx) => {
                const isDone = completedStations.includes(station.id);
                return (
                  <div key={station.id} onClick={() => toggleStation(station.id)} className="animate-fade-in"
                    style={{
                      animationDelay: `${(idx + 5) * 0.06}s`, cursor: 'pointer', textAlign: 'center',
                      padding: '0.7rem 0.3rem', borderRadius: '12px',
                      border: `2px ${isDone ? 'solid' : 'dashed'} ${isDone ? station.color : 'rgba(255,255,255,0.15)'}`,
                      background: isDone ? `${station.color}22` : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.3s ease', position: 'relative',
                    }}>
                    <div style={{fontSize: '1.6rem', marginBottom: '0.2rem', filter: isDone ? 'none' : 'grayscale(1) opacity(0.4)'}}>
                      {station.icon}
                    </div>
                    <div style={{fontSize: '0.6rem', fontWeight: 600, color: isDone ? station.color : '#64748b', lineHeight: 1.2}}>
                      {station.name}
                    </div>
                    {isDone && (
                      <div style={{position: 'absolute', top: '-4px', right: '-4px', background: station.color, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white', fontWeight: 900, boxShadow: `0 2px 6px ${station.color}80`}}>✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {progress === 100 && (
            <div className="text-center mt-6 animate-fade-in" style={{padding: '1rem', background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))', borderRadius: '14px', border: '2px solid #fbbf24'}}>
              <div style={{fontSize: '2.5rem'}}>🏆</div>
              <h3 style={{color: '#fbbf24', fontWeight: 900, fontSize: '1.2rem', marginTop: '0.3rem'}}>{t('passport_page.gold_title')}</h3>
              <p style={{color: '#94a3b8', fontSize: '0.8rem'}}>{t('passport_page.gold_desc')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <p className="text-muted" style={{fontSize: '0.85rem'}}>{t('passport_page.hint')}</p>
      </div>

      {showConfetti && (
        <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: '5rem', animation: 'fadeInUp 0.5s ease'}}>🎉🏆🎉</div>
        </div>
      )}
    </div>
  );
};

export default Passport;
