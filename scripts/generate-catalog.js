const fs   = require('fs');
const path = require('path');

const APPS_DIR    = path.join(__dirname, '..', 'apps');
const OUTPUT_FILE = path.join(__dirname, '..', 'catalog.json');

const REPO     = process.env.GITHUB_REPOSITORY || 'USERNAME/REPO';
const BRANCH   = process.env.GITHUB_REF_NAME   || 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

function getMeta(html, name) {
  const re = new RegExp(
    `<meta\\s+(?:[^>]*?\\s+)?name=["']${name}["'][^>]*?content=["']([^"']*)["']` +
    `|<meta\\s+(?:[^>]*?\\s+)?content=["']([^"']*)["'][^>]*?name=["']${name}["']`,
    'i'
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] !== undefined ? m[1] : m[2]).trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g,  '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&#39;/g,  "'");
}

function processFile(filePath) {
  const html     = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  const slug     = filename.replace(/\.html?$/i, '');

  const name = getMeta(html, 'bcx:name');
  if (!name) {
    console.log(`  ⚠  Skipped: ${filename} — tidak ada bcx:name`);
    return null;
  }

  const idRaw = getMeta(html, 'bcx:id') || slug;
  const id    = idRaw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');

  const tagsRaw = getMeta(html, 'bcx:tags') || '';
  const tags    = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const priceRaw = getMeta(html, 'bcx:price');
  const price    = priceRaw !== null ? Number(priceRaw) || 0 : 0;

  const contentUrl   = `${RAW_BASE}/apps/${encodeURIComponent(filename)}`;
  const imageMetaUrl = getMeta(html, 'bcx:image') || null;
  const imageUrl     = imageMetaUrl
    ? (imageMetaUrl.startsWith('http') ? imageMetaUrl : `${RAW_BASE}/${imageMetaUrl}`)
    : null;

  const item = {
    id,
    title:       decodeEntities(name),
    description: decodeEntities(getMeta(html, 'bcx:desc')     || ''),
    category:    getMeta(html, 'bcx:category')  || 'useful',
    icon:        getMeta(html, 'bcx:icon')       || 'app-window',
    color:       getMeta(html, 'bcx:color')      || 'from-slate-500 to-gray-700',
    version:     getMeta(html, 'bcx:version')    || '1.0',
    author:      getMeta(html, 'bcx:author')     || '',
    tags,
    price,
    contentUrl,
  };

  if (imageUrl) item.imageUrl = imageUrl;
  return item;
}

function main() {
  if (!fs.existsSync(APPS_DIR)) {
    console.error(`❌ Folder apps/ tidak ditemukan`);
    process.exit(1);
  }

  const files = fs.readdirSync(APPS_DIR)
    .filter(f => /\.html?$/i.test(f))
    .sort();

  console.log(`📂 Scanning ${files.length} file HTML di apps/...\n`);

  const catalog = [];
  for (const file of files) {
    const filePath = path.join(APPS_DIR, file);
    console.log(`  → ${file}`);
    const item = processFile(filePath);
    if (item) {
      catalog.push(item);
      console.log(`     ✓ "${item.title}" [${item.category}]`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log(`\n✅ catalog.json: ${catalog.length} app terdaftar`);
}

main();
