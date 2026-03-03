import { Colors } from '@/constants/colors';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const modules = [
    { id: 1, title: 'What is Source Segregation?', duration: '5 min read', icon: '📚', content: 'Source segregation means separating waste at the point of generation — your home. Instead of mixing all waste together, you separate it into categories: wet (biodegradable), dry (recyclable), and hazardous. This is the single most impactful action you can take for waste management.' },
    { id: 2, title: 'Wet Waste — Green Bin', duration: '3 min read', icon: '🟢', content: 'Green bin receives all biodegradable waste: food scraps, vegetable peels, fruit rinds, tea leaves, coffee grounds, garden waste, egg shells, and spoiled food. This waste can be composted into fertilizer.' },
    { id: 3, title: 'Dry Waste — Blue Bin', duration: '3 min read', icon: '🔵', content: 'Blue bin receives all recyclable waste: plastic bottles, paper, cardboard, metal cans, glass bottles, tetra packs, and clean packaging. Rinse containers before placing them in the blue bin.' },
    { id: 4, title: 'Hazardous Waste — Red Bin', duration: '3 min read', icon: '🔴', content: 'Red bin receives dangerous waste: batteries, expired medicines, syringes, broken glass, electronic waste (e-waste), paints, and chemicals. Never mix hazardous waste with regular waste.' },
    { id: 5, title: 'Why It Matters', duration: '3 min read', icon: '🌍', content: 'India generates 62 million tonnes of waste per year. Only 11.9 million tonnes gets processed correctly. Correct segregation at source is the foundation of the entire waste management chain. Your action directly impacts how much waste ends up in landfills vs being recycled.' },
];

export default function TrainingScreen() {
    const [currentModule, setCurrentModule] = useState(0);
    const [completed, setCompleted] = useState<Set<number>>(new Set());
    const showToast = useUIStore((s) => s.showToast);
    const updateUser = useAuthStore((s) => s.updateUser);

    const handleComplete = (id: number) => {
        setCompleted((prev) => new Set(prev).add(id));
        if (currentModule < modules.length - 1) {
            setCurrentModule(currentModule + 1);
        }
    };

    const handleFinish = async () => {
        try {
            await userService.completeTraining();
            updateUser({ trainingComplete: true });
            showToast('Training complete! You can now request pickups. 🎉', 'success');
            router.replace('/(citizen)');
        } catch {
            showToast('Failed to save training progress', 'error');
        }
    };

    const allDone = completed.size === modules.length;
    const mod = modules[currentModule];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Segregation Training</Text>
            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 4 }}>
                Complete all modules to unlock pickups and cashback
            </Text>

            {/* Progress */}
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 20 }}>
                {modules.map((m, i) => (
                    <View key={m.id} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: completed.has(m.id) ? Colors.primary[600] : Colors.neutral[200] }} />
                ))}
            </View>
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 6 }}>{completed.size}/{modules.length} completed</Text>

            {/* Current Module */}
            <View style={{ marginTop: 24, backgroundColor: Colors.white, borderRadius: 16, padding: 20 }}>
                <Text style={{ fontSize: 32, textAlign: 'center' }}>{mod.icon}</Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.text, textAlign: 'center', marginTop: 12 }}>{mod.title}</Text>
                <Text style={{ fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 4 }}>{mod.duration}</Text>
                <Text style={{ fontSize: 15, color: Colors.text, lineHeight: 24, marginTop: 16 }}>{mod.content}</Text>

                <Pressable
                    onPress={() => handleComplete(mod.id)}
                    disabled={completed.has(mod.id)}
                    style={{ marginTop: 20, backgroundColor: completed.has(mod.id) ? Colors.neutral[200] : Colors.primary[600], paddingVertical: 14, borderRadius: 10, alignItems: 'center' }}
                >
                    <Text style={{ color: completed.has(mod.id) ? Colors.textSecondary : Colors.white, fontWeight: '600' }}>
                        {completed.has(mod.id) ? '✓ Completed' : 'Mark as Complete'}
                    </Text>
                </Pressable>
            </View>

            {/* Module list */}
            <View style={{ marginTop: 24, gap: 8 }}>
                {modules.map((m, i) => (
                    <Pressable key={m.id} onPress={() => setCurrentModule(i)} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: i === currentModule ? Colors.primary[50] : Colors.white, borderRadius: 10, gap: 10 }}>
                        <Text style={{ fontSize: 18 }}>{m.icon}</Text>
                        <Text style={{ flex: 1, fontSize: 14, color: Colors.text, fontWeight: i === currentModule ? '600' : '400' }}>{m.title}</Text>
                        {completed.has(m.id) && <Ionicons name="checkmark-circle" size={20} color={Colors.success.DEFAULT} />}
                    </Pressable>
                ))}
            </View>

            {allDone && (
                <Pressable onPress={handleFinish} style={{ marginTop: 24, backgroundColor: Colors.primary[600], paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}>
                    <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}>🎓 Finish Training</Text>
                </Pressable>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}
