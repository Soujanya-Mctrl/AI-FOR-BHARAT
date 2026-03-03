import { Colors } from '@/constants/colors';
import { setItem } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
    { icon: 'leaf' as const, title: 'What EcoWaste Does', desc: 'Segregate your waste correctly and earn real cashback. Every pickup is verified automatically.', color: Colors.primary[600] },
    { icon: 'trash-bin' as const, title: 'How Segregation Works', desc: 'Green bin for wet waste (food scraps). Blue bin for dry waste (plastic, paper). Red bin for hazardous waste (batteries, chemicals).', color: Colors.secondary[600] },
    { icon: 'wallet' as const, title: 'How Cashback Works', desc: 'A kabadiwalla picks up your waste, confirms quality, and money hits your in-app wallet. Withdraw via UPI anytime.', color: Colors.success.dark },
];

export default function OnboardingScreen() {
    const [current, setCurrent] = useState(0);

    const complete = async () => {
        await setItem('onboarding_complete', 'true');
        router.replace('/(citizen)');
    };

    const slide = slides[current];

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 32 }}>
            <View style={{ alignItems: 'center' }}>
                <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: slide.color + '20', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={slide.icon} size={48} color={slide.color} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: 32, textAlign: 'center' }}>{slide.title}</Text>
                <Text style={{ fontSize: 15, color: Colors.textSecondary, marginTop: 12, textAlign: 'center', lineHeight: 22 }}>{slide.desc}</Text>
            </View>

            {/* Dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                {slides.map((_, i) => (
                    <View key={i} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === current ? Colors.primary[600] : Colors.neutral[300] }} />
                ))}
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                <Pressable onPress={complete}>
                    <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '500' }}>Skip</Text>
                </Pressable>
                <Pressable
                    onPress={() => current < slides.length - 1 ? setCurrent(current + 1) : complete()}
                    style={{ backgroundColor: Colors.primary[600], paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 }}
                >
                    <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}>
                        {current < slides.length - 1 ? 'Next' : 'Get Started'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
