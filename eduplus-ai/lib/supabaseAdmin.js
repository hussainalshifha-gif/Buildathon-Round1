import { createClient } from '@supabase/supabase-js';

/**
 * IMPORTANT: this client uses the SERVICE ROLE key, which bypasses RLS.
 * It must only ever be imported inside app/api/** route handlers
 * (server-side). Never import this file in a 'use client' component,
 * or you'd leak the service role key to the browser.
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
