import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { MessageCircle, X, Send, Sparkles, RotateCcw } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyA6yrI5vdjC2uSSjSapnPfJiFa47YGHsUs';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const quickQuestions = [
  '🗓️ Deadline nộp bài?',
  '📝 Đăng ký thế nào?',
  '🔬 Có mấy lĩnh vực?',
  '🏆 Giải thưởng gì?',
  '💡 Gợi ý ý tưởng STEM?',
  '📊 Làm PPT thế nào?',
  '🛂 Passport là gì?',
  '🎯 Ngày hội có gì?',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Chào bạn! 🌿 Mình là **Trợ lý AI STEM NSHM** — được trang bị trí tuệ nhân tạo. Hỏi mình bất cứ gì về Ngày Hội STEM nhé!' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventContext, setEventContext] = useState('');
  const messagesEnd = useRef(null);

  // Fetch all event data and build context for AI
  useEffect(() => {
    const buildContext = async () => {
      const [faq, tl, ab, aw, mentorRes, newsRes, roundsRes] = await Promise.all([
        supabase.from('faq').select('*'),
        supabase.from('timeline').select('*').order('id'),
        supabase.from('about').select('*').single(),
        supabase.from('awards').select('*'),
        supabase.from('mentors').select('name,subject,bio'),
        supabase.from('news').select('title,summary,date').order('created_at', { ascending: false }).limit(5),
        supabase.from('rounds').select('*').order('id'),
      ]);

      let ctx = `=== THÔNG TIN NGÀY HỘI STEM — TRƯỜNG NGÔI SAO HOÀNG MAI ===\n`;
      ctx += `Chủ đề: "Ngày Hội STEM — Kiến Tạo Thế Giới Xanh" (Mùa giải 2025-2026)\n`;
      ctx += `Trường: Ngôi Sao Hoàng Mai, Hà Nội (Tiểu học - THCS - THPT)\n`;
      ctx += `Ngày diễn ra: 22/04/2026\n\n`;

      if (ab.data) {
        ctx += `--- GIỚI THIỆU ---\n`;
        ctx += `${ab.data.message || ''}\nTrọng tâm: ${ab.data.focus || ''}\nĐối tượng: ${ab.data.target || ''}\nHình thức: ${ab.data.format || ''}\n\n`;
      }

      if (tl.data?.length) {
        ctx += `--- LỊCH TRÌNH ---\n`;
        tl.data.forEach(t => { ctx += `• ${t.date}: ${t.title} — ${t.desc || ''}\n`; });
        ctx += '\n';
      }

      if (roundsRes.data?.length) {
        ctx += `--- CÁC VÒNG THI ---\n`;
        roundsRes.data.forEach(r => {
          ctx += `• ${r.title}: ${r.content || ''}\n`;
          if (r.format) ctx += `  Hình thức: ${r.format}\n`;
          if (r.deadline) ctx += `  Deadline: ${r.deadline}\n`;
          if (r.requirements) ctx += `  Yêu cầu: ${r.requirements}\n`;
        });
        ctx += '\n';
      }

      ctx += `--- 4 LĨNH VỰC STEM ---\n`;
      ctx += `1. Science (Khoa học): Khoa học sự sống, năng lượng xanh, hóa học ứng dụng\n`;
      ctx += `2. Technology (Công nghệ): Lập trình, IoT, AI vào giải pháp xanh\n`;
      ctx += `3. Engineering (Kỹ thuật): Thiết kế, chế tạo mô hình, sáng chế\n`;
      ctx += `4. Mathematics (Toán học): Mô hình toán, thống kê, tối ưu hóa\n\n`;

      if (aw.data?.length) {
        ctx += `--- GIẢI THƯỞNG ---\n`;
        aw.data.forEach(a => { ctx += `• ${a.title}: ${a.qty || ''} — ${a.value || ''}\n`; });
        ctx += '\n';
      }

      if (mentorRes.data?.length) {
        ctx += `--- MENTOR ---\n`;
        mentorRes.data.forEach(m => { ctx += `• ${m.name} (${m.subject || ''}): ${m.bio || ''}\n`; });
        ctx += '\n';
      }

      if (faq.data?.length) {
        ctx += `--- CÂU HỎI THƯỜNG GẶP (FAQ) ---\n`;
        faq.data.forEach(f => { ctx += `Q: ${f.question}\nA: ${f.answer}\n\n`; });
      }

      if (newsRes.data?.length) {
        ctx += `--- TIN TỨC MỚI NHẤT ---\n`;
        newsRes.data.forEach(n => { ctx += `• [${n.date || ''}] ${n.title}: ${n.summary || ''}\n`; });
        ctx += '\n';
      }

      ctx += `--- PASSPORT STEM ---\n`;
      ctx += `Mỗi học sinh nhận 1 quyển Passport giấy tại sự kiện. Có 8 trạm (5 trải nghiệm + 3 dự thi). Thu thập đủ 8 sticker để tham gia Quay Số May Mắn.\n`;
      ctx += `5 Trạm Trải Nghiệm: Khoa Học, Công Nghệ, Toán Học, Robotic, Mộc\n`;
      ctx += `3 Trạm Dự Thi: Gian hàng S/T, Gian hàng E/M, Bình chọn yêu thích\n\n`;

      ctx += `--- WEBSITE ---\n`;
      ctx += `Trang web có các mục: Trang Chủ, Giới Thiệu, Lịch Trình, Mentor, Tin Tức, FAQ, Thư Viện, Đội Thi & Kết Quả, Passport STEM\n`;
      ctx += `Đăng ký tham gia bằng nút "Đăng Ký Tham Gia" trên trang chủ hoặc thanh điều hướng.\n`;

      setEventContext(ctx);
    };
    buildContext();
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGemini = async (userMessage, chatHistory) => {
    const systemPrompt = `Bạn là "Trợ lý AI STEM NSHM" — chatbot thông minh của Ngày Hội STEM trường Ngôi Sao Hoàng Mai.

VAI TRÒ:
- Trả lời câu hỏi về sự kiện (lịch trình, đăng ký, giải thưởng, mentor, passport...)
- 🧠 TƯ VẤN Ý TƯỞNG STEM: Gợi ý, góp ý, phát triển ý tưởng dự án theo 4 lĩnh vực S-T-E-M, phù hợp chủ đề "Kiến Tạo Thế Giới Xanh"
- 📋 HƯỚNG DẪN TRÌNH BÀY: Tư vấn cách làm poster, PPT, mô hình, cách thuyết trình trước ban giám khảo
- 🔧 HƯỚNG DẪN TRIỂN KHAI: Gợi ý các bước thực hiện dự án, vật liệu cần thiết, cách thí nghiệm

QUY TẮC BẮT BUỘC:
1. Trả lời thân thiện, dùng emoji. Với câu hỏi thông tin → ngắn gọn (3-4 câu). Với tư vấn ý tưởng/trình bày → có thể dài hơn với gạch đầu dòng.
2. Chỉ trả lời những gì HỌC SINH cần biết. KHÔNG bao giờ tiết lộ kế hoạch nội bộ giáo viên, chi phí tổ chức, quy trình duyệt bài, thông tin quản trị.
3. Khi tư vấn ý tưởng STEM, luôn gắn với chủ đề "Kiến Tạo Thế Giới Xanh" — bảo vệ môi trường, năng lượng tái tạo, phát triển bền vững.
4. Nếu câu hỏi KHÔNG liên quan STEM hoặc sự kiện → từ chối lịch sự.
5. Dùng tiếng Việt. Dùng **bold** cho thông tin quan trọng.
6. KHÔNG bịa số liệu hay thông tin sự kiện. Với ý tưởng STEM thì có thể sáng tạo gợi ý.

GỢI Ý Ý TƯỞNG MẪU THEO LĨNH VỰC:
- Science: Chế phẩm sinh học xử lý rác, vật liệu phân hủy thay nhựa, chiết xuất tinh dầu, năng lượng tái tạo
- Technology: IoT giám sát không khí, App bảo vệ môi trường, thùng rác AI phân loại, robot dọn rác
- Engineering: Máy lọc nước mini, nhà kính thông minh, hệ thống tưới tự động, mô hình nhà xanh
- Mathematics: Mô hình tối ưu thu gom rác, phân tích dữ liệu ô nhiễm, thuật toán tiết kiệm năng lượng

HƯỚNG DẪN TRÌNH BÀY:
- Poster: Tiêu đề rõ, vấn đề → giải pháp → kết quả, hình ảnh minh họa, font chữ lớn dễ đọc
- PPT: 10-15 slide, mở đầu ấn tượng, nêu vấn đề → ý tưởng → triển khai → kết quả → kết luận
- Thuyết trình: 5-7 phút, tự tin, nói rõ ràng, có demo/mô hình nếu được, chuẩn bị câu hỏi phản biện

DỮ LIỆU SỰ KIỆN:
${eventContext}`;

    // Build conversation for Gemini
    const contents = [];
    
    // Add chat history (last 10 messages for context)
    const recentHistory = chatHistory.slice(-10);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.from === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
    
    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.9,
          },
        }),
      });

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      if (data.error) {
        console.error('Gemini API error:', data.error);
        return '⚠️ Mình gặp lỗi kết nối. Bạn thử lại sau nhé!';
      }
      
      return '🤔 Mình chưa hiểu câu hỏi này. Bạn thử hỏi lại hoặc xem FAQ nhé!';
    } catch (error) {
      console.error('Gemini fetch error:', error);
      return '⚠️ Không kết nối được AI. Kiểm tra mạng và thử lại nhé!';
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    const userMsg = { from: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const answer = await callGemini(text.trim(), messages);
      setMessages(prev => [...prev, { from: 'bot', text: answer }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: '⚠️ Có lỗi xảy ra. Thử lại nhé!' }]);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = () => {
    setMessages([
      { from: 'bot', text: 'Chào bạn! 🌿 Mình là **Trợ lý AI STEM NSHM**. Hỏi mình bất cứ gì về Ngày Hội STEM nhé!' },
    ]);
  };

  const renderText = (text) => {
    // Convert **bold** and line breaks
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </React.Fragment>
    ));
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
          width: '380px', maxWidth: 'calc(100vw - 2rem)', height: '520px', maxHeight: 'calc(100vh - 6rem)',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          background: 'white',
          border: '1px solid #e2e8f0',
        }}>
          {/* Header */}
          <div style={{background: 'linear-gradient(135deg, #22c55e, #16a34a)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div className="flex items-center gap-2">
              <div style={{width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Sparkles size={18} color="white" />
              </div>
              <div>
                <div style={{color: 'white', fontWeight: 700, fontSize: '0.85rem'}}>Trợ lý AI STEM</div>
                <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.63rem'}}>✨ Powered by Gemini AI</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetChat} title="Cuộc trò chuyện mới" style={{background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.3rem', cursor: 'pointer', color: 'white', display: 'flex'}}>
                <RotateCcw size={14} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.3rem', cursor: 'pointer', color: 'white', display: 'flex'}}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex: 1, overflowY: 'auto', padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc'}}>
            {messages.map((msg, i) => (
              <div key={i} style={{display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{
                  maxWidth: '85%', padding: '0.5rem 0.8rem', borderRadius: '14px', fontSize: '0.82rem', lineHeight: 1.6,
                  background: msg.from === 'user' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'white',
                  color: msg.from === 'user' ? 'white' : '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <div style={{padding: '0.5rem 1rem', borderRadius: '14px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', fontSize: '0.82rem', color: '#94a3b8'}}>
                  <span className="typing-dots">Đang suy nghĩ</span>
                  <style>{`.typing-dots::after { content: '...'; animation: dots 1.5s steps(4, end) infinite; } @keyframes dots { 0%, 20% { content: ''; } 40% { content: '.'; } 60% { content: '..'; } 80%, 100% { content: '...'; } }`}</style>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div style={{padding: '0.4rem 0.8rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', background: 'white'}}>
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} disabled={isLoading} style={{fontSize: '0.63rem', padding: '0.2rem 0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap', opacity: isLoading ? 0.5 : 1}}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} style={{display: 'flex', padding: '0.5rem', borderTop: '1px solid #f1f5f9', background: 'white'}}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isLoading ? 'Đang trả lời...' : 'Nhập câu hỏi...'}
              disabled={isLoading}
              style={{flex: 1, border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.5rem 0.8rem', fontSize: '0.82rem', outline: 'none', opacity: isLoading ? 0.6 : 1}}
            />
            <button type="submit" disabled={isLoading || !input.trim()} style={{background: isLoading ? '#94a3b8' : '#22c55e', border: 'none', borderRadius: '10px', padding: '0.5rem 0.6rem', marginLeft: '0.4rem', cursor: isLoading ? 'not-allowed' : 'pointer', color: 'white'}}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
