import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Stamp, Star, Trophy } from 'lucide-react';

const Passport = () => {
  const [stations, setStations] = useState([]);
  const [completedStations, setCompletedStations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stem_passport') || '[]'); } catch { return []; }
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      const { data } = await supabase.from('final_schedule').select('*').order('id', { ascending: true });
      if (data) setStations(data);
    };
    fetchStations();
  }, []);

  const toggleStation = (id) => {
    let updated;
    if (completedStations.includes(id)) {
      updated = completedStations.filter(s => s !== id);
    } else {
      updated = [...completedStations, id];
      // Show confetti if all done
      if (updated.length === stations.length && stations.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
    setCompletedStations(updated);
    localStorage.setItem('stem_passport', JSON.stringify(updated));
  };

  const progress = stations.length > 0 ? Math.round(completedStations.length / stations.length * 100) : 0;
  const stationIcons = ['🔬', '💻', '⚙️', '📐', '🧪', '🔭', '🤖', '🧬', '🌿', '🎨'];

  return (
    <div className="container py-20" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="text-center mb-8 animate-fade-in">
        <div className="stem-section-badge" style={{background: '#fef3c7', color: '#d97706'}}>🛂 PASSPORT</div>
        <h1 className="section-title text-green-gradient">Passport STEM</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Đóng dấu tại mỗi trạm bạn tham gia. Hoàn thành tất cả để nhận Passport Vàng!</p>
      </div>

      {/* Passport Card */}
      <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
        <div className="card glass" style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #1e3a2f 0%, #0f2419 50%, #1e3a2f 100%)',
          color: 'white',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          {/* Passport pattern */}
          <div style={{position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)', pointerEvents: 'none'}}></div>

          {/* Header */}
          <div className="text-center mb-6" style={{position: 'relative'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🛂</div>
            <h2 style={{fontSize: '1.1rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '0.3rem'}}>STEM PASSPORT</h2>
            <p style={{fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '2px'}}>NGÔI SAO HOÀNG MAI • 2026</p>
          </div>

          {/* Progress */}
          <div style={{marginBottom: '1.5rem'}}>
            <div className="flex justify-between" style={{fontSize: '0.8rem', marginBottom: '0.4rem'}}>
              <span style={{color: '#94a3b8'}}>Tiến độ</span>
              <span style={{color: '#fbbf24', fontWeight: 700}}>{completedStations.length}/{stations.length} trạm</span>
            </div>
            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '10px', overflow: 'hidden'}}>
              <div style={{width: `${progress}%`, height: '100%', background: progress === 100 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '10px', transition: 'width 0.5s ease'}}></div>
            </div>
          </div>

          {/* Stamp Grid */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.8rem'}}>
            {stations.map((station, idx) => {
              const isDone = completedStations.includes(station.id);
              return (
                <div
                  key={station.id}
                  onClick={() => toggleStation(station.id)}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${idx * 0.06}s`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: '0.8rem 0.5rem',
                    borderRadius: '12px',
                    border: `2px ${isDone ? 'solid #22c55e' : 'dashed rgba(255,255,255,0.2)'}`,
                    background: isDone ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{fontSize: '1.8rem', marginBottom: '0.3rem', filter: isDone ? 'none' : 'grayscale(1) opacity(0.4)'}}>
                    {stationIcons[idx % stationIcons.length]}
                  </div>
                  <div style={{fontSize: '0.68rem', fontWeight: 600, color: isDone ? '#4ade80' : '#64748b', lineHeight: 1.3}}>
                    {station.title || station.time}
                  </div>
                  {isDone && (
                    <div style={{position: 'absolute', top: '-4px', right: '-4px', background: '#22c55e', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', fontWeight: 900, boxShadow: '0 2px 6px rgba(34,197,94,0.5)'}}>
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion Badge */}
          {progress === 100 && (
            <div className="text-center mt-6 animate-fade-in" style={{padding: '1rem', background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))', borderRadius: '14px', border: '2px solid #fbbf24'}}>
              <div style={{fontSize: '2.5rem'}}>🏆</div>
              <h3 style={{color: '#fbbf24', fontWeight: 900, fontSize: '1.2rem', marginTop: '0.3rem'}}>PASSPORT VÀNG!</h3>
              <p style={{color: '#94a3b8', fontSize: '0.8rem'}}>Chúc mừng bạn đã hoàn thành tất cả các trạm STEM!</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <p className="text-muted" style={{fontSize: '0.85rem'}}>
          💡 Nhấn vào mỗi trạm khi bạn hoàn thành. Dữ liệu được lưu trên thiết bị của bạn.
        </p>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: '5rem', animation: 'fadeInUp 0.5s ease'}}>🎉🏆🎉</div>
        </div>
      )}
    </div>
  );
};

export default Passport;
