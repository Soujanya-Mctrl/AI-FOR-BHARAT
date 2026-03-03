import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ErrorStateProps { message: string; onRetry?: () => void; }

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
            <Ionicons name="alert-circle-outline" size={64} color={Colors.error.DEFAULT} />
            <Text style={{ marginTop: 16, fontSize: 16, color: Colors.text, textAlign: 'center' }}>{message}</Text>
            {onRetry && (
                <Pressable onPress={onRetry} style={{ marginTop: 20, backgroundColor: Colors.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
                    <Text style={{ color: Colors.white, fontWeight: '600' }}>Retry</Text>
                </Pressable>
            )}
        </View>
    );
}
