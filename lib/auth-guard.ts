import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function verifyAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return { error: 'No authorization header', status: 401 };

  const token = authHeader.replace('Bearer ', '');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }
  
  return { user };
}
