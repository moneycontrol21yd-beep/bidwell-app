import { supabase } from "./supabase";

export async function logAction(action: string, resource: string) {
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from("audit_logs").insert({
      user_id: data?.user?.id,
      action,
      resource,
    });
  } catch (e) {
    console.log("Audit log failed:", e);
  }
}
