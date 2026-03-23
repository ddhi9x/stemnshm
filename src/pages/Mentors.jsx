import React, { useState, useEffect } from 'react';
import { getLocalData } from '../data/mockData';
import { Users } from 'lucide-react';
import './Mentors.css';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setMentors(getLocalData('mentors'));
  }, []);

  const fields = ['All', 'Science', 'Technology', 'Engineering', 'Mathematics'];
  const filteredMentors = filter === 'All' ? mentors : mentors.filter(m => m.field === filter);

  const getBadgeColor = (field) => {
    switch(field) {
      case 'Science': return 'bg-green-100 text-primary border border-green-200';
      case 'Technology': return 'bg-blue-100 text-secondary border border-blue-200';
      case 'Engineering': return 'bg-orange-100 text-orange-600 border border-orange-200';
      case 'Mathematics': return 'bg-purple-100 text-purple-600 border border-purple-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="container py-20 min-h-screen">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="section-title text-green-gradient">Đội Ngũ Mentor Cố Vấn</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Các thầy cô với chuyên môn dày dạn sẽ đồng hành và định hướng ý tưởng cho các đội thi trong suốt quá trình hoàn thiện mô hình.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 text-orange-600 px-4 py-2 rounded-full font-medium text-sm border border-yellow-200 shadow-sm" style={{padding: '0.5rem 1rem', borderRadius: '50px'}}>
          <Users size={16} /> Lưu ý: Mỗi giáo viên Mentor hỗ trợ tối đa 04 đội thi
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in" style={{animationDelay: '0.1s'}}>
        {fields.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f === 'All' ? 'Tất Cả Lĩnh Vực' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.map((m, idx) => (
          <div 
            key={m.id} 
            className="card glass hover-lift" 
            style={{animation: `fadeInUp 0.5s ease-out forwards`, animationDelay: `${idx * 0.05}s`, opacity: 0}}
          >
            <div className="flex flex-col items-center text-center h-full">
              {m.image ? (
                 <img src={m.image} alt={m.name} className="mentor-card-avatar" />
              ) : (
                 <div className="mentor-avatar-gradient mb-4" style={{width: '90px', height: '90px', border: '3px solid white'}}></div>
              )}
              
              <h3 className="text-xl text-nshm mb-2">{m.name}</h3>
              <span className={`badge-tag ${getBadgeColor(m.field)}`}>
                {m.field}
              </span>
              <p className="text-muted text-sm flex-1 pt-2 w-full">
                {m.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-10 text-muted">
          Không tìm thấy Mentor nào trong lĩnh vực này.
        </div>
      )}
    </div>
  );
};

export default Mentors;
