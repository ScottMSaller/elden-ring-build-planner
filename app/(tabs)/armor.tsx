import { EquipmentList } from '@/components/EquipmentList';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { eldenRingApi } from '@/services/eldenRingApi';
import React from 'react';

export default function ArmorScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background}}>
    <EquipmentList
      title="Armor"
      fetchData={eldenRingApi.getAllArmors.bind(eldenRingApi)}
      searchData={eldenRingApi.searchArmors.bind(eldenRingApi)}
      showRequirements={false}
    />
    </SafeAreaWrapper>
  );
} 