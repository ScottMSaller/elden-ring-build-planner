import { EquipmentList } from '@/components/EquipmentList';
import { eldenRingApi } from '@/services/eldenRingApi';
import React from 'react';

export default function WeaponsScreen() {
  return (
    <EquipmentList
      title="Weapons"
      fetchData={eldenRingApi.getAllWeapons.bind(eldenRingApi)}
      searchData={eldenRingApi.searchWeapons.bind(eldenRingApi)}
      showRequirements={true}
    />
  );
} 