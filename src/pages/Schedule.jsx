import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { initialData } from '../data/mockData';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const Schedule = () => {
  const [timeline, setTimeline] = useState(initialData.timeline || []);

  useEffect(() => {
    const fetchTimeline = async () => {
      const { data } = await supabase.from('timeline').select('*').order('id', { ascending: true });
      if (data && data.length > 0) setTimeline(data);
    };
    fetchTimeline();
  }, []);

  return (
    <div className="container py-20" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block bg-green-100 text-primary px-4 py-1 rounded-full font-bold text-sm mb-4">📅 LỊCH TRÌNH</div>
        <h1 className="section-title text-green-gradient">Hành Trình Kiến Tạo</h1>
        <p className="text-muted text-lg">Cùng đếm ngược và theo dõi sát sao lịch trình cuộc thi</p>
      </div>

      <div className="card glass animate-fade-in" style={{animationDelay: '0.1s'}}>
        <div className="relative pl-8 border-l-3" style={{borderLeft: '3px solid var(--primary-green)'}}>
          {timeline.map((item, index) => {
            const isLast = index === timeline.length - 1;
            return (
              <div key={item.id || index} className="relative mb-8" style={{marginBottom: isLast ? 0 : '2rem'}}>
                <div className="absolute -left-[26px] top-1 bg-white rounded-full">
                  {isLast ? (
                    <div className="w-6 h-6 rounded-full bg-nshm flex items-center justify-center shadow-lg">
                      <CheckCircle2 size={14} color="white" />
                    </div>
                  ) : index === 0 ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 size={14} color="white" />
                    </div>
                  ) : (
                    <Clock size={22} className="text-orange-400" />
                  )}
                </div>
                <div className={`p-5 rounded-xl border transition-all hover:shadow-md ${isLast ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <h3 className={`text-lg m-0 font-bold ${isLast ? 'text-nshm' : ''}`}>
                      {item.title}
                    </h3>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${isLast ? 'bg-red-100 text-nshm' : 'bg-blue-100 text-secondary'}`}>
                      {item.date}
                    </span>
                  </div>
                  <p className="text-muted text-sm m-0">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex justify-center gap-4 mt-8 flex-wrap animate-fade-in" style={{animationDelay: '0.2s'}}>
        <Link to="/chung-ket" className="btn btn-primary" style={{padding: '0.7rem 1.5rem'}}>🎉 Xem Hoạt Động Ngày Hội</Link>
        <Link to="/" className="btn btn-outline" style={{borderColor: 'var(--primary-green)', color: 'var(--primary-green)', padding: '0.7rem 1.5rem'}}>← Về Trang Chủ</Link>
      </div>
    </div>
  );
};

export default Schedule;
