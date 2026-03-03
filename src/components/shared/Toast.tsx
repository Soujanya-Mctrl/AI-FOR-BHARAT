import { Colors } from '@/constants/colors';
import { useUIStore } from '@/stores/uiStore';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Text } from 'react-native';

const typeColors = {
    success: { bg: Colors.success.light, text: Colors.success.dark, icon: '✓' },
    error: { bg: Colors.error.light, text: Colors.error.dark, icon: '✕' },
    info: { bg: '#dbeafe', text: '#1d4ed8', icon: 'ℹ' },
    warning: { bg: Colors.warning.light, text: Colors.warning.dark, icon: '⚠' },
};

export function Toast() {
    const toast = useUIStore((s) => s.toast);
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (toast) {
            Animated.spring(slideAnim, { toValue: Platform.OS === 'ios' ? 50 : 10, tension: 80, friction: 10, useNativeDriver: true }).start();
        } else {
            Animated.timing(slideAnim, { toValue: -100, duration: 200, useNativeDriver: true }).start();
        }
    }, [toast]);

    if (!toast) return null;

    const config = typeColors[toast.type] || typeColors.info;

    return (
        <Animated.View style={{
            position: 'absolute', top: 0, left: 16, right: 16, zIndex: 9999,
            transform: [{ translateY: slideAnim }],
            backgroundColor: config.bg, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
            flexDirection: 'row', alignItems: 'center', gap: 10,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
        }}>
            <Text style={{ fontSize: 18 }}>{config.icon}</Text>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: config.text }}>{toast.message}</Text>
        </Animated.View>
    );
}
