import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://goxemgrlabpzxoxuxzbd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveGVtZ3JsYWJwenhveHV4emJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzg5MzksImV4cCI6MjA4OTg1NDkzOX0.0Zd5rco7w7vOvKGIF6DoLbgfrd-An6qICUuaOQBmPVY'
);

async function setup() {
  // Check if table exists by trying to query
  const { data: existing } = await supabase.from('final_schedule').select('*');
  
  if (existing && existing.length > 0) {
    console.log('✅ Table final_schedule already has data:', existing.length, 'items');
    return;
  }

  // Insert seed data
  const { data, error } = await supabase.from('final_schedule').insert([
    { id: 1, time: '7h30 - 8h30', title: 'Chuẩn bị & Setup', desc: '7h30 - 7h45: Các đội thi trưng bày sản phẩm dự thi dưới sân bóng. Các trạm trải nghiệm setup. 8h25: HS tham gia trải nghiệm di chuyển xuống sân.' },
    { id: 2, time: '8h30 - 9h00', title: 'Khai mạc Ngày Hội', desc: '8h30 - 8h40: Ổn định tổ chức. 8h40 - 9h00: Khai mạc (có các thí nghiệm biểu diễn tạo hứng thú cho HS).' },
    { id: 3, time: '9h00 - 10h00', title: 'Thi đấu & Trải nghiệm', desc: 'Các đội thi thuyết trình về sản phẩm dự thi (2 phút/đội). BGK chấm điểm. HS tham gia 2 hoạt động: tham quan gian hàng ghi chép vào Passport + vượt qua thử thách tại các Trạm Trải nghiệm. Thu thập đủ 8 sticker (5 trạm dự thi + 3 trạm trải nghiệm) để đổi số may mắn.' },
    { id: 4, time: '10h00 - 10h30', title: 'Tổng kết & Trao giải', desc: 'BGK hoàn thành chấm, tính điểm và xếp giải. Công bố giải thưởng, trao giải. Quay số may mắn. Kết thúc chương trình.' },
  ]).select();

  if (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('Bạn cần tạo bảng final_schedule trong Supabase SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS final_schedule (
  id INTEGER PRIMARY KEY,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  desc TEXT
);

ALTER TABLE final_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON final_schedule FOR SELECT USING (true);
CREATE POLICY "Allow all operations" ON final_schedule FOR ALL USING (true) WITH CHECK (true);
    `);
  } else {
    console.log('✅ Đã tạo dữ liệu lịch trình chung kết!', data.length, 'mục');
  }
}

setup();
