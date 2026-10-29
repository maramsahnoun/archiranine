const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.kptfmbhhrjqhyhcknhxc',
  password: 'Oussama012345@gmail.com',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log('Creating storage bucket archiranin...');
  await client.query(`
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('archiranin', 'archiranin', true, 104857600, NULL)
    ON CONFLICT (id) DO UPDATE SET public = true;

    -- Drop existing storage policies
    DROP POLICY IF EXISTS "Public can view archiranin media" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated can upload archiranin media" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated can update archiranin media" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated can delete archiranin media" ON storage.objects;

    -- Create storage policies
    CREATE POLICY "Public can view archiranin media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'archiranin');

    CREATE POLICY "Authenticated can upload archiranin media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'archiranin');

    CREATE POLICY "Authenticated can update archiranin media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'archiranin');

    CREATE POLICY "Authenticated can delete archiranin media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'archiranin');
  `);
  console.log('Storage bucket created and policies set!');
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
