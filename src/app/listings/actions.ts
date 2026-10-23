"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { listingSchema } from "@/lib/validations/listing";

export type ListingActionState = { error?: string; success?: string };

export async function createListing(
  _: ListingActionState,
  formData: FormData
): Promise<ListingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priceInr: formData.get("priceInr"),
    condition: formData.get("condition"),
    categoryId: formData.get("categoryId"),
    collegeId: formData.get("collegeId") || undefined,
    city: formData.get("city"),
  };

  const parsed = listingSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  // Insert the listing record
  const { data: listing, error: insertError } = await supabase
    .from("listings")
    .insert({
      seller_id: user.id,
      category_id: parsed.data.categoryId,
      college_id: parsed.data.collegeId ? parsed.data.collegeId : null,
      title: parsed.data.title,
      description: parsed.data.description,
      price_inr: parsed.data.priceInr,
      condition: parsed.data.condition,
      city: parsed.data.city,
      status: "active",
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  // Handle Image Upload if provided
  const imageFile = formData.get("image") as File | null;
  const imageUrlFallback = formData.get("imageUrl") as string | null;

  if (imageFile && imageFile.size > 0 && imageFile.name) {
    try {
      const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `${user.id}/${listing.id}/${Date.now()}-${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(storagePath, imageFile, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (!uploadError) {
        await supabase.from("listing_images").insert({
          listing_id: listing.id,
          storage_path: storagePath,
          alt_text: parsed.data.title,
          sort_order: 0,
        });
      }
    } catch {
      // Continue even if image upload encounters an issue
    }
  } else if (imageUrlFallback && imageUrlFallback.trim().startsWith("http")) {
    await supabase.from("listing_images").insert({
      listing_id: listing.id,
      storage_path: imageUrlFallback.trim(),
      alt_text: parsed.data.title,
      sort_order: 0,
    });
  }

  revalidatePath("/");
  revalidatePath("/browse");
  revalidatePath("/account");
  redirect(`/listings/${listing.id}`);
}

export async function markListingStatus(
  listingId: string,
  newStatus: "active" | "sold" | "archived"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase
    .from("listings")
    .update({
      status: newStatus,
      sold_at: newStatus === "sold" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  revalidatePath("/account");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/browse");
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("seller_id", user.id);

  revalidatePath("/account");
  revalidatePath("/browse");
  redirect("/account");
}

export async function toggleWishlist(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if exists
  const { data: existing } = await supabase
    .from("wishlists")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);
  } else {
    await supabase.from("wishlists").insert({
      user_id: user.id,
      listing_id: listingId,
    });
  }

  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/account");
}
