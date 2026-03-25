import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Trophy, Users, ArrowLeft } from 'lucide-react';

const Results = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('status', 'approved')
        .order('field', { ascending: true });
      if (data) setTeams(data);
      setLoading(false);
    };
    fetchTeams();
  }, []);

  const fieldColors = {
    Science: { bg: '#dcfce7', color: '#16a34a', icon: '🔬' },
    Technology: { bg: '#dbeafe', color: '#2563eb', icon: '💻' },
    Engineering: { bg: '#fef3c7', color: '#d97706', icon: '⚙️' },
    Mathematics: { bg: '#fce7f3', color: '#db2777', icon: '📐' },
  };

  const filtered = filter === 'all' ? teams : teams.filter(t => t.field === filter);

  return (
    <div className="container py-20" style={{maxWidth: '1000px', margin: '0 auto'}}>
      <div className="text-center mb-12 animate-fade-in">
        <div className="stem-section-badge" style={{background: '#fef9c3', color: '#ca8a04'}}>🏆 KẾT QUẢ</div>
        <h1 className="section-title text-green-gradient">Công Bố Kết Quả</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Danh sách các đội thi xuất sắc lọt vào vòng Chung Kết Ngày Hội STEM 2026.</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div style={{fontSize: '3rem'}}>⏳</div>
          <p className="text-muted mt-4">Đang tải kết quả...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📋</div>
          <h3 className="text-muted text-xl mb-2">Chưa có kết quả</h3>
          <p className="text-muted mb-6">Kết quả sẽ được công bố sau khi Ban Tổ Chức hoàn tất chấm điểm vòng Sơ Loại.</p>
          <Link to="/" className="btn btn-primary">← Về Trang Chủ</Link>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-8 justify-center flex-wrap animate-fade-in">
            {[['all', '🏆 Tất cả'], ['Science', '🔬 Science'], ['Technology', '💻 Technology'], ['Engineering', '⚙️ Engineering'], ['Mathematics', '📐 Mathematics']].map(([val, label]) => (
              <button key={val} className={`btn ${filter === val ? 'btn-nshm' : 'btn-outline'}`} style={{fontSize: '0.85rem', padding: '0.4rem 1rem'}} onClick={() => setFilter(val)}>
                {label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
            {Object.entries(fieldColors).map(([field, style]) => {
              const count = teams.filter(t => t.field === field).length;
              return (
                <div key={field} className="card glass text-center" style={{padding: '1rem', borderTop: `3px solid ${style.color}`}}>
                  <div style={{fontSize: '1.5rem'}}>{style.icon}</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 900, color: style.color}}>{count}</div>
                  <div style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 600}}>{field}</div>
                </div>
              );
            })}
          </div>

          {/* Team List */}
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((team, idx) => {
              const style = fieldColors[team.field] || fieldColors.Science;
              return (
                <div key={team.id} className="card glass hover-up animate-fade-in" style={{animationDelay: `${idx * 0.06}s`, padding: '1.5rem', borderLeft: `4px solid ${style.color}`}}>
                  <div className="flex items-start gap-3">
                    <div style={{width: '42px', height: '42px', borderRadius: '12px', background: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0}}>
                      {style.icon}
                    </div>
                    <div className="flex-1">
                      <h3 style={{fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: 'var(--text-main)'}}>{team.team_name}</h3>
                      <div className="flex items-center gap-3 flex-wrap" style={{fontSize: '0.8rem', color: '#64748b'}}>
                        <span style={{background: style.bg, color: style.color, padding: '0.1rem 0.5rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.72rem'}}>{team.field}</span>
                        {team.leader && <span>👤 {team.leader}</span>}
                        {team.class && <span>🏫 {team.class}</span>}
                      </div>
                      {team.members && <p style={{fontSize: '0.78rem', color: '#94a3b8', margin: '0.4rem 0 0', whiteSpace: 'pre-line'}}>👥 {team.members}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 animate-fade-in">
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Tổng cộng <span style={{fontWeight: 700, color: 'var(--primary-green)'}}>{teams.length}</span> đội thi lọt vào Chung Kết 🎉</p>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="text-center mt-8">
        <Link to="/" className="btn btn-outline" style={{marginRight: '1rem'}}>← Trang Chủ</Link>
        <Link to="/chung-ket" className="btn btn-primary">🎉 Xem Lịch Chung Kết →</Link>
      </div>
    </div>
  );
};

export default Results;
