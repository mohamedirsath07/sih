import { useEffect, useState } from 'react';

const useIndexedDB = (dbName: string, storeName: string) => {
    const [db, setDb] = useState<IDBDatabase | null>(null);

    useEffect(() => {
        const request = indexedDB.open(dbName);

        request.onupgradeneeded = (event) => {
            const db = event.target.result as IDBDatabase;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            setDb(event.target.result as IDBDatabase);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event);
        };
    }, [dbName, storeName]);

    const addItem = (item: any) => {
        if (!db) return;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.add(item);
    };

    const getItem = (id: string) => {
        return new Promise((resolve, reject) => {
            if (!db) return reject('Database not initialized');
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject('Error fetching item');
            };
        });
    };

    const getAllItems = () => {
        return new Promise((resolve, reject) => {
            if (!db) return reject('Database not initialized');
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject('Error fetching items');
            };
        });
    };

    return { addItem, getItem, getAllItems };
};

export default useIndexedDB;