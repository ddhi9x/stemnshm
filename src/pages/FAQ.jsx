import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../supabaseClient';

const FAQ = () => {
  const [faqItems, setFaqItems] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const fetchFaq = async () => {
      const { data } = await supabase.from('faq').select('*').order('sort_order', { ascending: true });
      if (data) setFaqItems(data);
    };
    fetchFaq();
  }, []);

  return (
    <div className="container py-20 min-h-screen">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full font-bold text-sm mb-4">❓ HỎI ĐÁP</div>
        <h1 className="section-title text-green-gradient">Câu Hỏi Thường Gặp</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Tổng hợp các câu hỏi phổ biến nhất về Ngày Hội STEM — Kiến Tạo Thế Giới Xanh 2025-2026.
        </p>
      </div>

      <div className="flex flex-col gap-4 animate-fade-in" style={{maxWidth: '850px', margin: '0 auto', animationDelay: '0.1s'}}>
        {faqItems.map((faq, idx) => (
          <div
            key={faq.id}
            className="card glass hover-up"
            style={{cursor: 'pointer', padding: '1.5rem 2rem', transition: 'all 0.3s'}}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: openIdx === idx ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#f1f5f9',
                  color: openIdx === idx ? 'white' : '#64748b',
                  fontSize: '0.8rem', fontWeight: 900, transition: 'all 0.3s'
                }}>{idx + 1}</span>
                <h4 className="m-0" style={{fontSize: '1rem', color: openIdx === idx ? '#22c55e' : '#c8102e', transition: 'color 0.3s', fontWeight: 700}}>{faq.question}</h4>
              </div>
              <ChevronDown size={20} style={{transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', color: '#94a3b8', flexShrink: 0}} />
            </div>
            <div style={{
              maxHeight: openIdx === idx ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease',
              opacity: openIdx === idx ? 1 : 0,
              marginTop: openIdx === idx ? '1rem' : '0',
            }}>
              <div style={{padding: '1rem 1.25rem', background: '#f0fdf4', borderRadius: '12px', borderLeft: '4px solid #22c55e'}}>
                <p className="text-muted m-0" style={{lineHeight: 1.8, fontSize: '0.95rem'}}>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {faqItems.length === 0 && (
        <div className="text-center py-10 text-muted">Đang tải câu hỏi...</div>
      )}

      <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <div className="card glass inline-block" style={{padding: '1.5rem 2.5rem'}}>
          <p className="m-0 text-muted">Vẫn còn thắc mắc? Liên hệ <strong className="text-nshm">info@ngoisaocaohanoi.edu.vn</strong> hoặc hỏi trực tiếp thầy cô chủ nhiệm!</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
