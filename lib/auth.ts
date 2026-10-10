import { supabase } from "./supabase";

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function signOutAllDevices() {
  const { error } = await supabase.auth.signOut({ scope: "global" });
  return { error };
}

export async function changePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
