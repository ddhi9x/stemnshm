import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [aboutData, setAboutData] = useState({ message: '', focus: '', target: '', format: '' });
  const [awards, setAwards] = useState([]);
  const [linksData, setLinksData] = useState({ register: '', submit: '' });
  const [timeline, setTimeline] = useState([]);

  const [newArticle, setNewArticle] = useState({ title: '', summary: '', date: '' });
  const [newMentor, setNewMentor] = useState({ name: '', field: '', bio: '', image: '' });

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
        if (linkDb) setLinksData({ register: linkDb.register, submit: linkDb.submit });

        const { data: tlData } = await supabase.from('timeline').select('*').order('id', {ascending: true});
        if (tlData) setTimeline(tlData);

        const { data: abData } = await supabase.from('about').select('*').single();
        if (abData) setAboutData(abData);
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
    const { data, error } = await supabase.from('news').insert(newArticle).select();
    if (error) {
      console.error('Error adding news:', error);
      alert('Lỗi khi thêm tin tức!');
    } else if (data && data.length > 0) {
      setNews([data[0], ...news]);
      setNewArticle({ title: '', summary: '', date: '' });
      alert('Đã thêm tin tức!');
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
    const { data, error } = await supabase.from('mentors').insert(newMentor).select();
    if (error) {
      console.error('Error adding mentor:', error);
      alert('Lỗi khi thêm Mentor!');
    } else if (data && data.length > 0) {
      setMentors([...mentors, data[0]]);
      setNewMentor({ name: '', field: '', bio: '', image: '' });
      alert('Đã thêm Mentor!');
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
    await supabase.from('links').update(linksData).eq('id', 1);
    alert('Đã cập nhật Link Ngày Hội!');
  };

  const handleAwardChange = (id, field, val) => {
    const updated = awards.map(a => a.id === id ? { ...a, [field]: val } : a);
    setAwards(updated);
  };

  const handleSaveAwards = async () => {
    for (const a of awards) {
      await supabase.from('awards').update({ qty: a.qty, value: a.value }).eq('id', a.id);
    }
    alert('Đã cập nhật Cơ Cấu Giải Thưởng!');
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
        </ul>
        <button className="btn btn-outline" onClick={handleLogout} style={{marginTop: 'auto', borderColor: '#ef4444', color: '#ef4444'}}>Thoát</button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'news' && (
          <div className="fade-in">
             ... {/* Using same UI for news */}
            <h2 className="text-secondary mb-6">Quản lý Tin Tức</h2>
            <div className="admin-card card glass border-l-4 border-secondary">
              <h3 className="mb-4 text-green-gradient">Thêm bài viết mới</h3>
              <input type="text" placeholder="Tiêu đề" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="admin-input" />
              <input type="date" value={newArticle.date} onChange={e => setNewArticle({...newArticle, date: e.target.value})} className="admin-input" />
              <textarea placeholder="Nội dung tóm tắt..." value={newArticle.summary} onChange={e => setNewArticle({...newArticle, summary: e.target.value})} className="admin-input" rows="4"></textarea>
              <button className="btn btn-primary" onClick={handleSaveNews}>Đăng Tin</button>
            </div>

            <div className="admin-list mt-8">
              {news.map(n => (
                <div key={n.id} className="card mb-4 flex justify-between items-center p-4">
                  <div>
                    <h4 className="m-0 text-nshm">{n.title}</h4>
                    <p className="text-muted m-0 text-sm mt-1">{n.date}</p>
                  </div>
                  <button className="btn btn-outline" style={{padding: '0.4rem 1rem', borderColor: '#ef4444', color: '#ef4444'}} onClick={() => handleDeleteNews(n.id)}>Xóa</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Quản lý Mentor</h2>
            <div className="admin-card card glass border-l-4 border-primary">
              <h3 className="mb-4 text-green-gradient">Thêm Mentor mới</h3>
              <input type="text" placeholder="Tên Mentor (VD: Thầy Hùng)" value={newMentor.name} onChange={e => setNewMentor({...newMentor, name: e.target.value})} className="admin-input" />
              <input type="text" placeholder="Link Ảnh Đại Diện (VD: /mentor1.jpg hoặc https://...)" value={newMentor.image} onChange={e => setNewMentor({...newMentor, image: e.target.value})} className="admin-input" />
              <select value={newMentor.field} onChange={e => setNewMentor({...newMentor, field: e.target.value})} className="admin-input">
                <option value="">-- Chọn lĩnh vực --</option>
                <option value="Science">Science (Khoa học)</option>
                <option value="Technology">Technology (Công nghệ)</option>
                <option value="Engineering">Engineering (Kỹ thuật)</option>
                <option value="Mathematics">Mathematics (Toán học)</option>
              </select>
              <textarea placeholder="Tiểu sử / Mô tả chuyên môn..." value={newMentor.bio} onChange={e => setNewMentor({...newMentor, bio: e.target.value})} className="admin-input" rows="3"></textarea>
              <button className="btn btn-primary" onClick={handleSaveMentor}>Thêm Mentor</button>
            </div>

            <div className="admin-list grid grid-cols-2 gap-6 p-6">
              {mentors.map(m => (
                <div key={m.id} className="card block-shadow flex flex-col items-start p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {m.image ? (
                       <img src={m.image} alt={m.name} style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                       <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#eee'}}></div>
                    )}
                    <div>
                      <h4 className="m-0 text-nshm">{m.name}</h4>
                      <span className="text-secondary text-sm bg-blue-50 px-2 py-1 rounded inline-block mt-1">{m.field}</span>
                    </div>
                  </div>
                  <p className="text-muted text-sm mb-5 flex-1 w-full">{m.bio}</p>
                  <button className="btn btn-outline w-full" style={{padding: '0.4rem', borderColor: '#f87171', color: '#ef4444'}} onClick={() => handleDeleteMentor(m.id)}>Xóa Mentor</button>
             </div>
              ))}
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
            
            <div className="admin-card card glass border-l-4 border-secondary">
              <h3 className="mb-4 text-secondary">Cập nhật Link Gửi bài / Đăng ký</h3>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">Link Form Đăng Ký Tham Gia</label>
                <input type="text" placeholder="https://..." value={linksData.register} onChange={e => setLinksData({...linksData, register: e.target.value})} className="admin-input" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-muted mb-2">Link Nộp Sản Phẩm / Nộp Bài</label>
                <input type="text" placeholder="https://..." value={linksData.submit} onChange={e => setLinksData({...linksData, submit: e.target.value})} className="admin-input" />
              </div>
              <button className="btn btn-nshm w-full" onClick={handleSaveLinks}>Lưu Cập Nhật Link Đồng Bộ</button>
            </div>
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Chỉnh Sửa Cơ Cấu Giải Thưởng</h2>
            <div className="admin-card card glass border-l-4" style={{borderColor: '#fbbf24'}}>
              <div className="flex flex-col gap-6">
                {awards && awards.map(aw => (
                  <div key={aw.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="mb-3" style={{color: aw.color}}>{aw.title}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Số lượng giải</label>
                        <input type="text" className="admin-input" value={aw.qty} onChange={(e) => handleAwardChange(aw.id, 'qty', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">Giá trị giải thưởng</label>
                        <input type="text" className="admin-input" value={aw.value} onChange={(e) => handleAwardChange(aw.id, 'value', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-6 w-full" onClick={handleSaveAwards}>Lưu Cập Nhật Giải Thưởng</button>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">Chỉnh Sửa Hành Trình Ngày Hội</h2>
            <div className="admin-card card glass border-l-4 border-primary">
              <div className="flex flex-col gap-6">
                {timeline && timeline.map(tt => (
                  <div key={tt.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="mb-3 text-secondary">Trạm {tt.id}</h4>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
