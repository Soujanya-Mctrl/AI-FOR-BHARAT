import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useRef, useState } from 'react';

const QUEUE_KEY = 'offline_queue';

interface QueuedRequest {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    data?: any;
    timestamp: number;
}

export function useOfflineQueue() {
    const [isOnline, setIsOnline] = useState(true);
    const [queueLength, setQueueLength] = useState(0);
    const isProcessing = useRef(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            const online = state.isConnected ?? true;
            setIsOnline(online);

            // When back online, replay queued requests
            if (online && !isProcessing.current) {
                processQueue();
            }
        });

        // Load initial queue length
        loadQueueLength();

        return () => unsubscribe();
    }, []);

    const loadQueueLength = async () => {
        try {
            const raw = await AsyncStorage.getItem(QUEUE_KEY);
            if (raw) {
                const queue = JSON.parse(raw) as QueuedRequest[];
                setQueueLength(queue.length);
            }
        } catch {
            // Ignore
        }
    };

    const addToQueue = useCallback(async (request: Omit<QueuedRequest, 'id' | 'timestamp'>) => {
        try {
            const raw = await AsyncStorage.getItem(QUEUE_KEY);
            const queue: QueuedRequest[] = raw ? JSON.parse(raw) : [];
            queue.push({
                ...request,
                id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
                timestamp: Date.now(),
            });
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
            setQueueLength(queue.length);
        } catch {
            // If storage fails, the request is lost — acceptable for MVP
        }
    }, []);

    const processQueue = async () => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        try {
            const raw = await AsyncStorage.getItem(QUEUE_KEY);
            if (!raw) return;

            const queue: QueuedRequest[] = JSON.parse(raw);
            const remaining: QueuedRequest[] = [];

            for (const req of queue) {
                try {
                    await api.request({
                        method: req.method,
                        url: req.url,
                        data: req.data,
                    });
                } catch {
                    // Re-queue failed requests
                    remaining.push(req);
                }
            }

            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
            setQueueLength(remaining.length);
        } finally {
            isProcessing.current = false;
        }
    };

    return { isOnline, queueLength, addToQueue };
}
