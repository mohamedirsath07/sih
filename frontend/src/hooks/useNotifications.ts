import { useEffect, useState } from 'react';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
        // Optionally, you can also store notifications in IndexedDB or local storage for offline access
    };

    const removeNotification = (id) => {
        setNotifications((prevNotifications) => prevNotifications.filter(notification => notification.id !== id));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    useEffect(() => {
        // Logic to fetch notifications from a server or local storage can be added here
        // For example, you could fetch notifications when the component mounts
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
    };
};

export default useNotifications;