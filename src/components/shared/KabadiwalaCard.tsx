import { Colors } from '@/constants/colors';
import type { NearbyKabadiwalla } from '@/types/user.types';
import { formatDistance } from '@/utils/formatters';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { RatingStars } from './RatingStars';
import { TrustScoreBadge } from './TrustScoreBadge';

interface KabadiwalaCardProps {
    kabadiwalla: NearbyKabadiwalla;
    onRequest?: () => void;
}

export function KabadiwalaCard({ kabadiwalla, onRequest }: KabadiwalaCardProps) {
    return (
        <View style={{
            backgroundColor: Colors.white,
            borderRadius: 12,
            padding: 16,
            marginHorizontal: 16,
            marginVertical: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>{kabadiwalla.username}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                            {formatDistance(kabadiwalla.distance)} away
                        </Text>
                        <Text style={{ color: Colors.neutral[300] }}>•</Text>
                        <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                            ~{kabadiwalla.estimatedArrivalMinutes} min
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <TrustScoreBadge score={kabadiwalla.reliabilityScore} />
                        <RatingStars value={kabadiwalla.kabadiwalaProfile?.accuracyScore ? Math.round(kabadiwalla.kabadiwalaProfile.accuracyScore / 20) : 3} readonly size={14} />
                    </View>
                </View>
                {onRequest && (
                    <Pressable
                        onPress={onRequest}
                        style={{
                            backgroundColor: Colors.primary[600],
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: Colors.white, fontWeight: '600', fontSize: 13 }}>Request</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
