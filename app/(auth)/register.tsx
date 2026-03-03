import { RegisterForm } from '@/components/forms/RegisterForm';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

export default function RegisterScreen() {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (data: { username: string; email: string; password: string; role: string }) => {
        setIsLoading(true);
        try {
            const { authClient } = require('@/services/betterAuth');
            const { data: signUpData, error } = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.username,
                // We map custom fields into the additionalFields we defined in backend
                role: data.role,
            });
            if (error) {
                console.error("Register Error", error);
                return;
            }
            // After successful sign in with better-auth, hydrate the global store
            const { useAuthStore } = require('@/stores/authStore');
            await useAuthStore.getState().hydrateFromStorage();

            if (data.role === 'kabadiwalla') {
                router.replace('/(kabadiwalla)/onboarding');
            } else {
                router.replace('/(auth)/onboarding');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { authClient } = require('@/services/betterAuth');
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "ecowaste://",
            });
        } catch (error) {
            console.error("Google Login Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60, backgroundColor: Colors.background }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.text }}>Create Account</Text>
                <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }}>
                    Join EcoWaste and start making a difference
                </Text>

                <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

                <Pressable onPress={() => router.back()} style={{ marginTop: 24, alignItems: 'center' }}>
                    <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>
                        Already have an account?{' '}
                        <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>Sign In</Text>
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
                    style={{ backgroundColor: Colors.white, paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 40 }}
                >
                    <Ionicons name="logo-google" size={20} color={Colors.text} />
                    <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '600' }}>Continue with Google</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
