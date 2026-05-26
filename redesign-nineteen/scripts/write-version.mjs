import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const versionFile = path.join(publicDir, 'version.json');

const now = new Date();
const version = {
  version: String(now.getTime()),
  builtAt: now.toISOString(),
};

await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(versionFile, JSON.stringify(version), 'utf8');
console.log(`[write-version] version=${version.version} builtAt=${version.builtAt}`);
