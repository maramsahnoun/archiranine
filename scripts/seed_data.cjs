const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kptfmbhhrjqhyhcknhxc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGZtYmhocmpxaHloY2tuaHhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI5ODc0NCwiZXhwIjoyMTA4ODc0NzQ0fQ.sOplyfBBIriUFi0wpbdmflewfWIDxICTFt3-W-mHsJA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function uploadFile(bucket, storagePath, filePath, contentType) {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, {
    contentType,
    upsert: true
  });
  if (error) {
    console.error(`Failed to upload ${filePath}:`, error.message);
    throw error;
  }
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  console.log(`Uploaded ${storagePath} -> ${publicUrlData.publicUrl}`);
  return publicUrlData.publicUrl;
}

async function main() {
  console.log('Seeding ArchiRanin data to Supabase...');


  // 1. Upload Logo
  const logoPath = path.resolve(__dirname, '../projet1souma/Contact/logo.png');
  const logoUrl = await uploadFile('archiranin', 'branding/logo.png', logoPath, 'image/png');


  // 2. Upload 3D Model
  const glbPath = path.resolve(__dirname, '../projet1souma/projets/ville1/3D/projet 1.glb');
  console.log('Uploading 3D model (10MB)...');
  const glbUrl = await uploadFile('archiranin', 'projects/villa-1/models/villa-1.glb', glbPath, 'model/gltf-binary');


  // 3. Upload 2D PDF Plans
  const pdf1Path = path.resolve(__dirname, '../projet1souma/projets/ville1/2D/1.pdf');
  const pdf2Path = path.resolve(__dirname, '../projet1souma/projets/ville1/2D/2.pdf');
  const plan1Url = await uploadFile('archiranin', 'projects/villa-1/plans/plan-rez-de-chaussee.pdf', pdf1Path, 'application/pdf');
  const plan2Url = await uploadFile('archiranin', 'projects/villa-1/plans/plan-etage.pdf', pdf2Path, 'application/pdf');


  // 4. Upload 3D Render Images
  const imgDir = path.resolve(__dirname, '../projet1souma/projets/ville1/3D');
  const imgFiles = fs.readdirSync(imgDir).filter(f => f.endsWith('.jpg'));
  const imageUrls = [];

  for (let i = 0; i < imgFiles.length; i++) {
    const f = imgFiles[i];
    const fullPath = path.join(imgDir, f);
    const dest = `projects/villa-1/images/render-${i + 1}.jpg`;
    const url = await uploadFile('archiranin', dest, fullPath, 'image/jpeg');
    imageUrls.push(url);
  }

  
  // 5. Seed Site Settings
  const settings = [
    { setting_key: 'site_name', setting_value: 'ArchiRanin' },
    { setting_key: 'architect_name', setting_value: 'Ranine Sahnoun' },
    { setting_key: 'tagline', setting_value: 'Architecte d’Intérieur & Designer d’Espace' },
    { setting_key: 'company_email', setting_value: 'sahnounranine8@gmail.com' },
    { setting_key: 'company_phone', setting_value: '+216 46 412 009' },
    { setting_key: 'whatsapp_number', setting_value: '+21646412009' },
    { setting_key: 'company_address', setting_value: 'Tunis, Tunisie' },
    { setting_key: 'linkedin_url', setting_value: 'https://www.linkedin.com/in/ranine-sahnoun-08470a247' },
    { setting_key: 'instagram_url', setting_value: 'https://instagram.com/archiranine' },
    { setting_key: 'logo_url', setting_value: logoUrl },
    { setting_key: 'palette_colors', setting_value: JSON.stringify(['#c0ab94', '#896130', '#fefefe', '#49321d', '#8c6232', '#926837', '#614e3e']) }
  ];

  for (const s of settings) {
    const { error } = await supabase.from('site_settings').upsert(s, { onConflict: 'setting_key' });
    if (error) console.error(`Error saving setting ${s.setting_key}:`, error.message);
  }
  console.log('Site settings seeded.');

  // 6. Seed Categories
  const categories = [
    { name: 'Architecture d’Intérieur', slug: 'architecture-interieur', description: 'Aménagement et design d’espaces de vie sur-mesure' },
    { name: 'Résidentiel & Villas', slug: 'residentiel-villas', description: 'Conception et rénovation de villas haut de gamme' },
    { name: 'Rénovation & Décoration', slug: 'renovation-decoration', description: 'Valorisation des espaces existants avec des finitions d’exception' },
    { name: 'Commercial & Espaces Pro', slug: 'commercial-espaces-pro', description: 'Bureaux, boutiques et concepts pour professionnels' }
  ];

  const catMap = {};
  for (const c of categories) {
    const { data, error } = await supabase.from('categories').upsert(c, { onConflict: 'slug' }).select();
    if (error) console.error(`Error saving category ${c.name}:`, error.message);
    else if (data && data[0]) catMap[c.slug] = data[0].id;
  }
  console.log('Categories seeded:', catMap);

  // 7. Seed Project "Villa 1"
  const catId = catMap['residentiel-villas'] || Object.values(catMap)[0];
  const project = {
    category_id: catId,
    title: 'Villa 1 - Résidence Contemporaine',
    slug: 'villa-1-residence-contemporaine',
    short_description: 'Architecture d’intérieur et aménagement sur-mesure d’une villa moderne alliant épure, boiseries nobles et baies vitrées.',
    description: 'Conception complète de l’aménagement intérieur et extérieur d’une villa contemporaine d’exception. Le projet articule des volumes généreux, une palette chromatique chaleureuse (tons sables, chêne naturel, noyer et touches d’acier sombre), et une transition harmonieuse entre les espaces de vie et la terrasse paysagée. Les plans 2D détaillés et la modélisation 3D interactive permettent d’explorer chaque pièce avant sa réalisation.',
    style: 'Contemporain & Chaleureux',
    surface: 320,
    land_surface: 600,
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    garage: true,
    location: 'Tunisie',
    model_3d_url: glbUrl,
    video_url: null,
    status: 'published',
    views: 185
  };

  const { data: pData, error: pError } = await supabase.from('projects').upsert(project, { onConflict: 'slug' }).select();
  if (pError) {
    console.error('Error inserting project:', pError.message);
    return;
  }
  const projectId = pData[0].id;
  console.log(`Project "Villa 1" inserted with ID: ${projectId}`);

  // Delete any existing images/plans for this project to avoid duplicates on re-run
  await supabase.from('project_images').delete().eq('project_id', projectId);
  await supabase.from('project_plans').delete().eq('project_id', projectId);

  // 8. Insert Project Images
  const projectImages = imageUrls.map((url, idx) => ({
    project_id: projectId,
    image_url: url,
    alt_text: `Villa 1 - Vue intérieure ${idx + 1}`,
    sort_order: idx,
    is_cover: idx === 0
  }));
  const { error: imgError } = await supabase.from('project_images').insert(projectImages);
  if (imgError) console.error('Error inserting images:', imgError.message);
  else console.log(`Inserted ${projectImages.length} images for project.`);

  // 9. Insert Project Plans
  const projectPlans = [
    {
      project_id: projectId,
      floor_name: 'Rez-de-chaussée (Plan d’aménagement)',
      floor_number: 0,
      pdf_url: plan1Url,
      sort_order: 0
    },
    {
      project_id: projectId,
      floor_name: 'Étage supérieur (Plan technique & distribution)',
      floor_number: 1,
      pdf_url: plan2Url,
      sort_order: 1
    }
  ];
  const { error: planError } = await supabase.from('project_plans').insert(projectPlans);
  if (planError) console.error('Error inserting plans:', planError.message);
  else console.log(`Inserted ${projectPlans.length} plans for project.`);

  console.log('Seeding finished successfully!');
}

main().catch(console.error);
