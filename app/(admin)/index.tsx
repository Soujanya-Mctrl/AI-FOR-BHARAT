import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function AdminHome() {
    const { logout } = useAuth();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Admin Panel</Text>
                <Pressable onPress={logout} style={{ padding: 8 }}>
                    <Ionicons name="log-out-outline" size={24} color={Colors.neutral[500]} />
                </Pressable>
            </View>

            <View style={{ marginTop: 24, gap: 12 }}>
                <Pressable onPress={() => router.push('/(admin)/flags')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 20, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.error.light, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="flag-outline" size={22} color={Colors.error.DEFAULT} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>Anomaly Flags</Text>
                        <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>Review flagged accounts and suspicious activity</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.neutral[400]} />
                </Pressable>

                <Pressable onPress={() => router.push('/(admin)/kabadiwallas')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 20, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.secondary[100], justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="people-outline" size={22} color={Colors.secondary[600]} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>Kabadiwalla Directory</Text>
                        <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>Manage kabadiwalla profiles and verification</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.neutral[400]} />
                </Pressable>
            </View>
        </ScrollView>
    );
}
