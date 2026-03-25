import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Clock, ChevronLeft } from 'lucide-react';

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from('news').select('*').order('date', { ascending: false });
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

  // Article detail view
  if (selectedArticle) {
    return (
      <div className="container py-20" style={{maxWidth: '900px', margin: '0 auto'}}>
        <button
          className="btn btn-outline mb-6 flex items-center gap-2"
          style={{borderColor: '#94a3b8', color: '#64748b'}}
          onClick={() => setSelectedArticle(null)}
        >
          <ChevronLeft size={18} /> Quay lại danh sách
        </button>
        <article className="card glass animate-fade-in" style={{padding: '2.5rem'}}>
          {selectedArticle.image && (
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              style={{width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem'}}
            />
          )}
          <h1 className="text-nshm mb-3" style={{fontSize: '2rem', lineHeight: 1.3}}>{selectedArticle.title}</h1>
          <div className="flex items-center gap-2 mb-6 pb-4" style={{borderBottom: '1px solid #f1f5f9'}}>
            <Clock size={14} className="text-muted" />
            <span className="text-muted text-sm font-medium">{formatDate(selectedArticle.date)}</span>
          </div>
          {selectedArticle.content ? (
            <div
              className="news-content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              style={{lineHeight: 1.9, fontSize: '1.05rem', color: '#334155'}}
            />
          ) : (
            <p className="text-muted leading-relaxed" style={{lineHeight: 1.8, fontSize: '1.05rem'}}>{selectedArticle.summary}</p>
          )}
        </article>
      </div>
    );
  }

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
            <div
              key={article.id}
              className="card glass hover-up block-shadow animate-fade-in"
              style={{
                animationDelay: `${idx * 0.08}s`,
                borderLeft: '5px solid var(--primary-green)',
                padding: '2rem',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedArticle(article)}
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
                <span className="text-muted text-sm font-medium">{formatDate(article.date)}</span>
                {article.content && <span className="text-sm" style={{marginLeft: 'auto', color: 'var(--secondary-blue)', fontWeight: 600}}>Đọc thêm →</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
