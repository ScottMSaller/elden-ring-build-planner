import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useCharacter } from '@/contexts/CharacterContext';
import { FavoriteItem, useFavorites } from '@/contexts/FavoritesContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type CategoryType = 'all' | 'weapons' | 'shields' | 'sorceries' | 'spirits' | 'talismans' | 'incantations' | 'items' | 'ashes' | 'armors';
type ColorScheme = 'light' | 'dark';

const categories: { key: CategoryType; title: string }[] = [
  { key: 'all', title: 'All' },
  { key: 'weapons', title: 'Weapons' },
  { key: 'shields', title: 'Shields' },
  { key: 'armors', title: 'Armor' },
  { key: 'sorceries', title: 'Sorceries' },
  { key: 'incantations', title: 'Incantations' },
  { key: 'spirits', title: 'Spirits' },
  { key: 'ashes', title: 'Ashes of War' },
  { key: 'talismans', title: 'Talismans' },
  { key: 'items', title: 'Items' },
];

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { canEquipWeapon } = useCharacter();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const colorScheme = useColorScheme() as ColorScheme;
  const colors = Colors[colorScheme];
  const router = useRouter();

  const filteredFavorites = activeCategory === 'all'
    ? favorites
    : favorites.filter(item => item.type === activeCategory);

  const TabButton = ({ category }: { category: { key: CategoryType; title: string } }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeCategory === category.key ? '#666666' : 'rgba(255, 255, 255, 0.05)',
          borderColor: activeCategory === category.key ? '#666666' : colors.text,
        },
      ]}
      onPress={() => setActiveCategory(category.key)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeCategory === category.key ? '#FFFFFF' : colors.text },
      ]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: FavoriteItem }) => {
    const canEquip = ['weapons', 'shields', 'sorceries', 'incantations'].includes(item.type) 
      ? canEquipWeapon((item as any).requiredAttributes || (item as any).requires)
      : true;
    const itemIsFavorite = isFavorite(item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.itemCard,
          !canEquip && styles.itemCardDisabled
        ]}
        onPress={() => router.push({
          pathname: '/item-details',
          params: { id: item.id, type: item.type }
        })}
      >
        <View style={styles.itemHeader}>
          <Image 
            source={item.image ? { uri: item.image } : require('@/assets/images/partial-react-logo.png')}
            style={styles.itemImage}
            defaultSource={require('@/assets/images/partial-react-logo.png')}
          />
          <View style={styles.itemInfo}>
            <ThemedText style={[
              styles.itemName,
              !canEquip && styles.itemNameDisabled
            ]}>
              {item.name}
            </ThemedText>
            <ThemedText style={styles.itemType}>{categories.find(c => c.key === item.type)?.title || item.type}</ThemedText>
          </View>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(item);
              }}
            >
              <ThemedText style={[styles.favoriteIcon, itemIsFavorite && styles.favoriteIconActive]}>
                {itemIsFavorite ? '★' : '☆'}
              </ThemedText>
            </TouchableOpacity>
            {!canEquip && (
              <View style={styles.requirementBadge}>
                <Text style={styles.requirementText}>Cannot Equip</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Favorites</ThemedText>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContent}
        >
          <View style={styles.buttonContainer}>
            {categories.map((category) => (
              <TabButton key={category.key} category={category} />
            ))}
          </View>
        </ScrollView>

        <FlatList
          data={filteredFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: 50 }]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No favorites yet in this category.
              </ThemedText>
            </View>
          }
        />
      </ThemedView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    paddingTop: 5,
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabContainer: {
    maxHeight: 65,
    paddingHorizontal: 16,
  },
  tabContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    height: 36,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    opacity: 0.8,
  },
  controlsContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
    gap: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  itemCardDisabled: {
    opacity: 0.7,
  },
  itemNameDisabled: {
    opacity: 0.8,
  },
  requirementBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  requirementText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 