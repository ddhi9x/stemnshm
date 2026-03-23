export const initialData = {
  timelines: [
    { id: 1, title: 'Phát động cuộc thi', date: '23/03/2025', status: 'done' },
    { id: 2, title: 'Mở đăng ký', date: '25/03/2025', status: 'active' },
    { id: 3, title: 'Nộp sơ loại', date: '06/04/2025', status: 'pending' },
    { id: 4, title: 'Ngày hội STEM', date: '15/05/2025', status: 'pending' },
  ],
  mentors: [
    { id: 1, name: 'Cô Nguyễn Thị Lan Anh (Hóa)', field: 'Science', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 2, name: 'Thầy Phạm Minh Đức', field: 'Science', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 3, name: 'Cô Nguyễn Thị Oanh', field: 'Science', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 4, name: 'Thầy Nguyễn Nhật Hoàng', field: 'Technology', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 5, name: 'Cô Nguyễn Ngọc Ánh', field: 'Technology', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 6, name: 'Cô Ngô Thu Hằng', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 7, name: 'Cô Hoàng Thị Thùy Linh', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 8, name: 'Cô Vũ Thị Phương Thảo', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 9, name: 'Cô Trần Phương Thảo', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 10, name: 'Cô Nguyễn Hồng Loan', field: 'Mathematics', bio: 'Nhận tối đa 04 đội thi.' },
    { id: 11, name: 'Thầy Phạm Minh Hiếu', field: 'Mathematics', bio: 'Nhận tối đa 04 đội thi.' },
  ],
  news: [
    { id: 1, title: 'Chính thức mở cổng đăng ký STEM Day 2025', summary: 'Học sinh từ khối 6-8 có thể bắt đầu lập đội...', date: '25/03/2025' }
  ],
  faqs: [
    { id: 1, question: 'Em đăng ký cá nhân hay nhóm?', answer: 'Có thể đăng ký cá nhân hoặc nhóm tối đa 3 bạn.' },
    { id: 2, question: 'Sản phẩm có cần chạy được không?', answer: 'Khuyến khích có mô hình chạy được, hoặc ít nhất là sa bàn mô phỏng thực tế.' }
  ],
  about: {
    message: "Chủ đề: STEM kiến tạo thế giới xanh",
    focus: "Sáng tạo giải pháp và sản phẩm STEM hướng tới bảo vệ môi trường, có tính ứng dụng cao, đồng thời tạo ra không gian trải nghiệm học thật - làm thật cho học sinh toàn trường.",
    target: "Toàn bộ học sinh khối 6, 7, 8 của Trường Ngôi Sao Hoàng Mai.",
    format: "Đăng ký theo nhóm (tối đa 3-5 thành viên) hoặc cá nhân.",
  },
  links: {
    register: "https://ngoisaocaohanoi.edu.vn",
    submit: "#"
  },
  timeline: [
    { id: 1, date: "Tháng 03.2026", title: "Truyền thông & Đăng ký", desc: "Công bố thể lệ, mở cổng đăng ký trực tuyến cho các đội thi khối THCS." },
    { id: 2, date: "30.03.2026", title: "Gặp gỡ Mentor", desc: "Lên ý tưởng, bản vẽ thiết kết kỹ thuật và nộp dự án vòng thử nghiệm." },
    { id: 3, date: "06.04.2026", title: "Nộp Sản Phẩm Sơ Loại", desc: "Hạn chót nộp bản trình bày ý tưởng (PowerPoint) lên hệ thống của Nhà trường." },
    { id: 4, date: "08.04.2026", title: "Công Bố Chung Kết", desc: "Chốt danh sách các đội thi xuất sắc lọt vào điểm xuất phát cuối cùng." },
    { id: 5, date: "22.04.2026", title: "NGÀY HỘI QUYẾT ĐẤU", desc: "Trưng bày gian hàng, bảo vệ mô hình và tham gia 5 trạm thi đấu." }
  ],
  awards: [
    { id: 'nhat', title: 'GIẢI NHẤT', qty: '1 Giải', value: 'Huy chương vàng + Giấy khen', color: '#fbbf24', bg: '#fffbeb' },
    { id: 'nhi', title: 'GIẢI NHÌ', qty: '2 Giải', value: 'Huy chương bạc + Giấy khen', color: '#94a3b8', bg: '#f8fafc' },
    { id: 'ba', title: 'GIẢI BA', qty: '3 Giải', value: 'Huy chương đồng + Giấy khen', color: '#f97316', bg: '#fff7ed' },
    { id: 'kk', title: 'GIẢI KHUYẾN KHÍCH', qty: '5 Giải', value: 'Giấy chứng nhận', color: '#3b82f6', bg: '#eff6ff' },
    { id: 'phu', title: 'GIẢI SÁNG TẠO', qty: 'Nhiều giải', value: 'Quà tặng hiện vật', color: '#10b981', bg: '#ecfdf5' }
  ]
};

export const getLocalData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initialData[key];
};

export const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
