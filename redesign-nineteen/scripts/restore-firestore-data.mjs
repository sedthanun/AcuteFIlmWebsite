import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const backupDir = path.join(projectRoot, 'public', 'data');

const firebaseConfig = {
  apiKey: 'AIzaSyAj-cfd3Eku9w-vP6CiSWfEYhSZ1M4x80Y',
  authDomain: 'acutefilmmovies.firebaseapp.com',
  projectId: 'acutefilmmovies',
  storageBucket: 'acutefilmmovies.firebasestorage.app',
  messagingSenderId: '702201085699',
  appId: '1:702201085699:web:561142754e136f75def336',
  measurementId: 'G-V46FVR3ZY6',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const collections = [
  { name: 'movies', fileName: 'movies.json' },
  { name: 'news', fileName: 'news.json' },
];

async function readBackup(fileName) {
  const filePath = path.join(backupDir, fileName);
  const content = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(content);
  return Array.isArray(parsed.items) ? parsed.items : [];
}

async function restoreCollection({ name, fileName }) {
  const items = await readBackup(fileName);
  let restored = 0;

  for (const item of items) {
    const documentId = item.slug || item.id;
    if (!documentId) continue;

    const { id, ...data } = item;
    await setDoc(doc(db, name, documentId), data);
    restored += 1;
  }

  return { name, restored };
}

async function main() {
  const results = [];
  for (const collection of collections) {
    results.push(await restoreCollection(collection));
  }

  for (const result of results) {
    console.log(`Restored ${result.name}: ${result.restored} items`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
