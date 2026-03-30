# TỔNG QUAN DỰ ÁN WESBITE "NGÀY HỘI STEM - NGÔI SAO HOÀNG MAI"

## 1. Thông Tin Chung
*   **Tên sự kiện:** Ngày Hội STEM — Kiến Tạo Thế Giới Xanh (Mùa giải 2025-2026)
*   **Đơn vị tổ chức:** Trường Liên cấp Tiểu học - THCS - THPT Ngôi Sao Hoàng Mai (Hà Nội)
*   **Ngày diễn ra (Dự kiến):** 22/04/2026
*   **Mục tiêu:** Tạo sân chơi khoa học, công nghệ, kỹ thuật và toán học cho học sinh, với trọng tâm là các giải pháp bảo vệ môi trường, năng lượng tái tạo và phát triển bền vững.
*   **Đối tượng tham gia:** Học sinh trường Ngôi Sao Hoàng Mai.

## 2. Các Lĩnh Vực Thi Đấu (S.T.E.M)
Cuộc thi được chia thành 4 lĩnh vực cốt lõi để học sinh tự do sáng tạo định hướng "Thế Giới Xanh":
1.  **Science (Khoa học):** Khoa học sự sống, khoa học môi trường, hóa học ứng dụng, nghiên cứu năng lượng tái tạo, vật liệu phân hủy sinh học, chế phẩm sinh học.
2.  **Technology (Công nghệ):** Ứng dụng lập trình, phần mềm, ứng dụng di động (App), Trí tuệ nhân tạo (AI), Internet vạn vật (IoT) vào các giải pháp xanh (ví dụ: thùng rác thông minh, app theo dõi khí hậu).
3.  **Engineering (Kỹ thuật):** Thiết kế, chế tạo máy móc, mô hình tự động hóa, robot, giải pháp kỹ thuật bảo vệ môi trường (ví dụ: robot dọn rác, máy lọc nước mini).
4.  **Mathematics (Toán học):** Mô hình hóa toán học, thống kê, vẽ biểu đồ, phân tích dữ liệu, thuật toán tối ưu hóa nhằm giải quyết vấn đề môi trường.

## 3. Hoạt Động Khác & Trải Nghiệm
*   **Passport STEM (Gamification):** Học sinh được phát 1 cuốn hộ chiếu (Passport). Tham gia trải nghiệm tại các trạm để thu thập con dấu (Stamp). Vượt qua 8 trạm (5 trạm trải nghiệm + 3 trạm dự thi) sẽ đạt điều kiện tham gia vòng Quay Số May Mắn.
    *   *5 Trạm trải nghiệm:* Trạm Khoa học, Trạm Công nghệ, Trạm Toán học, Trạm Robotic, Trạm Mộc.
    *   *3 Trạm dự thi:* Gian hàng dự thi Science/Tech, Gian hàng Engineering/Math, Trạm Bình chọn dự án được yêu thích nhất.

## 4. Tính Năng Chính Của Website
Website đóng vai trò là cổng thông tin điện tử duy nhất và chính thức cho toàn bộ học sinh và giáo viên trong suốt quá trình trước, trong và sau sự kiện:
*   **Trang Chủ:** Banner sự kiện, đồng hồ đếm ngược, tổng quan 4 lĩnh vực STEM, các nút kêu gọi hành động (Call To Action: Đăng ký, Nộp bài, Tải file HD).
*   **Giới Thiệu:** Thông điệp, đối tượng, hình thức tổ chức.
*   **Lịch Trình (Timeline):** Cập nhật theo thời gian thực tiến độ sự kiện từ lúc đăng ký đến ngày chung kết.
*   **Vòng Thi:** Thể lệ chi tiết các vòng thi.
*   **Mentor (Cố vấn):** Danh sách profile các thầy cô hỗ trợ học sinh.
*   **Tin Tức & Thông Báo:** Bảng tin cập nhật nhanh các thông tin quan trọng. Có tính năng đếm lượt xem (Views).
*   **FAQ:** Giải đáp các thắc mắc chung.
*   **Thư Viện Ảnh (Gallery):** Lưu giữ hình ảnh qua các mùa giải trước.
*   **Trang Quản Trị (Admin Dashboard):**
    *   Quản lý toàn bộ nội dung động (Lịch trình, Tin tức, Mentor, Cài đặt chung, v.v.) qua giao diện thân thiện, không cần sửa code.
    *   Theo dõi thống kê lượt xem tin tức, lượt click các nút Đăng ký, Nộp bài.
*   **Chatbot Trợ lý AI (Tích hợp Gemini):**
    *   Sử dụng AI tiên tiến của Google (Gemini Flash).
    *   Được cấu hình để tư vấn chuyên sâu về sự kiện, trả lời thông tin lịch trình, quy định.
    *   **Đặc biệt:** AI hỗ trợ đóng vai trò làm *Coach (Huấn luyện viên)*, gợi ý đề tài nghiên cứu STEM, hướng dẫn cách làm thuyết trình PPT, cách xây dựng mô hình.

## 5. Technology Stack (Công Nghệ Sử Dụng)
*   **Frontend:** ReactJS (Vite framework), React Router v6.
*   **Styling:** CSS thuần, Tailwind CSS (qua các utility classes), Lucide Icons.
*   **Backend & Database:** Supabase (PostgreSQL, Storage, Auth, Edge Functions, RPC).
*   **AI Integration:** Google Gemini API (model `gemini-2.5-flash` hoặc các bản cập nhật mới nhất)
*   **Hosting:** Vercel / Netlify.
*   **Đa Ngôn Ngữ:** Tuỳ chỉnh i18n hỗ trợ VN/EN/ZH (nếu cần thiết).
