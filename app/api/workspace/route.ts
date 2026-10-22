import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  // Yahan hum Service Role Key use kar rahe hain
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    const { data: { user }, error: authError } = await supabase.auth.getUser(token || undefined);
    if (authError || !user) return NextResponse.json({ success: false, error: "Unauthorized: Invalid Token" }, { status: 401 });

    const body = await request.json();
    
    const { error } = await supabase
      .from('bid_workspace')
      .upsert({
        user_id: user.id,
        tender_id: body.tender_id,
        title: body.title,
        org_name: body.org_name,
        value: body.value,
        closing_date: body.closing_date,
        status: body.status || 'Review',
        checklist: body.checklist || { emd: false, docs: false, jv: false }
      }, { onConflict: 'user_id,tender_id' });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Saved to Workspace!" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    const { data: { user } } = await supabase.auth.getUser(token || undefined);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from('bid_workspace')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ success: false, error: error.message });
    return NextResponse.json({ success: true, workspace: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
