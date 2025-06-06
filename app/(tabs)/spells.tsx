import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { SpellList } from '@/components/SpellList';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { eldenRingApi } from '@/services/eldenRingApi';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SpellsScreen() {
  const [activeTab, setActiveTab] = useState<'sorceries' | 'incantations'>('sorceries');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const TabButton = ({ tab, title }: { tab: 'sorceries' | 'incantations'; title: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && { backgroundColor: colors.tint },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.tabButtonTextActive,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background}}>
    <ThemedView style={styles.container}>
      <View style={styles.tabContainer}>
        <TabButton tab="sorceries" title="Sorceries" />
        <TabButton tab="incantations" title="Incantations" />
      </View>
      {activeTab === 'sorceries' ? (
        <SpellList
          title="Sorceries"
          fetchData={eldenRingApi.getAllSorceries.bind(eldenRingApi)}
          searchData={eldenRingApi.searchSorceries.bind(eldenRingApi)}
        />
      ) : (
        <SpellList
          title="Incantations"
          fetchData={eldenRingApi.getAllIncantations.bind(eldenRingApi)}
          searchData={eldenRingApi.searchIncantations.bind(eldenRingApi)}
        />
      )}
    </ThemedView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  tabButtonTextActive: {
    color: 'white',
  },
}); 