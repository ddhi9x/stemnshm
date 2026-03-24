import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trophy, MapPin, Clock, Users, CheckCircle2, Leaf, Cpu, Wrench, FunctionSquare, Award, Star } from 'lucide-react';

const FinalEvent = () => {
  const [awards, setAwards] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([
    { time: '7h30 - 8h30', title: 'Chuẩn bị & Setup', desc: '7h30 - 7h45: Các đội thi trưng bày sản phẩm dự thi dưới sân bóng. Các trạm trải nghiệm setup. 8h25: HS tham gia trải nghiệm di chuyển xuống sân.' },
    { time: '8h30 - 9h00', title: 'Khai mạc Ngày Hội', desc: '8h30 - 8h40: Ổn định tổ chức. 8h40 - 9h00: Khai mạc (có các thí nghiệm biểu diễn tạo hứng thú cho HS).' },
    { time: '9h00 - 10h00', title: 'Thi đấu & Trải nghiệm', desc: 'Các đội thi thuyết trình về sản phẩm dự thi (2 phút/đội). BGK chấm điểm.' },
    { time: '10h00 - 10h30', title: 'Tổng kết & Trao giải', desc: 'BGK hoàn thành chấm, tính điểm và xếp giải. Công bố giải thưởng, trao giải. Quay số may mắn.' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: awData } = await supabase.from('awards').select('*');
      if (awData) setAwards(awData);

      const { data: schData } = await supabase.from('final_schedule').select('*').order('id', { ascending: true });
      if (schData && schData.length > 0) setScheduleItems(schData);
    };
    fetchData();
  }, []);

  const stations = [
    { icon: <Leaf size={28} className="text-green-500" />, name: 'Trạm Khoa Học', color: '#22c55e', bg: '#f0fdf4', desc: 'Thí nghiệm hóa học xanh & năng lượng tái tạo' },
    { icon: <Cpu size={28} className="text-blue-500" />, name: 'Trạm Công Nghệ', color: '#3b82f6', bg: '#eff6ff', desc: 'Lập trình, AI và IoT thực hành' },
    { icon: <FunctionSquare size={28} className="text-purple-600" />, name: 'Trạm Toán Học', color: '#9333ea', bg: '#faf5ff', desc: 'Giải đố logic & đo lường thực tế' },
    { icon: <Wrench size={28} className="text-orange-500" />, name: 'Trạm Robotic', color: '#f97316', bg: '#fff7ed', desc: 'Điều khiển robot & thi đấu' },
    { icon: <Star size={28} className="text-amber-500" />, name: 'Trạm Mộc', color: '#d97706', bg: '#fffbeb', desc: 'Chế tạo mô hình bằng gỗ & vật liệu tái chế' },
  ];

  return (
    <div className="home-container">
      {/* Hero */}
      <section style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '5rem 1rem 4rem'}}>
        <div className="container text-center animate-fade-in">
          <div className="inline-block bg-white/10 backdrop-blur px-5 py-2 rounded-full font-bold text-sm mb-6 border border-white/20">
            🏆 VÒNG CHUNG KẾT
          </div>
          <h1 className="section-title" style={{color: 'white', fontSize: '2.8rem', lineHeight: 1.2}}>
            Ngày Hội <span className="text-gradient">STEM 2026</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8">
            Trưng bày gian hàng, bảo vệ mô hình và tham gia chuỗi trải nghiệm tương tác
          </p>
          <div className="flex justify-center gap-8 flex-wrap text-center">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock size={20} /> <span className="font-bold text-white">22/04/2026</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={20} /> <span className="font-bold text-white">Trường Ngôi Sao Hoàng Mai</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={20} /> <span className="font-bold text-white">7h30 - 11h00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lịch trình ngày hội */}
      <section className="py-20 bg-light">
        <div className="container" style={{maxWidth: '800px'}}>
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="section-title text-nshm">Lịch Trình Ngày Hội</h2>
            <p className="text-muted text-lg">Diễn biến chi tiết buổi sáng ngày 22/04/2026</p>
          </div>

          <div className="relative pl-8 border-l-4 border-primary animate-fade-in" style={{animationDelay: '0.1s'}}>
            {scheduleItems.map((item, idx) => (
              <div key={idx} className="mb-8 relative">
                <div className="absolute -left-[38px] top-1 bg-white rounded-full p-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{background: 'var(--primary-green)'}}>
                    <CheckCircle2 size={14} color="white" />
                  </div>
                </div>
                <div className="card glass hover-up" style={{padding: '1.5rem'}}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-green-100 text-primary px-3 py-1 rounded-full text-sm font-bold">{item.time}</span>
                    <h3 className="m-0 text-lg">{item.title}</h3>
                  </div>
                  <p className="text-muted m-0 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Trạm trải nghiệm */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block bg-green-100 text-primary px-4 py-1 rounded-full font-bold text-sm mb-4">🌍 TRẢI NGHIỆM</div>
            <h2 className="section-title text-green-gradient">5 Trạm Thực Hành</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Hoàn thành tất cả các trạm để thu thập dấu mộc vào Passport và tham gia bốc thăm trúng thưởng!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stations.map((s, idx) => (
              <div 
                key={idx} 
                className="card text-center hover-lift block-shadow animate-fade-in"
                style={{animationDelay: `${idx * 0.08}s`, borderTop: `4px solid ${s.color}`, background: s.bg}}
              >
                <div className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center" style={{background: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.06)'}}>
                  {s.icon}
                </div>
                <h4 className="font-bold mb-2" style={{color: s.color}}>{s.name}</h4>
                <p className="text-muted text-xs m-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quay số may mắn */}
      <section className="py-16" style={{background: 'linear-gradient(135deg, #fef3c7, #fdf2f8)'}}>
        <div className="container text-center animate-fade-in" style={{maxWidth: '700px'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎰</div>
          <h2 className="section-title text-nshm">Quay Số May Mắn</h2>
          <p className="text-gray-700 text-lg mb-4">
            Thu thập đủ sticker của <strong>8 trạm</strong> (gồm 5 trạm dự thi + 3 trạm trải nghiệm) sẽ được đổi 
            <strong className="text-nshm"> 1 số may mắn</strong> để tham gia quay số may mắn!
          </p>
        </div>
      </section>

      {/* Giải thưởng */}
      {awards.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="section-title text-nshm">Cơ Cấu Giải Thưởng Chung Kết</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
              {awards.map(aw => (
                <div key={aw.id} className="card text-center hover-lift block-shadow" style={{width: '200px', backgroundColor: aw.bg, borderTop: `5px solid ${aw.color}`}}>
                  <div className="mx-auto mb-3 w-14 h-14 rounded-xl flex items-center justify-center bg-white" style={{boxShadow: '0 6px 12px rgba(0,0,0,0.05)'}}>
                    <Trophy size={28} color={aw.color} />
                  </div>
                  <h4 style={{color: aw.color, fontWeight: 900, fontSize: '1rem'}}>{aw.title}</h4>
                  <p className="text-sm text-muted mb-1">{aw.qty}</p>
                  <strong className="text-xs" style={{color: aw.color}}>{aw.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FinalEvent;
