import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useCharacter } from '@/contexts/CharacterContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApiResponse, EldenRingItem } from '@/services/eldenRingApi';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SpellRequirement {
  name: string;
  amount: number;
}

interface SpellItem extends Omit<EldenRingItem, 'requires'> {
  requires?: SpellRequirement[];
  cost?: number;
  slots?: number;
  effects?: string;
}

interface SpellListProps {
  title: string;
  fetchData: (limit?: number) => Promise<ApiResponse<any>>;
  searchData: (name: string) => Promise<ApiResponse<any>>;
}

export function SpellList({ title, fetchData, searchData }: SpellListProps) {
  const [items, setItems] = useState<SpellItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing] = useState(false);
  const { stats } = useCharacter();
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetchData(50);
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadItems();
      return;
    }

    try {
      setLoading(true);
      const response = await searchData(query);
      setItems(response.data);
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const canEquipSpell = (requirements: SpellRequirement[]): boolean => {
    return requirements.every(req => {
      const statValue = stats[req.name.toLowerCase() as keyof typeof stats] || 0;
      return statValue >= req.amount;
    });
  };

  const renderItem = ({ item }: { item: SpellItem }) => {
    const canEquip = canEquipSpell(item.requires || []);
    
    return (
      <TouchableOpacity style={[
        styles.itemCard,
        !canEquip && styles.itemCardDisabled
      ]}>
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
            {item.type && (
              <ThemedText style={styles.itemType}>{item.type}</ThemedText>
            )}
            {item.effects && (
              <ThemedText style={styles.itemEffect}>{item.effects}</ThemedText>
            )}
          </View>
          {!canEquip && (
            <View style={styles.requirementBadge}>
              <Text style={styles.requirementText}>Cannot Equip</Text>
            </View>
          )}
        </View>
        
        {item.description && (
          <ThemedText style={styles.itemDescription} numberOfLines={3}>
            {item.description}
          </ThemedText>
        )}

        {item.requires && (
          <View style={styles.requirements}>
            <ThemedText style={styles.requirementsTitle}>Requirements:</ThemedText>
            <ThemedText style={styles.requirementsText}>
              {item.requires
                .filter(req => req.amount > 0)
                .map(req => `${req.name}: ${req.amount}`)
                .join(', ')}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && items.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading {title}...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { 
            borderColor: '#ccc',
            color: colors.text,
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          }]}
          placeholder={`Search ${title.toLowerCase()}...`}
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={loadItems}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {searchQuery ? 'No spells found matching your search.' : 'No spells available.'}
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemCardDisabled: {
    opacity: 0.5,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  itemNameDisabled: {
    opacity: 0.6,
  },
  itemType: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  itemEffect: {
    fontSize: 14,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginTop: 8,
  },
  requirements: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requirementsText: {
    fontSize: 12,
    opacity: 0.7,
  },
  requirementBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  requirementText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
}); 