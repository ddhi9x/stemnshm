import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useI18n } from '../i18n/I18nContext';
import { Clock, ChevronLeft, Share2, Facebook, Copy, CheckCircle2, Eye } from 'lucide-react';

const NewsDetail = () => {
  const { t } = useI18n();
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
        // Increment view count (once per session per article)
        const viewedKey = `news_viewed_${id}`;
        if (!sessionStorage.getItem(viewedKey)) {
          sessionStorage.setItem(viewedKey, '1');
          const newViews = (data.views || 0) + 1;
          await supabase.from('news').update({ views: newViews }).eq('id', id);
          setArticle(prev => prev ? { ...prev, views: newViews } : prev);
        }
      }
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

  // Auto-inject table filter functionality after content renders
  const contentRef = React.useRef(null);
  useEffect(() => {
    if (!article?.content) return;

    const injectFilters = () => {
      if (!contentRef.current) return;
      const tables = contentRef.current.querySelectorAll('table');
      if (tables.length === 0) return;

    tables.forEach((table) => {
      if (table.parentElement?.classList?.contains('table-scroll-wrap')) return;
      if (table.previousElementSibling?.classList?.contains('table-filter-bar')) return;

      // Wrap table in scrollable container
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll-wrap';
      wrapper.style.cssText = 'overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:8px;margin:0.5rem 0;';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);

      let rows = Array.from(table.querySelectorAll('tbody tr'));
      // Fallback: if no tbody, get all rows except first (header)
      if (rows.length === 0) {
        const allRows = Array.from(table.querySelectorAll('tr'));
        rows = allRows.slice(1); // skip header row
      }
      if (rows.length === 0) return;

      const headers = Array.from(table.querySelectorAll('thead th'));
      // Fallback: if no thead, check first row for th
      const fallbackHeaders = headers.length > 0 ? headers : Array.from(table.querySelectorAll('tr:first-child th'));
      let mentorColIdx = -1;
      let idColIdx = -1;
      fallbackHeaders.forEach((th, i) => {
        const txt = th.textContent.toLowerCase();
        if (txt.includes('mentor')) mentorColIdx = i;
        if (txt.includes('id')) idColIdx = i;
      });

      const mentors = new Set();
      if (mentorColIdx >= 0) {
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells[mentorColIdx]) mentors.add(cells[mentorColIdx].textContent.trim());
        });
      }

      const filterBar = document.createElement('div');
      filterBar.className = 'table-filter-bar';
      filterBar.style.cssText = 'display:flex;gap:0.6rem;flex-wrap:wrap;align-items:center;margin-bottom:0.8rem;padding:0.8rem 1rem;background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;';

      const searchWrap = document.createElement('div');
      searchWrap.style.cssText = 'flex:1;min-width:160px;';
      searchWrap.innerHTML = '<label style="display:block;font-size:0.7rem;font-weight:700;color:#059669;margin-bottom:2px;">\uD83D\uDD0D Tìm ID đội</label><input type="text" placeholder="Nhập ID đội (VD: 109)" style="width:100%;padding:0.4rem 0.7rem;border:2px solid #d1d5db;border-radius:8px;font-size:0.85rem;outline:none;transition:border 0.2s;" />';
      filterBar.appendChild(searchWrap);

      if (mentors.size > 0) {
        const selectWrap = document.createElement('div');
        selectWrap.style.cssText = 'flex:1;min-width:200px;';
        let optionsHtml = '<option value="">Tất cả Mentor</option>';
        Array.from(mentors).sort().forEach(m => {
          optionsHtml += '<option value="' + m + '">' + m + '</option>';
        });
        selectWrap.innerHTML = '<label style="display:block;font-size:0.7rem;font-weight:700;color:#059669;margin-bottom:2px;">\uD83D\uDC64 Lọc theo Mentor</label><select style="width:100%;padding:0.4rem 0.7rem;border:2px solid #d1d5db;border-radius:8px;font-size:0.85rem;outline:none;background:white;cursor:pointer;">' + optionsHtml + '</select>';
        filterBar.appendChild(selectWrap);
      }

      const countEl = document.createElement('div');
      countEl.style.cssText = 'font-size:0.75rem;color:#64748b;width:100%;margin-top:0.2rem;';
      countEl.textContent = '\uD83D\uDCCB Hiển thị ' + rows.length + '/' + rows.length + ' dòng';
      filterBar.appendChild(countEl);

      wrapper.parentNode.insertBefore(filterBar, wrapper);

      // Mobile scroll hint
      if (window.innerWidth <= 640) {
        const hint = document.createElement('div');
        hint.style.cssText = 'font-size:0.7rem;color:#94a3b8;text-align:center;padding:0.3rem;margin-bottom:0.3rem;';
        hint.textContent = '\u2194\uFE0F Vu\u1ED1t ngang \u0111\u1EC3 xem to\u00E0n b\u1ED9 b\u1EA3ng';
        wrapper.parentNode.insertBefore(hint, wrapper);
      }

      const searchInput = filterBar.querySelector('input');
      const mentorSelect = filterBar.querySelector('select');

      const doFilter = () => {
        const searchVal = (searchInput?.value || '').trim().toLowerCase();
        const mentorVal = mentorSelect?.value || '';
        let shown = 0;

        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          let showByMentor = true;
          let showBySearch = true;

          if (mentorVal && mentorColIdx >= 0 && cells[mentorColIdx]) {
            showByMentor = cells[mentorColIdx].textContent.trim() === mentorVal;
          }

          if (searchVal && idColIdx >= 0 && cells[idColIdx]) {
            const ids = cells[idColIdx].textContent.split(',').map(s => s.trim().toLowerCase());
            showBySearch = ids.some(id => id.includes(searchVal));
          } else if (searchVal) {
            showBySearch = row.textContent.toLowerCase().includes(searchVal);
          }

          const show = showByMentor && showBySearch;
          row.style.display = show ? '' : 'none';
          if (show) shown++;
        });

        countEl.textContent = '\uD83D\uDCCB Hiển thị ' + shown + '/' + rows.length + ' dòng';
        countEl.style.color = shown < rows.length ? '#059669' : '#64748b';
        countEl.style.fontWeight = shown < rows.length ? '700' : '400';
      };

      searchInput?.addEventListener('input', doFilter);
      mentorSelect?.addEventListener('change', doFilter);
      searchInput?.addEventListener('focus', () => { searchInput.style.borderColor = '#059669'; });
      searchInput?.addEventListener('blur', () => { searchInput.style.borderColor = '#d1d5db'; });
    });
    };

    // Try inject after short delay, retry once after longer delay
    const t1 = setTimeout(injectFilters, 300);
    const t2 = setTimeout(injectFilters, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [article]);

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⏳</div>
        <p className="text-muted">{t('news_page.loading')}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📭</div>
        <h2 className="text-muted mb-4">{t('news_page.not_found')}</h2>
        <Link to="/tin-tuc" className="btn btn-primary">{t('news_page.back_to_list')}</Link>
      </div>
    );
  }

  return (
    <div className="container py-20" style={{maxWidth: '900px', margin: '0 auto', padding: '5rem 1rem 3rem'}}>
      {/* Back button */}
      <Link to="/tin-tuc" className="btn btn-outline mb-6 flex items-center gap-2" style={{borderColor: '#94a3b8', color: '#64748b', width: 'fit-content'}}>
        <ChevronLeft size={18} /> {t('news_page.back_to_list')}
      </Link>

      {/* Main Article - Full Width */}
      <article className="card glass animate-fade-in" style={{padding: '2rem'}}>
        {article.image && (
          <img src={article.image} alt={article.title} style={{width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem'}} />
        )}

        <h1 className="text-nshm mb-3" style={{fontSize: '1.5rem', lineHeight: 1.3, textAlign: 'center'}}>{article.title}</h1>

        <div className="flex items-center gap-4 mb-6 pb-4 flex-wrap" style={{borderBottom: '1px solid #f1f5f9'}}>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-muted" />
            <span className="text-muted text-sm font-medium">{formatDate(article.date || article.created_at)}</span>
          </div>
          <div className="flex items-center gap-2" style={{marginLeft: 'auto'}}>
            <button onClick={handleShareFB} className="btn btn-outline" style={{padding: '0.3rem 0.7rem', fontSize: '0.75rem', borderColor: '#3b5998', color: '#3b5998', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
              <Facebook size={14} /> {t('news_page.share')}
            </button>
            <button onClick={handleCopyLink} className="btn btn-outline" style={{padding: '0.3rem 0.7rem', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
              {copied ? <><CheckCircle2 size={14} className="text-primary" /> {t('news_page.copied')}</> : <><Copy size={14} /> {t('news_page.copy_link')}</>}
            </button>
          </div>
        </div>

        {article.content ? (
          <div ref={contentRef} className="news-content" dangerouslySetInnerHTML={{ __html: article.content }} style={{lineHeight: 1.9, fontSize: '1.05rem', color: '#334155', overflowX: 'auto'}} />
        ) : (
          <p className="text-muted leading-relaxed" style={{lineHeight: 1.8, fontSize: '1.05rem'}}>{article.summary}</p>
        )}

        {/* View Count Footer */}
        <div style={{marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.82rem'}}>
            <Eye size={15} />
            <span>{article.views || 0} lượt xem</span>
          </div>
          <span style={{fontSize: '0.75rem', color: '#cbd5e1'}}>{formatDate(article.date || article.created_at)}</span>
        </div>
      </article>

      {/* Related & Quick Links - Below Article */}
      <div className="news-bottom-bar" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem'}}>
        <div className="card glass" style={{padding: '1.2rem'}}>
          <h3 style={{fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-main)'}}>{t('news_page.related')}</h3>
          {related.length > 0 ? related.map((r, i) => (
            <Link key={r.id} to={`/tin-tuc/${r.id}`} style={{display: 'block', padding: '0.6rem 0', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none'}}>
              <h4 style={{fontSize: '0.82rem', fontWeight: 600, color: '#334155', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{r.title}</h4>
              <span style={{fontSize: '0.68rem', color: '#94a3b8'}}>{r.date ? new Date(r.date).toLocaleDateString('vi-VN') : ''}</span>
            </Link>
          )) : (
            <p className="text-muted" style={{fontSize: '0.82rem'}}>{t('news_page.no_related')}</p>
          )}
        </div>

        <div className="card glass" style={{padding: '1.2rem'}}>
          <h3 style={{fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-main)'}}>{t('news_page.quick_links')}</h3>
          <div className="flex flex-col gap-2">
            <Link to="/lich-trinh" style={{fontSize: '0.82rem', color: 'var(--secondary-blue)', fontWeight: 500}}>{t('news_page.schedule_link')}</Link>
            <Link to="/mentor" style={{fontSize: '0.82rem', color: 'var(--secondary-blue)', fontWeight: 500}}>{t('news_page.mentor_link')}</Link>
            <Link to="/faq" style={{fontSize: '0.82rem', color: 'var(--secondary-blue)', fontWeight: 500}}>{t('news_page.faq_link')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
