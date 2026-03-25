import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { MessageCircle, X, Send } from 'lucide-react';

const quickQuestions = [
  '🗓️ Deadline nộp bài?',
  '📝 Đăng ký thế nào?',
  '🔬 Có mấy lĩnh vực?',
  '🏆 Giải thưởng gì?',
  '👩‍🏫 Mentor là ai?',
  '📍 Thi ở đâu?',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Chào bạn! 🌿 Mình là trợ lý STEM NSHM. Hỏi mình bất cứ điều gì về cuộc thi nhé!' },
  ]);
  const [input, setInput] = useState('');
  const [faqData, setFaqData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [aboutData, setAboutData] = useState({});
  const [awData, setAwData] = useState([]);
  const messagesEnd = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [faq, tl, ab, aw] = await Promise.all([
        supabase.from('faq').select('*'),
        supabase.from('timeline').select('*').order('id'),
        supabase.from('about').select('*').single(),
        supabase.from('awards').select('*'),
      ]);
      if (faq.data) setFaqData(faq.data);
      if (tl.data) setTimelineData(tl.data);
      if (ab.data) setAboutData(ab.data);
      if (aw.data) setAwData(aw.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const findAnswer = (query) => {
    const q = query.toLowerCase();

    // Check FAQ first
    for (const item of faqData) {
      const question = (item.question || '').toLowerCase();
      const words = q.split(/\s+/).filter(w => w.length > 2);
      const matchCount = words.filter(w => question.includes(w)).length;
      if (matchCount >= 2 || q.includes(question.slice(0, 15).toLowerCase())) {
        return item.answer;
      }
    }

    // Keyword matching
    if (q.includes('deadline') || q.includes('nộp') || q.includes('hạn')) {
      const submitItem = timelineData.find(t => t.title?.toLowerCase().includes('nộp'));
      return submitItem
        ? `📅 Hạn nộp bài: **${submitItem.date}** — ${submitItem.title}. ${submitItem.desc || ''}`
        : 'Bạn kiểm tra tab Lịch Trình để xem deadline nhé!';
    }

    if (q.includes('đăng ký') || q.includes('đăng kí') || q.includes('tham gia')) {
      return '📝 Bạn nhấn nút **"Đăng Ký Tham Gia"** trên Navbar, hoặc xem trang Lịch Trình để biết các bước đăng ký chi tiết!';
    }

    if (q.includes('lĩnh vực') || q.includes('ngành') || q.includes('field')) {
      return '🔬 Cuộc thi có **4 lĩnh vực**: Science (Khoa học), Technology (Công nghệ), Engineering (Kỹ thuật), Mathematics (Toán học).';
    }

    if (q.includes('giải') || q.includes('thưởng') || q.includes('prize')) {
      if (awData.length > 0) {
        return '🏆 Cơ cấu giải thưởng:\n' + awData.map(a => `• ${a.title}: ${a.qty} — ${a.value}`).join('\n');
      }
      return '🏆 Cuộc thi có Giải Nhất, Nhì, Ba, Khuyến Khích và Giải Sáng Tạo!';
    }

    if (q.includes('mentor') || q.includes('cố vấn') || q.includes('giáo viên')) {
      return '👩‍🏫 Mỗi đội sẽ được phân Mentor hướng dẫn. Xem danh sách Mentor trong tab **Mentor** ở Navbar nhé!';
    }

    if (q.includes('ở đâu') || q.includes('địa điểm') || q.includes('trường')) {
      return '📍 Cuộc thi diễn ra tại trường **Ngôi Sao Hoàng Mai**, Hà Nội. Vòng Chung Kết sẽ trưng bày gian hàng tại khuôn viên trường!';
    }

    if (q.includes('lịch') || q.includes('timeline') || q.includes('bao giờ')) {
      if (timelineData.length > 0) {
        return '📅 Lịch trình cuộc thi:\n' + timelineData.map(t => `• **${t.date}**: ${t.title}`).join('\n');
      }
      return 'Xem Lịch Trình chi tiết trên Navbar nhé!';
    }

    if (q.includes('giới thiệu') || q.includes('gì') || q.includes('stem là')) {
      return aboutData.message || 'Ngày Hội STEM là sân chơi khoa học lớn nhất dành cho học sinh Ngôi Sao Hoàng Mai! 🌿';
    }

    if (q.includes('passport') || q.includes('stamp') || q.includes('đóng dấu')) {
      return '🛂 Passport STEM là tính năng gamification! Khi tham gia ngày hội, bạn đóng dấu mỗi trạm để hoàn thành Passport Vàng. Xem tại trang **Passport**!';
    }

    return '🤔 Mình chưa hiểu câu hỏi này lắm. Bạn thử hỏi về: **đăng ký, deadline, lĩnh vực, giải thưởng, mentor, hoặc lịch trình** nhé! Hoặc xem FAQ trên Navbar.';
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: 'user', text };
    const answer = findAnswer(text);
    const botMsg = { from: 'bot', text: answer };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9000,
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(34,197,94,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse-glow 2s infinite',
          }}
        >
          <MessageCircle size={24} color="white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9001,
          width: '360px', maxWidth: 'calc(100vw - 2rem)', height: '480px', maxHeight: 'calc(100vh - 6rem)',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          background: 'white',
          border: '1px solid #e2e8f0',
        }}>
          {/* Header */}
          <div style={{background: 'linear-gradient(135deg, #22c55e, #16a34a)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div className="flex items-center gap-2">
              <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🤖</div>
              <div>
                <div style={{color: 'white', fontWeight: 700, fontSize: '0.85rem'}}>Trợ lý STEM</div>
                <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem'}}>● Online</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.3rem', cursor: 'pointer', color: 'white'}}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{flex: 1, overflowY: 'auto', padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc'}}>
            {messages.map((msg, i) => (
              <div key={i} style={{display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{
                  maxWidth: '85%', padding: '0.5rem 0.8rem', borderRadius: '14px', fontSize: '0.82rem', lineHeight: 1.5,
                  background: msg.from === 'user' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'white',
                  color: msg.from === 'user' ? 'white' : '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text.replace(/\*\*(.*?)\*\*/g, '「$1」')}
                </div>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          {/* Quick questions */}
          <div style={{padding: '0.4rem 0.8rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', background: 'white'}}>
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} style={{fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap'}}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{display: 'flex', padding: '0.5rem', borderTop: '1px solid #f1f5f9', background: 'white'}}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              style={{flex: 1, border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.5rem 0.8rem', fontSize: '0.82rem', outline: 'none'}}
            />
            <button type="submit" style={{background: '#22c55e', border: 'none', borderRadius: '10px', padding: '0.5rem 0.6rem', marginLeft: '0.4rem', cursor: 'pointer', color: 'white'}}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
