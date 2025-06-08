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
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ItemDetailsScreen() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
        }} 
      />
      <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite({ 
                id: item.id, 
                type: type as any, 
                name: item.name, 
                image: item.image as string | undefined 
              })}
            >
              <ThemedText style={[styles.favoriteIcon, itemIsFavorite && styles.favoriteIconActive]}>
                {itemIsFavorite ? '★' : '☆'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <Image
                source={item.image ? { uri: item.image } : require('@/assets/images/partial-react-logo.png')}
                style={styles.image}
                defaultSource={require('@/assets/images/partial-react-logo.png')}
                resizeMode="contain"
              />
            </View>

            <ThemedText style={styles.name}>{item.name}</ThemedText>
            
            {item.type && (
              <ThemedText style={styles.type}>{item.type}</ThemedText>
            )}

            {item.description && (
              <View style={styles.section}>
                <ThemedText style={styles.description}>{item.description}</ThemedText>
              </View>
            )}

            {item.effect && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Effect</ThemedText>
                <ThemedText style={styles.sectionText}>{item.effect}</ThemedText>
              </View>
            )}

            {item.weight && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Weight</ThemedText>
                <ThemedText style={styles.sectionText}>{item.weight.toFixed(1)}</ThemedText>
              </View>
            )}

            {item.fpCost && parseInt(item.fpCost) > 0 && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>FP Cost</ThemedText>
                <ThemedText style={styles.sectionText}>{item.fpCost}</ThemedText>
              </View>
            )}

            {item.hpCost && parseInt(item.hpCost) > 0 && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>HP Cost</ThemedText>
                <ThemedText style={styles.sectionText}>{item.hpCost}</ThemedText>
              </View>
            )}

            {item.attack && item.attack.length > 0 && (
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

            {item.defence && item.defence.length > 0 && (
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

            {item.scalesWith && item.scalesWith.length > 0 && (
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

            {item.dmgNegation && item.dmgNegation.length > 0 && (
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

            {item.resistance && item.resistance.length > 0 && (
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
      </SafeAreaWrapper>
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
    paddingTop: 16,
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