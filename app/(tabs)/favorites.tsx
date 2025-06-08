import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
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
  View,
} from 'react-native';

type CategoryType = 'all' | 'weapons' | 'shields' | 'sorceries' | 'spirits' | 'talismans' | 'incantations' | 'items' | 'ashes' | 'armors';

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
  const { favorites, toggleFavorite } = useFavorites();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const filteredFavorites = activeCategory === 'all'
    ? favorites
    : favorites.filter(item => item.type === activeCategory);

  const TabButton = ({ category }: { category: { key: CategoryType; title: string } }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeCategory === category.key && { backgroundColor: colors.tint },
      ]}
      onPress={() => setActiveCategory(category.key)}
    >
      <Text style={[
        styles.tabButtonText,
        activeCategory === category.key && styles.tabButtonTextActive,
      ]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity 
      style={styles.itemCard}
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
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemType}>{categories.find(c => c.key === item.type)?.title || item.type}</ThemedText>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item);
          }}
        >
          <ThemedText style={styles.favoriteIcon}>★</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          {categories.map((category) => (
            <TabButton key={category.key} category={category} />
          ))}
        </ScrollView>

        <FlatList
          data={filteredFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
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
    maxHeight: 60,
    paddingHorizontal: 16,
  },
  tabContent: {
    gap: 8,
    paddingRight: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    minWidth: 80,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  tabButtonTextActive: {
    color: 'white',
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
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
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
  favoriteIcon: {
    fontSize: 24,
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
  favoriteButton: {
    padding: 4,
  },
}); 