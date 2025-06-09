import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/contexts/FavoritesContext';
import armorData from '@/data/armors.json';
import ashesData from '@/data/ashes.json';
import incantationsData from '@/data/incantations.json';
import itemsData from '@/data/items.json';
import shieldsData from '@/data/shields.json';
import sorceriesData from '@/data/sorceries.json';
import spiritsData from '@/data/spirits.json';
import talismansData from '@/data/talismans.json';
import weaponsData from '@/data/weapons.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const DATA_MAP = {
  weapons: weaponsData,
  shields: shieldsData,
  sorceries: sorceriesData,
  spirits: spiritsData,
  talismans: talismansData,
  incantations: incantationsData,
  items: itemsData,
  ashes: ashesData,
  armors: armorData,
};

// Type guards for advanced property checks
function hasAttack(item: any): item is { attack: { name: string; amount: number | null }[] } {
  return Array.isArray(item.attack);
}
function hasDefence(item: any): item is { defence: { name: string; amount: number | null }[] } {
  return Array.isArray(item.defence);
}
function hasScalesWith(item: any): item is { scalesWith: { name: string; scaling?: string }[] } {
  return Array.isArray(item.scalesWith);
}
function hasDmgNegation(item: any): item is { dmgNegation: { name: string; amount: number | null }[] } {
  return Array.isArray(item.dmgNegation);
}
function hasResistance(item: any): item is { resistance: { name: string; amount: number | null }[] } {
  return Array.isArray(item.resistance);
}

export default function ItemDetailsScreen() {
  const { id, type } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];
  const { toggleFavorite, isFavorite } = useFavorites();

  const item = DATA_MAP[type as keyof typeof DATA_MAP].find(i => i.id === id);
  const itemIsFavorite = isFavorite(id as string);

  if (!item) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
        <ThemedView style={styles.container}>
          <ThemedText>Item not found</ThemedText>
        </ThemedView>
      </SafeAreaWrapper>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerBackTitle: 'Back',
          headerTitle: '',
          contentStyle: { backgroundColor: colors.background },
          headerRight: () => (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite({ 
                id: item.id, 
                type: type as any, 
                name: item.name, 
                image: (item as any).image as string | undefined,
                requiredAttributes: (item as any).requiredAttributes,
                requires: (item as any).requires
              })}
            >
              <ThemedText style={[styles.favoriteIcon, itemIsFavorite && styles.favoriteIconActive]}>
                {itemIsFavorite ? '★' : '☆'}
              </ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={(item as any).image ? { uri: (item as any).image } : require('@/assets/images/partial-react-logo.png')}
              style={styles.image}
              defaultSource={require('@/assets/images/partial-react-logo.png')}
              resizeMode="contain"
            />
          </View>

          <ThemedText style={styles.name}>{item.name}</ThemedText>
          
          {(item as any).type && (
            <ThemedText style={styles.type}>{(item as any).type}</ThemedText>
          )}

          {(item as any).description && (
            <View style={styles.section}>
              <ThemedText style={styles.description}>{(item as any).description}</ThemedText>
            </View>
          )}

          {(item as any).effect && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Effect</ThemedText>
              <ThemedText style={styles.sectionText}>{(item as any).effect}</ThemedText>
            </View>
          )}

          {(item as any).weight && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Weight</ThemedText>
              <ThemedText style={styles.sectionText}>{(item as any).weight.toFixed(1)}</ThemedText>
            </View>
          )}

          {(item as any).fpCost && parseInt((item as any).fpCost) > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>FP Cost</ThemedText>
              <ThemedText style={styles.sectionText}>{(item as any).fpCost}</ThemedText>
            </View>
          )}

          {(item as any).hpCost && parseInt((item as any).hpCost) > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>HP Cost</ThemedText>
              <ThemedText style={styles.sectionText}>{(item as any).hpCost}</ThemedText>
            </View>
          )}

          {hasAttack(item) && item.attack.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Attack</ThemedText>
              <View style={styles.statsGrid}>
                {item.attack.map((stat) => (
                  <View key={stat.name} style={styles.statItem}>
                    <ThemedText style={styles.statType}>{stat.name}</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {stat.amount !== null ? stat.amount : 'N/A'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hasDefence(item) && item.defence.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Defence</ThemedText>
              <View style={styles.statsGrid}>
                {item.defence.map((stat) => (
                  <View key={stat.name} style={styles.statItem}>
                    <ThemedText style={styles.statType}>{stat.name}</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {stat.amount !== null ? stat.amount : 'N/A'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hasScalesWith(item) && item.scalesWith.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Scaling</ThemedText>
              <View style={styles.statsGrid}>
                {item.scalesWith.map((stat) => (
                  <View key={stat.name} style={styles.statItem}>
                    <ThemedText style={styles.statType}>{stat.name}</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {stat.scaling || 'N/A'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hasDmgNegation(item) && item.dmgNegation.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Damage Negation</ThemedText>
              <View style={styles.statsGrid}>
                {item.dmgNegation.map((stat) => (
                  <View key={stat.name} style={styles.statItem}>
                    <ThemedText style={styles.statType}>{stat.name}</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {stat.amount !== null ? stat.amount.toFixed(1) : 'N/A'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hasResistance(item) && item.resistance.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Resistance</ThemedText>
              <View style={styles.statsGrid}>
                {item.resistance.map((stat) => (
                  <View key={stat.name} style={styles.statItem}>
                    <ThemedText style={styles.statType}>{stat.name}</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {stat.amount !== null ? stat.amount.toFixed(1) : 'N/A'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#888',
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '25%',
    padding: 8,
  },
  statType: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 