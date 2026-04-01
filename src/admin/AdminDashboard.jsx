import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AvatarCropper from './AvatarCropper';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as XLSX from 'xlsx';
import './Admin.css';

// Register table tags so Quill doesn't strip them
const Block = Quill.import('blots/block');
class TableCell extends Block { static blotName = 'tableCell'; static tagName = 'TD'; }
class TableHeader extends Block { static blotName = 'tableHeader'; static tagName = 'TH'; }
class TableRow extends Block { static blotName = 'tableRow'; static tagName = 'TR'; }
const Container = Quill.import('blots/container');
class TableBody extends Container { static blotName = 'tableBody'; static tagName = 'TBODY'; }
class TableHead extends Container { static blotName = 'tableHead'; static tagName = 'THEAD'; }
class Table extends Container { static blotName = 'table'; static tagName = 'TABLE'; }
Quill.register(TableCell); Quill.register(TableHeader); Quill.register(TableRow);
Quill.register(TableBody); Quill.register(TableHead); Quill.register(Table);

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [aboutData, setAboutData] = useState({ message: '', focus: '', target: '', format: '', objective: '', stem_s: '', stem_t: '', stem_e: '', stem_m: '', round1_title: '', round1_desc: '', round1_items: '', round2_title: '', round2_desc: '', round2_items: '' });
  const [awards, setAwards] = useState([]);
  const [linksData, setLinksData] = useState({ register: '', submit: '', template_hoso: '', template_ppt: '', template_guide: '', label_register: 'Đăng Ký Tham Gia', label_submit: 'Nộp Bài / Sản Phẩm', label_hoso: 'Tải Mẫu Hồ Sơ', label_ppt: 'Mẫu Trình Bày PPT', label_guide: 'HD Trình Chiếu', show_register: true, show_submit: true, show_hoso: true, show_ppt: true, show_guide: true });
  const [settingsData, setSettingsData] = useState({ tagline: '', email: '', hotline: '', gemini_key: '', gemini_model: 'gemini-2.5-flash' });
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
  const [htmlMode, setHtmlMode] = useState(false);
  const [newMentor, setNewMentor] = useState({ name: '', field: '', bio: '', image: '', slogan: '' });
  const [editingMentorId, setEditingMentorId] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [newAward, setNewAward] = useState({ title: '', qty: '', value: '', color: '#22c55e', bg: '#ecfdf5' });
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ team_name: '', field: 'Science', members: '', leader: '', class: '', notes: '' });
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [chatSessionMessages, setChatSessionMessages] = useState([]);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamFilter, setTeamFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [newGalleryItem, setNewGalleryItem] = useState({ url: '', caption: '', type: 'image' });
  const [roundsData, setRoundsData] = useState([]);

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

        const { data: teamsData } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
        if (teamsData) setTeams(teamsData);

        const { data: galData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (galData) setGalleryItems(galData);

        const { data: rnData } = await supabase.from('rounds').select('*').order('sort_order', { ascending: true });
        if (rnData) setRoundsData(rnData);
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
  // Ref for contentEditable preview
  const previewEditRef = React.useRef(null);

  const handleSaveNews = async () => {
    if(!newArticle.title) return;
    // Sync contentEditable content before saving
    if (previewEditRef.current && !htmlMode) {
      newArticle.content = previewEditRef.current.innerHTML;
    }
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
    const { error } = await supabase.from('links').update({
      register: linksData.register, submit: linksData.submit,
      template_hoso: linksData.template_hoso, template_ppt: linksData.template_ppt,
      template_guide: linksData.template_guide,
      label_register: linksData.label_register, label_submit: linksData.label_submit,
      label_hoso: linksData.label_hoso, label_ppt: linksData.label_ppt, label_guide: linksData.label_guide,
      show_register: linksData.show_register ?? true, show_submit: linksData.show_submit ?? true,
      show_hoso: linksData.show_hoso ?? true, show_ppt: linksData.show_ppt ?? true, show_guide: linksData.show_guide ?? true
    }).eq('id', linksData.id || 1);
    if (error) alert('Lỗi lưu: ' + error.message);
    else alert('✅ Đã cập nhật Link & Ẩn/Hiện nút!');
  };

  const handleSaveSettings = async () => {
    await supabase.from('settings').update({
      tagline: settingsData.tagline, email: settingsData.email, hotline: settingsData.hotline,
      event_date: settingsData.event_date || '',
      stat1_num: settingsData.stat1_num, stat1_label: settingsData.stat1_label,
      stat2_num: settingsData.stat2_num, stat2_label: settingsData.stat2_label,
      stat3_num: settingsData.stat3_num, stat3_label: settingsData.stat3_label,
      stat4_num: settingsData.stat4_num, stat4_label: settingsData.stat4_label,
      gemini_key: settingsData.gemini_key || '',
      gemini_model: settingsData.gemini_model || 'gemini-2.5-flash',
      show_recruit_banner: settingsData.show_recruit_banner !== false,
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

  // === Teams handlers ===
  const handleSaveTeam = async () => {
    if (!newTeam.team_name) return;
    if (editingTeamId) {
      const { data, error } = await supabase.from('teams').update(newTeam).eq('id', editingTeamId).select();
      if (!error && data?.length) {
        setTeams(teams.map(t => t.id === editingTeamId ? data[0] : t));
        setNewTeam({ team_name: '', field: 'Science', members: '', leader: '', class: '', notes: '' });
        setEditingTeamId(null);
        alert('Đã cập nhật đội thi!');
      }
    } else {
      const { data, error } = await supabase.from('teams').insert(newTeam).select();
      if (!error && data?.length) {
        setTeams([data[0], ...teams]);
        setNewTeam({ team_name: '', field: 'Science', members: '', leader: '', class: '', notes: '' });
        alert('Đã thêm đội thi!');
      }
    }
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Xóa đội thi này?')) {
      await supabase.from('teams').delete().eq('id', id);
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const handleTeamStatus = async (id, status) => {
    await supabase.from('teams').update({ status }).eq('id', id);
    setTeams(teams.map(t => t.id === id ? { ...t, status } : t));
  };

  // === Export Excel ===
  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  // === Gallery handlers ===
  const handleAddGallery = async () => {
    if (!newGalleryItem.url) return;
    const { data, error } = await supabase.from('gallery').insert(newGalleryItem).select();
    if (!error && data?.length) {
      setGalleryItems([data[0], ...galleryItems]);
      setNewGalleryItem({ url: '', caption: '', type: 'image' });
      alert('Đã thêm ảnh/video!');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm('Xóa ảnh/video này?')) {
      await supabase.from('gallery').delete().eq('id', id);
      setGalleryItems(galleryItems.filter(g => g.id !== id));
    }
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
          <li className={activeTab === 'teams' ? 'active' : ''} onClick={() => setActiveTab('teams')}>🏆 Đội Thi <span style={{background: '#ef4444', color: 'white', borderRadius: '10px', padding: '0 6px', fontSize: '0.7rem', marginLeft: '4px'}}>{teams.length}</span></li>
          <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>🖼️ Thư Viện</li>
          <li className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>📊 Thống Kê</li>
          <li className={activeTab === 'rounds' ? 'active' : ''} onClick={() => setActiveTab('rounds')}>🎯 Vòng Thi</li>
          <li className={activeTab === 'chatlog' ? 'active' : ''} onClick={() => {
            setActiveTab('chatlog');
            supabase.from('chat_logs').select('session_id, created_at').order('created_at', { ascending: false }).then(({ data }) => {
              if (!data) return;
              const sessions = {};
              data.forEach(r => {
                if (!sessions[r.session_id]) sessions[r.session_id] = { session_id: r.session_id, started: r.created_at, count: 0 };
                sessions[r.session_id].count++;
              });
              setChatLogs(Object.values(sessions));
            });
          }}>💬 Lịch Sử Chat</li>
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
              <label className="block text-sm font-bold text-muted mb-2">📝 Nội dung bài viết</label>
              <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <button
                  type="button"
                  onClick={() => {
                    if (previewEditRef.current && !htmlMode) {
                      setNewArticle(prev => ({...prev, content: previewEditRef.current.innerHTML}));
                    }
                    setHtmlMode(true);
                  }}
                  style={{padding: '0.35rem 0.8rem', borderRadius: '8px', border: '2px solid', borderColor: htmlMode ? '#2563eb' : '#cbd5e1', background: htmlMode ? '#eff6ff' : 'white', color: htmlMode ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'}}
                >{'<>'} Mã HTML</button>
                <button
                  type="button"
                  onClick={() => setHtmlMode(false)}
                  style={{padding: '0.35rem 0.8rem', borderRadius: '8px', border: '2px solid', borderColor: !htmlMode ? '#059669' : '#cbd5e1', background: !htmlMode ? '#f0fdf4' : 'white', color: !htmlMode ? '#059669' : '#64748b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'}}
                >👁 Xem trước</button>
              </div>
              {htmlMode ? (
                <div>
                  <textarea
                    className="admin-input"
                    rows="16"
                    value={newArticle.content || ''}
                    onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                    placeholder="Paste mã HTML ở đây... (table, div, style đều được giữ nguyên)"
                    style={{fontFamily: 'Consolas, monospace', fontSize: '0.82rem', lineHeight: '1.5', background: '#1e293b', color: '#e2e8f0', borderRadius: '10px', padding: '0.8rem'}}
                  />
                  <p style={{fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem'}}>💡 <strong>Mẹo:</strong> Paste HTML có bảng, heading, danh sách ở đây. Bấm <strong>"👁 Xem trước"</strong> để xem giao diện thực tế.</p>
                </div>
              ) : (
                <div>
                  {newArticle.content ? (
                    <div
                      ref={previewEditRef}
                      className="news-content"
                      contentEditable
                      suppressContentEditableWarning
                      style={{background: 'white', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '1.5rem', minHeight: '200px', maxHeight: '500px', overflowY: 'auto', outline: 'none', cursor: 'text'}}
                      dangerouslySetInnerHTML={{__html: newArticle.content}}
                    />
                  ) : (
                    <div style={{background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#94a3b8', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <span>Chưa có nội dung. Chuyển sang <strong>{'<>'} Mã HTML</strong> để nhập nội dung.</span>
                    </div>
                  )}
                  <p style={{fontSize: '0.72rem', color: '#059669', marginTop: '0.4rem'}}>✏️ <strong>Click vào nội dung để sửa trực tiếp.</strong> Thay đổi sẽ tự lưu khi bạn click ra ngoài.</p>
                </div>
              )}
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
              <div className="mb-5">
                <label className="block text-sm font-bold text-nshm mb-2">🎯 Mục tiêu</label>
                <textarea value={aboutData.objective || ''} onChange={e => setAboutData({...aboutData, objective: e.target.value})} className="admin-input" rows="3" placeholder="Khám phá đam mê, thúc đẩy sáng tạo..."></textarea>
              </div>

              <h3 className="mb-3 text-primary" style={{marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>🔬 4 Lĩnh Vực STEM</h3>
              <div className="mb-4">
                <label className="block text-sm font-bold text-muted mb-1">Science (Khoa học)</label>
                <input type="text" value={aboutData.stem_s || ''} onChange={e => setAboutData({...aboutData, stem_s: e.target.value})} className="admin-input" placeholder="Thí nghiệm khoa học; thiết kế mô hình..." />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-muted mb-1">Technology (Công nghệ)</label>
                <input type="text" value={aboutData.stem_t || ''} onChange={e => setAboutData({...aboutData, stem_t: e.target.value})} className="admin-input" placeholder="Ứng dụng lập trình; phần mềm..." />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-muted mb-1">Engineering (Kỹ thuật)</label>
                <input type="text" value={aboutData.stem_e || ''} onChange={e => setAboutData({...aboutData, stem_e: e.target.value})} className="admin-input" placeholder="Xây dựng mô hình, giải pháp thiết kế..." />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-1">Mathematics (Toán học)</label>
                <input type="text" value={aboutData.stem_m || ''} onChange={e => setAboutData({...aboutData, stem_m: e.target.value})} className="admin-input" placeholder="Ứng dụng toán học thực tế..." />
              </div>

              <h3 className="mb-3 text-primary" style={{marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>🏆 Cấu trúc Vòng Thi</h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-bold text-muted mb-1">Tên Vòng 1</label>
                  <input type="text" value={aboutData.round1_title || ''} onChange={e => setAboutData({...aboutData, round1_title: e.target.value})} className="admin-input" placeholder="Vòng Sơ Loại" />
                  <label className="block text-sm font-bold text-muted mb-1 mt-2">Mô tả ngắn</label>
                  <input type="text" value={aboutData.round1_desc || ''} onChange={e => setAboutData({...aboutData, round1_desc: e.target.value})} className="admin-input" placeholder="Hồ sơ ý tưởng & Slideshow" />
                  <label className="block text-sm font-bold text-muted mb-1 mt-2">Các bước (mỗi dòng 1 bước)</label>
                  <textarea value={aboutData.round1_items || ''} onChange={e => setAboutData({...aboutData, round1_items: e.target.value})} className="admin-input" rows="3" placeholder="Mô tả ý tưởng&#10;Vẽ sơ đồ thiết kế&#10;Chọn Mentor"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted mb-1">Tên Vòng 2</label>
                  <input type="text" value={aboutData.round2_title || ''} onChange={e => setAboutData({...aboutData, round2_title: e.target.value})} className="admin-input" placeholder="Vòng Chung Kết" />
                  <label className="block text-sm font-bold text-muted mb-1 mt-2">Mô tả ngắn</label>
                  <input type="text" value={aboutData.round2_desc || ''} onChange={e => setAboutData({...aboutData, round2_desc: e.target.value})} className="admin-input" placeholder="STEM Day Exhibition" />
                  <label className="block text-sm font-bold text-muted mb-1 mt-2">Các bước (mỗi dòng 1 bước)</label>
                  <textarea value={aboutData.round2_items || ''} onChange={e => setAboutData({...aboutData, round2_items: e.target.value})} className="admin-input" rows="3" placeholder="Hoàn thiện sản phẩm&#10;Poster triển lãm&#10;Thuyết trình"></textarea>
                </div>
              </div>

              <button className="btn btn-primary btn-lg w-full" onClick={handleSaveAbout}>Lưu Thay Đổi Trang Giới Thiệu</button>
            </div>
            
            <div className="admin-card card glass border-l-4 border-secondary mb-6">
              <h3 className="mb-4 text-secondary">Cập nhật Link & Tên Nút</h3>
              {/* Visibility Toggles */}
              <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1.2rem'}}>
                <label className="block text-sm font-bold text-gray-700 mb-3">🔘 Ẩn/Hiện các nút trên Trang Chủ</label>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.8rem'}}>
                  {[
                    { key: 'show_register', label: 'Đăng Ký', color: '#dc2626' },
                    { key: 'show_submit', label: 'Nộp Bài', color: '#059669' },
                    { key: 'show_hoso', label: 'Mẫu Hồ Sơ', color: '#2563eb' },
                    { key: 'show_ppt', label: 'Mẫu PPT', color: '#d97706' },
                    { key: 'show_guide', label: 'HD Trình Chiếu', color: '#8b5cf6' },
                  ].map(btn => (
                    <label key={btn.key} style={{display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '8px', border: `2px solid ${linksData[btn.key] !== false ? btn.color : '#cbd5e1'}`, background: linksData[btn.key] !== false ? `${btn.color}10` : '#f1f5f9', transition: 'all 0.2s'}}>
                      <input type="checkbox" checked={linksData[btn.key] !== false} onChange={e => setLinksData({...linksData, [btn.key]: e.target.checked})} style={{accentColor: btn.color}} />
                      <span style={{fontSize: '0.8rem', fontWeight: 700, color: linksData[btn.key] !== false ? btn.color : '#94a3b8'}}>{btn.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem'}}>
                <button onClick={async () => { const { data } = await supabase.from('links').select('clicks_register,clicks_submit,clicks_hoso,clicks_ppt,clicks_guide').single(); if (data) setLinksData(prev => ({...prev, ...data})); alert('✅ Đã cập nhật số liệu mới nhất!'); }} style={{fontSize: '0.72rem', padding: '0.3rem 0.7rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', color: '#64748b'}}>
                  🔄 Làm mới thống kê
                </button>
              </div>
              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-muted">Link Form Đăng Ký Tham Gia</label>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', background: '#fef2f2', padding: '0.2rem 0.6rem', borderRadius: '12px'}}>🖱️ {linksData.clicks_register || 0} lượt bấm</span>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', background: '#fef2f2', padding: '0.2rem 0.6rem', borderRadius: '12px'}}>🖱️ {linksData.clicks_register || 0} lượt bấm</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="https://..." value={linksData.register} onChange={e => setLinksData({...linksData, register: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                  <input type="text" placeholder="Tên nút" value={linksData.label_register || ''} onChange={e => setLinksData({...linksData, label_register: e.target.value})} className="admin-input" style={{maxWidth: '180px', marginBottom: 0, fontWeight: 700, color: '#dc2626'}} />
                </div>
              </div>
              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-muted">Link Nộp Sản Phẩm / Nộp Bài</label>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '12px'}}>🖱️ {linksData.clicks_submit || 0} lượt bấm</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="https://..." value={linksData.submit} onChange={e => setLinksData({...linksData, submit: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0}} />
                  <input type="text" placeholder="Tên nút" value={linksData.label_submit || ''} onChange={e => setLinksData({...linksData, label_submit: e.target.value})} className="admin-input" style={{maxWidth: '180px', marginBottom: 0, fontWeight: 700, color: '#059669'}} />
                </div>
              </div>
              {[
                { key: 'template_hoso', clicksKey: 'clicks_hoso', labelKey: 'label_hoso', icon: '📄', title: 'Mẫu Hồ Sơ', accept: '.docx,.doc,.pdf,.xlsx', prefix: 'hoso', color: '#2563eb' },
                { key: 'template_ppt', clicksKey: 'clicks_ppt', labelKey: 'label_ppt', icon: '📊', title: 'Mẫu Trình Bày PPT', accept: '.pptx,.ppt,.pdf', prefix: 'ppt', color: '#d97706' },
                { key: 'template_guide', clicksKey: 'clicks_guide', labelKey: 'label_guide', icon: '📋', title: 'HD Trình Chiếu', accept: '.pdf,.docx,.doc,.pptx,.ppt', prefix: 'guide', color: '#8b5cf6' },
              ].map(tmpl => {
                const fileUrl = linksData[tmpl.key];
                const fileName = fileUrl ? decodeURIComponent(fileUrl.split('/').pop()) : null;
                const hasFile = !!fileUrl;
                return (
                  <div key={tmpl.key} className="mb-5" style={{border: `1px solid ${hasFile ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '12px', padding: '1rem', background: hasFile ? '#f0fdf4' : '#fafafa'}}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <label className="block text-sm font-bold m-0" style={{color: tmpl.color}}>{tmpl.icon} {tmpl.title}</label>
                        <span style={{fontSize: '0.7rem', fontWeight: 600, color: tmpl.color, background: `${tmpl.color}15`, padding: '0.15rem 0.5rem', borderRadius: '12px'}}>
                          🖱️ {linksData[tmpl.clicksKey] || 0} lượt tải
                        </span>
                      </div>
                      <span style={{fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 700, background: hasFile ? '#dcfce7' : '#fef3c7', color: hasFile ? '#166534' : '#92400e'}}>
                        {hasFile ? '✅ Đã có file' : '⏳ Chưa có file'}
                      </span>
                    </div>
                    
                    {/* Current File Display */}
                    {hasFile && (
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.8rem', background: 'white', border: '1px solid #d1fae5', borderRadius: '8px', marginBottom: '0.6rem'}}>
                        <span style={{fontSize: '1.2rem'}}>{tmpl.icon}</span>
                        <a href={fileUrl} target="_blank" rel="noreferrer" style={{flex: 1, fontSize: '0.78rem', color: '#0369a1', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline'}}>
                          {fileName}
                        </a>
                        <button onClick={() => { if (confirm('Xóa file "' + (fileName || '') + '"? URL sẽ bị xóa trắng.')) setLinksData({...linksData, [tmpl.key]: ''}); }} style={{background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, whiteSpace: 'nowrap'}}>
                          🗑️ Xóa
                        </button>
                      </div>
                    )}

                    {/* URL + Label inputs */}
                    <div className="flex gap-2 items-center mb-2">
                      <input type="text" placeholder={hasFile ? fileUrl : 'Dán URL hoặc upload file bên dưới (có thể để trống)'} value={linksData[tmpl.key] || ''} onChange={e => setLinksData({...linksData, [tmpl.key]: e.target.value})} className="admin-input" style={{flex: 1, marginBottom: 0, fontSize: '0.8rem'}} />
                      <input type="text" placeholder="Tên nút" value={linksData[tmpl.labelKey] || ''} onChange={e => setLinksData({...linksData, [tmpl.labelKey]: e.target.value})} className="admin-input" style={{maxWidth: '140px', marginBottom: 0, fontWeight: 700, color: tmpl.color, fontSize: '0.8rem'}} />
                    </div>

                    {/* Upload */}
                    <label className="btn btn-outline" style={{padding: '0.35rem 0.8rem', borderColor: '#059669', color: '#059669', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap'}}>
                      📎 Upload File Mới
                      <input type="file" accept={tmpl.accept} style={{display: 'none'}} onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const safeName = file.name
                          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
                          .replace(/đ/g, 'd').replace(/Đ/g, 'D')           // handle đ
                          .replace(/\s+/g, '_')                              // spaces → underscores
                          .replace(/[^a-zA-Z0-9_.\-]/g, '');                 // remove special chars
                        const fName = `${tmpl.prefix}_${Date.now()}_${safeName}`;
                        const { error } = await supabase.storage.from('templates').upload(fName, file, { upsert: true });
                        if (error) { alert('Lỗi upload: ' + error.message + '\n\nHãy tạo bucket "templates" trong Supabase Storage (public).'); return; }
                        const { data: urlData } = supabase.storage.from('templates').getPublicUrl(fName);
                        setLinksData({...linksData, [tmpl.key]: urlData.publicUrl});
                        alert('✅ Đã upload: ' + file.name);
                      }} />
                    </label>
                  </div>
                );
              })}
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
              <button className="btn w-full mt-4" style={{background: '#8b5cf6', color: 'white'}} onClick={handleSaveSettings}>💾 Lưu Số Thống Kê</button>
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

            {/* Chatbot AI Config */}
            <div className="admin-card card glass border-l-4 mt-6" style={{borderColor: '#8b5cf6'}}>
              <h3 className="mb-4" style={{color: '#8b5cf6'}}>🤖 Cấu Hình Chatbot AI</h3>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">🔑 Gemini API Key</label>
                <input type="password" placeholder="AIzaSy..." value={settingsData.gemini_key || ''} onChange={e => setSettingsData({...settingsData, gemini_key: e.target.value})} className="admin-input" style={{fontFamily: 'monospace'}} />
                <p style={{fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem'}}>Lấy key miễn phí tại <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{color: '#8b5cf6'}}>aistudio.google.com/apikey</a></p>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-muted mb-2">🧠 Model AI</label>
                <input type="text" list="gemini-models" placeholder="gemini-2.5-flash" value={settingsData.gemini_model || 'gemini-2.5-flash'} onChange={e => setSettingsData({...settingsData, gemini_model: e.target.value})} className="admin-input" style={{fontFamily: 'monospace'}} />
                <datalist id="gemini-models">
                  <option value="gemini-2.5-flash" />
                  <option value="gemini-2.5-pro" />
                  <option value="gemini-2.0-flash" />
                  <option value="gemini-2.0-flash-lite" />
                </datalist>
                <p style={{fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem'}}>Nhập tên model Gemini. Xem danh sách tại <a href="https://ai.google.dev/gemini-api/docs/models" target="_blank" rel="noreferrer" style={{color: '#8b5cf6'}}>ai.google.dev/models</a></p>
              </div>
              <div style={{background: settingsData.gemini_key ? '#f0fdf4' : '#fef3c7', border: `1px solid ${settingsData.gemini_key ? '#bbf7d0' : '#fde68a'}`, borderRadius: '10px', padding: '0.6rem 0.8rem', fontSize: '0.78rem', color: settingsData.gemini_key ? '#166534' : '#92400e'}}>
                {settingsData.gemini_key ? '✅ API Key đã được cấu hình — Chatbot AI đang hoạt động!' : '⚠️ Chưa có API Key — Chatbot sẽ không trả lời được.'}
              </div>
              <button className="btn w-full mt-4" style={{background: '#8b5cf6', color: 'white'}} onClick={handleSaveSettings}>Lưu Cấu Hình AI</button>
            </div>

            {/* Recruit Banner Toggle */}
            <div className="admin-card card glass border-l-4 mt-6" style={{borderColor: '#10b981'}}>
              <h3 className="mb-4" style={{color: '#059669'}}>📢 Banner Tuyển Thành Viên</h3>
              <p style={{fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem'}}>Bật/tắt popup tuyển thành viên Ban tổ chức hiển thị trên góc phải website.</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: settingsData.show_recruit_banner !== false ? '#f0fdf4' : '#f1f5f9', border: `2px solid ${settingsData.show_recruit_banner !== false ? '#22c55e' : '#cbd5e1'}`, borderRadius: '12px', transition: 'all 0.2s'}}>
                <label style={{position: 'relative', display: 'inline-block', width: '44px', height: '24px', flexShrink: 0}}>
                  <input type="checkbox" checked={settingsData.show_recruit_banner !== false} onChange={e => setSettingsData({...settingsData, show_recruit_banner: e.target.checked})} style={{opacity: 0, width: 0, height: 0}} />
                  <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: settingsData.show_recruit_banner !== false ? '#22c55e' : '#cbd5e1', borderRadius: '24px', transition: 'all 0.3s'}}>
                    <span style={{position: 'absolute', content: '', width: '18px', height: '18px', left: settingsData.show_recruit_banner !== false ? '22px' : '3px', top: '3px', background: 'white', borderRadius: '50%', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'}} />
                  </span>
                </label>
                <span style={{fontSize: '0.85rem', fontWeight: 700, color: settingsData.show_recruit_banner !== false ? '#059669' : '#94a3b8'}}>
                  {settingsData.show_recruit_banner !== false ? '🟢 Đang bật — Banner hiển thị trên website' : '⚪ Đã tắt — Banner ẩn hoàn toàn'}
                </span>
              </div>
              <button className="btn w-full mt-4" style={{background: '#059669', color: 'white'}} onClick={handleSaveSettings}>Lưu Cài Đặt Banner</button>
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="m-0 text-green-gradient">Danh Sách Mốc Hiện Có ({timeline.length})</h3>
                <button className="btn btn-nshm" style={{padding: '0.4rem 1rem', fontSize: '0.82rem'}} onClick={handleSaveTimeline}>
                  💾 Lưu Tất Cả
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {timeline && timeline.map((tt, idx) => (
                  <div key={tt.id} style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderLeft: '4px solid #059669',
                    borderRadius: '12px',
                    padding: '1rem',
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                  }}>
                    {/* Header row */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span style={{background: '#059669', color: 'white', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0}}>{idx + 1}</span>
                        <span style={{fontSize: '0.8rem', fontWeight: 700, color: '#059669'}}>{tt.title || 'Mốc chưa có tiêu đề'}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        {/* Sort up/down */}
                        <button
                          disabled={idx === 0}
                          title="Di chuyển lên"
                          style={{background: idx === 0 ? '#e2e8f0' : '#059669', color: 'white', border: 'none', borderRadius: '6px', width: '26px', height: '26px', cursor: idx === 0 ? 'default' : 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                          onClick={() => {
                            const arr = [...timeline];
                            [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
                            setTimeline([...arr]);
                          }}
                        >▲</button>
                        <button
                          disabled={idx === timeline.length - 1}
                          title="Di chuyển xuống"
                          style={{background: idx === timeline.length - 1 ? '#e2e8f0' : '#059669', color: 'white', border: 'none', borderRadius: '6px', width: '26px', height: '26px', cursor: idx === timeline.length - 1 ? 'default' : 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                          onClick={() => {
                            const arr = [...timeline];
                            [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                            setTimeline([...arr]);
                          }}
                        >▼</button>
                        {/* Save individual */}
                        <button
                          title="Lưu mốc này"
                          style={{background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700}}
                          onClick={async () => {
                            const { error } = await supabase.from('timeline').update({ date: tt.date, title: tt.title, desc: tt.desc }).eq('id', tt.id);
                            if (error) alert('Lỗi: ' + error.message);
                            else alert('✅ Đã lưu mốc: ' + tt.title);
                          }}
                        >💾 Lưu</button>
                        {/* Delete */}
                        <button
                          title="Xóa mốc này"
                          style={{background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700}}
                          onClick={async () => {
                            if (window.confirm(`Xóa mốc "${tt.title}"?`)) {
                              await supabase.from('timeline').delete().eq('id', tt.id);
                              setTimeline(timeline.filter(t => t.id !== tt.id));
                            }
                          }}
                        >🗑 Xóa</button>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">📅 Thời gian</label>
                        <input type="text" className="admin-input" value={tt.date} onChange={(e) => handleTimelineChange(tt.id, 'date', e.target.value)} placeholder="VD: 01/04/2026" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1">🏷️ Tiêu đề Mốc</label>
                        <input type="text" className="admin-input" value={tt.title} onChange={(e) => handleTimelineChange(tt.id, 'title', e.target.value)} placeholder="VD: Hạn nộp hồ sơ" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1">📝 Thông tin / Sự kiện chính</label>
                      <textarea className="admin-input" rows="2" value={tt.desc || ''} onChange={(e) => handleTimelineChange(tt.id, 'desc', e.target.value)} placeholder="Mô tả..." />
                    </div>
                  </div>
                ))}
              </div>
              {timeline.length > 1 && (
                <p style={{fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.75rem'}}>
                  💡 Sau khi sắp xếp lại thứ tự bằng ▲▼, nhấn <strong>Lưu Tất Cả</strong> để cập nhật.
                </p>
              )}
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

        {activeTab === 'teams' && (
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-secondary">🏆 Quản lý Đội Thi</h2>
              <div className="flex gap-2">
                <button className="btn btn-outline" style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}} onClick={() => exportToExcel(teams.map(t => ({
                  'Tên đội': t.team_name, 'Lĩnh vực': t.field, 'Đội trưởng': t.leader,
                  'Thành viên': t.members, 'Lớp': t.class, 'Trạng thái': t.status === 'approved' ? 'Đã duyệt' : t.status === 'rejected' ? 'Loại' : 'Chờ duyệt',
                  'Ghi chú': t.notes, 'Ngày đăng ký': new Date(t.created_at).toLocaleDateString('vi-VN')
                })), 'doi-thi-stem')}>📥 Export Đội Thi</button>
                <button className="btn btn-outline" style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}} onClick={() => exportToExcel(mentors.map(m => ({
                  'Tên': m.name, 'Lĩnh vực': m.field, 'Tiểu sử': m.bio, 'Slogan': m.slogan
                })), 'mentors-stem')}>📥 Export Mentors</button>
              </div>
            </div>

            {/* Add/Edit Form */}
            <div className="admin-card card glass border-l-4 border-secondary mb-6">
              <h3 className="mb-4 text-green-gradient">{editingTeamId ? '✏️ Sửa đội thi' : '➕ Thêm đội thi mới'}</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
                <input type="text" placeholder="Tên đội *" value={newTeam.team_name} onChange={e => setNewTeam({...newTeam, team_name: e.target.value})} className="admin-input" />
                <select value={newTeam.field} onChange={e => setNewTeam({...newTeam, field: e.target.value})} className="admin-input">
                  <option value="Science">🔬 Science</option>
                  <option value="Technology">💻 Technology</option>
                  <option value="Engineering">⚙️ Engineering</option>
                  <option value="Mathematics">📐 Mathematics</option>
                </select>
                <input type="text" placeholder="Đội trưởng" value={newTeam.leader} onChange={e => setNewTeam({...newTeam, leader: e.target.value})} className="admin-input" />
                <input type="text" placeholder="Lớp" value={newTeam.class} onChange={e => setNewTeam({...newTeam, class: e.target.value})} className="admin-input" />
              </div>
              <textarea placeholder="Thành viên (mỗi người 1 dòng)..." value={newTeam.members} onChange={e => setNewTeam({...newTeam, members: e.target.value})} className="admin-input mt-2" rows="2"></textarea>
              <textarea placeholder="Ghi chú..." value={newTeam.notes} onChange={e => setNewTeam({...newTeam, notes: e.target.value})} className="admin-input mt-2" rows="1"></textarea>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-nshm" onClick={handleSaveTeam}>{editingTeamId ? '💾 Cập nhật' : '➕ Thêm đội'}</button>
                {editingTeamId && <button className="btn btn-outline" onClick={() => { setEditingTeamId(null); setNewTeam({ team_name: '', field: 'Science', members: '', leader: '', class: '', notes: '' }); }}>Hủy</button>}
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {[['all', 'Tất cả'], ['pending', '⏳ Chờ duyệt'], ['approved', '✅ Đã duyệt'], ['rejected', '❌ Loại']].map(([val, label]) => (
                <button key={val} className={`btn ${teamFilter === val ? 'btn-nshm' : 'btn-outline'}`} style={{fontSize: '0.8rem', padding: '0.3rem 0.8rem'}} onClick={() => setTeamFilter(val)}>
                  {label} {val === 'all' ? `(${teams.length})` : `(${teams.filter(t => t.status === val).length})`}
                </button>
              ))}
            </div>

            {/* Team List */}
            <div className="flex flex-col gap-3">
              {teams.filter(t => teamFilter === 'all' || t.status === teamFilter).map(team => (
                <div key={team.id} className="admin-card card glass" style={{borderLeft: `4px solid ${team.status === 'approved' ? '#22c55e' : team.status === 'rejected' ? '#ef4444' : '#f59e0b'}`}}>
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="m-0" style={{fontSize: '1.05rem', fontWeight: 700}}>{team.team_name}</h4>
                        <span style={{fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '6px',
                          background: team.status === 'approved' ? '#dcfce7' : team.status === 'rejected' ? '#fef2f2' : '#fef9c3',
                          color: team.status === 'approved' ? '#16a34a' : team.status === 'rejected' ? '#dc2626' : '#ca8a04'
                        }}>
                          {team.status === 'approved' ? '✅ Đã duyệt' : team.status === 'rejected' ? '❌ Loại' : '⏳ Chờ duyệt'}
                        </span>
                      </div>
                      <div className="text-muted" style={{fontSize: '0.82rem'}}>
                        <span style={{background: '#eff6ff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600, color: 'var(--secondary-blue)'}}>{team.field}</span>
                        {team.leader && <span className="ml-3">👤 {team.leader}</span>}
                        {team.class && <span className="ml-3">🏫 {team.class}</span>}
                      </div>
                      {team.members && <p className="text-muted mt-1 m-0" style={{fontSize: '0.78rem', whiteSpace: 'pre-line'}}>👥 {team.members}</p>}
                      {team.notes && <p className="text-muted mt-1 m-0" style={{fontSize: '0.78rem', fontStyle: 'italic'}}>📝 {team.notes}</p>}
                    </div>
                    <div className="flex gap-1 flex-wrap" style={{flexShrink: 0}}>
                      {team.status !== 'approved' && <button className="btn btn-outline" style={{fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderColor: '#22c55e', color: '#22c55e'}} onClick={() => handleTeamStatus(team.id, 'approved')}>✅ Duyệt</button>}
                      {team.status !== 'rejected' && <button className="btn btn-outline" style={{fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderColor: '#ef4444', color: '#ef4444'}} onClick={() => handleTeamStatus(team.id, 'rejected')}>❌ Loại</button>}
                      <button className="btn btn-outline" style={{fontSize: '0.7rem', padding: '0.2rem 0.5rem'}} onClick={() => { setEditingTeamId(team.id); setNewTeam({ team_name: team.team_name, field: team.field, members: team.members || '', leader: team.leader || '', class: team.class || '', notes: team.notes || '' }); }}>✏️</button>
                      <button className="btn btn-outline" style={{fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderColor: '#ef4444', color: '#ef4444'}} onClick={() => handleDeleteTeam(team.id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
              {teams.filter(t => teamFilter === 'all' || t.status === teamFilter).length === 0 && (
                <p className="text-muted text-center py-8">Chưa có đội thi nào {teamFilter !== 'all' ? 'với trạng thái này' : ''}.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">🖼️ Quản lý Thư Viện</h2>
            <div className="admin-card card glass border-l-4 border-secondary mb-6">
              <h3 className="mb-4 text-green-gradient">➕ Thêm ảnh/video</h3>
              <input type="text" placeholder="URL ảnh hoặc video *" value={newGalleryItem.url} onChange={e => setNewGalleryItem({...newGalleryItem, url: e.target.value})} className="admin-input" />
              <input type="text" placeholder="Chú thích (tùy chọn)" value={newGalleryItem.caption} onChange={e => setNewGalleryItem({...newGalleryItem, caption: e.target.value})} className="admin-input mt-2" />
              <div className="flex gap-2 mt-2">
                <select value={newGalleryItem.type} onChange={e => setNewGalleryItem({...newGalleryItem, type: e.target.value})} className="admin-input" style={{maxWidth: '200px'}}>
                  <option value="image">📷 Ảnh</option>
                  <option value="video">🎬 Video</option>
                </select>
                <button className="btn btn-nshm" onClick={handleAddGallery}>➕ Thêm</button>
              </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.8rem'}}>
              {galleryItems.map(item => (
                <div key={item.id} style={{position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                  {item.type === 'video' ? (
                    <video src={item.url} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
                  ) : (
                    <img src={item.url} alt={item.caption || ''} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  )}
                  <div style={{position: 'absolute', top: '4px', right: '4px'}}>
                    <button onClick={() => handleDeleteGallery(item.id)} style={{background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', borderRadius: '6px', padding: '0.2rem 0.4rem', cursor: 'pointer', fontSize: '0.7rem'}}>🗑️</button>
                  </div>
                  {item.caption && <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '0.5rem', color: 'white', fontSize: '0.7rem'}}>{item.caption}</div>}
                </div>
              ))}
            </div>
            {galleryItems.length === 0 && <p className="text-muted text-center py-8">Chưa có ảnh/video nào.</p>}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">📊 Thống Kê Tổng Quan</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
              {[
                { icon: '👀', label: 'Lượt ghé thăm', value: settingsData.view_count || 0, color: '#8b5cf6' },
                { icon: '🏆', label: 'Tổng đội thi', value: teams.length, color: '#f59e0b' },
                { icon: '✅', label: 'Đã duyệt', value: teams.filter(t => t.status === 'approved').length, color: '#22c55e' },
                { icon: '⏳', label: 'Chờ duyệt', value: teams.filter(t => t.status === 'pending').length, color: '#eab308' },
                { icon: '👨‍🏫', label: 'Mentors', value: mentors.length, color: '#3b82f6' },
                { icon: '📰', label: 'Bài viết', value: news.length, color: '#ec4899' },
                { icon: '📷', label: 'Ảnh/Video', value: galleryItems.length, color: '#14b8a6' },
                { icon: '❓', label: 'FAQ', value: faqItems.length, color: '#64748b' },
              ].map((stat, i) => (
                <div key={i} className="card glass text-center" style={{padding: '1.2rem', borderTop: `3px solid ${stat.color}`}}>
                  <div style={{fontSize: '1.8rem'}}>{stat.icon}</div>
                  <div style={{fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1.1}}>{stat.value.toLocaleString()}</div>
                  <div style={{fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '0.3rem'}}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Click Stats */}
            <div className="admin-card card glass border-l-4 border-primary mb-6">
              <h3 className="mb-4 text-primary">🖱️ Thống Kê Lượt Click Nút</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.8rem'}}>
                {[
                  { label: 'Đăng Ký', value: linksData.clicks_register || 0, icon: '📝', color: '#dc2626' },
                  { label: 'Nộp Bài', value: linksData.clicks_submit || 0, icon: '📤', color: '#059669' },
                  { label: 'Mẫu Hồ Sơ', value: linksData.clicks_hoso || 0, icon: '📄', color: '#2563eb' },
                  { label: 'Mẫu PPT', value: linksData.clicks_ppt || 0, icon: '📊', color: '#d97706' },
                  { label: 'HD Trình Chiếu', value: linksData.clicks_guide || 0, icon: '📋', color: '#8b5cf6' },
                ].map((s, i) => (
                  <div key={i} style={{textAlign: 'center', padding: '0.8rem', border: `2px solid ${s.color}20`, borderRadius: '12px', background: `${s.color}08`}}>
                    <div style={{fontSize: '1.3rem'}}>{s.icon}</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 900, color: s.color}}>{s.value.toLocaleString()}</div>
                    <div style={{fontSize: '0.72rem', color: '#64748b', fontWeight: 600}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Distribution */}
            <div className="admin-card card glass">
              <h3 className="mb-4 text-green-gradient">📊 Phân bố Đội Thi theo Lĩnh Vực</h3>
              {['Science', 'Technology', 'Engineering', 'Mathematics'].map(field => {
                const count = teams.filter(t => t.field === field).length;
                const pct = teams.length > 0 ? Math.round(count / teams.length * 100) : 0;
                const colors = { Science: '#22c55e', Technology: '#3b82f6', Engineering: '#f59e0b', Mathematics: '#ec4899' };
                return (
                  <div key={field} style={{marginBottom: '0.8rem'}}>
                    <div className="flex justify-between" style={{fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem'}}>
                      <span>{field}</span>
                      <span>{count} đội ({pct}%)</span>
                    </div>
                    <div style={{background: '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden'}}>
                      <div style={{width: `${pct}%`, height: '100%', background: colors[field], borderRadius: '8px', transition: 'width 0.5s ease'}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rounds Tab */}
        {activeTab === 'rounds' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">🎯 Quản lý Vòng Thi</h2>
            <p className="text-muted mb-6" style={{fontSize: '0.85rem'}}>Chỉnh sửa nội dung phần "Cấu Trúc Cuộc Thi" (2 Vòng) trên trang chủ. Thay đổi sẽ cập nhật ngay trên website.</p>
            {roundsData.length === 0 ? (
              <div className="admin-card card glass" style={{padding: '2rem', textAlign: 'center'}}>
                <p className="text-muted">Chưa có dữ liệu. Hãy chạy SQL tạo bảng <code>rounds</code> trong Supabase.</p>
              </div>
            ) : (
              <div style={{display: 'grid', gap: '1.5rem'}}>
                {roundsData.map((round, idx) => (
                  <div key={round.id} className="admin-card card glass" style={{padding: '1.5rem', borderLeft: `4px solid ${idx === 0 ? '#22c55e' : '#dc2626'}`}}>
                    <h3 style={{color: idx === 0 ? '#22c55e' : '#dc2626', marginBottom: '1rem'}}>{idx === 0 ? '✅ Vòng 1: Sơ Loại' : '🏆 Vòng 2: Chung Kết'}</h3>
                    <div style={{display: 'grid', gap: '0.8rem'}}>
                      <div>
                        <label className="admin-label">Tên Vòng</label>
                        <input type="text" className="admin-input" value={round.title || ''} onChange={e => setRoundsData(prev => prev.map(r => r.id === round.id ? {...r, title: e.target.value} : r))} />
                      </div>
                      <div>
                        <label className="admin-label">Các bước nổi bật (hỗ trợ HTML)</label>
                        <textarea className="admin-input" rows={2} value={round.highlight_steps || ''} onChange={e => setRoundsData(prev => prev.map(r => r.id === round.id ? {...r, highlight_steps: e.target.value} : r))} />
                      </div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem'}}>
                        <div>
                          <label className="admin-label">Hình thức</label>
                          <input type="text" className="admin-input" value={round.format || ''} onChange={e => setRoundsData(prev => prev.map(r => r.id === round.id ? {...r, format: e.target.value} : r))} />
                        </div>
                        <div>
                          <label className="admin-label">Thời hạn / Thời gian</label>
                          <input type="text" className="admin-input" value={round.deadline || ''} onChange={e => setRoundsData(prev => prev.map(r => r.id === round.id ? {...r, deadline: e.target.value} : r))} />
                        </div>
                      </div>
                      <div>
                        <label className="admin-label">Nội dung chi tiết</label>
                        <textarea className="admin-input" rows={3} value={round.content || ''} onChange={e => setRoundsData(prev => prev.map(r => r.id === round.id ? {...r, content: e.target.value} : r))} />
                      </div>
                      <div>
                        <label className="admin-label">Yêu cầu / Tiêu chí</label>
                        <textarea className="admin-input" rows={2} value={round.requirements || ''} onChange={e => setRoundsData(prev => prev.map(r => r.id === round.id ? {...r, requirements: e.target.value} : r))} />
                      </div>
                      <button className="btn btn-primary" style={{width: 'fit-content'}} onClick={async () => {
                        const { error } = await supabase.from('rounds').update({
                          title: round.title,
                          highlight_steps: round.highlight_steps,
                          format: round.format,
                          deadline: round.deadline,
                          content: round.content,
                          requirements: round.requirements
                        }).eq('id', round.id);
                        if (error) alert('Lỗi: ' + error.message);
                        else alert('✅ Đã lưu ' + round.title);
                      }}>💾 Lưu {round.title}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chatlog' && (
          <div className="fade-in">
            <h2 className="text-secondary mb-6">💬 Lịch Sử Chat AI</h2>
            <p style={{fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem'}}>Xem các cuộc trò chuyện của học sinh với Chatbot AI. Mỗi phiên (session) là 1 cuộc hội thoại.</p>

            {chatLogs.length === 0 ? (
              <div className="admin-card card glass" style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>💬</div>
                <p>Chưa có cuộc trò chuyện nào được ghi lại.</p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                {chatLogs.map((s, idx) => (
                  <div key={s.session_id} className="admin-card card glass" style={{padding: '0.8rem 1rem', cursor: 'pointer', borderLeft: selectedSession === s.session_id ? '4px solid #22c55e' : '4px solid transparent', transition: 'all 0.2s'}}>
                    <div onClick={async () => {
                      if (selectedSession === s.session_id) { setSelectedSession(null); setChatSessionMessages([]); return; }
                      setSelectedSession(s.session_id);
                      const { data } = await supabase.from('chat_logs').select('*').eq('session_id', s.session_id).order('created_at', { ascending: true });
                      setChatSessionMessages(data || []);
                    }} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <div style={{fontWeight: 700, fontSize: '0.85rem', color: '#334155'}}>Phiên #{chatLogs.length - idx}</div>
                        <div style={{fontSize: '0.72rem', color: '#94a3b8'}}>{new Date(s.started).toLocaleString('vi-VN')} • {s.count} tin nhắn</div>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <span style={{fontSize: '0.7rem', background: '#f0fdf4', color: '#059669', padding: '0.15rem 0.5rem', borderRadius: '8px', fontWeight: 600}}>{Math.ceil(s.count / 2)} câu hỏi</span>
                        <button onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm('Xóa phiên chat này?')) return;
                          await supabase.from('chat_logs').delete().eq('session_id', s.session_id);
                          setChatLogs(chatLogs.filter(c => c.session_id !== s.session_id));
                          if (selectedSession === s.session_id) { setSelectedSession(null); setChatSessionMessages([]); }
                        }} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem', padding: '0.2rem 0.4rem'}}>🗑️</button>
                      </div>
                    </div>

                    {selectedSession === s.session_id && chatSessionMessages.length > 0 && (
                      <div style={{marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '400px', overflowY: 'auto'}}>
                        {chatSessionMessages.map((m) => (
                          <div key={m.id} style={{display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'}}>
                            <div style={{
                              maxWidth: '80%', padding: '0.5rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', lineHeight: 1.5,
                              background: m.role === 'user' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#f1f5f9',
                              color: m.role === 'user' ? 'white' : '#334155',
                            }}>
                              <div style={{fontSize: '0.6rem', color: m.role === 'user' ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginBottom: '0.15rem'}}>{m.role === 'user' ? '👤 Học sinh' : '🤖 AI'} • {new Date(m.created_at).toLocaleTimeString('vi-VN')}</div>
                              {m.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

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
