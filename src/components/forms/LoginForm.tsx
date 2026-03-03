import { Colors } from '@/constants/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    return (
        <View style={{ gap: 16 }}>
            <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={{ borderWidth: 1, borderColor: errors.email ? Colors.error.DEFAULT : Colors.border, borderRadius: 10, padding: 14, fontSize: 16, color: Colors.text, backgroundColor: Colors.white }}
                            placeholder="you@example.com"
                            placeholderTextColor={Colors.neutral[400]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
                {errors.email && <Text style={{ color: Colors.error.DEFAULT, fontSize: 12, marginTop: 4 }}>{errors.email.message}</Text>}
            </View>

            <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>Password</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={{ borderWidth: 1, borderColor: errors.password ? Colors.error.DEFAULT : Colors.border, borderRadius: 10, padding: 14, fontSize: 16, color: Colors.text, backgroundColor: Colors.white }}
                            placeholder="Enter password"
                            placeholderTextColor={Colors.neutral[400]}
                            secureTextEntry
                            autoComplete="password"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
                {errors.password && <Text style={{ color: Colors.error.DEFAULT, fontSize: 12, marginTop: 4 }}>{errors.password.message}</Text>}
            </View>

            <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                style={{ backgroundColor: isLoading ? Colors.primary[400] : Colors.primary[600], paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
            >
                {isLoading ? (
                    <ActivityIndicator color={Colors.white} />
                ) : (
                    <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>Sign In</Text>
                )}
            </Pressable>
        </View>
    );
}
