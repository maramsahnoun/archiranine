import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://kptfmbhhrjqhyhcknhxc.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGZtYmhocmpxaHloY2tuaHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTg3NDQsImV4cCI6MjEwODg3NDc0NH0.XnISsfmvwkLSRKqMmOjHSjTYQ1rZwIOPJOW7l36SIig";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function normalizeError(err) {
  let message =
    err?.response?.data?.message ||
    err?.message ||
    err?.error_description ||
    "Une erreur est survenue.";

  if (message.includes("Invalid login credentials")) {
    message = "Identifiants incorrects. Vérifiez votre email et mot de passe.";
  } else if (message.includes("row-level security")) {
    message = "Session expirée ou accès non autorisé. Veuillez vous reconnecter.";
  } else if (message.includes("duplicate key value")) {
    message = "Un élément avec ce nom ou identifiant existe déjà.";
  }

  const wrapped = err instanceof Error ? err : new Error(message);
  wrapped.response = {
    status: err?.status || 400,
    data: { message },
  };
  return wrapped;
}

function parseUrl(path, options = {}) {
  const [rawPath, queryString = ""] = String(path || "/").split("?");
  const cleanPath = rawPath.replace(/^\/api/, "").replace(/\/$/, "") || "/";
  const urlParams = Object.fromEntries(new URLSearchParams(queryString));
  const params = { ...urlParams, ...(options.params || {}) };
  return { cleanPath, params };
}

function slugify(value, fallbackPrefix = "item") {
  const base = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `${fallbackPrefix}-${Date.now()}`;
}

function formatProject(p) {
  if (!p) return null;
  const sortedImages = (p.project_images || []).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const coverObj = sortedImages.find((i) => i.is_cover) || sortedImages[0];
  const coverImage = coverObj?.image_url || p.cover_image || "";

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.categories?.name || p.category || "Architecture d’Intérieur",
    categoryId: p.category_id || p.categoryId,
    shortDescription: p.short_description || p.shortDescription || "",
    description: p.description || "",
    style: p.style || "Contemporain",
    surface: p.surface !== null && p.surface !== undefined ? Number(p.surface) : null,
    landSurface:
      p.land_surface !== null && p.land_surface !== undefined
        ? Number(p.land_surface)
        : null,
    floors: p.floors ?? 1,
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    garage: Boolean(p.garage),
    location: p.location || "Tunisie",
    model3dUrl: p.model_3d_url || p.model3dUrl || null,
    videoUrl: p.video_url || p.videoUrl || null,
    status: p.status || "draft",
    views: Number(p.views || 0),
    coverImage,
    images: sortedImages.map((img) => ({
      id: img.id,
      imageUrl: img.image_url,
      altText: img.alt_text || p.title,
      isCover: Boolean(img.is_cover),
      sortOrder: img.sort_order,
    })),
    plans: (p.project_plans || [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((plan) => ({
        id: plan.id,
        floorName: plan.floor_name,
        floorNumber: plan.floor_number,
        imageUrl: plan.image_url,
        pdfUrl: plan.pdf_url,
        sortOrder: plan.sort_order,
      })),
    createdAt: p.created_at,
  };
}

async function uploadToStorage(path, file) {
  const { error } = await supabase.storage.from("archiranin").upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from("archiranin")
    .getPublicUrl(path);
  return urlData.publicUrl;
}

async function handleGet(path, options = {}) {
  const { cleanPath, params } = parseUrl(path, options);

  // Auth me
  if (cleanPath === "/auth/me") {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Non authentifié");
    return {
      admin: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split("@")[0],
        role: user.user_metadata?.role || "super_admin",
      },
    };
  }

  if (cleanPath === "/auth/setup-status") {
    return { required: false };
  }

  // Dashboard stats
  if (cleanPath === "/admin/dashboard/stats") {
    const [
      { data: projects, error: pErr },
      { data: msgs, error: mErr },
      { data: cats, error: cErr },
    ] = await Promise.all([
      supabase.from("projects").select("id, status, views"),
      supabase.from("messages").select("id, status"),
      supabase.from("categories").select("id"),
    ]);
    if (pErr) throw pErr;
    if (mErr) throw mErr;
    if (cErr) throw cErr;

    const total = projects?.length || 0;
    const published =
      projects?.filter((p) => p.status === "published").length || 0;
    const drafts = projects?.filter((p) => p.status === "draft").length || 0;
    const archived =
      projects?.filter((p) => p.status === "archived").length || 0;
    const views =
      projects?.reduce((sum, p) => sum + (Number(p.views) || 0), 0) || 0;
    const messagesCount = msgs?.length || 0;
    const unread = msgs?.filter((m) => m.status === "unread").length || 0;
    const categoriesCount = cats?.length || 0;

    return {
      total,
      published,
      drafts,
      archived,
      views,
      messages: messagesCount,
      unread,
      categories: categoriesCount,
    };
  }

  if (cleanPath === "/admin/dashboard/recent-projects") {
    const { data, error } = await supabase
      .from("projects")
      .select("*, categories(name), project_images(*)")
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    return (data || []).map(formatProject);
  }

  if (cleanPath === "/admin/dashboard/popular-projects") {
    const { data, error } = await supabase
      .from("projects")
      .select("*, categories(name), project_images(*)")
      .order("views", { ascending: false })
      .limit(8);
    if (error) throw error;
    return (data || []).map(formatProject);
  }

  if (cleanPath === "/admin/dashboard/views") {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("views");
    if (error) throw error;
    const totalViews =
      (projects || []).reduce((acc, p) => acc + (Number(p.views) || 0), 0) || 0;
    const weights = [0.1, 0.12, 0.14, 0.15, 0.14, 0.17, 0.18];
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000)
        .toISOString()
        .slice(0, 10),
      total: Math.round(totalViews * weights[i]),
    }));
  }

  // Projects list
  if (cleanPath === "/admin/projects") {
    let query = supabase
      .from("projects")
      .select(
        "*, categories(id, name, slug), project_images(*), project_plans(*)",
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.max(1, Number(params.limit || 100));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    const projects = (data || []).map(formatProject);
    const total = count ?? projects.length;
    return {
      projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // Single project
  const projectDetail = cleanPath.match(/^\/admin\/projects\/(\d+)$/);
  if (projectDetail) {
    const id = Number(projectDetail[1]);
    const { data, error } = await supabase
      .from("projects")
      .select("*, categories(*), project_images(*), project_plans(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return formatProject(data);
  }

  // Categories
  if (cleanPath === "/admin/categories") {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    return (data || []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      isActive: c.is_active ? 1 : 0,
    }));
  }

  // Messages
  if (cleanPath === "/admin/messages") {
    let query = supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (params.status) query = query.eq("status", params.status);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone || "",
      subject: m.subject || "",
      message: m.message,
      status: m.status,
      createdAt: m.created_at,
    }));
  }

  // Settings
  if (cleanPath === "/admin/settings") {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) throw error;
    const settings = {};
    (data || []).forEach((item) => {
      settings[item.setting_key] = item.setting_value;
    });
    return settings;
  }

  throw new Error(`Endpoint GET non géré: ${cleanPath}`);
}

async function handlePost(path, body = {}) {
  const { cleanPath } = parseUrl(path);

  // Login
  if (cleanPath === "/auth/login") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(body.email || "").trim(),
      password: body.password,
    });
    if (error) throw error;
    return {
      admin: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split("@")[0],
        role: data.user.user_metadata?.role || "super_admin",
      },
    };
  }

  if (cleanPath === "/auth/logout") {
    await supabase.auth.signOut();
    return null;
  }

  if (cleanPath === "/auth/password") {
    const { error } = await supabase.auth.updateUser({
      password: body.newPassword || body.password,
    });
    if (error) throw error;
    return { success: true };
  }

  // Create project
  if (cleanPath === "/admin/projects") {
    const title = String(body.title || "").trim();
    if (!title) throw new Error("Le titre du projet est obligatoire.");

    let slug = slugify(body.slug || title, "projet");
    const { data: existingSlug } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const status = body.status || "draft";
    const insertPayload = {
      title,
      slug,
      category_id: body.categoryId ? Number(body.categoryId) : null,
      short_description: body.shortDescription || body.short_description || "",
      description: body.description || "",
      style: body.style || "Contemporain",
      surface:
        body.surface !== "" && body.surface !== null && body.surface !== undefined
          ? Number(body.surface)
          : null,
      land_surface:
        body.landSurface !== "" &&
        body.landSurface !== null &&
        body.landSurface !== undefined
          ? Number(body.landSurface)
          : null,
      floors: body.floors ? Number(body.floors) : 1,
      bedrooms:
        body.bedrooms !== "" && body.bedrooms !== undefined
          ? Number(body.bedrooms)
          : 0,
      bathrooms:
        body.bathrooms !== "" && body.bathrooms !== undefined
          ? Number(body.bathrooms)
          : 0,
      garage: Boolean(body.garage),
      location: body.location || "Tunisie",
      video_url: body.videoUrl || body.video_url || null,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(insertPayload)
      .select("id, slug")
      .single();

    if (error) throw error;
    return { id: data.id, slug: data.slug };
  }

  // Upload model 3D
  const modelMatch = cleanPath.match(/^\/admin\/projects\/(\d+)\/model$/);
  if (modelMatch) {
    const id = Number(modelMatch[1]);
    const file =
      body instanceof FormData
        ? body.get("model") || body.get("file")
        : body.file;
    if (file) {
      const ext = file.name ? file.name.split(".").pop() : "glb";
      const storagePath = `projects/project-${id}/models/model-${Date.now()}.${ext}`;
      const url = await uploadToStorage(storagePath, file);
      const { error } = await supabase
        .from("projects")
        .update({ model_3d_url: url, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      return { model3dUrl: url };
    }
    return { model3dUrl: null };
  }

  // Upload images
  const imagesMatch = cleanPath.match(/^\/admin\/projects\/(\d+)\/images$/);
  if (imagesMatch) {
    const id = Number(imagesMatch[1]);
    const inserted = [];
    if (body instanceof FormData) {
      const files = body.getAll("images").length
        ? body.getAll("images")
        : body.getAll("files");
      const { data: existingImgs } = await supabase
        .from("project_images")
        .select("id, is_cover, sort_order")
        .eq("project_id", id);
      const hasCover = (existingImgs || []).some((img) => img.is_cover);
      const startOrder = (existingImgs || []).length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!(file instanceof File)) continue;
        const ext = file.name ? file.name.split(".").pop() : "jpg";
        const storagePath = `projects/project-${id}/images/${Date.now()}-${i}.${ext}`;
        const url = await uploadToStorage(storagePath, file);
        const { data: img, error } = await supabase
          .from("project_images")
          .insert({
            project_id: id,
            image_url: url,
            alt_text: file.name || "Vue projet",
            sort_order: startOrder + i,
            is_cover: !hasCover && i === 0,
          })
          .select()
          .single();
        if (error) throw error;
        if (img) inserted.push(img);
      }
    }
    return inserted;
  }

  // Upload plans
  const plansMatch = cleanPath.match(/^\/admin\/projects\/(\d+)\/plans$/);
  if (plansMatch) {
    const id = Number(plansMatch[1]);
    const inserted = [];
    if (body instanceof FormData) {
      const files = body.getAll("plans").length
        ? body.getAll("plans")
        : body.getAll("files");
      const floorNames = body.getAll("floorName") || [];
      const { data: existingPlans } = await supabase
        .from("project_plans")
        .select("id")
        .eq("project_id", id);
      const startOrder = (existingPlans || []).length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!(file instanceof File)) continue;
        const isPdf =
          file.type === "application/pdf" ||
          (file.name && file.name.toLowerCase().endsWith(".pdf"));
        const ext = file.name
          ? file.name.split(".").pop()
          : isPdf
            ? "pdf"
            : "jpg";
        const storagePath = `projects/project-${id}/plans/${Date.now()}-${i}.${ext}`;
        const url = await uploadToStorage(storagePath, file);
        const { data: pl, error } = await supabase
          .from("project_plans")
          .insert({
            project_id: id,
            floor_name:
              floorNames[i] ||
              (file.name
                ? file.name.replace(/\.[^.]+$/, "")
                : `Plan ${startOrder + i + 1}`),
            floor_number: startOrder + i,
            pdf_url: isPdf ? url : null,
            image_url: isPdf ? null : url,
            sort_order: startOrder + i,
          })
          .select()
          .single();
        if (error) throw error;
        if (pl) inserted.push(pl);
      }
    }
    return inserted;
  }

  // Create Category
  if (cleanPath === "/admin/categories") {
    const name = String(body.name || "").trim();
    if (!name) throw new Error("Le nom de la catégorie est obligatoire.");

    let slug = slugify(body.slug || name, "categorie");
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existingCat) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        description: body.description ? String(body.description).trim() : "",
        is_active: true,
      })
      .select("id, name, slug, description, is_active")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.is_active ? 1 : 0,
    };
  }

  throw new Error(`Endpoint POST non géré: ${cleanPath}`);
}

async function handlePut(path, body = {}) {
  const { cleanPath } = parseUrl(path);

  if (cleanPath === "/auth/password") {
    const { error } = await supabase.auth.updateUser({
      password: body.newPassword || body.password,
    });
    if (error) throw error;
    return { success: true };
  }

  // Update project
  const projectDetail = cleanPath.match(/^\/admin\/projects\/(\d+)$/);
  if (projectDetail) {
    const id = Number(projectDetail[1]);
    const updateData = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.categoryId !== undefined)
      updateData.category_id = body.categoryId ? Number(body.categoryId) : null;
    if (body.shortDescription !== undefined)
      updateData.short_description = body.shortDescription;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.style !== undefined) updateData.style = body.style;
    if (body.surface !== undefined)
      updateData.surface =
        body.surface !== "" && body.surface !== null
          ? Number(body.surface)
          : null;
    if (body.landSurface !== undefined)
      updateData.land_surface =
        body.landSurface !== "" && body.landSurface !== null
          ? Number(body.landSurface)
          : null;
    if (body.floors !== undefined) updateData.floors = Number(body.floors || 1);
    if (body.bedrooms !== undefined)
      updateData.bedrooms = Number(body.bedrooms || 0);
    if (body.bathrooms !== undefined)
      updateData.bathrooms = Number(body.bathrooms || 0);
    if (body.garage !== undefined) updateData.garage = Boolean(body.garage);
    if (body.location !== undefined) updateData.location = body.location;
    if (body.videoUrl !== undefined) updateData.video_url = body.videoUrl;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "published") {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select("*, categories(*), project_images(*), project_plans(*)")
      .single();
    if (error) throw error;
    return formatProject(data);
  }

  // Update category
  const catMatch = cleanPath.match(/^\/admin\/categories\/(\d+)$/);
  if (catMatch) {
    const id = Number(catMatch[1]);
    const updatePayload = { updated_at: new Date().toISOString() };
    if (body.name !== undefined) {
      updatePayload.name = String(body.name).trim();
      updatePayload.slug = slugify(body.name, "categorie");
    }
    if (body.description !== undefined) {
      updatePayload.description = String(body.description || "").trim();
    }
    if (body.isActive !== undefined) {
      updatePayload.is_active = Boolean(body.isActive);
    }
    const { error } = await supabase
      .from("categories")
      .update(updatePayload)
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  // Update settings
  if (cleanPath === "/admin/settings") {
    for (const [key, value] of Object.entries(body)) {
      const { error } = await supabase.from("site_settings").upsert(
        {
          setting_key: key,
          setting_value:
            typeof value === "object"
              ? JSON.stringify(value)
              : String(value ?? ""),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" },
      );
      if (error) throw error;
    }
    return { success: true };
  }

  throw new Error(`Endpoint PUT non géré: ${cleanPath}`);
}

async function handlePatch(path) {
  const { cleanPath } = parseUrl(path);

  // Project status change
  const actMatch = cleanPath.match(
    /^\/admin\/projects\/(\d+)\/(publish|unpublish|archive)$/,
  );
  if (actMatch) {
    const id = Number(actMatch[1]);
    const action = actMatch[2];
    const status =
      action === "publish"
        ? "published"
        : action === "archive"
          ? "archived"
          : "draft";
    const update = { status, updated_at: new Date().toISOString() };
    if (status === "published") update.published_at = new Date().toISOString();
    const { error } = await supabase
      .from("projects")
      .update(update)
      .eq("id", id);
    if (error) throw error;
    return { id, status };
  }

  // Set cover image
  const coverMatch = cleanPath.match(/^\/admin\/images\/(\d+)\/cover$/);
  if (coverMatch) {
    const imageId = Number(coverMatch[1]);
    const { data: img, error: findErr } = await supabase
      .from("project_images")
      .select("id, project_id")
      .eq("id", imageId)
      .single();
    if (findErr) throw findErr;
    await supabase
      .from("project_images")
      .update({ is_cover: false })
      .eq("project_id", img.project_id);
    const { error } = await supabase
      .from("project_images")
      .update({ is_cover: true })
      .eq("id", imageId);
    if (error) throw error;
    return { success: true };
  }

  // Message status change
  const msgMatch = cleanPath.match(
    /^\/admin\/messages\/(\d+)\/(read|unread|archive)$/,
  );
  if (msgMatch) {
    const id = Number(msgMatch[1]);
    const act = msgMatch[2];
    const status = act === "archive" ? "archived" : act;
    const { error } = await supabase
      .from("messages")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return { id, status };
  }

  throw new Error(`Endpoint PATCH non géré: ${cleanPath}`);
}

async function handleDelete(path) {
  const { cleanPath } = parseUrl(path);

  // Delete project
  const projectMatch = cleanPath.match(/^\/admin\/projects\/(\d+)$/);
  if (projectMatch) {
    const id = Number(projectMatch[1]);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  // Delete project 3D model
  const modelMatch = cleanPath.match(/^\/admin\/projects\/(\d+)\/model$/);
  if (modelMatch) {
    const id = Number(modelMatch[1]);
    const { error } = await supabase
      .from("projects")
      .update({ model_3d_url: null, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  // Delete project image
  const imgMatch = cleanPath.match(/^\/admin\/images\/(\d+)$/);
  if (imgMatch) {
    const id = Number(imgMatch[1]);
    const { error } = await supabase
      .from("project_images")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  // Delete project plan
  const planMatch = cleanPath.match(/^\/admin\/plans\/(\d+)$/);
  if (planMatch) {
    const id = Number(planMatch[1]);
    const { error } = await supabase
      .from("project_plans")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  // Delete category
  const catMatch = cleanPath.match(/^\/admin\/categories\/(\d+)$/);
  if (catMatch) {
    const id = Number(catMatch[1]);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  // Delete message
  const msgMatch = cleanPath.match(/^\/admin\/messages\/(\d+)$/);
  if (msgMatch) {
    const id = Number(msgMatch[1]);
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  throw new Error(`Endpoint DELETE non géré: ${cleanPath}`);
}

export const api = {
  async get(url, options = {}) {
    try {
      const data = await handleGet(url, options);
      return { data: { success: true, data }, status: 200 };
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async post(url, body = {}, options = {}) {
    try {
      const data = await handlePost(url, body, options);
      return { data: { success: true, data }, status: 200 };
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async put(url, body = {}, options = {}) {
    try {
      const data = await handlePut(url, body, options);
      return { data: { success: true, data }, status: 200 };
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async patch(url, body = {}, options = {}) {
    try {
      const data = await handlePatch(url, body, options);
      return { data: { success: true, data }, status: 200 };
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async delete(url, options = {}) {
    try {
      const data = await handleDelete(url, options);
      return { data: { success: true, data }, status: 200 };
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

export async function request(promise) {
  const r = await promise;
  return r.data?.data !== undefined ? r.data.data : r.data;
}
