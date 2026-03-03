import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, Text } from 'react-native';

interface ExportButtonProps { data: any[]; filename: string; }

export function ExportButton({ data, filename }: ExportButtonProps) {
    const handleExport = () => {
        if (Platform.OS !== 'web' || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Pressable onPress={handleExport} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary[600], paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
            <Ionicons name="download-outline" size={18} color={Colors.white} />
            <Text style={{ color: Colors.white, fontWeight: '600', fontSize: 14 }}>Export CSV</Text>
        </Pressable>
    );
}
