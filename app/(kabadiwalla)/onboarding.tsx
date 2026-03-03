import { Colors } from '@/constants/colors';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function KabadiwalaOnboarding() {
    const [pincodes, setPincodes] = useState('');
    const [upiId, setUpiId] = useState('');
    const [loading, setLoading] = useState(false);
    const updateUser = useAuthStore((s) => s.updateUser);
    const showToast = useUIStore((s) => s.showToast);

    const handleSubmit = async () => {
        if (!pincodes.trim()) { showToast('Please enter at least one pincode', 'warning'); return; }
        setLoading(true);
        try {
            const pinList = pincodes.split(',').map((p) => p.trim()).filter(Boolean);
            const user = await userService.updateKabadiwalaProfile({ serviceAreaPincodes: pinList, upiId: upiId || undefined });
            updateUser(user);
            showToast('Profile set up! Welcome aboard. 🚲', 'success');
            router.replace('/(kabadiwalla)');
        } catch { showToast('Failed to save profile', 'error'); } finally { setLoading(false); }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.text }}>Welcome, Kabadiwalla!</Text>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 32 }}>Set up your profile to start receiving pickup requests</Text>

            <View style={{ gap: 16 }}>
                <View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>Service Area Pincodes</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, fontSize: 16, color: Colors.text, backgroundColor: Colors.white }}
                        placeholder="110001, 110002, 110003"
                        placeholderTextColor={Colors.neutral[400]}
                        value={pincodes}
                        onChangeText={setPincodes}
                    />
                    <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>Enter comma-separated pincodes</Text>
                </View>

                <View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>UPI ID (for payments)</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, fontSize: 16, color: Colors.text, backgroundColor: Colors.white }}
                        placeholder="yourname@upi"
                        placeholderTextColor={Colors.neutral[400]}
                        value={upiId}
                        onChangeText={setUpiId}
                        autoCapitalize="none"
                    />
                </View>

                <Pressable onPress={handleSubmit} disabled={loading} style={{ backgroundColor: loading ? Colors.neutral[300] : Colors.secondary[600], paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 }}>
                    {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}>Complete Setup</Text>}
                </Pressable>
            </View>
        </ScrollView>
    );
}
