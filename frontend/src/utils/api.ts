import axios, { AxiosInstance } from 'axios';

// Use relative base in dev; vite proxy maps /api to backend
const api: AxiosInstance = axios.create({ baseURL: '/api' });

// Attach token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Meta
export const getMeta = async () => {
    const { data } = await api.get('/meta');
    return data as { service: string; datasetVersion: string };
};

// Sync
export const syncPull = async () => {
    const { data } = await api.post('/sync/pull', {});
    return data as {
        datasetVersion: string;
        mode: 'full' | 'delta';
        collections: Record<string, any[]>;
    };
};

export const syncPush = async (events: any[]) => {
    const { data } = await api.post('/sync/push', { events });
    return data as { accepted: number; status: string };
};

// Datasets
export const fetchColleges = async (params?: { district?: string; stream?: string; degree?: string; q?: string; }) => {
    const { data } = await api.get('/datasets/colleges', { params });
    return data as any[];
};

export const fetchScholarships = async (params?: { q?: string; minAmount?: number; maxAmount?: number; deadlineBefore?: string; deadlineAfter?: string; state?: string; gender?: string; maxIncome?: string; category?: string; }) => {
    const { data } = await api.get('/datasets/scholarships', { params });
    return data as any[];
};

export const fetchTimelines = async (params?: { type?: string; district?: string; before?: string; after?: string; q?: string; }) => {
    const { data } = await api.get('/timelines', { params });
    return data as any[];
};

export const fetchNextTimelines = async (limit = 5) => {
    const { data } = await api.get('/timelines/next', { params: { limit } });
    return data as any[];
};

export const fetchDegrees = async (params?: { stream?: string }) => {
    const { data } = await api.get('/datasets/degrees', { params });
    return data as any[];
};

// Recommendations
export const recommendationsFromQuiz = async (payload: { answers: Array<{ id: number; choice: string }>; district?: string }) => {
    const { data } = await api.post('/recommendations/quiz', payload);
    return data as any;
};

// Auth
export const login = async (username: string, district?: string) => {
    const { data } = await api.post('/auth/login', { username, district });
    if (data?.token) localStorage.setItem('token', data.token);
    return data;
};

export const me = async () => {
    const { data } = await api.get('/auth/me');
    return data as { username: string; district?: string };
};

export default api;