import { supabase } from './supabaseClient';

// --- COURSES ---
export const fetchCourses = async () => {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw error;
  return data;
};

export const fetchCourseById = async (id: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*, course_modules(*), resources(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// --- APPROVALS (For Admin Dashboard) ---
export const fetchPendingApprovals = async () => {
  const { data, error } = await supabase
    .from('approvals')
    .select('*, profiles(*)')
    .eq('status', 'pending');
  if (error) throw error;
  return data;
};

export const approveUserRequest = async (approvalId: string, userId: string) => {
  // 1. Activate profile status
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', userId);
  if (profileError) throw profileError;

  // 2. Mark approval request as approved
  const { error: approvalError } = await supabase
    .from('approvals')
    .update({ status: 'approved' })
    .eq('id', approvalId);
  if (approvalError) throw approvalError;
};

export const rejectUserRequest = async (approvalId: string, userId: string) => {
  // 1. Suspend profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ status: 'suspended' })
    .eq('id', userId);
  if (profileError) throw profileError;

  // 2. Mark approval request as rejected
  const { error: approvalError } = await supabase
    .from('approvals')
    .update({ status: 'rejected' })
    .eq('id', approvalId);
  if (approvalError) throw approvalError;
};

// --- CERTIFICATES & RESULTS (For Trainee Dashboard) ---
export const fetchUserCertificates = async (traineeId: string) => {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, courses(*)')
    .eq('trainee_id', traineeId);
  if (error) throw error;
  return data;
};

export const fetchUserResults = async (traineeId: string) => {
  const { data, error } = await supabase
    .from('results')
    .select('*, assessments(*)')
    .eq('trainee_id', traineeId);
  if (error) throw error;
  return data;
};

// --- ANNOUNCEMENTS & NOTIFICATIONS ---
export const fetchAnnouncements = async () => {
  const { data, error } = await supabase.from('announcements').select('*');
  if (error) throw error;
  return data;
};

export const fetchUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
};
