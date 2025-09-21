import { useEffect, useState } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import { getMeta, syncPull } from '@/utils/api';

const DB_NAME = 'sgp-cache-v1';
const STORE = 'collections';

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });
}

export async function cacheCollection(name: string, data: any) {
  const db = await getDb();
  await db.put(STORE, data, name);
}

export async function readCollection<T = any>(name: string): Promise<T | undefined> {
  const db = await getDb();
  return (await db.get(STORE, name)) as T | undefined;
}

export function useSync() {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'ok' | 'error'>('idle');
  const [version, setVersion] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus('syncing');
        const meta = await getMeta();
        setVersion(meta.datasetVersion);
        const res = await syncPull();
        for (const [name, items] of Object.entries(res.collections || {})) {
          await cacheCollection(name, items);
        }
        if (!cancelled) setStatus('ok');
      } catch (e) {
        console.warn('Sync failed, using cached data', e);
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, version };
}
