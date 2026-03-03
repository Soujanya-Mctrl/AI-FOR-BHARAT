import { Colors } from '@/constants/colors';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface Column { key: string; label: string; width?: number; }
interface DataTableProps { columns: Column[]; data: any[]; onRowClick?: (row: any) => void; }

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator>
            <View>
                {/* Header */}
                <View style={{ flexDirection: 'row', backgroundColor: Colors.neutral[100], borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                    {columns.map((col) => (
                        <View key={col.key} style={{ width: col.width || 150, padding: 12 }}>
                            <Text style={{ fontWeight: '600', fontSize: 13, color: Colors.textSecondary }}>{col.label}</Text>
                        </View>
                    ))}
                </View>
                {/* Rows */}
                {data.map((row, idx) => (
                    <Pressable key={idx} onPress={() => onRowClick?.(row)} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.neutral[200] }}>
                        {columns.map((col) => (
                            <View key={col.key} style={{ width: col.width || 150, padding: 12 }}>
                                <Text style={{ fontSize: 13, color: Colors.text }}>{String(row[col.key] ?? '—')}</Text>
                            </View>
                        ))}
                    </Pressable>
                ))}
                {data.length === 0 && (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                        <Text style={{ color: Colors.textSecondary }}>No data available</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
