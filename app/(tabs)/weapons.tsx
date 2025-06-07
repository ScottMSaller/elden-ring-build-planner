import { EquipmentList } from '@/components/EquipmentList';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';

export default function WeaponsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background}}>
      <EquipmentList
        title="Weapons"
        type="weapons"
        showRequirements={true}
      />
    </SafeAreaWrapper>
  );
} 