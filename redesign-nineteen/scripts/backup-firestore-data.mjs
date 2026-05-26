import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'public', 'data');

const projectId = 'acutefilmmovies';
const collections = [
    {
        name: 'movies',
        outputFile: 'movies.json',
        sortItems: (items) => items.sort((a, b) => String(b.release || '').localeCompare(String(a.release || ''))),
    },
    {
        name: 'news',
        outputFile: 'news.json',
        sortItems: (items) => items.sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))),
    },
];

function unwrapFirestoreValue(value) {
    if (!value || typeof value !== 'object') return '';
    if ('stringValue' in value) return value.stringValue;
    if ('integerValue' in value) return value.integerValue;
    if ('doubleValue' in value) return value.doubleValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('nullValue' in value) return null;

    if ('arrayValue' in value) {
        return (value.arrayValue.values || []).map(unwrapFirestoreValue);
    }

    if ('mapValue' in value) {
        const fields = value.mapValue.fields || {};
        return Object.fromEntries(
            Object.entries(fields).map(([key, nestedValue]) => [key, unwrapFirestoreValue(nestedValue)]),
        );
    }

    if ('timestampValue' in value) return value.timestampValue;

    return '';
}

function normalizeDocument(document) {
    const fields = document.fields || {};
    const item = { id: document.name.split('/').pop() };

    for (const [key, value] of Object.entries(fields)) {
        item[key] = unwrapFirestoreValue(value);
    }

    return item;
}

async function fetchCollection(collectionName) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?t=${Date.now()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${collectionName}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return (data.documents || []).map(normalizeDocument);
}

async function backupCollection({ name, outputFile, sortItems }) {
    const items = sortItems(await fetchCollection(name));
    const outputPath = path.join(outputDir, outputFile);
    const payload = `${JSON.stringify({ items }, null, 4)}\n`;

    await writeFile(outputPath, payload, 'utf8');
    return { name, count: items.length, outputPath };
}

async function main() {
    await mkdir(outputDir, { recursive: true });

    const results = [];
    for (const collection of collections) {
        results.push(await backupCollection(collection));
    }

    for (const result of results) {
        console.log(`Backed up ${result.name}: ${result.count} items -> ${result.outputPath}`);
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
