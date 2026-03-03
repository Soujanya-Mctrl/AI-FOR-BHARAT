import { Colors } from '@/constants/colors';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingSpinnerProps { message?: string; }

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
            {message && <Text style={{ marginTop: 12, color: Colors.textSecondary, fontSize: 14 }}>{message}</Text>}
        </View>
    );
}
