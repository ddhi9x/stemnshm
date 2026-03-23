import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const scheduleData = [
  { date: '23/03', title: 'Phát Động Cuộc Thi', desc: 'Công bố thể lệ, tiêu chí và chủ đề STEM tới học sinh.', status: 'done' },
  { date: '25-27/03', title: 'Mở Cổng Đăng Ký', desc: 'Các đội thi đăng ký online theo form của nhà trường.', status: 'active' },
  { date: 'Cuối tháng 3', title: 'Gặp Mentor (Lần 1)', desc: 'Tư vấn ý tưởng chuyên sâu cùng các thầy cô Mentor.', status: 'pending' },
  { date: '06/04', title: 'Nộp Hồ Sơ Sơ Loại', desc: 'Nộp File hoặc Slideshow bản thảo ý tưởng.', status: 'pending' },
  { date: '08/04', title: 'Công Bố TOP 20', desc: 'BGK chọn 20 đội xuất sắc nhất vào vòng chung kết.', status: 'pending' },
  { date: '10/04 - 10/05', title: 'Sản Xuất & Mentoring', desc: 'Các đội hoàn thiện chế tạo sản phẩm và làm Poster (Mentor Lần 2, 3).', status: 'pending' },
  { date: '15/05', title: 'Ngày Hội Chung Kết', desc: 'Trưng bày, thuyết trình tại các gian hàng, kèm hoạt động Passport.', status: 'pending' },
];

const Schedule = () => {
  return (
    <div className="container py-20" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="text-center mb-12">
        <h1 className="section-title">Hành Trình Kiến Tạo</h1>
        <p className="text-muted text-lg">Cùng đếm ngược và theo dõi sát sao lịch trình cuộc thi</p>
      </div>

      <div className="card">
        <div className="timeline-container relative pl-6 border-l-2 border-gray-200 ml-4 py-4">
          {scheduleData.map((item, index) => (
            <div key={index} className="timeline-item relative mb-8 last:mb-0">
               {/* Marker point */}
              <div className="absolute -left-[37px] top-1 bg-white">
                 {item.status === 'done' && <CheckCircle2 className="text-primary bg-white" size={24} />}
                 {item.status === 'active' && <Clock className="text-orange-500 bg-white" size={24} />}
                 {item.status === 'pending' && <Circle className="text-gray-300 bg-white" size={24} />}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`text-lg m-0 ${item.status === 'active' ? 'text-orange-500' : 'text-main'}`}>
                    {item.title}
                  </h3>
                  <span className="badge-small bg-blue-100 text-secondary">{item.date}</span>
                </div>
                <p className="text-muted text-sm m-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
