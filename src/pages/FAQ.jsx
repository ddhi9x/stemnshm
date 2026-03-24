import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    q: 'Em đăng ký cá nhân hay nhóm?',
    a: 'Có thể đăng ký theo nhóm từ 3–5 bạn cùng khối THCS hoặc THPT. Mỗi nhóm cần có đầy đủ thông tin các thành viên khi điền form đăng ký.'
  },
  {
    q: 'Sản phẩm có cần chạy được không?',
    a: 'Khuyến khích có mô hình hoạt động được (chạy thực tế). Nếu chưa hoàn thiện, ít nhất cần có sa bàn mô phỏng, poster hoặc video demo để Ban Giám Khảo đánh giá ý tưởng.'
  },
  {
    q: 'Mỗi Mentor hỗ trợ bao nhiêu đội thi?',
    a: 'Mỗi giáo viên Mentor cố vấn sẽ hỗ trợ tối đa 04 đội thi. Mentor sẽ đồng hành, góp ý và định hướng ý tưởng cho các đội trong suốt quá trình chuẩn bị.'
  },
  {
    q: 'Passport là gì và sử dụng như thế nào?',
    a: 'Passport (sổ tay hành trình) là cuốn sổ mỗi học sinh nhận khi tham gia Ngày Hội STEM. Khi hoàn thành các hoạt động tại các trạm trải nghiệm, em sẽ được đóng dấu mộc vào Passport. Thu thập đủ mộc sẽ nhận quà lưu niệm!'
  },
  {
    q: 'Ngày Hội STEM diễn ra khi nào và ở đâu?',
    a: 'Ngày Hội STEM dự kiến tổ chức vào ngày 22/04/2026 tại khuôn viên Trường Ngôi Sao Hoàng Mai. Lịch trình chi tiết sẽ được cập nhật trên website và thông báo qua giáo viên chủ nhiệm.'
  },
  {
    q: 'Em thuộc lĩnh vực nào thì đăng ký lĩnh vực đó?',
    a: 'Bốn lĩnh vực thi gồm: Science (Khoa học), Technology (Công nghệ), Engineering (Kỹ thuật), Mathematics (Toán học). Em chọn lĩnh vực phù hợp nhất với ý tưởng dự án của nhóm. Một nhóm chỉ đăng ký 01 lĩnh vực duy nhất.'
  },
  {
    q: 'Có cần mua vật liệu đắt tiền để làm sản phẩm không?',
    a: 'Không nhất thiết! Ban Tổ Chức khuyến khích sử dụng vật liệu tái chế, vật liệu dễ tìm kiếm. Quan trọng là ý tưởng sáng tạo, khả năng giải quyết vấn đề thực tiễn và trình bày rõ ràng nguyên lý STEM trong sản phẩm.'
  },
  {
    q: 'Làm sao để liên hệ Mentor cố vấn?',
    a: 'Sau khi đăng ký, Ban Tổ Chức sẽ phân công Mentor cho từng đội. Em có thể xem thông tin Mentor tại trang "Mentor" trên website và liên hệ thông qua giáo viên chủ nhiệm hoặc email của trường.'
  },
  {
    q: 'Sản phẩm dự thi được đánh giá dựa trên tiêu chí nào?',
    a: 'Ban Giám Khảo đánh giá dựa trên: (1) Tính sáng tạo & giải quyết vấn đề thực tiễn, (2) Ứng dụng nguyên lý STEM rõ ràng, (3) Khả năng thuyết trình & trình bày, (4) Tính khả thi và mức độ hoàn thiện sản phẩm, (5) Tinh thần đồng đội & hợp tác.'
  },
  {
    q: 'Em có thể nộp bài dự thi trước Ngày Hội không?',
    a: 'Có! Em cần nộp Hồ sơ & Poster dự thi trước hạn deadline theo lịch trình. Link nộp bài được cập nhật trên website. Trong Ngày Hội, các đội sẽ trưng bày sản phẩm thực tế và thuyết trình trước Ban Giám Khảo.'
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

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
            key={idx}
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
                <h4 className="m-0" style={{fontSize: '1rem', color: openIdx === idx ? '#22c55e' : '#c8102e', transition: 'color 0.3s', fontWeight: 700}}>{faq.q}</h4>
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
                <p className="text-muted m-0" style={{lineHeight: 1.8, fontSize: '0.95rem'}}>{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <div className="card glass inline-block" style={{padding: '1.5rem 2.5rem'}}>
          <p className="m-0 text-muted">Vẫn còn thắc mắc? Liên hệ <strong className="text-nshm">info@ngoisaocaohanoi.edu.vn</strong> hoặc hỏi trực tiếp thầy cô chủ nhiệm!</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
