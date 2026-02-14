// Supabase client initialization (module)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace these placeholders with your Supabase project's values.
// Note: for client-side apps the anon key is public; keep row-level security
// and policies in Supabase configured appropriately.
const SUPABASE_URL = 'https://qafoyzymytmkglksynrr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZm95enlteXRta2dsa3N5bnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjAwODUsImV4cCI6MjA4NjYzNjA4NX0.xHdQPR5-8fSpB2woFVNcS6_LLgVvIrvnmQbPCE3FvX0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;

// Example helper (optional): fetch a public "products" table
export async function loadProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}

// expose helper for non-module scripts
window.loadProducts = loadProducts;
