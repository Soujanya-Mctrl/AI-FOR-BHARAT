import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface CameraCaptureProps {
    onCapture: (uri: string) => void;
    onClose?: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const [facing, setFacing] = useState<'front' | 'back'>('back');
    const [flash, setFlash] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        if (!permission?.granted) requestPermission();
    }, []);

    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permText}>Camera access is needed to photograph waste for AI classification.</Text>
                <Pressable onPress={requestPermission} style={styles.permBtn}>
                    <Text style={{ color: Colors.white, fontWeight: '600' }}>Grant Access</Text>
                </Pressable>
            </View>
        );
    }

    const handleCapture = async () => {
        if (!cameraRef.current) return;
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        if (photo?.uri) onCapture(photo.uri);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} flash={flash ? 'on' : 'off'}>
                {/* Top bar */}
                <View style={styles.topBar}>
                    {onClose && (
                        <Pressable onPress={onClose} style={styles.iconBtn}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </Pressable>
                    )}
                    <Pressable onPress={() => setFlash(!flash)} style={styles.iconBtn}>
                        <Ionicons name={flash ? 'flash' : 'flash-off'} size={24} color="#fff" />
                    </Pressable>
                    <Pressable onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')} style={styles.iconBtn}>
                        <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
                    </Pressable>
                </View>

                {/* Capture button */}
                <View style={styles.bottomBar}>
                    <Pressable onPress={handleCapture} style={styles.captureBtn}>
                        <View style={styles.captureInner} />
                    </Pressable>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: Colors.background },
    permText: { fontSize: 16, color: Colors.text, textAlign: 'center', marginBottom: 20 },
    permBtn: { backgroundColor: Colors.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 50 },
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    bottomBar: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
    captureBtn: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff' },
});
