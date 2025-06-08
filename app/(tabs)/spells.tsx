import { EquipmentList } from '@/components/EquipmentList';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ColorScheme = 'light' | 'dark';

export default function SpellsScreen() {
  const [activeTab, setActiveTab] = useState<'sorceries' | 'incantations'>('sorceries');
  const colorScheme = useColorScheme() as ColorScheme;
  const colors = Colors[colorScheme];

  const TabButton = ({ tab, title }: { tab: 'sorceries' | 'incantations'; title: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tab ? '#666666' : 'rgba(255, 255, 255, 0.05)',
          borderColor: activeTab === tab ? '#666666' : colors.text,
        },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === tab ? '#FFFFFF' : colors.text },
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
      <EquipmentList
        title={activeTab === 'sorceries' ? 'Sorceries' : 'Incantations'}
        type={activeTab}
        showRequirements={true}
        key={activeTab}
      />
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
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 44,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 