import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Clock, Eye } from 'lucide-react';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="container py-20" style={{maxWidth: '900px', margin: '0 auto'}}>
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block bg-blue-100 text-secondary px-4 py-1 rounded-full font-bold text-sm mb-4">📰 CẬP NHẬT</div>
        <h1 className="section-title text-green-gradient">Tin Tức & Thông Báo</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Theo dõi những thông tin mới nhất về Ngày Hội STEM 2026.</p>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📭</div>
          <h3 className="text-muted text-xl mb-2">Chưa có tin tức nào</h3>
          <p className="text-muted">Các bài viết mới sẽ được cập nhật tại đây, hãy quay lại sau nhé!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {news.map((article, idx) => (
            <Link
              key={article.id}
              to={`/tin-tuc/${article.id}`}
              className="card glass hover-up block-shadow animate-fade-in"
              style={{
                animationDelay: `${idx * 0.08}s`,
                borderLeft: '5px solid var(--primary-green)',
                padding: '2rem',
                textDecoration: 'none',
              }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl text-nshm mb-3 m-0" style={{lineHeight: 1.4}}>{article.title}</h3>
                  <p className="text-muted m-0 leading-relaxed">{article.summary || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '')}</p>
                </div>
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: '140px', height: '100px', borderRadius: '12px', objectFit: 'cover',
                      flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4" style={{borderTop: '1px solid #f1f5f9'}}>
                <Clock size={14} className="text-muted" />
                <span className="text-muted text-sm font-medium">{formatDate(article.date || article.created_at)}</span>
                <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.82rem', marginLeft: '0.5rem'}}><Eye size={13} /> {article.views || 0}</span>
                <span className="text-sm" style={{marginLeft: 'auto', color: 'var(--secondary-blue)', fontWeight: 600}}>Đọc thêm →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
