import { EquipmentList } from '@/components/EquipmentList';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { eldenRingApi } from '@/services/eldenRingApi';
import React from 'react';

export default function WeaponsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background}}>
    <EquipmentList
      title="Weapons"
      fetchData={eldenRingApi.getAllWeapons.bind(eldenRingApi)}
      searchData={eldenRingApi.searchWeapons.bind(eldenRingApi)}
      showRequirements={true}
    />
    </SafeAreaWrapper>
  );
} 