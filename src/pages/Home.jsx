import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLocalData } from '../data/mockData';
import { supabase } from '../supabaseClient';
import { ChevronRight, ChevronDown, Leaf, Cpu, Wrench, FunctionSquare, Clock, X, Download, Award, Trophy, Medal, CheckCircle2, Navigation, Monitor } from 'lucide-react';
import './Home.css';
import '../components/Timeline.css';
import '../components/Modal.css';

const domainDetails = {
  Science: {
    title: 'Science (Khoa học)',
    icon: <Leaf size={48} className="text-primary mb-4 mx-auto" />,
    color: 'var(--primary-green)',
    desc: 'Tập trung vào khoa học sự sống, năng lượng xanh, và hóa học ứng dụng.',
    ideas: [
      'Nghiên cứu chế phẩm sinh học xử lý rác thải hữu cơ hữu hiệu.',
      'Sáng chế vật liệu mới dễ phân hủy thay thế nhựa.',
      'Dự án chiết xuất tinh dầu, làm xà phòng từ nguyên liệu thiên nhiên.',
      'Khám phá các dạng năng lượng tái tạo (điện gió, mặt trời).'
    ],
    req: 'Dự án cần thể hiện rõ nguyên lý khoa học đằng sau và có số liệu thực nghiệm chứng minh bảo vệ môi trường.'
  },
  Technology: {
    title: 'Technology (Công nghệ)',
    icon: <Cpu size={48} className="text-secondary mb-4 mx-auto" />,
    color: 'var(--secondary-blue)',
    desc: 'Ứng dụng lập trình, IoT, và Trí tuệ nhân tạo (AI) vào giải pháp xanh.',
    ideas: [
      'Lập trình hệ thống IoT giám sát chất lượng không khí, độ ẩm đất.',
      'Xây dựng App/Website nâng cao nhận thức bảo vệ môi trường.',
      'Thiết kế thùng rác ứng dụng AI để tự động phân loại rác thải.',
      'Xe robot tự hành dọn rác, thu gom phế liệu trên sa bàn.'
    ],
    req: 'Cần có sản phẩm phần mềm, hoặc mạch điện tử/vi điều khiển (Arduino, Microbit...) ứng dụng code thực tế.'
  },
  Engineering: {
    title: 'Engineering (Kỹ thuật)',
    icon: <Wrench size={48} className="text-orange-500 mb-4 mx-auto" />,
    color: '#f97316',
    desc: 'Hướng tới thiết kế, lắp ráp và chế tạo thành công một mô hình vật lý.',
    ideas: [
      'Chế tạo mô hình máy lọc nước tuần hoàn mini.',
      'Thiết kế hệ thống tưới tiêu tự động thông minh bằng vật liệu tái chế.',
      'Mô hình nhà màng, nhà kính nông nghiệp tiết kiệm năng lượng.',
      'Chế tạo hệ thống ròng rọc, máy nén rác cơ học cho trường học.'
    ],
    req: 'Sản phẩm phải là một mô hình vật lý hoàn chỉnh, ưu tiên sử dụng vật liệu tái chế 100% để bảo vệ môi trường xanh.'
  },
  Mathematics: {
    title: 'Mathematics (Toán học)',
    icon: <FunctionSquare size={48} className="text-purple-600 mb-4 mx-auto" />,
    color: '#9333ea',
    desc: 'Sử dụng tư duy hình học, thống kê, tối ưu hóa thuật toán đo lường.',
    ideas: [
      'Xây dựng mô hình toán học thống kê lượng rác thải báo cáo trường học.',
      'Thiết kế hình học tối ưu cho kiến trúc xanh tiết kiệm diện tích.',
      'Thuật toán tối ưu hóa đường đi cho robot dọn rác.',
      'Phân tích số liệu và biểu đồ đo lường mức độ ô nhiễm không khí.'
    ],
    req: 'Đội thi cần làm rõ cách ứng dụng toán học (công thức, đồ thị, mô hình 3D) vào bài toán thực tiễn thay vì chỉ nêu ý tưởng suông.'
  }
};

const getAwardIcon = (id, color) => {
  if (id === 'nhat') return <Trophy size={40} color={color} />;
  if (id === 'nhi' || id === 'ba') return <Medal size={40} color={color} />;
  return <Award size={40} color={color} />;
}

const Home = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [news, setNews] = useState([]);
  const [awards, setAwards] = useState([]);
  const [linksData, setLinksData] = useState({ register: '#', submit: '#' });
  const [timeline, setTimeline] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Mentors (nếu có table mentors)
      // await supabase.from('mentors').select('*'); 
      
      const { data: awardsData } = await supabase.from('awards').select('*');
      if (awardsData) setAwards(awardsData);

      const { data: linksDb } = await supabase.from('links').select('*').single();
      if (linksDb) setLinksData({ register: linksDb.register, submit: linksDb.submit });

      const { data: timelineData } = await supabase.from('timeline').select('*').order('id', { ascending: true });
      if (timelineData) setTimeline(timelineData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if(activeModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [activeModal]);

  return (
    <div className="home-container">
      {/* Dynamic Hero Section - IOSTEM Style */}
      <section className="hero-section">
        <div className="container hero-grid gap-8 items-center">
          <div className="hero-content animate-fade-in">
            <div className="badge mb-4 pulse-glow">Mùa Giải 2025-2026</div>
            <h1 className="hero-title">
              <span className="text-nshm">Ngày Hội STEM</span> <br/>
              <span className="text-gradient">Kiến Tạo Thế Giới Xanh</span>
            </h1>
            <p className="hero-subtitle mb-8">
              Khơi nguồn sáng tạo, lan tỏa đam mê khoa học - công nghệ dành cho học sinh trường Ngôi Sao Hoàng Mai. Hành trình kiến tạo tương lai bắt đầu từ hôm nay.
            </p>
            <div className="hero-cta flex gap-4 flex-wrap">
              <a href={linksData.register} target="_blank" rel="noreferrer" className="btn btn-nshm btn-lg pulse-shadow">Đăng Ký Tham Gia</a>
              <a href={linksData.submit} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">Nộp Bài / Sản Phẩm</a>
              <a href="/Mau_Ho_So_So_Loai.docx" download className="btn btn-outline btn-lg" style={{borderColor: 'var(--secondary-blue)', color: 'var(--secondary-blue)'}}>
                <Download size={18} /> Tải Mẫu Hồ Sơ
              </a>
              <a href="/STEM_Pitch_Blueprints.pptx" download className="btn btn-outline btn-lg" style={{borderColor: '#d97706', color: '#d97706'}}>
                <Download size={18} /> Mẫu Trình Bày PPT
              </a>
            </div>
          </div>
          
          <div className="hero-image-wrapper animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="hero-orb orb-1"></div>
            <div className="hero-orb orb-2"></div>
            <img src="/hero.png" alt="STEM Green Tech" className="hero-image float-animation" />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section py-20 bg-light">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="section-title text-nshm">HÀNH TRÌNH CHINH PHỤC</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Chuỗi sự kiện và lịch trình chi tiết của Ngày Hội STEM 2026.</p>
          </div>

          <div className="timeline-container animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="timeline-track"></div>
            
            {timeline.length > 0 && timeline.map((node, index) => {
              const isLast = index === timeline.length - 1;
              const targetId = index === 2 ? 'vong-so-loai' : (index === 3 ? 'vong-chung-ket' : (index === 4 ? 'hoat-dong-ngay-hoi' : null));
              const linkTo = index === 1 ? '/mentor' : null;
              
              const handleClick = (e) => {
                if (linkTo) {
                  navigate(linkTo);
                } else if (targetId) {
                  e.preventDefault();
                  const el = document.getElementById(targetId);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({top: y, behavior: 'smooth'});
                  }
                }
              };

              return (
              <div key={node.id} className="timeline-node" style={{marginTop: index % 2 !== 0 ? '3rem' : '0'}}>
                {isLast ? (
                  <div onClick={handleClick} className="block p-3 rounded-xl hover-lift bg-white/50 border-2 border-dashed border-red-300 shadow-sm relative z-10 cursor-pointer" style={{top: '-15px'}}>
                    <div className="timeline-dot" style={{marginBottom: '0.5rem'}}></div>
                    <div className="timeline-date">{node.date}</div>
                    <div className="timeline-title">{node.title}</div>
                    <div className="timeline-desc">{node.desc}</div>
                    <div className="text-nshm font-bold text-xs mt-3 flex items-center justify-center gap-1 hover:underline">Xem Hoạt Động <ChevronDown size={14}/></div>
                  </div>
                ) : (
                  <div 
                    onClick={handleClick} 
                    className={(targetId || linkTo) ? 'cursor-pointer hover-up p-2 rounded-lg transition-all duration-300 hover:bg-black/5' : ''}
                    title={linkTo ? 'Nhấn để xem danh sách Mentor' : (targetId ? 'Nhấn để xem chi tiết vòng thi' : '')}
                  >
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">{node.date}</div>
                    <div className="timeline-title">{node.title}</div>
                    <div className="timeline-desc">{node.desc}</div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* 4 Domains Section - Float Cards */}
      <section className="domains-section py-20 relative bg-light">
        <div className="container relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="section-title text-green-gradient">4 Lĩnh Vực Cốt Lõi</h2>
            <p className="text-muted text-lg">Click trực tiếp vào từng lĩnh vực để xem gợi ý dự án chuyên sâu</p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div className="domain-card card text-center hover-up" onClick={() => setActiveModal('Science')} style={{cursor: 'pointer'}}>
              <div className="domain-icon bg-green-100 text-primary glow-icon"><Leaf size={32} /></div>
              <h3 className="mb-2">Science</h3>
              <p className="text-muted text-sm" style={{minHeight: '60px'}}>Nghiên cứu khoa học sự sống, năng lượng xanh.</p>
              <span className="text-primary text-xs font-bold mt-2 inline-block">BẤM XEM GỢI Ý &rarr;</span>
            </div>
            <div className="domain-card card text-center hover-up" onClick={() => setActiveModal('Technology')} style={{animationDelay: '0.1s', cursor: 'pointer'}}>
              <div className="domain-icon bg-blue-100 text-secondary glow-icon"><Cpu size={32} /></div>
              <h3 className="mb-2">Technology</h3>
              <p className="text-muted text-sm" style={{minHeight: '60px'}}>Phát triển phần mềm, ứng dụng AI, IoT.</p>
              <span className="text-secondary text-xs font-bold mt-2 inline-block">BẤM XEM GỢI Ý &rarr;</span>
            </div>
            <div className="domain-card card text-center hover-up" onClick={() => setActiveModal('Engineering')} style={{animationDelay: '0.2s', cursor: 'pointer'}}>
              <div className="domain-icon bg-orange-100 text-orange-500 glow-icon"><Wrench size={32} /></div>
              <h3 className="mb-2">Engineering</h3>
              <p className="text-muted text-sm" style={{minHeight: '60px'}}>Chế tạo mô hình, máy tái chế bằng cơ khí kỹ thuật.</p>
              <span className="text-orange-500 text-xs font-bold mt-2 inline-block">BẤM XEM GỢI Ý &rarr;</span>
            </div>
            <div className="domain-card card text-center hover-up" onClick={() => setActiveModal('Mathematics')} style={{animationDelay: '0.3s', cursor: 'pointer'}}>
              <div className="domain-icon bg-purple-100 text-purple-600 glow-icon"><FunctionSquare size={32} /></div>
              <h3 className="mb-2">Mathematics</h3>
              <p className="text-muted text-sm" style={{minHeight: '60px'}}>Thuật toán, đo lường thống kê số liệu.</p>
              <span className="text-purple-600 text-xs font-bold mt-2 inline-block">BẤM XEM GỢI Ý &rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rounds Section */}
      <section className="rounds-section py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block bg-blue-100 text-secondary px-4 py-1 rounded-full font-bold text-sm mb-4">🏆 CẤU TRÚC CUỘC THI</div>
            <h2 className="section-title text-nshm">CÁC VÒNG THI</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Cuộc thi được tổ chức tinh gọn qua 02 vòng thi với nội dung thực tiễn, đánh giá năng lực toàn diện của học sinh.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 relative z-10 animate-fade-in" style={{animationDelay: '0.1s'}}>
             {/* Round 1 */}
             <div id="vong-so-loai" className="card glass relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff)', borderColor: '#bbf7d0', padding: '3rem'}}>
               <div className="flex items-center gap-4 mb-6">
                 <div className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"><CheckCircle2 size={30} /></div>
                 <h3 className="text-2xl m-0 text-primary">Vòng Sơ Loại</h3>
               </div>
               
               <div className="space-y-4 text-left">
                 <div className="flex gap-3">
                   <Navigation size={20} className="text-muted shrink-0 mt-1" />
                   <div><strong className="text-gray-700">Hình thức:</strong> Nộp hồ sơ bản cứng và đăng ký dự thi trực tuyến.</div>
                 </div>
                 <div className="flex gap-3">
                   <Clock size={20} className="text-muted shrink-0 mt-1" />
                   <div><strong className="text-gray-700">Thời hạn:</strong> Nộp hồ sơ chậm nhất vào ngày <span className="text-nshm font-bold">06/04/2026</span>.</div>
                 </div>
                 <div className="flex gap-3">
                   <Leaf size={20} className="text-muted shrink-0 mt-1" />
                   <div>
                     <strong className="text-gray-700">Nội dung:</strong> Đội thi nộp Mẫu hồ sơ ý tưởng và Bản trình bày PowerPoint. Bắt buộc có Mentor bảo trợ. 
                     <br/><a href="/STEM_Pitch_Blueprints.pptx" download className="text-secondary font-bold inline-flex items-center gap-1 mt-1 hover:underline"><Download size={14}/> Tải Hướng Dẫn Kèm Theo</a>
                   </div>
                 </div>
                 <div className="flex gap-3">
                   <Award size={20} className="text-primary shrink-0 mt-1" />
                   <div><strong className="text-gray-700">Yêu cầu:</strong> Ý tưởng phải khả thi, sáng tạo và bám sát chủ đề Bảo vệ Môi trường (Green World).</div>
                 </div>
               </div>
             </div>

             {/* Round 2 */}
             <div id="vong-chung-ket" className="card glass relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #fdf2f8, #ffffff)', borderColor: '#fbcfe8', padding: '3rem'}}>
               <div className="flex items-center gap-4 mb-6">
                 <div className="bg-nshm text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"><Trophy size={30} /></div>
                 <h3 className="text-2xl m-0 text-nshm">Vòng Chung Kết (Ngày Hội STEM)</h3>
               </div>
               
               <div className="space-y-4 text-left">
                 <div className="flex gap-3">
                   <Navigation size={20} className="text-muted shrink-0 mt-1" />
                   <div><strong className="text-gray-700">Hình thức:</strong> Trưng bày gian hàng và thi đấu/thuyết trình trực tiếp tại Trường.</div>
                 </div>
                 <div className="flex gap-3">
                   <Clock size={20} className="text-muted shrink-0 mt-1" />
                   <div><strong className="text-gray-700">Thời gian sự kiện:</strong> Ngày <span className="text-nshm font-bold">22/04/2026</span>.</div>
                 </div>
                 <div className="flex gap-3">
                   <Leaf size={20} className="text-muted shrink-0 mt-1" />
                   <div><strong className="text-gray-700">Nội dung:</strong> Đội thi mang sản phẩm/mô hình vật lý hoàn chỉnh đến trưng bày. Trực tiếp thực hiện thuyết trình và trả lời phản biện với Ban Giám Khảo ngay tại gian hàng.</div>
                 </div>
                 <div className="flex gap-3">
                   <Award size={20} className="text-nshm shrink-0 mt-1" />
                   <div><strong className="text-gray-700">Tiêu chí Chấm:</strong> Khả năng ứng dụng thực tiễn, tính thẩm mỹ, vật liệu tái chế xanh và bản lĩnh trình bày.</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>
      {/* Criteria & Rules Section */}
      <section className="criteria-section py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="section-title text-primary">TIÊU CHUẨN & MA TRẬN ĐIỂM</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Thông tin chi tiết giúp các Đội thi định hướng rõ ràng và đạt kết quả cao nhất.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Quality Seal */}
            <div className="card shadow-lg p-8 rounded-2xl border-t-4 border-primary bg-green-50/30 hover-up">
              <h3 className="text-2xl text-primary mb-6 flex items-center gap-3"><CheckCircle2/> Tiêu chuẩn "Quality Seal"</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg shrink-0 h-fit"><Leaf size={24}/></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Vật liệu xanh (Khuyến khích)</h4>
                    <p className="text-muted text-sm text-gray-600">Ưu tiên sử dụng nguyên liệu tái chế, vật liệu đã qua sử dụng, rẻ tiền và thân thiện với môi trường.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-blue-100 text-blue-700 p-3 rounded-lg shrink-0 h-fit"><span className="font-bold text-xl">🛡️</span></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">An toàn tuyệt đối</h4>
                    <p className="text-muted text-sm text-gray-600">Đảm bảo an toàn cho người sử dụng; không có nguyên liệu gây cháy, nổ hoặc ô nhiễm môi trường.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-orange-100 text-orange-700 p-3 rounded-lg shrink-0 h-fit"><Wrench size={24}/></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Tính thực tiễn</h4>
                    <p className="text-muted text-sm text-gray-600">Sản phẩm phải có mục đích rõ ràng và có khả năng áp dụng vào thực tiễn cuộc sống.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-purple-100 text-purple-700 p-3 rounded-lg shrink-0 h-fit"><FunctionSquare size={24}/></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Hàm lượng chuyên môn</h4>
                    <p className="text-muted text-sm text-gray-600">Khuyến khích các sản phẩm thể hiện sự đầu tư nghiên cứu sâu sắc về mặt học thuật và kỹ thuật.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Matrix Points */}
            <div className="card shadow-lg p-8 rounded-2xl border-t-4 border-nshm bg-red-50/30 hover-up">
              <h3 className="text-2xl text-nshm mb-6 flex items-center gap-3"><Trophy/> Ma trận Điểm Sơ loại (30đ)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <span className="font-semibold text-gray-700">Mô tả ý tưởng & Nguyên lý</span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">6đ (20%)</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <span className="font-semibold text-gray-700">Xác định Vấn đề & Mục tiêu</span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">4đ (13.3%)</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <span className="font-semibold text-gray-700">Phù hợp Chủ đề (Thế giới xanh)</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">4đ (13.3%)</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <span className="font-semibold text-gray-700">Tính Sáng tạo & Khả thi</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">8đ (26.6%)</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <span className="font-semibold text-gray-700">Hàm lượng STEM/STEAM</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">4đ (13.3%)</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <span className="font-semibold text-gray-700">An toàn & Hình thức hồ sơ</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold">4đ (13.3%)</span>
                </div>
              </div>
              <div className="mt-6 bg-nshm text-white text-sm p-4 rounded-xl i talic opacity-90">
                <span className="font-bold">💡 Mẹo Nhỏ:</span> Giám khảo ưu tiên giải pháp RÕ RÀNG và HÀM LƯỢNG KIẾN THỨC hơn là trang trí rườm rà.
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Explore / Activities Section */}
      <section id="hoat-dong-ngay-hoi" className="explore-section py-20 bg-light">
        <div className="container" style={{maxWidth: '1000px'}}>
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-block px-5 py-1.5 rounded-full font-bold text-sm mb-4" style={{background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0'}}>
              🌍 KHÁM PHÁ & TRẢI NGHIỆM
            </div>
            <h2 className="section-title text-nshm" style={{fontSize: '2rem'}}>HOẠT ĐỘNG NGÀY HỘI STEM (22/04)</h2>
            <p className="text-gray-700 text-lg mx-auto font-medium">Không chỉ thi đấu, toàn bộ học sinh Ngôi Sao Hoàng Mai sẽ dùng <strong>"Passport"</strong> tham gia chuỗi trải nghiệm tương tác với sự kiện (Dự kiến 8h00 - 11h00).</p>
          </div>

          {/* Unified Activities Card */}
          <div className="card p-0 rounded-3xl mb-8 animate-fade-in block-shadow overflow-hidden bg-white" style={{animationDelay: '0.1s', border: 'none'}}>
            <div style={{height: '6px', background: 'linear-gradient(90deg, #22c55e 50%, #3b82f6 50%)'}}></div>
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 md:gap-16">
              
              {/* Activity 1 */}
              <div className="flex-1">
                <h3 className="text-xl mb-4 font-bold flex items-center gap-3" style={{color: '#166534'}}><CheckCircle2 size={24} className="text-green-500"/> Hoạt Động 1: Khán Giả Tương Tác</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">Học sinh tự do tham quan các gian hàng của đội lọt vào Vòng Chung Kết. Quan sát mô hình thực tế, lắng nghe thuyết trình và ghi lại thông tin những dự án ấn tượng nhất vào cuốn Passport của mình.</p>
              </div>

              {/* Vertical Divider (Desktop) / Horizontal (Mobile) */}
              <div className="hidden md:block w-px bg-gray-200"></div>
              <div className="md:hidden h-px w-full bg-gray-200"></div>

              {/* Activity 2 */}
              <div className="flex-1">
                <h3 className="text-xl mb-4 font-bold flex items-center gap-3" style={{color: '#1e40af'}}><Navigation size={24} className="text-blue-500"/> Hoạt Động 2: 5 Trạm Thực Hành</h3>
                <p className="text-gray-600 mb-5 leading-relaxed text-[15px]">Đích thân tham gia và hoàn thành thử thách tại 5 Trạm chuyên môn được thiết kế riêng:</p>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[15px] font-bold text-gray-700">
                  <div className="flex items-center gap-2"><Leaf size={18} className="text-green-500"/> Trạm Khoa Học</div>
                  <div className="flex items-center gap-2"><Monitor size={18} className="text-gray-700"/> Trạm Công Nghệ</div>
                  <div className="flex items-center gap-2"><FunctionSquare size={18} className="text-purple-600"/> Trạm Toán Học</div>
                  <div className="flex items-center gap-2"><Cpu size={18} className="text-blue-500"/> Trạm Robotic</div>
                  <div className="flex items-center gap-2 col-span-2"><Wrench size={18} className="text-orange-500"/> Trạm Mộc</div>
                </div>
              </div>

            </div>
          </div>

          {/* Lucky Draw Card */}
          <div className="card p-0 rounded-3xl border-2 border-nshm text-center hover-lift animate-fade-in bg-white overflow-hidden relative" style={{animationDelay: '0.2s', boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1)'}}>
            <div className="p-8 md:p-10">
              <h3 className="text-2xl text-nshm mb-4 flex items-center justify-center gap-3 font-bold"><Trophy size={28}/> Quay Số May Mắn</h3>
              <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed text-[15px]">Thu thập đủ dấu / thông tin của <strong>6 trạm</strong> (gồm 4 trạm dự thi + 2 trạm trải nghiệm) sẽ nhận mã số để bốc thăm trúng <strong className="text-nshm text-lg">5 Bộ kit STEM cực xịn</strong> cùng hàng chục chiếc Móc Khóa khoa học phiên bản giới hạn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="awards-section py-20" style={{background: 'linear-gradient(to bottom, var(--bg-light), white)'}}>
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full font-bold text-sm mb-4">🏆 GIẢI THƯỞNG</div>
            <h2 className="section-title text-nshm">CƠ CẤU GIẢI THƯỞNG</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Cơ cấu giải thưởng được phân chia theo từng lĩnh vực, đánh giá công tâm bởi Hội đồng BGK chuyên môn.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            {awards && awards.map((aw, idx) => (
              <div key={aw.id} className="card text-center hover-lift block-shadow" style={{width: '220px', backgroundColor: aw.bg, borderTop: `5px solid ${aw.color}`}}>
                <div style={{width: '80px', height: '80px', borderRadius: '20px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'}}>
                  {getAwardIcon(aw.id, aw.color)}
                </div>
                <h3 style={{color: aw.color, fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.5px', marginBottom: '0.5rem'}}>{aw.title}</h3>
                <p className="text-sm text-muted font-medium mb-3">Số lượng: <span style={{fontSize:'1.1rem', color: 'var(--text-main)'}}>{aw.qty}</span></p>
                <div className="pt-4 mt-auto border-t" style={{borderColor: 'rgba(0,0,0,0.05)'}}>
                  <p className="text-xs text-muted mb-1">Giá trị giải thưởng:</p>
                  <strong style={{color: aw.color}}>{aw.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="why-join-section py-20" style={{backgroundColor: '#1e293b', color: 'white'}}>
        <div className="container grid grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in relative">
            <h2 className="section-title mb-6" style={{color: 'white'}}>Tại sao nên tham gia<br/><span className="text-gradient">Ngày hội STEM?</span></h2>
            <p className="text-gray-300 text-lg mb-8">Trải nghiệm những giá trị thực tế và cơ hội phát triển bản thân toàn diện trong môi trường giáo dục đổi mới.</p>
            <div className="w-full flex justify-center">
              <img src="/hero.png" alt="Rocket" style={{width: '240px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'}} className="float-animation" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex flex-col gap-6" style={{marginTop: '2rem'}}>
              <div className="card glass text-center hover-up" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white'}}>
                <div className="mx-auto mb-4 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center"><Leaf size={32} color="var(--primary-green)" /></div>
                <h4 className="m-0 text-white leading-tight">Phát triển tư duy &<br/>sáng tạo xanh</h4>
              </div>
              <div className="card glass text-center hover-up" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white'}}>
                <div className="mx-auto mb-4 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center"><Award size={32} color="var(--secondary-blue)" /></div>
                <h4 className="m-0 text-white leading-tight">Vinh danh, bảo chứng<br/>năng lực học thuật</h4>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="card glass text-center hover-up" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white'}}>
                <div className="mx-auto mb-4 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center"><Trophy size={32} color="#f97316" /></div>
                <h4 className="m-0 text-white leading-tight">Trải nghiệm thi đấu<br/>hấp dẫn & tương tác</h4>
              </div>
              <div className="card glass text-center hover-up" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white'}}>
                <div className="mx-auto mb-4 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center"><FunctionSquare size={32} color="#9333ea" /></div>
                <h4 className="m-0 text-white leading-tight">Kỳ thi duy nhất trọn vẹn<br/>4 lĩnh vực cốt lõi</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Detail Modal */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}><X size={24} /></button>
            {domainDetails[activeModal].icon}
            <h2 className="text-center mb-6" style={{color: domainDetails[activeModal].color, fontSize: '2rem'}}>
              {domainDetails[activeModal].title}
            </h2>
            <div className="modal-body">
              <p className="text-lg mb-6 text-center font-medium">{domainDetails[activeModal].desc}</p>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                <h4 className="mb-4 text-nshm">💡 Gợi Ý Ý Tưởng Triển Khai:</h4>
                <ul className="list-disc pl-5">
                  {domainDetails[activeModal].ideas.map((idea, i) => (
                    <li key={i} className="mb-2 text-muted">{idea}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="mb-2 text-secondary">🎯 Tiêu Chí Đánh Giá Bắt Buộc:</h4>
                <p className="text-muted m-0">{domainDetails[activeModal].req}</p>
              </div>
            </div>
            <div className="text-center mt-8">
               <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Đã Hiểu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
