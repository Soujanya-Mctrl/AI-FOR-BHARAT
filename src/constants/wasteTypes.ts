export interface WasteType {
    id: string;
    label: string;
    icon: string;
    emoji: string;
    color: string;
    points: number;
    baseCashbackINR: number;
    binColor: string;
    description: string;
}

export const WASTE_TYPES: Record<string, WasteType> = {
    plastic: {
        id: 'plastic',
        label: 'Plastic',
        icon: 'bottle-soda-outline',
        emoji: '♻️',
        color: '#3b82f6',
        points: 10,
        baseCashbackINR: 4,
        binColor: 'Blue',
        description: 'Plastic bottles, bags, containers, wrappers',
    },
    biodegradable: {
        id: 'biodegradable',
        label: 'Biodegradable',
        icon: 'leaf',
        emoji: '🌿',
        color: '#22c55e',
        points: 5,
        baseCashbackINR: 3,
        binColor: 'Green',
        description: 'Food scraps, garden waste, organic matter',
    },
    hazardous: {
        id: 'hazardous',
        label: 'Hazardous',
        icon: 'alert-circle-outline',
        emoji: '⚠️',
        color: '#ef4444',
        points: 15,
        baseCashbackINR: 5,
        binColor: 'Red',
        description: 'Batteries, chemicals, electronics, medical waste',
    },
    glass: {
        id: 'glass',
        label: 'Glass',
        icon: 'glass-fragile',
        emoji: '🏺',
        color: '#8b5cf6',
        points: 8,
        baseCashbackINR: 4,
        binColor: 'Blue',
        description: 'Glass bottles, jars, broken glass',
    },
    metal: {
        id: 'metal',
        label: 'Metal',
        icon: 'cog-outline',
        emoji: '🔩',
        color: '#6b7280',
        points: 8,
        baseCashbackINR: 4,
        binColor: 'Blue',
        description: 'Cans, foil, metal containers',
    },
    paper: {
        id: 'paper',
        label: 'Paper',
        icon: 'file-document-outline',
        emoji: '📄',
        color: '#f59e0b',
        points: 5,
        baseCashbackINR: 3,
        binColor: 'Blue',
        description: 'Newspapers, cardboard, paper packaging',
    },
    other: {
        id: 'other',
        label: 'Other',
        icon: 'trash-can-outline',
        emoji: '🗑️',
        color: '#a3a3a3',
        points: 2,
        baseCashbackINR: 2,
        binColor: 'Gray',
        description: 'Mixed or unclassifiable waste',
    },
} as const;

export const WASTE_CATEGORIES = Object.keys(WASTE_TYPES) as Array<keyof typeof WASTE_TYPES>;
