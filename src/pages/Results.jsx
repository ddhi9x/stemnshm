import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useI18n } from '../i18n/I18nContext';

const Results = () => {
  const { t } = useI18n();
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
        <div className="stem-section-badge" style={{background: '#fef9c3', color: '#ca8a04'}}>{t('results_page.badge')}</div>
        <h1 className="section-title text-green-gradient">{t('results_page.title')}</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">{t('results_page.desc')}</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div style={{fontSize: '3rem'}}>⏳</div>
          <p className="text-muted mt-4">{t('results_page.loading')}</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📋</div>
          <h3 className="text-muted text-xl mb-2">{t('results_page.empty')}</h3>
          <p className="text-muted mb-6">{t('results_page.empty_desc')}</p>
          <Link to="/" className="btn btn-primary">{t('results_page.back_home')}</Link>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-8 justify-center flex-wrap animate-fade-in">
            {[['all', t('results_page.all')], ['Science', '🔬 Science'], ['Technology', '💻 Technology'], ['Engineering', '⚙️ Engineering'], ['Mathematics', '📐 Mathematics']].map(([val, label]) => (
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
            <p className="text-muted" style={{fontSize: '0.85rem'}}>{t('results_page.total')} <span style={{fontWeight: 700, color: 'var(--primary-green)'}}>{teams.length}</span> {t('results_page.teams_qualified')}</p>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="text-center mt-8">
        <Link to="/" className="btn btn-outline" style={{marginRight: '1rem'}}>{t('results_page.back_home')}</Link>
        <Link to="/chung-ket" className="btn btn-primary">{t('results_page.view_finals')}</Link>
      </div>
    </div>
  );
};

export default Results;
