import { LoginForm } from '@/components/forms/LoginForm';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

export default function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);

    const { login, loginWithGoogle } = useAuth();

    const handleLogin = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);

            // After successful sign in with better-auth, hydrate the global store
            const { useAuthStore } = require('@/stores/authStore');
            await useAuthStore.getState().hydrateFromStorage();

            // Route based on role
            const role = useAuthStore.getState().role;
            switch (role) {
                case 'kabadiwalla': router.replace('/(kabadiwalla)'); break;
                case 'municipality': router.replace('/(municipality)'); break;
                case 'admin': router.replace('/(admin)'); break;
                default: router.replace('/(citizen)'); break;
            }
        } catch (error) {
            console.error("Login Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error("Google Login Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: Colors.background }}>
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary[600], justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="leaf" size={40} color={Colors.white} />
                    </View>
                    <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.primary[700], marginTop: 16 }}>EcoWaste</Text>
                    <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 4 }}>Segregate. Earn. Save the planet.</Text>
                </View>

                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

                <Pressable onPress={() => router.push('/(auth)/register')} style={{ marginTop: 24, alignItems: 'center' }}>
                    <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>
                        Don't have an account?{' '}
                        <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>Register</Text>
                    </Text>
                </Pressable>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
                    <Text style={{ color: Colors.textSecondary, marginHorizontal: 12, fontSize: 14 }}>OR</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
                </View>

                <Pressable
                    onPress={handleGoogleLogin}
                    disabled={isLoading}
                    style={{ backgroundColor: Colors.white, paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', justifyContent: 'center', gap: 12 }}
                >
                    <Ionicons name="logo-google" size={20} color={Colors.text} />
                    <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '600' }}>Continue with Google</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
