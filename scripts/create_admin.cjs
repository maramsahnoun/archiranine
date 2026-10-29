const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kptfmbhhrjqhyhcknhxc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGZtYmhocmpxaHloY2tuaHhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI5ODc0NCwiZXhwIjoyMTA4ODc0NzQ0fQ.sOplyfBBIriUFi0wpbdmflewfWIDxICTFt3-W-mHsJA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
  const email = 'sahnounranine8@gmail.com';
  const password = 'AdminPassword2026!';

  console.log(`Creating admin account for ${email}...`);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: 'Ranine Sahnoun', role: 'super_admin' }
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('Admin user created successfully! ID:', data.user.id);
  }

  // Also create a backup admin for development/testing if needed
  const devEmail = 'admin@archiranin.com';
  const { data: devData, error: devError } = await supabase.auth.admin.createUser({
    email: devEmail,
    password: password,
    email_confirm: true,
    user_metadata: { name: 'Admin ArchiRanin', role: 'admin' }
  });
  if (devError && !devError.message.includes('already registered')) {
    console.error('Error creating dev user:', devError.message);
  } else {
    console.log('Dev admin created successfully:', devEmail);
  }
}

createAdmin().catch(console.error);
