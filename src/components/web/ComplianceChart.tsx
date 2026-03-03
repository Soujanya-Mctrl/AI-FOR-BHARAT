import { Colors } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

interface ComplianceChartProps { data: Array<{ label: string; value: number }>; type: 'line' | 'bar' | 'area'; title: string; }

export function ComplianceChart({ data, type, title }: ComplianceChartProps) {
    const maxVal = Math.max(...data.map((d) => d.value), 1);

    return (
        <View style={{ backgroundColor: Colors.white, borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 16 }}>{title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 120 }}>
                {data.map((d, i) => (
                    <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{
                            width: '80%',
                            height: (d.value / maxVal) * 100,
                            backgroundColor: Colors.primary[500],
                            borderRadius: 4,
                            minHeight: 4,
                        }} />
                        <Text style={{ fontSize: 9, color: Colors.textSecondary, marginTop: 4 }}>{d.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
