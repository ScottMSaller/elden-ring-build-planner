import { EquipmentList } from '@/components/EquipmentList';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ItemCategory = 'items' | 'shields' | 'talismans' | 'spirits' | 'ashes';
type ColorScheme = 'light' | 'dark';

const categories = [
  { key: 'items' as ItemCategory, title: 'Items' },
  { key: 'shields' as ItemCategory, title: 'Shields' },
  { key: 'talismans' as ItemCategory, title: 'Talismans' },
  { key: 'spirits' as ItemCategory, title: 'Spirits' },
  { key: 'ashes' as ItemCategory, title: 'Ashes of War' },
];

export default function ItemsScreen() {
  const [activeTab, setActiveTab] = useState<ItemCategory>('items');
  const colorScheme = useColorScheme() as ColorScheme;
  const colors = Colors[colorScheme];

  const TabButton = ({ category }: { category: { key: ItemCategory; title: string } }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === category.key ? '#666666' : 'rgba(255, 255, 255, 0.05)',
          borderColor: activeTab === category.key ? '#666666' : colors.text,
        },
      ]}
      onPress={() => setActiveTab(category.key)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === category.key ? '#FFFFFF' : colors.text },
      ]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
    <ThemedView style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {categories.map((category) => (
          <TabButton key={category.key} category={category} />
        ))}
      </ScrollView>
      
      <EquipmentList
        title={categories.find(c => c.key === activeTab)?.title || ''}
        type={activeTab}
        showRequirements={activeTab === 'shields'}
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
    maxHeight: 60,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContent: {
    gap: 8,
    paddingRight: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    height: 36,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 