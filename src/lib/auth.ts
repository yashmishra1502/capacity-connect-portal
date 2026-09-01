import { supabase } from './supabaseClient';
import type { Role } from './mock-data';

export type AuthResult = { ok: true } | { ok: false; message: string };

export interface Profile {
  id: string;
  name?: string | null;
  email?: string | null;
  dept?: string | null;
  role: Role;
  status?: string | null;
  [key: string]: unknown;
}

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  dept: string;
  role: Role;
}

export const demoCredentials = (role: Role) => {
  switch (role) {
    case 'admin':
      return { email: 'admin@capacityconnect.gov.in', password: 'Admin@123' };
    case 'trainer':
      return { email: 'trainer@capacityconnect.gov.in', password: 'Trainer@123' };
    default:
      return { email: 'trainee@capacityconnect.gov.in', password: 'Trainee@123' };
  }
};

export const register = async ({
  email,
  password,
  name,
  dept,
  role,
}: RegisterParams): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, dept, role } },
  });

  if (error) return { ok: false, message: error.message };

  if (role !== 'admin' && data.user) {
    await supabase.from('approvals').insert({
      user_id: data.user.id,
      type: `${role.toUpperCase()}_SIGNUP`,
      subject: `New ${role} registration request from ${name}`,
      priority: 'medium',
      status: 'pending',
    });
  }

  return { ok: true };
};

export const login = async (
  expectedRole: Role,
  email: string,
  password: string,
): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { ok: false, message: 'User profile not found.' };
  }

  if (profile.role !== expectedRole) {
    await supabase.auth.signOut();
    return { ok: false, message: `Unauthorized. You cannot log in as ${expectedRole}.` };
  }

  if (profile.status === 'pending') {
    await supabase.auth.signOut();
    return { ok: false, message: 'Your account is pending approval from an Admin.' };
  }

  if (profile.status === 'suspended') {
    await supabase.auth.signOut();
    return { ok: false, message: 'Your account has been suspended.' };
  }

  return { ok: true };
};

export const logout = async () => {
  await supabase.auth.signOut();
};
