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
  const res = await client.query(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log('Public tables count:', res.rows.length);
  res.rows.forEach(r => console.log(' - ' + r.table_name));
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
