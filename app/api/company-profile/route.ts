import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (new user)
    return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true, profile: data || null });
}

export async function POST(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  
  const { error } = await supabase
    .from('company_profiles')
    .upsert({
      user_id: user.id,
      company_name: body.company_name,
      gstin: body.gstin,
      pan: body.pan,
      msme: body.msme,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: "Profile saved successfully!" });
}
