import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(30),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['citizen', 'kabadiwalla']),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => Promise<void>;
    isLoading?: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: '', email: '', password: '', confirmPassword: '', role: 'citizen' },
    });

    const selectedRole = watch('role');

    const InputField = ({ name, label, placeholder, secureTextEntry, keyboardType, autoComplete }: any) => (
        <View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>{label}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={{ borderWidth: 1, borderColor: (errors as any)[name] ? Colors.error.DEFAULT : Colors.border, borderRadius: 10, padding: 14, fontSize: 16, color: Colors.text, backgroundColor: Colors.white }}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.neutral[400]}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                        autoCapitalize={name === 'email' ? 'none' : 'words'}
                        autoComplete={autoComplete}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                    />
                )}
            />
            {(errors as any)[name] && <Text style={{ color: Colors.error.DEFAULT, fontSize: 12, marginTop: 4 }}>{(errors as any)[name]?.message}</Text>}
        </View>
    );

    return (
        <View style={{ gap: 16 }}>
            {/* Role Picker */}
            <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 8 }}>I am a...</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable
                        onPress={() => setValue('role', 'citizen')}
                        style={{ flex: 1, borderWidth: 2, borderColor: selectedRole === 'citizen' ? Colors.primary[600] : Colors.border, borderRadius: 12, padding: 16, alignItems: 'center', backgroundColor: selectedRole === 'citizen' ? Colors.primary[50] : Colors.white }}
                    >
                        <Ionicons name="home-outline" size={28} color={selectedRole === 'citizen' ? Colors.primary[600] : Colors.neutral[400]} />
                        <Text style={{ marginTop: 8, fontWeight: '600', color: selectedRole === 'citizen' ? Colors.primary[700] : Colors.text }}>Citizen</Text>
                        <Text style={{ fontSize: 11, color: Colors.textSecondary, marginTop: 2 }}>I generate waste</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setValue('role', 'kabadiwalla')}
                        style={{ flex: 1, borderWidth: 2, borderColor: selectedRole === 'kabadiwalla' ? Colors.secondary[600] : Colors.border, borderRadius: 12, padding: 16, alignItems: 'center', backgroundColor: selectedRole === 'kabadiwalla' ? Colors.secondary[50] : Colors.white }}
                    >
                        <Ionicons name="bicycle-outline" size={28} color={selectedRole === 'kabadiwalla' ? Colors.secondary[600] : Colors.neutral[400]} />
                        <Text style={{ marginTop: 8, fontWeight: '600', color: selectedRole === 'kabadiwalla' ? Colors.secondary[700] : Colors.text }}>Kabadiwalla</Text>
                        <Text style={{ fontSize: 11, color: Colors.textSecondary, marginTop: 2 }}>I collect waste</Text>
                    </Pressable>
                </View>
                {errors.role && <Text style={{ color: Colors.error.DEFAULT, fontSize: 12, marginTop: 4 }}>{errors.role.message}</Text>}
            </View>

            <InputField name="username" label="Username" placeholder="Your name" autoComplete="username" />
            <InputField name="email" label="Email" placeholder="you@example.com" keyboardType="email-address" autoComplete="email" />
            <InputField name="password" label="Password" placeholder="Min 8 characters" secureTextEntry autoComplete="new-password" />
            <InputField name="confirmPassword" label="Confirm Password" placeholder="Re-enter password" secureTextEntry autoComplete="new-password" />

            <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                style={{ backgroundColor: isLoading ? Colors.primary[400] : Colors.primary[600], paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
            >
                {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>Create Account</Text>}
            </Pressable>
        </View>
    );
}
