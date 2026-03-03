import { ReportForm } from '@/components/forms/ReportForm';
import { CameraCapture } from '@/components/native/CameraCapture';
import { CashbackBadge } from '@/components/shared/CashbackBadge';
import { Colors } from '@/constants/colors';
import { useLocation } from '@/hooks/useLocation';
import * as locationService from '@/services/location.service';
import { reportService } from '@/services/report.service';
import { useUIStore } from '@/stores/uiStore';
import { compressImage } from '@/utils/imageUtils';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

type Step = 'camera' | 'result' | 'form' | 'success';

export default function ReportScreen() {
    const [step, setStep] = useState<Step>('camera');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [classification, setClassification] = useState<any>(null);
    const [category, setCategory] = useState('other');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('Detecting...');
    const [isLoading, setIsLoading] = useState(false);
    const { currentLocation } = useLocation();
    const showToast = useUIStore((s) => s.showToast);

    const handleCapture = async (uri: string) => {
        setImageUri(uri);
        setIsLoading(true);
        try {
            const compressed = await compressImage(uri);
            setImageUri(compressed);

            // Get address
            if (currentLocation) {
                const addr = await locationService.reverseGeocode(currentLocation.lat, currentLocation.lng);
                setAddress(addr);
            }

            // Classify
            const result = await reportService.classifyWaste(compressed);
            setClassification(result);
            setCategory(result.wasteType || 'other');
            setStep('result');
        } catch {
            showToast('Failed to classify image. Try again.', 'error');
            setStep('camera');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!imageUri) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', { uri: imageUri, type: 'image/jpeg', name: 'waste.jpg' } as any);
            formData.append('title', `${category} waste report`);
            formData.append('description', description || 'Waste report submitted via mobile');
            formData.append('location', address);
            formData.append('category', category);

            await reportService.createReport(formData);
            setStep('success');
        } catch {
            showToast('Failed to submit report', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'camera') {
        return <CameraCapture onCapture={handleCapture} />;
    }

    if (step === 'result' && classification) {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24 }}>
                {imageUri && <Image source={{ uri: imageUri }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 20 }} />}
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <Text style={{ fontSize: 48 }}>{classification.emoji || '🗑️'}</Text>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 8 }}>
                        {classification.wasteType || 'Unknown'}
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 4 }}>
                        Detected by AI • {classification.pointsAwarded || 0} points
                    </Text>
                </View>

                <Pressable onPress={() => setStep('form')} style={{ backgroundColor: Colors.primary[600], paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}>
                    <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}>Continue</Text>
                </Pressable>
                <Pressable onPress={() => setStep('camera')} style={{ marginTop: 12, alignItems: 'center' }}>
                    <Text style={{ color: Colors.textSecondary }}>Retake Photo</Text>
                </Pressable>
            </ScrollView>
        );
    }

    if (step === 'form') {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 20 }}>Submit Report</Text>
                <ReportForm category={category} onCategoryChange={setCategory} description={description} onDescriptionChange={setDescription} address={address} />
                <Pressable onPress={handleSubmit} disabled={isLoading} style={{ marginTop: 24, backgroundColor: isLoading ? Colors.neutral[300] : Colors.primary[600], paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}>
                    {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}>Submit Report</Text>}
                </Pressable>
            </ScrollView>
        );
    }

    // Success step
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: Colors.background }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎉</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Report Submitted!</Text>
            <View style={{ marginTop: 16 }}>
                <CashbackBadge amount={classification?.pointsAwarded || 0} pending />
            </View>
            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 12, textAlign: 'center' }}>
                Points confirmed after kabadiwalla pickup
            </Text>
            <Pressable onPress={() => { setStep('camera'); setImageUri(null); setClassification(null); }} style={{ marginTop: 32, backgroundColor: Colors.primary[600], paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 }}>
                <Text style={{ color: Colors.white, fontWeight: '700' }}>Report Another</Text>
            </Pressable>
        </View>
    );
}
