-- Bạn hãy copy toàn bộ đoạn mã này và dán vào mục SQL EDITOR trên Supabase để chạy nhé.
-- Nó sẽ tự động tạo đủ cấu trúc bảng cho trang web của mình!

-- Bảng Tin Tức
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  date text,
  image text,
  created_at timestamp with time zone DEFAULT now()
);

-- Bảng Mentors
CREATE TABLE IF NOT EXISTS mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  field text,
  bio text,
  image text,
  created_at timestamp with time zone DEFAULT now()
);

-- Bảng Giới thiệu
CREATE TABLE IF NOT EXISTS about (
  id integer PRIMARY KEY DEFAULT 1,
  message text,
  focus text,
  target text,
  format text
);

-- Bảng Giải Thưởng
CREATE TABLE IF NOT EXISTS awards (
  id text PRIMARY KEY,
  title text,
  qty text,
  value text,
  color text,
  bg text
);

-- Bảng Hành trình - Timeline
CREATE TABLE IF NOT EXISTS timeline (
  id integer PRIMARY KEY,
  date text,
  title text,
  "desc" text -- Sử dụng ngoặc kép vì desc là từ khóa
);

-- Bảng Links đăng ký
CREATE TABLE IF NOT EXISTS links (
  id integer PRIMARY KEY DEFAULT 1,
  register text,
  submit text
);

-- Cấp quyền truy cập Đọc - Ghi công khai (Mô phỏng lại hệ thống đăng nhập bằng mã PIN nội bộ)
-- Bật RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Bảng Cài Đặt Chung (Footer, v.v.)
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  tagline text,
  email text,
  hotline text
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Tạo Policy cho phép mọi người Đọc và Ghi tạm thời
CREATE POLICY "Public Access" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON mentors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON about FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON awards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON timeline FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Chèn dữ liệu mẫu gốc (Seed Data)
INSERT INTO about (id, message, focus, target, format) VALUES 
(1, 'Ngày Hội STEM là không gian trải nghiệm khoa học lớn nhất năm dành riêng cho các bạn học sinh Ngôi Sao Hoàng Mai với chủ đề Hành tinh Xanh.', 'Tập trung vào 4 lĩnh vực trọng tâm: Science (Khoa học sự sống, hóa học), Technology (Lập trình, AI, IoT), Engineering (Chế tạo máy, mô hình 3D), Mathematics (Tối ưu đo lường).', 'Tất cả học sinh khối THCS Ngôi Sao Hoàng Mai có đam mê khám phá và sáng tạo.', 'Cuộc thi diễn ra với 2 vòng: Vòng gửi ý tưởng Bản vẽ/Mô phỏng 3D và Vòng Chung Kết - Trưng bày tại khuôn viên trường.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO links (id, register, submit) VALUES 
(1, 'https://ngoisaocaohanoi.edu.vn', '#')
ON CONFLICT (id) DO NOTHING;

INSERT INTO timeline (id, date, title, "desc") VALUES 
(1, 'Tháng 03.2026', 'Truyền thông & Đăng ký', 'Công bố thể lệ, mở cổng đăng ký trực tuyến cho các đội thi khối THCS.'),
(2, '30.03.2026', 'Gặp gỡ Mentor', 'Lên ý tưởng, bản vẽ thiết kết kỹ thuật và nộp dự án vòng thử nghiệm.'),
(3, '06.04.2026', 'Nộp Sản Phẩm Sơ Loại', 'Hạn chót nộp bản trình bày ý tưởng (PowerPoint) lên hệ thống của Nhà trường.'),
(4, '08.04.2026', 'Công Bố Chung Kết', 'Chốt danh sách các đội thi xuất sắc lọt vào điểm xuất phát cuối cùng.'),
(5, '22.04.2026', 'NGÀY HỘI QUYẾT ĐẤU', 'Trưng bày gian hàng, bảo vệ mô hình và tham gia 5 trạm thi đấu.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO awards (id, title, qty, value, color, bg) VALUES 
('nhat', 'GIẢI NHẤT', '1 Giải', 'Huy chương vàng + Giấy khen', '#fbbf24', '#fffbeb'),
('nhi', 'GIẢI NHÌ', '2 Giải', 'Huy chương bạc + Giấy khen', '#94a3b8', '#f8fafc'),
('ba', 'GIẢI BA', '3 Giải', 'Huy chương đồng + Giấy khen', '#d97706', '#fef3c7'),
('khuyen-khich', 'KHUYẾN KHÍCH', '4 Giải', 'Giấy khen', '#3b82f6', '#eff6ff'),
('sang-tao', 'GIẢI SÁNG TẠO', '2 Giải', 'Giấy khen', '#ec4899', '#fdf2f8')
ON CONFLICT (id) DO NOTHING;

INSERT INTO settings (id, tagline, email, hotline) VALUES 
(1, 'STEM Kiến Tạo Thế Giới Xanh 2025-2026', 'info@ngoisaocaohanoi.edu.vn', '1900 xxxx')
ON CONFLICT (id) DO NOTHING;

-- Seed dữ liệu Mentor có sẵn (để Admin dễ dàng thay ảnh sau)
INSERT INTO mentors (name, field, bio) VALUES
('Cô Nguyễn Thị Lan Anh (Hóa)', 'Science', 'Nhận tối đa 04 đội thi.'),
('Thầy Phạm Minh Đức', 'Science', 'Nhận tối đa 04 đội thi.'),
('Cô Nguyễn Thị Oanh', 'Science', 'Nhận tối đa 04 đội thi.'),
('Thầy Nguyễn Nhật Hoàng', 'Technology', 'Nhận tối đa 04 đội thi.'),
('Cô Nguyễn Ngọc Ánh', 'Technology', 'Nhận tối đa 04 đội thi.'),
('Cô Ngô Thu Hằng', 'Engineering', 'Nhận tối đa 04 đội thi.'),
('Cô Hoàng Thị Thùy Linh', 'Engineering', 'Nhận tối đa 04 đội thi.'),
('Cô Vũ Thị Phương Thảo', 'Engineering', 'Nhận tối đa 04 đội thi.'),
('Cô Trần Phương Thảo', 'Engineering', 'Nhận tối đa 04 đội thi.'),
('Cô Nguyễn Hồng Loan', 'Mathematics', 'Nhận tối đa 04 đội thi.'),
('Thầy Phạm Minh Hiếu', 'Mathematics', 'Nhận tối đa 04 đội thi.');
