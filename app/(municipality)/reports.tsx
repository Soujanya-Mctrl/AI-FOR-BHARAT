import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { DataTable } from '@/components/web/DataTable';
import { ExportButton } from '@/components/web/ExportButton';
import { Colors } from '@/constants/colors';
import { municipalityService } from '@/services/municipality.service';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function MunicipalityReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await municipalityService.getReports({ limit: 50 });
                setReports(data.reports || []);
            } catch { } finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <LoadingSpinner message="Loading reports..." />;

    const columns = [
        { key: 'date', label: 'Date', width: 100 },
        { key: 'area', label: 'Area', width: 150 },
        { key: 'qualityScore', label: 'Quality', width: 80 },
        { key: 'status', label: 'Status', width: 100 },
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={{ paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Verified Reports</Text>
                <ExportButton data={reports} filename="ecowaste_reports" />
            </View>
            <View style={{ margin: 16 }}>
                <DataTable columns={columns} data={reports} />
            </View>
        </ScrollView>
    );
}
