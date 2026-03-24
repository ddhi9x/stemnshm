import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://goxemgrlabpzxoxuxzbd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveGVtZ3JsYWJwenhveHV4emJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzg5MzksImV4cCI6MjA4OTg1NDkzOX0.0Zd5rco7w7vOvKGIF6DoLbgfrd-An6qICUuaOQBmPVY'
);

async function reorder() {
  // Correct chronological order:
  // 1: Truyền thông & Đăng ký (Tháng 03)
  // 2: Gặp gỡ Mentor lần 1 (30.03)
  // 3: Nộp Sản Phẩm Sơ Loại (06.04)
  // 4: Công Bố Chung Kết (08.04)
  // 5: Gặp gỡ Mentor lần 2 (09-10.04) -- was id 6
  // 6: Gặp gỡ Mentor lần 3 (16-17.04) -- was id 7
  // 7: NGÀY HỘI QUYẾT ĐẤU (22.04) -- was id 5

  // Move id 5 (Ngày Hội) to id 8, then update 6->5, 7->6, 8->7
  // Since primary key, we need to delete and re-insert all

  // Delete id 5,6,7
  await supabase.from('timeline').delete().in('id', [5, 6, 7]);
  
  // Re-insert in correct order
  const { data, error } = await supabase.from('timeline').insert([
    { id: 5, date: '09-10.04.2026', title: 'Gặp gỡ Mentor (Lần 2)', desc: 'Trao đổi tiến độ, chỉnh sửa thiết kế và hoàn thiện ý tưởng sản phẩm.' },
    { id: 6, date: '16-17.04.2026', title: 'Gặp gỡ Mentor (Lần 3)', desc: 'Rà soát lần cuối, hoàn thiện sản phẩm/mô hình và chuẩn bị cho Ngày Hội.' },
    { id: 7, date: '22.04.2026', title: 'NGÀY HỘI QUYẾT ĐẤU', desc: 'Trưng bày gian hàng, bảo vệ mô hình và tham gia 5 trạm thi đấu.' },
  ]).select();
  
  if (error) console.error('Lỗi:', error.message);
  else {
    console.log('✅ Đã sắp xếp lại timeline:');
    const { data: all } = await supabase.from('timeline').select('*').order('id');
    all.forEach(t => console.log(`  ${t.id}: ${t.date} - ${t.title}`));
  }
}

reorder();
