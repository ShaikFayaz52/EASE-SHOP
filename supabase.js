// Supabase client initialization (module)
import { createClient }
 from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace these placeholders with your Supabase project's values.
// Note: for client-side apps the anon key is public; keep row-level security
// and policies in Supabase configured appropriately.
const SUPABASE_URL = 'https://pltffzieycnedbbwtvld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdGZmemlleWNuZWRiYnd0dmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Njk5MjIsImV4cCI6MjA5NDE0NTkyMn0.QqCostY9Wu4zCE23GmkNRO8nFxWPKe0unDYBQKcgx2Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;
