import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { initialData } from '../data/mockData';

const About = () => {
  const [aboutData, setAboutData] = useState(initialData.about);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data } = await supabase.from('about').select('*').single();
      if (data) setAboutData(data);
    };
    fetchAbout();
  }, []);

  if (!aboutData) return <div className="container py-20">Loading...</div>;

  // Parse bullet items from text (one per line)
  const parseItems = (text) => {
    if (!text) return [];
    return text.split('\n').map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  };

  return (
    <div className="container py-20 animate-fade-in" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="text-center mb-12">
        <div className="badge mb-4">Mùa Giải 2025-2026</div>
        <h1 className="section-title text-gradient">Giới Thiệu Ngày Hội STEM</h1>
        <p className="text-muted text-lg">Khơi dậy đam mê khoa học và công nghệ môi trường</p>
      </div>

      <div className="card glass mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
        <h2 className="mb-4 text-green-gradient">1. Thông điệp và Mục tiêu</h2>
        <p className="mb-4">
          <strong className="text-nshm">Chủ đề:</strong> <span className="font-bold">{aboutData.message}</span>
        </p>
        <p className="mb-4">
          <strong className="text-nshm">Trọng tâm:</strong> {aboutData.focus}
        </p>
        <p>
          <strong className="text-nshm">Mục tiêu:</strong> {aboutData.objective || 'Khám phá đam mê, thúc đẩy tinh thần sáng tạo, và định hướng học sinh áp dụng kiến thức đa phân môn để giải quyết vấn đề xã hội.'}
        </p>
      </div>

      <div className="card glass mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
        <h2 className="mb-4 text-green-gradient">2. Đối tượng & Hình thức thi</h2>
        <ul className="list-disc pl-5 mb-4" style={{lineHeight: '1.8'}}>
          <li><strong className="text-nshm">Đối tượng:</strong> {aboutData.target}</li>
          <li><strong className="text-nshm">Hình thức:</strong> {aboutData.format}</li>
          <li><strong className="text-nshm">4 Lĩnh vực chính:</strong>
            <ul className="pl-6 text-muted" style={{listStyleType: 'circle'}}>
              <li><strong>Science:</strong> {aboutData.stem_s || 'Thí nghiệm khoa học; thiết kế mô hình, hệ thống về khoa học'}</li>
              <li><strong>Technology:</strong> {aboutData.stem_t || 'Ứng dụng lập trình; ứng dụng phần mềm'}</li>
              <li><strong>Engineering:</strong> {aboutData.stem_e || 'Xây dựng mô hình, giải pháp thiết kế sáng tạo'}</li>
              <li><strong>Mathematics:</strong> {aboutData.stem_m || 'Ứng dụng toán học trong thực tế'}</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="card glass animate-fade-in" style={{animationDelay: '0.3s'}}>
        <h2 className="mb-4 text-green-gradient">3. Cấu trúc 2 vòng thi</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl block-shadow border-l-4 border-primary">
            <h3 className="text-lg mb-2 text-primary">{aboutData.round1_title || 'Vòng Sơ Loại'}</h3>
            <p className="text-sm text-muted font-bold mb-3">{aboutData.round1_desc || 'Hồ sơ ý tưởng & Slideshow'}</p>
            <ul className="text-sm pl-4 text-muted">
              {parseItems(aboutData.round1_items || 'Mô tả ý tưởng, tính khả thi\nVẽ sơ đồ thiết kế nháp\nChọn Mentor bảo trợ kỹ thuật').map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-5 rounded-xl block-shadow border-l-4 border-secondary">
            <h3 className="text-lg mb-2 text-secondary">{aboutData.round2_title || 'Vòng Chung Kết'}</h3>
            <p className="text-sm text-muted font-bold mb-3">{aboutData.round2_desc || 'STEM Day Exhibition'}</p>
            <ul className="text-sm pl-4 text-muted">
              {parseItems(aboutData.round2_items || 'Hoàn thiện Sản phẩm/Mô hình thật\nChuẩn bị Poster triển lãm\nThuyết trình & demo biểu diễn').map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
