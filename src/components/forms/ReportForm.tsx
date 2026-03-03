import { Colors } from '@/constants/colors';
import { WASTE_TYPES } from '@/constants/wasteTypes';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface ReportFormProps {
    category: string;
    onCategoryChange: (cat: string) => void;
    description: string;
    onDescriptionChange: (desc: string) => void;
    address: string;
}

export function ReportForm({ category, onCategoryChange, description, onDescriptionChange, address }: ReportFormProps) {
    const categories = Object.values(WASTE_TYPES);

    return (
        <View style={{ gap: 16 }}>
            <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 8 }}>Category</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {categories.map((cat) => (
                        <Pressable
                            key={cat.id}
                            onPress={() => onCategoryChange(cat.id)}
                            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: category === cat.id ? cat.color : Colors.border, backgroundColor: category === cat.id ? cat.color + '15' : Colors.white }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '500', color: category === cat.id ? cat.color : Colors.textSecondary }}>
                                {cat.emoji} {cat.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>Description</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.white, minHeight: 80, textAlignVertical: 'top' }}
                    placeholder="Describe the waste..."
                    placeholderTextColor={Colors.neutral[400]}
                    multiline
                    maxLength={500}
                    value={description}
                    onChangeText={onDescriptionChange}
                />
            </View>

            <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>Location</Text>
                <View style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, backgroundColor: Colors.neutral[100] }}>
                    <Text style={{ fontSize: 14, color: Colors.textSecondary }}>{address || 'Detecting location...'}</Text>
                </View>
            </View>
        </View>
    );
}
