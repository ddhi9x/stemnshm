import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Clock, ChevronLeft, Share2, Facebook, Copy, CheckCircle2 } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const { data } = await supabase.from('news').select('*').eq('id', id).single();
      if (data) {
        setArticle(data);
        document.title = `${data.title} — STEM NSHM`;
      }
      // Fetch related articles (latest 3 excluding current)
      const { data: relData } = await supabase
        .from('news').select('id,title,date,image,summary')
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (relData) setRelated(relData);
      setLoading(false);
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⏳</div>
        <p className="text-muted">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📭</div>
        <h2 className="text-muted mb-4">Không tìm thấy bài viết</h2>
        <Link to="/tin-tuc" className="btn btn-primary">← Quay lại Tin Tức</Link>
      </div>
    );
  }

  return (
    <div className="container py-20" style={{maxWidth: '1100px', margin: '0 auto'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem'}}>
        {/* Main Article */}
        <div>
          <Link to="/tin-tuc" className="btn btn-outline mb-6 flex items-center gap-2" style={{borderColor: '#94a3b8', color: '#64748b', width: 'fit-content'}}>
            <ChevronLeft size={18} /> Quay lại danh sách
          </Link>

          <article className="card glass animate-fade-in" style={{padding: '2.5rem'}}>
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                style={{width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem'}}
              />
            )}

            <h1 className="text-nshm mb-3" style={{fontSize: '2rem', lineHeight: 1.3}}>{article.title}</h1>

            <div className="flex items-center gap-4 mb-6 pb-4 flex-wrap" style={{borderBottom: '1px solid #f1f5f9'}}>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted" />
                <span className="text-muted text-sm font-medium">{formatDate(article.date || article.created_at)}</span>
              </div>
              <div className="flex items-center gap-2" style={{marginLeft: 'auto'}}>
                <button onClick={handleShareFB} className="btn btn-outline" style={{padding: '0.3rem 0.7rem', fontSize: '0.75rem', borderColor: '#3b5998', color: '#3b5998', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                  <Facebook size={14} /> Chia sẻ
                </button>
                <button onClick={handleCopyLink} className="btn btn-outline" style={{padding: '0.3rem 0.7rem', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                  {copied ? <><CheckCircle2 size={14} className="text-primary" /> Đã copy!</> : <><Copy size={14} /> Copy link</>}
                </button>
              </div>
            </div>

            {article.content ? (
              <div
                className="news-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{lineHeight: 1.9, fontSize: '1.05rem', color: '#334155'}}
              />
            ) : (
              <p className="text-muted leading-relaxed" style={{lineHeight: 1.8, fontSize: '1.05rem'}}>{article.summary}</p>
            )}
          </article>
        </div>

        {/* Sidebar */}
        <aside className="news-sidebar" style={{position: 'sticky', top: '100px', alignSelf: 'start'}}>
          <div className="card glass" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)'}}>📰 Bài viết khác</h3>
            {related.length > 0 ? related.map((r, i) => (
              <Link key={r.id} to={`/tin-tuc/${r.id}`} style={{display: 'block', padding: '0.8rem 0', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none'}}>
                <div className="flex gap-3">
                  {r.image && (
                    <img src={r.image} alt="" style={{width: '60px', height: '45px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0}} />
                  )}
                  <div>
                    <h4 style={{fontSize: '0.85rem', fontWeight: 600, color: '#334155', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{r.title}</h4>
                    <span style={{fontSize: '0.7rem', color: '#94a3b8'}}>{r.date ? new Date(r.date).toLocaleDateString('vi-VN') : ''}</span>
                  </div>
                </div>
              </Link>
            )) : (
              <p className="text-muted" style={{fontSize: '0.85rem'}}>Chưa có bài viết nào khác.</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="card glass mt-4" style={{padding: '1.2rem'}}>
            <h3 style={{fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-main)'}}>🔗 Liên kết nhanh</h3>
            <div className="flex flex-col gap-2">
              <Link to="/lich-trinh" style={{fontSize: '0.82rem', color: 'var(--secondary-blue)', fontWeight: 500}}>📅 Lịch trình cuộc thi</Link>
              <Link to="/mentor" style={{fontSize: '0.82rem', color: 'var(--secondary-blue)', fontWeight: 500}}>👨‍🏫 Danh sách Mentor</Link>
              <Link to="/faq" style={{fontSize: '0.82rem', color: 'var(--secondary-blue)', fontWeight: 500}}>❓ Câu hỏi thường gặp</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsDetail;
