import { EquipmentList } from '@/components/EquipmentList';
import { eldenRingApi } from '@/services/eldenRingApi';
import React from 'react';

export default function ArmorScreen() {
  return (
    <EquipmentList
      title="Armor"
      fetchData={eldenRingApi.getAllArmors.bind(eldenRingApi)}
      searchData={eldenRingApi.searchArmors.bind(eldenRingApi)}
      showRequirements={false}
    />
  );
} 