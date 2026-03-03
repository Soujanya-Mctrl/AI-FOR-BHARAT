import { Colors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable, Text, View } from 'react-native';

interface BottomSheetProps { visible: boolean; onClose: () => void; title?: string; children: React.ReactNode; }

export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }).start();
        } else {
            Animated.timing(slideAnim, { toValue: Dimensions.get('window').height, duration: 250, useNativeDriver: true }).start();
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={onClose} />
            <Animated.View style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
                maxHeight: '80%', transform: [{ translateY: slideAnim }],
            }}>
                <View style={{ alignItems: 'center', paddingTop: 12 }}>
                    <View style={{ width: 40, height: 4, backgroundColor: Colors.neutral[300], borderRadius: 2 }} />
                </View>
                {title && <Text style={{ fontSize: 18, fontWeight: '700', padding: 16, color: Colors.text }}>{title}</Text>}
                <View style={{ padding: 16 }}>{children}</View>
            </Animated.View>
        </Modal>
    );
}
