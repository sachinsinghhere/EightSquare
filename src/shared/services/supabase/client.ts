
import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://crrlsrfsdtibisgcyies.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycmxzcmZzZHRpYmlzZ2N5aWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDMyOTEsImV4cCI6MjA1NTc3OTI5MX0.rYHPutiagc6rrY8dsZvZAVY3c3KBzlQbO5tMowKXttw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
