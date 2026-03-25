import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { X, ChevronLeft, ChevronRight, Image, Film } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prevItem = () => setLightbox(l => (l > 0 ? l - 1 : filtered.length - 1));
  const nextItem = () => setLightbox(l => (l < filtered.length - 1 ? l + 1 : 0));

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, filtered.length]);

  return (
    <div className="container py-20" style={{maxWidth: '1100px', margin: '0 auto'}}>
      <div className="text-center mb-12 animate-fade-in">
        <div className="stem-section-badge" style={{background: '#ede9fe', color: '#7c3aed'}}>📸 THƯ VIỆN</div>
        <h1 className="section-title text-green-gradient">Thư Viện Ảnh & Video</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Những khoảnh khắc ấn tượng từ Ngày Hội STEM.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 justify-center mb-8 animate-fade-in">
        {[['all', '🖼️ Tất cả', items.length], ['image', '📷 Ảnh', items.filter(i => i.type === 'image').length], ['video', '🎬 Video', items.filter(i => i.type === 'video').length]].map(([val, label, count]) => (
          <button key={val} className={`btn ${filter === val ? 'btn-nshm' : 'btn-outline'}`} style={{fontSize: '0.85rem'}} onClick={() => setFilter(val)}>
            {label} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16"><div style={{fontSize: '3rem'}}>⏳</div><p className="text-muted">Đang tải...</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📷</div>
          <h3 className="text-muted text-xl mb-2">Chưa có ảnh/video</h3>
          <p className="text-muted">Thư viện sẽ được cập nhật sau sự kiện.</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
          {filtered.map((item, idx) => (
            <div key={item.id} className="animate-fade-in" style={{animationDelay: `${idx * 0.04}s`, cursor: 'pointer', borderRadius: '14px', overflow: 'hidden', position: 'relative', aspectRatio: '4/3', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}} onClick={() => openLightbox(idx)}>
              {item.type === 'video' ? (
                <div style={{width: '100%', height: '100%', position: 'relative'}}>
                  <video src={item.url} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
                  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)'}}>
                    <Film size={40} color="white" />
                  </div>
                </div>
              ) : (
                <img src={item.url} alt={item.caption || ''} style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s'}} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              )}
              {item.caption && (
                <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '1rem 0.8rem 0.6rem', color: 'white', fontSize: '0.8rem', fontWeight: 500}}>
                  {item.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div style={{position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={closeLightbox}>
          <button onClick={closeLightbox} style={{position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'white'}}>
            <X size={24} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevItem(); }} style={{position: 'absolute', left: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'white'}}>
            <ChevronLeft size={28} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {filtered[lightbox].type === 'video' ? (
              <video src={filtered[lightbox].url} controls autoPlay style={{maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px'}} />
            ) : (
              <img src={filtered[lightbox].url} alt="" style={{maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain'}} />
            )}
            {filtered[lightbox].caption && (
              <p style={{color: '#e2e8f0', marginTop: '0.8rem', fontSize: '0.9rem', textAlign: 'center'}}>{filtered[lightbox].caption}</p>
            )}
            <p style={{color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.4rem'}}>{lightbox + 1} / {filtered.length}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); nextItem(); }} style={{position: 'absolute', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'white'}}>
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
