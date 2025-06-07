import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useCharacter } from '@/contexts/CharacterContext';
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
import { EldenRingItem } from '@/services/eldenRingApi';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface EquipmentListProps {
  title: string;
  type: 'weapons' | 'shields' | 'sorceries' | 'spirits' | 'talismans' | 'incantations' | 'items' | 'ashes' | 'armors';
  showRequirements?: boolean;
}

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
} as const;

export function EquipmentList({ title, type, showRequirements = false }: EquipmentListProps) {
  const [items] = useState<EldenRingItem[]>(() => DATA_MAP[type]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEquippableOnly, setShowEquippableOnly] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { canEquipWeapon } = useCharacter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filterItems = useCallback((query: string, equippableOnly: boolean) => {
    let filtered = items;

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (equippableOnly) {
      filtered = filtered.filter(item => canEquipWeapon((item as any).requiredAttributes));
    }

    return filtered;
  }, [items, canEquipWeapon]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleEquippable = () => {
    setShowEquippableOnly(!showEquippableOnly);
  };

  const renderItem = ({ item }: { item: EldenRingItem }) => {
    const canEquip = showRequirements ? canEquipWeapon((item as any).requiredAttributes) : true;
    const isExpanded = expandedItems.has(item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.itemCard,
          !canEquip && styles.itemCardDisabled
        ]}
        onPress={() => toggleExpanded(item.id)}
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
            {item.type && (
              <ThemedText style={styles.itemType}>{item.type}</ThemedText>
            )}
            {item.effect && (
              <ThemedText style={styles.itemEffect}>{item.effect}</ThemedText>
            )}
          </View>
          {!canEquip && (
            <View style={styles.requirementBadge}>
              <Text style={styles.requirementText}>Cannot Equip</Text>
            </View>
          )}
          <ThemedText style={[styles.expandIcon, isExpanded && styles.expandIconRotated]}>
            ▼
          </ThemedText>
        </View>
        
        {item.description && (
          <ThemedText style={styles.itemDescription} numberOfLines={3}>
            {item.description}
          </ThemedText>
        )}

        {isExpanded && type === 'armors' && (
          <View style={styles.statsContainer}>
            <View style={styles.weightContainer}>
              <ThemedText style={styles.statsLabel}>Weight</ThemedText>
              <ThemedText style={styles.statsValue}>{item.weight?.toFixed(1) || 'N/A'}</ThemedText>
            </View>
            
            {item.dmgNegation && item.dmgNegation.length > 0 && (
              <View style={styles.dmgNegationContainer}>
                <ThemedText style={styles.statsLabel}>Damage Negation</ThemedText>
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
          </View>
        )}

        {showRequirements && (item as any).requiredAttributes && (
          <View style={styles.requirements}>
            <ThemedText style={styles.requirementsTitle}>Requirements:</ThemedText>
            <ThemedText style={styles.requirementsText}>
              {((item as any).requiredAttributes)
                .map((req: { name: string; amount: string }) => `${req.name}: ${req.amount}`)
                .join(', ')}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filteredItems = filterItems(searchQuery, showEquippableOnly);

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
        {showRequirements && (
          <TouchableOpacity
            style={[
              styles.filterButton,
              showEquippableOnly && { backgroundColor: colors.tint }
            ]}
            onPress={toggleEquippable}
          >
            <Text style={[
              styles.filterButtonText,
              showEquippableOnly && styles.filterButtonTextActive
            ]}>
              {showEquippableOnly ? 'Show All' : 'Show Equippable'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {searchQuery ? 'No items found matching your search.' : 'No items available.'}
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  filterButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    backgroundColor: '#ccc',
  },
  statsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dmgNegationContainer: {
    marginTop: 4,
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 14,
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
  expandIcon: {
    fontSize: 16,
    marginLeft: 8,
    opacity: 0.6,
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
}); 