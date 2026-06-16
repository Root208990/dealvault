// Safe Netlify build script — never fails
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || 'https://yvnyvbgcrqxxugqwphfu.supabase.co';
const key = process.env.SUPABASE_ANON_KEY || '';

const output = `// Auto-generated — optional, credentials also in index.html
window.APP_CONFIG = {
  ...(window.APP_CONFIG || {}),
  SUPABASE_URL: ${JSON.stringify(url)},
  SUPABASE_ANON_KEY: ${JSON.stringify(key)},
};
`;

try {
  fs.writeFileSync(path.join(__dirname, '..', 'config.js'), output, 'utf8');
  console.log('Build OK');
} catch (err) {
  console.log('Build OK (config.js skipped)');
}
