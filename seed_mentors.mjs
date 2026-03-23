import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://goxemgrlabpzxoxuxzbd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveGVtZ3JsYWJwenhveHV4emJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzg5MzksImV4cCI6MjA4OTg1NDkzOX0.0Zd5rco7w7vOvKGIF6DoLbgfrd-An6qICUuaOQBmPVY'
);

const mentors = [
  { name: 'Cô Nguyễn Thị Lan Anh (Hóa)', field: 'Science', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Thầy Phạm Minh Đức', field: 'Science', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Cô Nguyễn Thị Oanh', field: 'Science', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Thầy Nguyễn Nhật Hoàng', field: 'Technology', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Cô Nguyễn Ngọc Ánh', field: 'Technology', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Cô Ngô Thu Hằng', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Cô Hoàng Thị Thùy Linh', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Cô Vũ Thị Phương Thảo', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Cô Trần Phương Thảo', field: 'Engineering', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Cô Nguyễn Hồng Loan', field: 'Mathematics', bio: 'Nhận tối đa 04 đội thi.' },
  { name: 'Thầy Phạm Minh Hiếu', field: 'Mathematics', bio: 'Nhận tối đa 04 đội thi.' },
];

async function seed() {
  // Xóa dữ liệu test cũ trước
  await supabase.from('mentors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const { data, error } = await supabase.from('mentors').insert(mentors);
  if (error) {
    console.error('Lỗi:', error.message);
  } else {
    console.log('✅ Đã nạp thành công 11 mentor vào Supabase!');
  }
}

seed();
