export function unwrapFirestoreFields(document) {
  const fields = document?.fields || {};
  const item = { id: document?.name?.split('/').pop() || '' };

  for (const [key, value] of Object.entries(fields)) {
    item[key] = value.stringValue || value.integerValue || value.booleanValue || '';
  }

  return item;
}

export async function fetchFirestoreCollection(collectionName) {
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/acutefilmmovies/databases/(default)/documents/${collectionName}?t=${Date.now()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${collectionName}: ${res.status}`);
  }

  const data = await res.json();
  return (data.documents || []).map(unwrapFirestoreFields);
}
