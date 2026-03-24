import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://goxemgrlabpzxoxuxzbd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveGVtZ3JsYWJwenhveHV4emJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzg5MzksImV4cCI6MjA4OTg1NDkzOX0.0Zd5rco7w7vOvKGIF6DoLbgfrd-An6qICUuaOQBmPVY'
);

async function test() {
  const { data, error } = await supabase.from('mentors').select('id, name, sort_order');
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
