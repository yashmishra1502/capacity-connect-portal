import { supabase } from './supabaseClient';

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  dept: string;
  role: 'trainee' | 'trainer' | 'admin';
}

export const register = async ({ email, password, name, dept, role }: RegisterParams) => {
  // 1. Create account in Supabase Auth (passes metadata to our SQL trigger)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, dept, role }
    }
  });

  if (error) throw new Error(error.message);

  // 2. Create an explicit entry in the approvals table for admin review
  if (role !== 'admin' && data.user) {
    await supabase.from('approvals').insert({
      user_id: data.user.id,
      type: `${role.toUpperCase()}_SIGNUP`,
      subject: `New ${role} registration request from ${name}`,
      priority: 'medium',
      status: 'pending'
    });
  }

  return data;
};

export const login = async (email: string, password: string, expectedRole: string) => {
  // 1. Authenticate with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // 2. Fetch profile from database to verify status and role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    throw new Error('User profile not found.');
  }

  // 3. Prevent role mismatches (e.g., Trainee trying to use Admin portal)
  if (profile.role !== expectedRole) {
    await supabase.auth.signOut();
    throw new Error(`Unauthorized. You cannot log in as ${expectedRole}.`);
  }

  // 4. Enforce Admin approval check
  if (profile.status === 'pending') {
    await supabase.auth.signOut();
    throw new Error('Your account is pending approval from an Admin.');
  }

  if (profile.status === 'suspended') {
    await supabase.auth.signOut();
    throw new Error('Your account has been suspended.');
  }

  return { session: data.session, profile };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
