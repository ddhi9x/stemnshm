import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AvatarCropper from './AvatarCropper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Admin.css';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [aboutData, setAboutData] = useState({ message: '', focus: '', target: '', format: '' });
  const [awards, setAwards] = useState([]);
  const [linksData, setLinksData] = useState({ register: '', submit: '', template_hoso: '', template_ppt: '', template_guide: '', label_register: 'Đăng Ký Tham Gia', label_submit: 'Nộp Bài / Sản Phẩm', label_hoso: 'Tải Mẫu Hồ Sơ', label_ppt: 'Mẫu Trình Bày PPT', label_guide: 'HD Trình Chiếu' });
  const [settingsData, setSettingsData] = useState({ tagline: '', email: '', hotline: '' });
  const [timeline, setTimeline] = useState([]);
  const [finalSchedule, setFinalSchedule] = useState([]);
  const [newScheduleItem, setNewScheduleItem] = useState({ time: '', title: '', desc: '' });
  const [faqItems, setFaqItems] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [criteria, setCriteria] = useState([]);
  const [scoring, setScoring] = useState([]);
  const [newCriteria, setNewCriteria] = useState({ title: '', description: '', icon: '🔬' });
  const [newScoring, setNewScoring] = useState({ title: '', points: '', percent: '' });

  const [newArticle, setNewArticle] = useState({ title: '', summary: '', content: '', date: '', image: '' });
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [newMentor, setNewMentor] = useState({ name: '', field: '', bio: '', image: '', slogan: '' });
  const [editingMentorId, setEditingMentorId] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [newAward, setNewAward] = useState({ title: '', qty: '', value: '', color: '#22c55e', bg: '#ecfdf5' });

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);

    if (isAuthenticated) {
      const fetchAdminData = async () => {
        const { data: newsData } = await supabase.from('news').select('*').order('date', { ascending: false });
        if (newsData) setNews(newsData);

        const { data: mentorsData } = await supabase.from('mentors').select('*');
        if (mentorsData) setMentors(mentorsData);

        const { data: awData } = await supabase.from('awards').select('*');
        if (awData) setAwards(awData);

        const { data: linkDb } = await supabase.from('links').select('*').single();
        if (linkDb) setLinksData(linkDb);

        const { data: stData } = await supabase.from('settings').select('*').single();
        if (stData) setSettingsData(stData);

        const { data: tlData } = await supabase.from('timeline').select('*').order('id', {ascending: true});
        if (tlData) setTimeline(tlData);

        const { data: abData } = await supabase.from('about').select('*').single();
        if (abData) setAboutData(abData);

        const { data: fsData } = await supabase.from('final_schedule').select('*').order('id', { ascending: true });
        if (fsData) setFinalSchedule(fsData);

        const { data: faqData } = await supabase.from('faq').select('*').order('sort_order', { ascending: true });
        if (faqData) setFaqItems(faqData);

        const { data: crData } = await supabase.from('criteria').select('*').order('sort_order', { ascending: true });
        if (crData) setCriteria(crData);

        const { data: scData } = await supabase.from('scoring').select('*').order('sort_order', { ascending: true });
        if (scData) setScoring(scData);
      }
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'nshmadmin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      alert('Sai mật khẩu!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  // --- Handlers for Data ---
  const handleSaveNews = async () => {
    if(!newArticle.title) return;
    if (editingNewsId) {
      // Update existing
      const { error } = await supabase.from('news').update({
        title: newArticle.title, summary: newArticle.summary,
        content: newArticle.content, date: newArticle.date, image: newArticle.image
      }).eq('id', editingNewsId);
      if (error) { alert('Lỗi khi cập nhật!'); }
      else {
        setNews(news.map(n => n.id === editingNewsId ? {...n, ...newArticle} : n));
        setNewArticle({ title: '', summary: '', content: '', date: '', image: '' });
        setEditingNewsId(null);
        alert('Đã cập nhật bài viết!');
      }
    } else {
      // Insert new
      const { data, error } = await supabase.from('news').insert(newArticle).select();
      if (error) {
        console.error('Error adding news:', error);
        alert('Lỗi khi thêm tin tức!');
      } else if (data && data.length > 0) {
        setNews([data[0], ...news]);
        setNewArticle({ title: '', summary: '', content: '', date: '', image: '' });
        alert('Đã thêm tin tức!');
      }
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tin này?")) {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) {
        console.error('Error deleting news:', error);
        alert('Lỗi khi xóa tin tức!');
      } else {
        const updated = news.filter(n => n.id !== id);
        setNews(updated);
      }
    }
  };

  const handleSaveMentor = async () => {
    if(!newMentor.name) return;
    if (editingMentorId) {
      const { data, error } = await supabase.from('mentors').update(newMentor).eq('id', editingMentorId).select();
      if (error) {
        console.error('Error updating mentor:', error);
        alert('Lỗi khi cập nhật Mentor!');
      } else if (data && data.length > 0) {
        setMentors(mentors.map(m => m.id === editingMentorId ? data[0] : m));
        setNewMentor({ name: '', field: '', bio: '', image: '', slogan: '' });
        setEditingMentorId(null);
        alert('Đã sửa thông tin Mentor!');
      }
    } else {
      const { data, error } = await supabase.from('mentors').insert(newMentor).select();
      if (error) {
        console.error('Error adding mentor:', error);
        alert('Lỗi khi thêm Mentor!');
      } else if (data && data.length > 0) {
        setMentors([...mentors, data[0]]);
        setNewMentor({ name: '', field: '', bio: '', image: '', slogan: '' });
        alert('Đã thêm Mentor!');
      }
    }
  };

  const handleDeleteMentor = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa mentor này?")) {
      const { error } = await supabase.from('mentors').delete().eq('id', id);
      if (error) {
        console.error('Error deleting mentor:', error);
        alert('Lỗi khi xóa mentor!');
      } else {
        const updated = mentors.filter(m => m.id !== id);
        setMentors(updated);
      }
    }
  };

  const handleSaveAbout = async () => {
    await supabase.from('about').update(aboutData).eq('id', 1);
    alert('Đã lưu Cập Nhập Chung!');
  };

  const handleLinksChange = (field, val) => {
    setLinksData({ ...linksData, [field]: val });
  };

  const handleSaveLinks = async () => {
    await supabase.from('links').update({
      register: linksData.register, submit: linksData.submit,
      template_hoso: linksData.template_hoso, template_ppt: linksData.template_ppt,
      template_guide: linksData.template_guide,
      label_register: linksData.label_register, label_submit: linksData.label_submit,
      label_hoso: linksData.label_hoso, label_ppt: linksData.label_ppt, label_guide: linksData.label_guide
    }).eq('id', 1);
    alert('Đã cập nhật Link Ngày Hội!');
  };

  const handleSaveSettings = async () => {
    await supabase.from('settings').update({
      tagline: settingsData.tagline, email: settingsData.email, hotline: settingsData.hotline,
      event_date: settingsData.event_date || '',
      stat1_num: settingsData.stat1_num, stat1_label: settingsData.stat1_label,
      stat2_num: settingsData.stat2_num, stat2_label: settingsData.stat2_label,
      stat3_num: settingsData.stat3_num, stat3_label: settingsData.stat3_label,
      stat4_num: settingsData.stat4_num, stat4_label: settingsData.stat4_label,
    }).eq('id', 1);
    alert('Đã cập nhật Cài Đặt!');
  };

  const handleAwardChange = (id, field, val) => {
    const updated = awards.map(a => a.id === id ? { ...a, [field]: val } : a);
    setAwards(updated);
  };

  const handleSaveAwards = async () => {
    for (const a of awards) {
      await supabase.from('awards').update({ title: a.title, qty: a.qty, value: a.value, color: a.color, bg: a.bg }).eq('id', a.id);
    }
    alert('Đã cập nhật Cơ Cấu Giải Thưởng!');
  };

  const handleAddAward = async () => {
    if (!newAward.title) return;
    const { data, error } = await supabase.from('awards').insert(newAward).select();
    if (error) { alert('Lỗi khi thêm giải!'); return; }
    if (data && data.length > 0) {
      setAwards([...awards, data[0]]);
      setNewAward({ title: '', qty: '', value: '', color: '#22c55e', bg: '#ecfdf5' });
      alert('Đã thêm giải thưởng mới!');
    }
  };

  const handleDeleteAward = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa giải thưởng này?')) {
      const { error } = await supabase.from('awards').delete().eq('id', id);
      if (!error) setAwards(awards.filter(a => a.id !== id));
    }
  };

  const handleTimelineChange = (id, field, val) => {
    const updated = timeline.map(t => t.id === id ? { ...t, [field]: val } : t);
    setTimeline(updated);
  };

  const handleSaveTimeline = async () => {
    for (const t of timeline) {
      await supabase.from('timeline').update({ date: t.date, title: t.title, desc: t.desc }).eq('id', t.id);
    }
    alert('Đã cập nhật Lịch Trình Ngày Hội!');
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-20 flex justify-center items-center" style={{minHeight: '60vh'}}>
        <form onSubmit={handleLogin} className="card text-center block-shadow glass border-t-4 border-nshm" style={{width: '100%', maxWidth: '400px'}}>
          <h2 className="text-nshm mb-6">Đăng Nhập Quản Trị</h2>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Mật khẩu..." 
            className="admin-input mb-4" 
            autoFocus 
          />
          <button type="submit" className="btn btn-nshm w-full" style={{width: '100%'}}>Đăng Nhập</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar" style={{display: 'flex', flexDirection: 'column'}}>
        <h2 className="admin-title">Admin CMS</h2>
        <ul className="admin-menu" style={{flex: 1}}>
          <li className={activeTab === 'news' ? 'active' : ''} onClick={() => setActiveTab('news')}>Quản lý Tin Tức</li>
          <li className={activeTab === 'mentors' ? 'active' : ''} onClick={() => setActiveTab('mentors')}>Quản lý Mentors</li>
          <li className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>Trang Giới Thiệu</li>
          <li className={activeTab === 'awards' ? 'active' : ''} onClick={() => setActiveTab('awards')}>Cơ Cấu Giải Thưởng</li>
          <li className={activeTab === 'timeline' ? 'active' : ''} onClick={() => setActiveTab('timeline')}>Lịch Trình</li>
          <li className={activeTab === 'final' ? 'active' : ''} onClick={() => setActiveTab('final')}>Chung Kết</li>
          <li className={activeTab === 'faq' ? 'active' : ''} onClick={() => setActiveTab('faq')}>FAQ</li>
          <li className={activeTab === 'criteria' ? 'active' : ''} onClick={() => setActiveTab('criteria')}>Tiêu Chuẩn & Điểm</li>
        </ul>
        <button className="btn btn-outline" onClick={handleLogout} style={{marginTop: 'auto', borderColor: '#ef4444', color: '#ef4444'}}>Thoát</button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'news' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Quản lý Tin Tức</h2>
            <div className="admin-card card glass border-l-4 border-secondary">
              <h3 className="mb-4 text-green-gradient">{editingNewsId ? '✏️ Sửa bài viết' : 'Thêm bài viết mới'}</h3>
              <input type="text" placeholder="Tiêu đề" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="admin-input" />
              <input type="date" value={newArticle.date} onChange={e => setNewArticle({...newArticle, date: e.target.value})} className="admin-input" />
              <input type="text" placeholder="Link ảnh đại diện (URL hình ảnh, có thể để trống)" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} className="admin-input" />
              <textarea placeholder="Tóm tắt ngắn (hiện ở trang chủ và danh sách tin)..." value={newArticle.summary} onChange={e => setNewArticle({...newArticle, summary: e.target.value})} className="admin-input" rows="2"></textarea>
              <label className="block text-sm font-bold text-muted mb-2">📝 Nội dung bài viết (Rich Text - chèn ảnh, bảng, heading...)</label>
              <div style={{background: 'white', borderRadius: '12px', marginBottom: '1rem'}}>
                <ReactQuill
                  theme="snow"
                  value={newArticle.content || ''}
                  onChange={val => setNewArticle({...newArticle, content: val})}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link', 'image'],
                      ['blockquote', 'code-block'],
                      ['clean']
                    ]
                  }}
                  style={{minHeight: '200px'}}
                />
              </div>
              <div className="flex gap-3">
                <button className="btn btn-primary flex-1" onClick={handleSaveNews}>{editingNewsId ? 'Cập Nhật' : 'Đăng Tin'}</button>
                {editingNewsId && <button className="btn btn-outline" style={{borderColor: '#94a3b8', color: '#64748b'}} onClick={() => { setEditingNewsId(null); setNewArticle({ title: '', summary: '', content: '', date: '', image: '' }); }}>Hủy Sửa</button>}
              </div>
            </div>

            <div className="admin-list mt-8">
              <h3 className="mb-4 text-muted">📰 Danh sách bài viết ({news.length})</h3>
              {news.map(n => (
                <div key={n.id} className="card mb-4 p-4" style={{borderLeft: editingNewsId === n.id ? '4px solid var(--secondary-blue)' : '4px solid #e2e8f0'}}>
                  <div className="flex justify-between items-start gap-4">
                    <div style={{flex: 1}}>
                      <h4 className="m-0 text-nshm">{n.title}</h4>
                      <p className="text-muted m-0 text-sm mt-1">{n.date}</p>
                      {n.summary && <p className="text-muted m-0 text-sm mt-1" style={{opacity: 0.7}}>{n.summary?.substring(0, 100)}...</p>}
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{padding: '0.4rem 1rem', borderColor: 'var(--secondary-blue)', color: 'var(--secondary-blue)'}} onClick={() => {
                        setEditingNewsId(n.id);
                        setNewArticle({ title: n.title, summary: n.summary || '', content: n.content || '', date: n.date || '', image: n.image || '' });
                        window.scrollTo({top: 0, behavior: 'smooth'});
                      }}>✏ Sửa</button>
                      <button className="btn btn-outline" style={{padding: '0.4rem 1rem', borderColor: '#ef4444', color: '#ef4444'}} onClick={() => handleDeleteNews(n.id)}>Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Quản lý Mentor</h2>
            <div className="admin-card card glass border-l-4 border-primary">
              <h3 className="mb-4 text-green-gradient">{editingMentorId ? 'Chỉnh Sửa Thông Tin Mentor' : 'Thêm Mentor mới'}</h3>
              <input type="text" placeholder="Tên Mentor (VD: Thầy Hùng)" value={newMentor.name} onChange={e => setNewMentor({...newMentor, name: e.target.value})} className="admin-input" />
              <div className="mb-4">
                <label className="block text-sm font-bold text-muted mb-2">Ảnh Đại Diện</label>
                {/* Paste zone */}
                <div 
                  tabIndex={0}
                  onPaste={(e) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;
                    for (const item of items) {
                      if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        setRawImage(URL.createObjectURL(file));
                        break;
                      }
                    }
                  }}
                  style={{
                    border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '1.5rem',
                    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    background: newMentor.image ? '#f0fdf4' : '#f8fafc',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                >
                  {newMentor.image ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={newMentor.image} alt="Preview" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} />
                      <span className="text-sm text-green-600 font-bold">✓ Ảnh đã sẵn sàng (Ctrl+V để đổi ảnh)</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📋</div>
                      <p className="text-muted m-0 font-bold">Bấm vào đây rồi <span className="text-primary">Ctrl + V</span> để dán ảnh</p>
                      <p className="text-muted m-0 text-xs mt-1">Ảnh tự động resize nhẹ đẹp • Hoặc chọn file bên dưới</p>
                    </div>
                  )}
                </div>
                {/* Fallback file input */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setRawImage(URL.createObjectURL(file));
                    }
                  }} 
                  className="admin-input mt-2" 
                  style={{padding: '0.5rem', fontSize: '0.8rem'}} 
                />
              </div>
              <select value={newMentor.field} onChange={e => setNewMentor({...newMentor, field: e.target.value})} className="admin-input">
                <option value="">-- Chọn lĩnh vực --</option>
                <option value="Science">Science (Khoa học)</option>
                <option value="Technology">Technology (Công nghệ)</option>
                <option value="Engineering">Engineering (Kỹ thuật)</option>
                <option value="Mathematics">Mathematics (Toán học)</option>
              </select>
              <input type="text" placeholder="Slogan / Châm ngôn (có thể để trống)" value={newMentor.slogan || ''} onChange={e => setNewMentor({...newMentor, slogan: e.target.value})} className="admin-input" style={{fontStyle: 'italic'}} />
              <textarea placeholder="Tiểu sử / Mô tả chuyên môn..." value={newMentor.bio} onChange={e => setNewMentor({...newMentor, bio: e.target.value})} className="admin-input" rows="3"></textarea>
              <div className="flex gap-3">
                <button className="btn btn-primary" onClick={handleSaveMentor}>{editingMentorId ? 'Lưu Cập Nhật Mentor' : 'Thêm Mentor'}</button>
                {editingMentorId && (
                  <button className="btn btn-outline" style={{borderColor: '#9ca3af', color: '#6b7280'}} onClick={() => {
                    setEditingMentorId(null);
                    setNewMentor({ name: '', field: '', bio: '', image: '', slogan: '' });
                  }}>Hủy Sửa</button>
                )}
              </div>
            </div>

            <div className="admin-list p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="m-0 text-green-gradient">Danh sách Mentor ({mentors.length})</h3>
                <button className="btn btn-primary" style={{padding: '0.5rem 1.2rem', fontSize: '0.85rem'}} onClick={async () => {
                  for (let i = 0; i < mentors.length; i++) {
                    await supabase.from('mentors').update({ sort_order: i + 1 }).eq('id', mentors[i].id);
                  }
                  alert('Đã lưu thứ tự Mentor!');
                }}>💾 Lưu Thứ Tự</button>
              </div>
              {[
                { field: 'Science', label: '🔬 Science (Khoa học)', color: '#22c55e', bg: '#f0fdf4' },
                { field: 'Technology', label: '💻 Technology (Công nghệ)', color: '#3b82f6', bg: '#eff6ff' },
                { field: 'Engineering', label: '⚙️ Engineering (Kỹ thuật)', color: '#f97316', bg: '#fff7ed' },
                { field: 'Mathematics', label: '📐 Mathematics (Toán học)', color: '#9333ea', bg: '#faf5ff' },
              ].map(group => {
                const groupMentors = mentors.filter(m => m.field === group.field).sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
                if (groupMentors.length === 0) return null;
                return (
                  <div key={group.field} style={{marginBottom: '1.5rem'}}>
                    <div style={{padding: '0.5rem 1rem', background: group.bg, borderRadius: '10px', marginBottom: '0.75rem', borderLeft: `4px solid ${group.color}`}}>
                      <h4 style={{margin: 0, color: group.color, fontSize: '0.95rem'}}>{group.label} ({groupMentors.length})</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {groupMentors.map((m, idx) => (
                        <div key={m.id} style={{position: 'relative', background: 'white', borderRadius: '16px', padding: '1.5rem 0.8rem 0.8rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0'}}>
                          <div style={{position: 'absolute', top: '0.4rem', left: '0.4rem', background: group.color, color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900}}>{idx + 1}</div>
                          <div style={{position: 'absolute', top: '0.4rem', right: '0.4rem', display: 'flex', gap: '2px'}}>
                            <button disabled={idx === 0} style={{background: idx === 0 ? '#e2e8f0' : group.color, color: 'white', border: 'none', borderRadius: '5px', width: '22px', height: '22px', cursor: idx === 0 ? 'default' : 'pointer', fontSize: '0.6rem'}} onClick={() => {
                              const all = [...mentors]; const gIdxs = all.map((mm, i) => mm.field === group.field ? i : -1).filter(i => i >= 0);
                              [all[gIdxs[idx]], all[gIdxs[idx - 1]]] = [all[gIdxs[idx - 1]], all[gIdxs[idx]]];
                              all.forEach((item, i) => item.sort_order = i + 1); setMentors([...all]);
                            }}>◀</button>
                            <button disabled={idx === groupMentors.length - 1} style={{background: idx === groupMentors.length - 1 ? '#e2e8f0' : group.color, color: 'white', border: 'none', borderRadius: '5px', width: '22px', height: '22px', cursor: idx === groupMentors.length - 1 ? 'default' : 'pointer', fontSize: '0.6rem'}} onClick={() => {
                              const all = [...mentors]; const gIdxs = all.map((mm, i) => mm.field === group.field ? i : -1).filter(i => i >= 0);
                              [all[gIdxs[idx]], all[gIdxs[idx + 1]]] = [all[gIdxs[idx + 1]], all[gIdxs[idx]]];
                              all.forEach((item, i) => item.sort_order = i + 1); setMentors([...all]);
                            }}>▶</button>
                          </div>
                          {m.image ? (
                            <img src={m.image} alt={m.name} style={{width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', margin: '0.3rem auto 0.5rem'}} />
                          ) : (
                            <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff, #dbeafe)', margin: '0.3rem auto 0.5rem'}}></div>
                          )}
                          <h4 style={{margin: '0 0 0.2rem', color: '#c8102e', fontSize: '0.8rem', fontWeight: 800}}>{m.name}</h4>
                          {m.slogan && <p style={{color: '#94a3b8', fontSize: '0.65rem', fontStyle: 'italic', margin: '0 0 0.4rem'}}>"{m.slogan}"</p>}
                          <div style={{display: 'flex', gap: '3px', marginTop: '0.4rem'}}>
                            <button style={{flex: 1, padding: '0.25rem', fontSize: '0.7rem', borderRadius: '6px', border: `1px solid ${group.color}`, background: 'white', color: group.color, cursor: 'pointer', fontWeight: 600}} onClick={() => {
                              setEditingMentorId(m.id);
                              setNewMentor({ name: m.name, field: m.field, bio: m.bio, image: m.image || '', slogan: m.slogan || '' });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}>✏️ Sửa</button>
                            <button style={{flex: 1, padding: '0.25rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #f87171', background: 'white', color: '#ef4444', cursor: 'pointer', fontWeight: 600}} onClick={() => handleDeleteMentor(m.id)}>🗑 Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Sửa Trang Giới Thiệu & Các Link Form</h2>
            <div className="admin-card card glass border-l-4 border-nshm mb-6">
              <h3 className="mb-4 text-primary">Nội dung Giới thiệu</h3>
              <div className="mb-5">
                <label className="block text-sm font-bold text-nshm mb-2">Chủ đề năm học</label>
                <input type="text" value={aboutData.message} onChange={e => setAboutData({...aboutData, message: e.target.value})} className="admin-input" />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-nshm mb-2">Trọng tâm</label>
                <textarea value={aboutData.focus} onChange={e => setAboutData({...aboutData, focus: e.target.value})} className="admin-input" rows="3"></textarea>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-nshm mb-2">Đối tượng</label>
                <input type="text" value={aboutData.target} onChange={e => setAboutData({...aboutData, target: e.target.value})} className="admin-input" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-nshm mb-2">Hình thức thi</label>
                <input type="text" value={aboutData.format} onChange={e => setAboutData({...aboutData, format: e.target.value})} className="admin-input" />
              </div>
              <button className="btn btn-primary btn-lg w-full" onClick={handleSaveAbout}>Lưu Thay Đổi Trang Giới Thiệu</button>
            </div>
            
            <div className="admin-card card glass border-l-4 border-secondary mb-6">
              <h3 className="mb-4 text-secondary">Cập nhật Link & Tên Nút</h3>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">Link Form Đăng Ký Tham Gia</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="https://..." value={linksData.register} onChange={e => setLinksData({...linksData, register: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                  <input type="text" placeholder="Tên nút" value={linksData.label_register || ''} onChange={e => setLinksData({...linksData, label_register: e.target.value})} className="admin-input" style={{maxWidth: '180px', marginBottom: 0, fontWeight: 700, color: '#dc2626'}} />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">Link Nộp Sản Phẩm / Nộp Bài</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="https://..." value={linksData.submit} onChange={e => setLinksData({...linksData, submit: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                  <input type="text" placeholder="Tên nút" value={linksData.label_submit || ''} onChange={e => setLinksData({...linksData, label_submit: e.target.value})} className="admin-input" style={{maxWidth: '180px', marginBottom: 0, fontWeight: 700, color: '#059669'}} />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">📄 Mẫu Hồ Sơ (file .docx)</label>
                <div className="flex gap-2 items-center mb-2">
                  <input type="text" placeholder="URL file hoặc upload bên dưới" value={linksData.template_hoso || ''} onChange={e => setLinksData({...linksData, template_hoso: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                  <input type="text" placeholder="Tên nút" value={linksData.label_hoso || ''} onChange={e => setLinksData({...linksData, label_hoso: e.target.value})} className="admin-input" style={{maxWidth: '160px', marginBottom: 0, fontWeight: 700, color: '#2563eb'}} />
                </div>
                <div className="flex gap-2 items-center">
                  <label className="btn btn-outline" style={{padding: '0.4rem 1rem', borderColor: '#059669', color: '#059669', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>
                    📎 Upload File Mới
                    <input type="file" accept=".docx,.doc,.pdf,.xlsx" style={{display: 'none'}} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const fileName = `hoso_${Date.now()}_${file.name}`;
                      const { data, error } = await supabase.storage.from('templates').upload(fileName, file, { upsert: true });
                      if (error) { alert('Lỗi upload: ' + error.message + '\n\nHãy tạo bucket "templates" trong Supabase Storage (public).'); return; }
                      const { data: urlData } = supabase.storage.from('templates').getPublicUrl(fileName);
                      setLinksData({...linksData, template_hoso: urlData.publicUrl});
                      alert('✅ Đã upload: ' + file.name);
                    }} />
                  </label>
                  {linksData.template_hoso && <span className="text-xs text-muted" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>📄 {linksData.template_hoso.split('/').pop()}</span>}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-muted mb-2">📊 Mẫu Trình Bày PPT (file .pptx)</label>
                <div className="flex gap-2 items-center mb-2">
                  <input type="text" placeholder="URL file hoặc upload bên dưới" value={linksData.template_ppt || ''} onChange={e => setLinksData({...linksData, template_ppt: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                  <input type="text" placeholder="Tên nút" value={linksData.label_ppt || ''} onChange={e => setLinksData({...linksData, label_ppt: e.target.value})} className="admin-input" style={{maxWidth: '160px', marginBottom: 0, fontWeight: 700, color: '#d97706'}} />
                </div>
                <div className="flex gap-2 items-center">
                  <label className="btn btn-outline" style={{padding: '0.4rem 1rem', borderColor: '#2563eb', color: '#2563eb', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>
                    📎 Upload File Mới
                    <input type="file" accept=".pptx,.ppt,.pdf" style={{display: 'none'}} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const fileName = `ppt_${Date.now()}_${file.name}`;
                      const { data, error } = await supabase.storage.from('templates').upload(fileName, file, { upsert: true });
                      if (error) { alert('Lỗi upload: ' + error.message + '\n\nHãy tạo bucket "templates" trong Supabase Storage (public).'); return; }
                      const { data: urlData } = supabase.storage.from('templates').getPublicUrl(fileName);
                      setLinksData({...linksData, template_ppt: urlData.publicUrl});
                      alert('✅ Đã upload: ' + file.name);
                    }} />
                  </label>
                  {linksData.template_ppt && <span className="text-xs text-muted" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>📊 {linksData.template_ppt.split('/').pop()}</span>}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-muted mb-2">📋 Hướng Dẫn Thiết Kế Trình Chiếu</label>
                <div className="flex gap-2 items-center mb-2">
                  <input type="text" placeholder="URL file hoặc upload bên dưới" value={linksData.template_guide || ''} onChange={e => setLinksData({...linksData, template_guide: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                  <input type="text" placeholder="Tên nút" value={linksData.label_guide || ''} onChange={e => setLinksData({...linksData, label_guide: e.target.value})} className="admin-input" style={{maxWidth: '160px', marginBottom: 0, fontWeight: 700, color: '#8b5cf6'}} />
                </div>
                <div className="flex gap-2 items-center">
                  <label className="btn btn-outline" style={{padding: '0.4rem 1rem', borderColor: '#8b5cf6', color: '#8b5cf6', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>
                    📎 Upload File Mới
                    <input type="file" accept=".pdf,.docx,.doc,.pptx,.ppt" style={{display: 'none'}} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const fileName = `guide_${Date.now()}_${file.name}`;
                      const { data, error } = await supabase.storage.from('templates').upload(fileName, file, { upsert: true });
                      if (error) { alert('Lỗi upload: ' + error.message); return; }
                      const { data: urlData } = supabase.storage.from('templates').getPublicUrl(fileName);
                      setLinksData({...linksData, template_guide: urlData.publicUrl});
                      alert('✅ Đã upload: ' + file.name);
                    }} />
                  </label>
                  {linksData.template_guide && <span className="text-xs text-muted" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>📋 {linksData.template_guide.split('/').pop()}</span>}
                </div>
              </div>
              <button className="btn btn-nshm w-full" onClick={handleSaveLinks}>Lưu Cập Nhật Link Đồng Bộ</button>
            </div>

            <div className="admin-card card glass border-l-4 mb-6" style={{borderColor: '#8b5cf6'}}>
              <h3 className="mb-4" style={{color: '#8b5cf6', fontWeight: 800}}>Đổi Số Thống Kê (Trang Chủ)</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-muted mb-1">Số liệu {i}</label>
                    <input type="text" className="admin-input mb-2" placeholder="VD: 200+" value={settingsData[`stat${i}_num`] || ''} onChange={e => setSettingsData({...settingsData, [`stat${i}_num`]: e.target.value})} style={{fontWeight: 900, fontSize: '1.1rem', color: '#22c55e'}} />
                    <label className="block text-xs font-bold text-muted mb-1">Nhãn</label>
                    <input type="text" className="admin-input" placeholder="VD: Học sinh tham gia" value={settingsData[`stat${i}_label`] || ''} onChange={e => setSettingsData({...settingsData, [`stat${i}_label`]: e.target.value})} />
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card card glass border-l-4 border-primary">
              <h3 className="mb-4 text-primary">Cài Đặt Footer & Sự Kiện</h3>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">📅 Ngày sự kiện (Countdown trang chủ)</label>
                <input type="date" value={settingsData.event_date || ''} onChange={e => setSettingsData({...settingsData, event_date: e.target.value})} className="admin-input" />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">Slogan / Thông điệp Ngày Hội</label>
                <input type="text" value={settingsData.tagline} onChange={e => setSettingsData({...settingsData, tagline: e.target.value})} className="admin-input" />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">Email hỗ trợ</label>
                <input type="text" value={settingsData.email} onChange={e => setSettingsData({...settingsData, email: e.target.value})} className="admin-input" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-muted mb-2">Hotline hỗ trợ</label>
                <input type="text" value={settingsData.hotline} onChange={e => setSettingsData({...settingsData, hotline: e.target.value})} className="admin-input" />
              </div>
              <button className="btn btn-primary w-full" onClick={handleSaveSettings}>Lưu Cập Nhật Footer & Sự Kiện</button>
            </div>
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Quản Lý Cơ Cấu Giải Thưởng</h2>

            {/* Form thêm giải mới */}
            <div className="admin-card card glass border-l-4 border-primary mb-6">
              <h3 className="mb-4 text-green-gradient">Thêm Loại Giải Mới</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Tên giải</label>
                  <input type="text" placeholder="VD: GIẢI ĐẶC BIỆT" className="admin-input" value={newAward.title} onChange={e => setNewAward({...newAward, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Số lượng</label>
                  <input type="text" placeholder="VD: 1 Giải" className="admin-input" value={newAward.qty} onChange={e => setNewAward({...newAward, qty: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Giá trị giải thưởng</label>
                  <input type="text" placeholder="VD: Huy chương + Giấy khen" className="admin-input" value={newAward.value} onChange={e => setNewAward({...newAward, value: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Màu sắc</label>
                  <div className="flex gap-2">
                    <input type="color" value={newAward.color} onChange={e => setNewAward({...newAward, color: e.target.value})} style={{width: '40px', height: '38px', border: 'none', cursor: 'pointer'}} />
                    <input type="color" value={newAward.bg} onChange={e => setNewAward({...newAward, bg: e.target.value})} style={{width: '40px', height: '38px', border: 'none', cursor: 'pointer'}} title="Màu nền" />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleAddAward}>+ Thêm Giải Thưởng</button>
            </div>

            {/* Danh sách giải hiện có */}
            <div className="admin-card card glass border-l-4" style={{borderColor: '#fbbf24'}}>
              <h3 className="mb-4 text-green-gradient">Danh Sách Giải Hiện Có</h3>
              <div className="flex flex-col gap-6">
                {awards && awards.map(aw => (
                  <div key={aw.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <input type="text" className="admin-input" style={{fontWeight: 900, color: aw.color, fontSize: '1.1rem', maxWidth: '300px'}} value={aw.title} onChange={(e) => handleAwardChange(aw.id, 'title', e.target.value)} />
                      <button className="btn btn-outline" style={{padding: '0.3rem 0.8rem', borderColor: '#ef4444', color: '#ef4444', fontSize: '0.8rem'}} onClick={() => handleDeleteAward(aw.id)}>Xóa</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Số lượng giải</label>
                        <input type="text" className="admin-input" value={aw.qty} onChange={(e) => handleAwardChange(aw.id, 'qty', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Giá trị giải thưởng</label>
                        <input type="text" className="admin-input" value={aw.value} onChange={(e) => handleAwardChange(aw.id, 'value', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Màu chữ / Nền</label>
                        <div className="flex gap-2">
                          <input type="color" value={aw.color || '#22c55e'} onChange={(e) => handleAwardChange(aw.id, 'color', e.target.value)} style={{width: '40px', height: '38px', border: 'none', cursor: 'pointer'}} title="Màu chữ" />
                          <input type="color" value={aw.bg || '#ecfdf5'} onChange={(e) => handleAwardChange(aw.id, 'bg', e.target.value)} style={{width: '40px', height: '38px', border: 'none', cursor: 'pointer'}} title="Màu nền" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-6 w-full" onClick={handleSaveAwards}>Lưu Cập Nhật Tất Cả Giải Thưởng</button>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Chỉnh Sửa Hành Trình Ngày Hội</h2>

            {/* Form thêm mốc mới */}
            <div className="admin-card card glass border-l-4 border-primary mb-6">
              <h3 className="mb-4 text-green-gradient">Thêm Mốc Hành Trình Mới</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Thời gian / Ngày</label>
                  <input type="text" placeholder="VD: 01/04/2026" className="admin-input" id="new-tl-date" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Tiêu đề Mốc</label>
                  <input type="text" placeholder="VD: Hạn nộp hồ sơ" className="admin-input" id="new-tl-title" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-muted mb-1">Thông tin / Sự kiện chính</label>
                <textarea className="admin-input" rows="2" placeholder="Mô tả..." id="new-tl-desc"></textarea>
              </div>
              <button className="btn btn-primary" onClick={async () => {
                const date = document.getElementById('new-tl-date').value;
                const title = document.getElementById('new-tl-title').value;
                const desc = document.getElementById('new-tl-desc').value;
                if (!date || !title) return;
                const { data, error } = await supabase.from('timeline').insert({ date, title, desc }).select();
                if (error) { alert('Lỗi: ' + error.message); return; }
                if (data?.[0]) {
                  setTimeline([...timeline, data[0]]);
                  document.getElementById('new-tl-date').value = '';
                  document.getElementById('new-tl-title').value = '';
                  document.getElementById('new-tl-desc').value = '';
                  alert('Đã thêm mốc hành trình!');
                }
              }}>+ Thêm Mốc</button>
            </div>

            <div className="admin-card card glass border-l-4 border-primary">
              <h3 className="mb-4 text-green-gradient">Danh Sách Mốc Hiện Có ({timeline.length})</h3>
              <div className="flex flex-col gap-6">
                {timeline && timeline.map(tt => (
                  <div key={tt.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="m-0 text-secondary">Mốc #{tt.id}</h4>
                      <button className="btn btn-outline" style={{padding: '0.3rem 0.8rem', borderColor: '#ef4444', color: '#ef4444', fontSize: '0.8rem'}} onClick={async () => {
                        if (window.confirm('Xóa mốc này?')) {
                          await supabase.from('timeline').delete().eq('id', tt.id);
                          setTimeline(timeline.filter(t => t.id !== tt.id));
                        }
                      }}>Xóa</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Thời gian</label>
                        <input type="text" className="admin-input" value={tt.date} onChange={(e) => handleTimelineChange(tt.id, 'date', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Tiêu đề Mốc</label>
                        <input type="text" className="admin-input" value={tt.title} onChange={(e) => handleTimelineChange(tt.id, 'title', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1">Thông tin / Sự kiện chính</label>
                      <textarea className="admin-input" rows="2" value={tt.desc} onChange={(e) => handleTimelineChange(tt.id, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-nshm mt-6 w-full" onClick={handleSaveTimeline}>Lưu Hành Trình Ngày Hội</button>
            </div>
          </div>
        )}

        {activeTab === 'final' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Quản Lý Lịch Trình Chung Kết</h2>

            {/* Form thêm mục mới */}
            <div className="admin-card card glass border-l-4 border-primary mb-6">
              <h3 className="mb-4 text-green-gradient">Thêm Mốc Lịch Trình Mới</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Khung giờ</label>
                  <input type="text" placeholder="VD: 8h30 - 9h00" className="admin-input" value={newScheduleItem.time} onChange={e => setNewScheduleItem({...newScheduleItem, time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Tiêu đề</label>
                  <input type="text" placeholder="VD: Khai mạc" className="admin-input" value={newScheduleItem.title} onChange={e => setNewScheduleItem({...newScheduleItem, title: e.target.value})} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-muted mb-1">Mô tả chi tiết</label>
                <textarea className="admin-input" rows="3" placeholder="Nội dung hoạt động..." value={newScheduleItem.desc} onChange={e => setNewScheduleItem({...newScheduleItem, desc: e.target.value})}></textarea>
              </div>
              <button className="btn btn-primary" onClick={async () => {
                if (!newScheduleItem.time || !newScheduleItem.title) return;
                const maxId = finalSchedule.length > 0 ? Math.max(...finalSchedule.map(s => s.id)) : 0;
                const { data, error } = await supabase.from('final_schedule').insert({ id: maxId + 1, ...newScheduleItem }).select();
                if (error) { alert('Lỗi: ' + error.message); return; }
                if (data && data.length > 0) {
                  setFinalSchedule([...finalSchedule, data[0]]);
                  setNewScheduleItem({ time: '', title: '', desc: '' });
                  alert('Đã thêm!');
                }
              }}>+ Thêm Mốc Lịch Trình</button>
            </div>

            {/* Danh sách hiện có */}
            <div className="admin-card card glass border-l-4" style={{borderColor: '#fbbf24'}}>
              <h3 className="mb-4 text-green-gradient">Lịch Trình Hiện Có</h3>
              <div className="flex flex-col gap-6">
                {finalSchedule.map(item => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-green-100 text-primary px-3 py-1 rounded-full text-sm font-bold">Mốc {item.id}</span>
                      <button className="btn btn-outline" style={{padding: '0.3rem 0.8rem', borderColor: '#ef4444', color: '#ef4444', fontSize: '0.8rem'}} onClick={async () => {
                        if (window.confirm('Xóa mốc này?')) {
                          await supabase.from('final_schedule').delete().eq('id', item.id);
                          setFinalSchedule(finalSchedule.filter(s => s.id !== item.id));
                        }
                      }}>Xóa</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Khung giờ</label>
                        <input type="text" className="admin-input" value={item.time} onChange={e => {
                          setFinalSchedule(finalSchedule.map(s => s.id === item.id ? { ...s, time: e.target.value } : s));
                        }} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Tiêu đề</label>
                        <input type="text" className="admin-input" value={item.title} onChange={e => {
                          setFinalSchedule(finalSchedule.map(s => s.id === item.id ? { ...s, title: e.target.value } : s));
                        }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1">Mô tả</label>
                      <textarea className="admin-input" rows="2" value={item.desc || ''} onChange={e => {
                        setFinalSchedule(finalSchedule.map(s => s.id === item.id ? { ...s, desc: e.target.value } : s));
                      }}></textarea>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-6 w-full" onClick={async () => {
                for (const s of finalSchedule) {
                  await supabase.from('final_schedule').update({ time: s.time, title: s.title, desc: s.desc }).eq('id', s.id);
                }
                alert('Đã cập nhật Lịch Trình Chung Kết!');
              }}>Lưu Cập Nhật Lịch Trình</button>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Quản Lý Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="admin-card card glass border-l-4 mb-6" style={{borderColor: '#9333ea'}}>
              <h3 className="mb-4" style={{color: '#9333ea'}}>Thêm Câu Hỏi Mới</h3>
              <input type="text" placeholder="Câu hỏi..." value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} className="admin-input" />
              <textarea placeholder="Câu trả lời..." value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} className="admin-input" rows="3"></textarea>
              <button className="btn btn-primary" onClick={async () => {
                if (!newFaq.question) return;
                const { data } = await supabase.from('faq').insert({ ...newFaq, sort_order: faqItems.length + 1 }).select();
                if (data && data[0]) { setFaqItems([...faqItems, data[0]]); setNewFaq({ question: '', answer: '' }); alert('Đã thêm câu hỏi!'); }
              }}>Thêm Câu Hỏi</button>
            </div>
            <div className="admin-card card glass border-l-4" style={{borderColor: '#9333ea'}}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="m-0" style={{color: '#9333ea'}}>Danh sách FAQ ({faqItems.length})</h3>
                <button className="btn btn-primary" style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}} onClick={async () => {
                  for (let i = 0; i < faqItems.length; i++) {
                    await supabase.from('faq').update({ question: faqItems[i].question, answer: faqItems[i].answer, sort_order: i + 1 }).eq('id', faqItems[i].id);
                  }
                  alert('Đã lưu tất cả FAQ!');
                }}>💾 Lưu Tất Cả</button>
              </div>
              <div className="flex flex-col gap-4">
                {faqItems.map((faq, idx) => (
                  <div key={faq.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200" style={{position: 'relative'}}>
                    <div style={{position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '4px', alignItems: 'center'}}>
                      <button disabled={idx === 0} style={{background: idx === 0 ? '#e2e8f0' : '#9333ea', color: 'white', border: 'none', borderRadius: '5px', width: '24px', height: '24px', cursor: idx === 0 ? 'default' : 'pointer', fontSize: '0.6rem'}} onClick={() => {
                        const arr = [...faqItems]; [arr[idx], arr[idx-1]] = [arr[idx-1], arr[idx]];
                        arr.forEach((item, i) => item.sort_order = i + 1); setFaqItems([...arr]);
                      }}>▲</button>
                      <button disabled={idx === faqItems.length - 1} style={{background: idx === faqItems.length - 1 ? '#e2e8f0' : '#9333ea', color: 'white', border: 'none', borderRadius: '5px', width: '24px', height: '24px', cursor: idx === faqItems.length - 1 ? 'default' : 'pointer', fontSize: '0.6rem'}} onClick={() => {
                        const arr = [...faqItems]; [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]];
                        arr.forEach((item, i) => item.sort_order = i + 1); setFaqItems([...arr]);
                      }}>▼</button>
                      <button style={{background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem'}} onClick={async () => {
                        if (window.confirm('Xóa câu hỏi này?')) {
                          await supabase.from('faq').delete().eq('id', faq.id);
                          setFaqItems(faqItems.filter(f => f.id !== faq.id));
                        }
                      }}>🗑</button>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                      <span style={{background: '#9333ea', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, flexShrink: 0}}>{idx + 1}</span>
                      <input type="text" className="admin-input" style={{fontWeight: 700, color: '#c8102e', marginBottom: 0}} value={faq.question} onChange={e => { const arr = [...faqItems]; arr[idx].question = e.target.value; setFaqItems(arr); }} />
                    </div>
                    <textarea className="admin-input" rows="2" style={{marginBottom: 0, fontSize: '0.9rem'}} value={faq.answer} onChange={e => { const arr = [...faqItems]; arr[idx].answer = e.target.value; setFaqItems(arr); }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'criteria' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Tiêu Chuẩn "Quality Seal" & Ma Trận Điểm</h2>

            {/* Quality Seal Criteria */}
            <div className="admin-card card glass border-l-4 mb-6" style={{borderColor: '#22c55e'}}>
              <h3 className="mb-4" style={{color: '#22c55e'}}>✅ Tiêu chuẩn Quality Seal</h3>
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Icon (🔬, 🛡️...)" value={newCriteria.icon} onChange={e => setNewCriteria({...newCriteria, icon: e.target.value})} className="admin-input" style={{width: '80px', marginBottom: 0}} />
                <input type="text" placeholder="Tiêu đề" value={newCriteria.title} onChange={e => setNewCriteria({...newCriteria, title: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                <button className="btn btn-primary" style={{whiteSpace: 'nowrap'}} onClick={async () => {
                  if (!newCriteria.title) return;
                  const { data } = await supabase.from('criteria').insert({...newCriteria, sort_order: criteria.length + 1}).select();
                  if (data?.[0]) { setCriteria([...criteria, data[0]]); setNewCriteria({title:'', description:'', icon:'🔬'}); }
                }}>+ Thêm</button>
              </div>
              <input type="text" placeholder="Mô tả tiêu chí..." value={newCriteria.description} onChange={e => setNewCriteria({...newCriteria, description: e.target.value})} className="admin-input" />
              <div className="flex flex-col gap-3 mt-2">
                {criteria.map((c, idx) => (
                  <div key={c.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-3 items-start" style={{position: 'relative'}}>
                    <input type="text" value={c.icon} onChange={e => { const arr = [...criteria]; arr[idx].icon = e.target.value; setCriteria(arr); }} className="admin-input" style={{width: '50px', marginBottom: 0, textAlign: 'center'}} />
                    <div style={{flex: 1}}>
                      <input type="text" value={c.title} onChange={e => { const arr = [...criteria]; arr[idx].title = e.target.value; setCriteria(arr); }} className="admin-input" style={{fontWeight: 700, marginBottom: 4}} />
                      <input type="text" value={c.description} onChange={e => { const arr = [...criteria]; arr[idx].description = e.target.value; setCriteria(arr); }} className="admin-input" style={{fontSize: '0.85rem', marginBottom: 0}} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                      <button disabled={idx === 0} style={{background: idx === 0 ? '#e2e8f0' : '#22c55e', color: 'white', border: 'none', borderRadius: '4px', width: '22px', height: '18px', fontSize: '0.5rem', cursor: idx === 0 ? 'default' : 'pointer'}} onClick={() => { const arr=[...criteria]; [arr[idx],arr[idx-1]]=[arr[idx-1],arr[idx]]; arr.forEach((x,i)=>x.sort_order=i+1); setCriteria(arr); }}>▲</button>
                      <button disabled={idx===criteria.length-1} style={{background: idx===criteria.length-1?'#e2e8f0':'#22c55e', color:'white', border:'none', borderRadius:'4px', width:'22px', height:'18px', fontSize:'0.5rem', cursor: idx===criteria.length-1?'default':'pointer'}} onClick={() => { const arr=[...criteria]; [arr[idx],arr[idx+1]]=[arr[idx+1],arr[idx]]; arr.forEach((x,i)=>x.sort_order=i+1); setCriteria(arr); }}>▼</button>
                      <button style={{background:'#ef4444', color:'white', border:'none', borderRadius:'4px', width:'22px', height:'18px', fontSize:'0.5rem', cursor:'pointer'}} onClick={async () => {
                        await supabase.from('criteria').delete().eq('id', c.id);
                        setCriteria(criteria.filter(x=>x.id!==c.id));
                      }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring Matrix */}
            <div className="admin-card card glass border-l-4 mb-6" style={{borderColor: '#c8102e'}}>
              <h3 className="mb-4" style={{color: '#c8102e'}}>🏆 Ma trận Điểm Sơ loại</h3>
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Tiêu chí chấm điểm" value={newScoring.title} onChange={e => setNewScoring({...newScoring, title: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                <input type="text" placeholder="Điểm (VD: 6đ)" value={newScoring.points} onChange={e => setNewScoring({...newScoring, points: e.target.value})} className="admin-input" style={{width: '80px', marginBottom: 0}} />
                <input type="text" placeholder="%" value={newScoring.percent} onChange={e => setNewScoring({...newScoring, percent: e.target.value})} className="admin-input" style={{width: '80px', marginBottom: 0}} />
                <button className="btn btn-nshm" style={{whiteSpace: 'nowrap'}} onClick={async () => {
                  if (!newScoring.title) return;
                  const { data } = await supabase.from('scoring').insert({...newScoring, sort_order: scoring.length + 1}).select();
                  if (data?.[0]) { setScoring([...scoring, data[0]]); setNewScoring({title:'', points:'', percent:''}); }
                }}>+ Thêm</button>
              </div>
              <div className="flex flex-col gap-3">
                {scoring.map((s, idx) => (
                  <div key={s.id} className="p-3 bg-white rounded-lg border border-gray-200 flex gap-3 items-center">
                    <span style={{background: '#c8102e', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, flexShrink: 0}}>{idx+1}</span>
                    <input type="text" value={s.title} onChange={e => { const arr=[...scoring]; arr[idx].title=e.target.value; setScoring(arr); }} className="admin-input" style={{flex: 1, marginBottom: 0, fontWeight: 600}} />
                    <input type="text" value={s.points} onChange={e => { const arr=[...scoring]; arr[idx].points=e.target.value; setScoring(arr); }} className="admin-input" style={{width: '70px', marginBottom: 0, textAlign: 'center', fontWeight: 700, color: '#c8102e'}} />
                    <input type="text" value={s.percent} onChange={e => { const arr=[...scoring]; arr[idx].percent=e.target.value; setScoring(arr); }} className="admin-input" style={{width: '70px', marginBottom: 0, textAlign: 'center'}} />
                    <div style={{display: 'flex', gap: '2px'}}>
                      <button disabled={idx===0} style={{background: idx===0?'#e2e8f0':'#c8102e', color:'white', border:'none', borderRadius:'4px', width:'20px', height:'20px', fontSize:'0.5rem', cursor:idx===0?'default':'pointer'}} onClick={() => { const arr=[...scoring]; [arr[idx],arr[idx-1]]=[arr[idx-1],arr[idx]]; arr.forEach((x,i)=>x.sort_order=i+1); setScoring(arr); }}>▲</button>
                      <button disabled={idx===scoring.length-1} style={{background:idx===scoring.length-1?'#e2e8f0':'#c8102e', color:'white', border:'none', borderRadius:'4px', width:'20px', height:'20px', fontSize:'0.5rem', cursor:idx===scoring.length-1?'default':'pointer'}} onClick={() => { const arr=[...scoring]; [arr[idx],arr[idx+1]]=[arr[idx+1],arr[idx]]; arr.forEach((x,i)=>x.sort_order=i+1); setScoring(arr); }}>▼</button>
                      <button style={{background:'#ef4444', color:'white', border:'none', borderRadius:'4px', width:'20px', height:'20px', fontSize:'0.5rem', cursor:'pointer'}} onClick={async () => {
                        await supabase.from('scoring').delete().eq('id', s.id);
                        setScoring(scoring.filter(x=>x.id!==s.id));
                      }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={async () => {
              for (let i = 0; i < criteria.length; i++) {
                await supabase.from('criteria').update({ title: criteria[i].title, description: criteria[i].description, icon: criteria[i].icon, sort_order: i + 1 }).eq('id', criteria[i].id);
              }
              for (let i = 0; i < scoring.length; i++) {
                await supabase.from('scoring').update({ title: scoring[i].title, points: scoring[i].points, percent: scoring[i].percent, sort_order: i + 1 }).eq('id', scoring[i].id);
              }
              alert('Đã lưu Tiêu Chuẩn & Ma Trận Điểm!');
            }}>💾 Lưu Tất Cả Tiêu Chuẩn & Điểm</button>
          </div>
        )}
      </div>

      {/* Avatar Cropper Modal */}
      {rawImage && (
        <AvatarCropper
          imageSrc={rawImage}
          onCrop={(croppedImg) => {
            setNewMentor(prev => ({...prev, image: croppedImg}));
            setRawImage(null);
          }}
          onCancel={() => setRawImage(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
