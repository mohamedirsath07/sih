import { useEffect, useState } from 'react';

const useOfflineQueue = () => {
    const [queue, setQueue] = useState([]);

    const addToQueue = (request) => {
        setQueue((prevQueue) => [...prevQueue, request]);
        localStorage.setItem('offlineQueue', JSON.stringify([...queue, request]));
    };

    const processQueue = async () => {
        const storedQueue = JSON.parse(localStorage.getItem('offlineQueue')) || [];
        for (const request of storedQueue) {
            try {
                const response = await fetch(request.url, {
                    method: request.method,
                    headers: request.headers,
                    body: JSON.stringify(request.body),
                });
                if (response.ok) {
                    // Optionally handle successful response
                }
            } catch (error) {
                console.error('Failed to process request:', error);
            }
        }
        localStorage.removeItem('offlineQueue');
        setQueue([]);
    };

    useEffect(() => {
        if (navigator.onLine) {
            processQueue();
        }
    }, [navigator.onLine]);

    return { addToQueue, queue };
};

export default useOfflineQueue;