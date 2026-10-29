import { createClient } from "@supabase/supabase-js";
import { demoApi } from "./demo.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://kptfmbhhrjqhyhcknhxc.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGZtYmhocmpxaHloY2tuaHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTg3NDQsImV4cCI6MjEwODg3NDc0NH0.XnISsfmvwkLSRKqMmOjHSjTYQ1rZwIOPJOW7l36SIig";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function formatProject(p) {
  if (!p) return null;
  const sortedImages = (p.project_images || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const coverObj = sortedImages.find(i => i.is_cover) || sortedImages[0];
  const coverImage = coverObj?.image_url || p.cover_image || "";

  const images = sortedImages.map(img => ({
    id: img.id,
    imageUrl: img.image_url,
    altText: img.alt_text || p.title,
    isCover: Boolean(img.is_cover),
    sortOrder: img.sort_order
  }));

  const plans = (p.project_plans || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(plan => ({
    id: plan.id,
    floorName: plan.floor_name,
    floorNumber: plan.floor_number,
    imageUrl: plan.image_url,
    pdfUrl: plan.pdf_url,
    sortOrder: plan.sort_order
  }));

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.categories?.name || p.category || "Architecture d’Intérieur",
    categoryId: p.category_id || p.categoryId,
    shortDescription: p.short_description || p.shortDescription || "",
    description: p.description || "",
    style: p.style || "Contemporain",
    surface: p.surface ? Number(p.surface) : null,
    landSurface: p.land_surface ? Number(p.land_surface) : null,
    floors: p.floors || 1,
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    garage: Boolean(p.garage),
    location: p.location || "Tunisie",
    model3dUrl: p.model_3d_url || p.model3dUrl || null,
    videoUrl: p.video_url || p.videoUrl || null,
    status: p.status || "published",
    views: Number(p.views || 0),
    coverImage,
    images,
    plans,
    createdAt: p.created_at
  };
}

async function handleGet(path, options = {}) {
  const cleanPath = path.replace(/^\/api/, "").replace(/\/$/, "") || "/";
  const params = options.params || {};

  // 1. Categories
  if (cleanPath === "/categories") {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("id", { ascending: true });
    if (error) throw error;
    return data.map(c => ({ id: c.id, name: c.name, slug: c.slug, description: c.description }));
  }

  // 2. Projects list
  if (cleanPath === "/projects") {
    let query = supabase
      .from("projects")
      .select("*, categories(id, name, slug), project_images(*)", { count: "exact" })
      .eq("status", "published");

    if (params.category) {
      if (!isNaN(Number(params.category))) {
        query = query.eq("category_id", Number(params.category));
      } else {
        const { data: cat } = await supabase.from("categories").select("id").eq("slug", params.category).maybeSingle();
        if (cat) query = query.eq("category_id", cat.id);
      }
    }

    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,short_description.ilike.%${params.search}%`);
    }

    if (params.sort === "views") {
      query = query.order("views", { ascending: false });
    } else if (params.sort === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.max(1, Number(params.limit || 12));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    const projects = (data || []).map(formatProject);
    const total = count ?? projects.length;
    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 3. Project detail
  if (cleanPath.startsWith("/projects/")) {
    const slugOrId = cleanPath.replace("/projects/", "").trim();
    let query = supabase
      .from("projects")
      .select("*, categories(*), project_images(*), project_plans(*)");

    if (!isNaN(Number(slugOrId))) {
      query = query.or(`id.eq.${slugOrId},slug.eq.${slugOrId}`);
    } else {
      query = query.eq("slug", slugOrId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return formatProject(data);
  }

  // 4. Site Settings
  if (cleanPath === "/settings") {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) throw error;
    const settings = {};
    (data || []).forEach(item => {
      settings[item.setting_key] = item.setting_value;
    });
    return settings;
  }

  throw new Error(`Endpoint non géré: ${cleanPath}`);
}

async function handlePost(path, body = {}) {
  const cleanPath = path.replace(/^\/api/, "").replace(/\/$/, "") || "/";

  // 1. Increment Views
  const viewMatch = cleanPath.match(/^\/projects\/(\d+)\/view$/);
  if (viewMatch) {
    const id = Number(viewMatch[1]);
    await supabase.rpc("increment_project_views", { p_id: id });
    return { success: true };
  }

  // 2. Submit Contact Message
  if (cleanPath === "/messages") {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        name: body.name || "",
        email: body.email || "",
        phone: body.phone || null,
        subject: body.subject || null,
        message: body.message || "",
        status: "unread"
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: data.id };
  }

  throw new Error(`POST endpoint non géré: ${cleanPath}`);
}

export const api = {
  async get(url, options = {}) {
    try {
      const data = await handleGet(url, options);
      return { data: { success: true, data }, status: 200 };
    } catch (err) {
      console.warn("Supabase GET error, fallback to demo if available:", err);
      const fallback = demoApi({ method: "get", url, ...options });
      if (fallback !== undefined) {
        return { data: { success: true, data: fallback }, status: 200 };
      }
      throw err;
    }
  },

  async post(url, body = {}, options = {}) {
    try {
      const data = await handlePost(url, body);
      return { data: { success: true, data }, status: 200 };
    } catch (err) {
      console.warn("Supabase POST error, fallback to demo if available:", err);
      const fallback = demoApi({ method: "post", url, data: body, ...options });
      if (fallback !== undefined) {
        return { data: { success: true, data: fallback }, status: 200 };
      }
      throw err;
    }
  }
};

export async function request(promise) {
  const r = await promise;
  return r.data?.data !== undefined ? r.data.data : r.data;
}
