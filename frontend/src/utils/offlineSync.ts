import { openDB } from 'idb';

const DB_NAME = 'studentGuidanceDB';
const STORE_NAME = 'offlineRequests';

// Initialize IndexedDB
const initDB = async () => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, {
                keyPath: 'id',
                autoIncrement: true,
            });
        },
    });
    return db;
};

// Add request to IndexedDB
export const addRequestToQueue = async (request) => {
    const db = await initDB();
    await db.add(STORE_NAME, request);
};

// Get all requests from IndexedDB
export const getRequestsFromQueue = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

// Clear the request queue
export const clearRequestQueue = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};

// Sync requests with the server
export const syncRequests = async (syncFunction) => {
    const requests = await getRequestsFromQueue();
    for (const request of requests) {
        await syncFunction(request);
        await clearRequestQueue();
    }
};