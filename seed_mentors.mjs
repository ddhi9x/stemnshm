import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://goxemgrlabpzxoxuxzbd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveGVtZ3JsYWJwenhveHV4emJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzg5MzksImV4cCI6MjA4OTg1NDkzOX0.0Zd5rco7w7vOvKGIF6DoLbgfrd-An6qICUuaOQBmPVY'
);

async function test() {
  // Try to read slogan column
  const { data, error } = await supabase.from('mentors').select('slogan').limit(1);
  if (error) {
    console.log('❌ Cột slogan chưa tồn tại. Cần chạy SQL:');
    console.log(`ALTER TABLE mentors ADD COLUMN slogan TEXT;`);
  } else {
    console.log('✅ Cột slogan đã tồn tại!');
  }
}
test();
