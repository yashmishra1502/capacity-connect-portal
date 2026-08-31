import { supabase } from "./supabaseClient";

export type FeatureCard = {
  id: string;
  tag: string;
  title: string;
  description: string;
  image_url: string | null;
  storage_path: string | null;
  display_order: number;
  created_at: string;
};

const BUCKET = "feature-images";
const TABLE = "feature_cards";

export async function fetchFeatureCards(): Promise<FeatureCard[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

async function uploadImage(file: File): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: urlData.publicUrl, path };
}

/** Create a new feature card. Image is optional — falls back to a generic icon on the site. */
export async function addFeatureCard(input: {
  tag: string;
  title: string;
  description: string;
  file?: File | null;
}): Promise<FeatureCard> {
  let image_url: string | null = null;
  let storage_path: string | null = null;

  if (input.file) {
    const uploaded = await uploadImage(input.file);
    image_url = uploaded.url;
    storage_path = uploaded.path;
  }

  const existing = await fetchFeatureCards();
  const nextOrder = existing.length
    ? Math.max(...existing.map((c) => c.display_order)) + 1
    : 0;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      tag: input.tag,
      title: input.title,
      description: input.description,
      image_url,
      storage_path,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return data as FeatureCard;
}

/** Update tag/title/description text without touching the image. */
export async function updateFeatureCardText(
  id: string,
  fields: { tag: string; title: string; description: string }
): Promise<void> {
  const { error } = await supabase.from(TABLE).update(fields).eq("id", id);
  if (error) throw error;
}

/** Upload a new image and attach it to an existing card, replacing any previous one. */
export async function replaceFeatureCardImage(card: FeatureCard, file: File): Promise<FeatureCard> {
  const uploaded = await uploadImage(file);

  const { data, error } = await supabase
    .from(TABLE)
    .update({ image_url: uploaded.url, storage_path: uploaded.path })
    .eq("id", card.id)
    .select()
    .single();
  if (error) throw error;

  if (card.storage_path) {
    await supabase.storage.from(BUCKET).remove([card.storage_path]).catch(() => {});
  }

  return data as FeatureCard;
}

/** Remove the image only, reverting the card to the generic icon fallback. */
export async function clearFeatureCardImage(card: FeatureCard): Promise<void> {
  if (card.storage_path) {
    await supabase.storage.from(BUCKET).remove([card.storage_path]).catch(() => {});
  }
  const { error } = await supabase
    .from(TABLE)
    .update({ image_url: null, storage_path: null })
    .eq("id", card.id);
  if (error) throw error;
}

export async function deleteFeatureCard(card: FeatureCard): Promise<void> {
  if (card.storage_path) {
    await supabase.storage.from(BUCKET).remove([card.storage_path]).catch(() => {});
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", card.id);
  if (error) throw error;
}

export async function reorderFeatureCards(items: { id: string; display_order: number }[]): Promise<void> {
  await Promise.all(
    items.map((it) =>
      supabase.from(TABLE).update({ display_order: it.display_order }).eq("id", it.id)
    )
  );
}
