import { supabase } from "./supabaseClient";

export type DepartmentLogo = {
  id: string;
  name: string;
  logo_url: string;
  storage_path: string;
  display_order: number;
  created_at: string;
};

const BUCKET = "department-logos";
const TABLE = "department_logos";

/** Fetch all logos, ordered for display in the carousel / admin list. */
export async function fetchLogos(): Promise<DepartmentLogo[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Upload an image file to storage and create the matching DB row. */
export async function addLogo(file: File, name: string): Promise<DepartmentLogo> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // put new logos at the end of the current order
  const existing = await fetchLogos();
  const nextOrder = existing.length
    ? Math.max(...existing.map((l) => l.display_order)) + 1
    : 0;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name,
      logo_url: urlData.publicUrl,
      storage_path: path,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DepartmentLogo;
}

/** Rename a department without touching its image. */
export async function updateLogoName(id: string, name: string): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ name }).eq("id", id);
  if (error) throw error;
}

/** Replace the image for an existing row (keeps the same name/order). */
export async function replaceLogoImage(logo: DepartmentLogo, file: File): Promise<DepartmentLogo> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from(TABLE)
    .update({ logo_url: urlData.publicUrl, storage_path: path })
    .eq("id", logo.id)
    .select()
    .single();
  if (error) throw error;

  // best-effort cleanup of the old file; ignore failures
  await supabase.storage.from(BUCKET).remove([logo.storage_path]).catch(() => {});

  return data as DepartmentLogo;
}

/** Delete a logo (both the DB row and the stored image). */
export async function deleteLogo(logo: DepartmentLogo): Promise<void> {
  await supabase.storage.from(BUCKET).remove([logo.storage_path]);
  const { error } = await supabase.from(TABLE).delete().eq("id", logo.id);
  if (error) throw error;
}

/** Persist a new display order after drag/move reordering. */
export async function reorderLogos(items: { id: string; display_order: number }[]): Promise<void> {
  await Promise.all(
    items.map((it) =>
      supabase.from(TABLE).update({ display_order: it.display_order }).eq("id", it.id)
    )
  );
}
