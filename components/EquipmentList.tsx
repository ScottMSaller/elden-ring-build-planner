import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useCharacter } from '@/contexts/CharacterContext';
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

type ColorScheme = 'light' | 'dark';

interface SpellRequirement {
  name: string;
  amount: number;
}

interface SpellItem extends EldenRingItem {
  cost?: number;
  slots?: number;
  requires?: SpellRequirement[];
}

interface EquipmentListProps {
  title: string;
  type: 'weapons' | 'shields' | 'sorceries' | 'spirits' | 'talismans' | 'incantations' | 'items' | 'ashes' | 'armors';
  showRequirements?: boolean;
}

const DATA_MAP = {
  weapons: weaponsData,
  shields: shieldsData,
  sorceries: sorceriesData as SpellItem[],
  spirits: spiritsData,
  talismans: talismansData,
  incantations: incantationsData as SpellItem[],
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
  const { toggleFavorite, isFavorite } = useFavorites();
  const colorScheme = useColorScheme() as ColorScheme;
  const colors = Colors[colorScheme];

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
      filtered = filtered.filter(item => {
        if (type === 'sorceries' || type === 'incantations') {
          const spellItem = item as SpellItem;
          return canEquipWeapon(spellItem.requires);
        }
        return canEquipWeapon((item as any).requiredAttributes);
      });
    }

    return filtered;
  }, [items, canEquipWeapon, type]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleEquippable = () => {
    setShowEquippableOnly(!showEquippableOnly);
  };

  const renderItem = ({ item }: { item: EldenRingItem | SpellItem }) => {
    const canEquip = showRequirements ? canEquipWeapon((item as any).requiredAttributes || (item as SpellItem).requires) : true;
    const isExpanded = expandedItems.has(item.id);
    const isSpell = type === 'sorceries' || type === 'incantations';
    const spellItem = isSpell ? item as SpellItem : null;
    const itemIsFavorite = isFavorite(item.id);
    
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
          <View style={styles.controlsContainer}>
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite({ 
                  id: item.id, 
                  type, 
                  name: item.name, 
                  image: item.image as string | undefined,
                  requiredAttributes: (item as any).requiredAttributes,
                  requires: (item as SpellItem).requires
                })}
              >
                <ThemedText style={[styles.favoriteIcon, itemIsFavorite && styles.favoriteIconActive]}>
                  {itemIsFavorite ? '★' : '☆'}
                </ThemedText>
              </TouchableOpacity>
              {!(type === 'talismans' || type === 'items') && (
                <ThemedText style={[styles.expandIcon, isExpanded && styles.expandIconRotated]}>
                  ▼
                </ThemedText>
              )}
            </View>
            {!canEquip && (
              <View style={styles.requirementBadge}>
                <Text style={styles.requirementText}>Cannot Equip</Text>
              </View>
            )}
          </View>
        </View>
        
        {item.description && (
          <ThemedText style={styles.itemDescription} numberOfLines={isExpanded ? undefined : 3}>
            {item.description}
          </ThemedText>
        )}

        {isExpanded && type === 'weapons' && (
          <View style={[styles.statsContainer, { padding: 8 }]}>
            <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
              <ThemedText style={styles.statsLabel}>Weight</ThemedText>
              <ThemedText style={styles.statsValue}>{item.weight?.toFixed(1) || 'N/A'}</ThemedText>
            </View>

            {item.category && (
              <View style={[styles.statSection, { borderTopWidth: 0, marginTop: 4, paddingTop: 4 }]}>
                <ThemedText style={styles.statsLabel}>Category</ThemedText>
                <ThemedText style={styles.statsValue}>{item.category}</ThemedText>
              </View>
            )}

            {item.attack && item.attack.length > 0 && (
              <View style={[styles.statSection, { marginTop: 12, paddingTop: 12, borderTopWidth: 1 }]}>
                <ThemedText style={styles.statsLabel}>Attack</ThemedText>
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
              <View style={[styles.statSection, { marginTop: 12, paddingTop: 12, borderTopWidth: 1 }]}>
                <ThemedText style={styles.statsLabel}>Defence</ThemedText>
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
              <View style={[styles.statSection, { marginTop: 12, paddingTop: 12, borderTopWidth: 1 }]}>
                <ThemedText style={styles.statsLabel}>Scaling</ThemedText>
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

            {showRequirements && (item as any).requiredAttributes && (
              <View style={[styles.statSection, { marginTop: 12, paddingTop: 12, borderTopWidth: 1 }]}>
                <ThemedText style={styles.statsLabel}>Requirements</ThemedText>
                <View style={styles.statsGrid}>
                  {(item as any).requiredAttributes.map((req: { name: string; amount: number | null }) => (
                    <View key={req.name} style={styles.statItem}>
                      <ThemedText style={styles.statType}>{req.name}</ThemedText>
                      <ThemedText style={[
                        styles.statValue,
                        !canEquipWeapon([req]) && styles.statValueUnmet
                      ]}>
                        {req.amount !== null ? req.amount : 'N/A'}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {isExpanded && type === 'shields' && (
          <View style={[styles.statsContainer, { padding: 8 }]}>
            <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
              <ThemedText style={styles.statsLabel}>Weight</ThemedText>
              <ThemedText style={styles.statsValue}>{item.weight?.toFixed(1) || 'N/A'}</ThemedText>
            </View>

            {item.attack && item.attack.length > 0 && (
              <View style={[styles.statSection, { borderTopWidth: 0, marginTop: 4, paddingTop: 4 }]}>
                <ThemedText style={styles.statsLabel}>Attack</ThemedText>
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
              <View style={[styles.statSection, { borderTopWidth: 0, marginTop: 4, paddingTop: 4 }]}>
                <ThemedText style={styles.statsLabel}>Defence</ThemedText>
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
              <View style={[styles.statSection, { borderTopWidth: 0, marginTop: 4, paddingTop: 4 }]}>
                <ThemedText style={styles.statsLabel}>Scaling</ThemedText>
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
          </View>
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

            {item.resistance && item.resistance.length > 0 && (
              <View style={styles.statSection}>
                <ThemedText style={styles.statsLabel}>Resistance</ThemedText>
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
          </View>
        )}

        {isExpanded && type === 'spirits' && (
          <View style={[styles.statsContainer, { padding: 8 }]}>
            {(item as any).fpCost && parseInt((item as any).fpCost) > 0 && (
              <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
                <ThemedText style={styles.statsLabel}>FP Cost</ThemedText>
                <ThemedText style={styles.statsValue}>{(item as any).fpCost}</ThemedText>
              </View>
            )}
            {(item as any).hpCost && parseInt((item as any).hpCost) > 0 && (
              <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
                <ThemedText style={styles.statsLabel}>HP Cost</ThemedText>
                <ThemedText style={styles.statsValue}>{(item as any).hpCost}</ThemedText>
              </View>
            )}
            {(item as any).effect && (
              <View style={[styles.weightContainer, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
                <ThemedText style={styles.statsLabel}>Effect</ThemedText>
                <ThemedText style={styles.statsValue}>{(item as any).effect}</ThemedText>
              </View>
            )}
          </View>
        )}

        {isExpanded && type === 'ashes' && (
          <View style={[styles.statsContainer, { padding: 8 }]}>
            <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
              <ThemedText style={styles.statsLabel}>Affinity</ThemedText>
              <ThemedText style={styles.statsValue}>{(item as any).affinity || 'N/A'}</ThemedText>
            </View>
            {(item as any).skill && (
              <View style={[styles.weightContainer, { borderBottomWidth: 0, marginBottom: 4, paddingBottom: 4 }]}>
                <ThemedText style={styles.statsLabel}>Skill</ThemedText>
                <ThemedText style={styles.statsValue}>{(item as any).skill}</ThemedText>
              </View>
            )}
            {(item as any).fpCost && parseInt((item as any).fpCost) > 0 && (
              <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
                <ThemedText style={styles.statsLabel}>FP Cost</ThemedText>
                <ThemedText style={styles.statsValue}>{(item as any).fpCost}</ThemedText>
              </View>
            )}
            {(item as any).hpCost && parseInt((item as any).hpCost) > 0 && (
              <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
                <ThemedText style={styles.statsLabel}>HP Cost</ThemedText>
                <ThemedText style={styles.statsValue}>{(item as any).hpCost}</ThemedText>
              </View>
            )}
            {(item as any).effect && (
              <View style={[styles.weightContainer, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
                <ThemedText style={styles.statsLabel}>Effect</ThemedText>
                <ThemedText style={styles.statsValue}>{(item as any).effect}</ThemedText>
              </View>
            )}
          </View>
        )}

        {isExpanded && isSpell && spellItem && (
          <View style={[styles.statsContainer, { padding: 8 }]}>
            <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
              <ThemedText style={styles.statsLabel}>FP Cost</ThemedText>
              <ThemedText style={styles.statsValue}>{spellItem.cost || 'N/A'}</ThemedText>
            </View>

            {spellItem.slots && (
              <View style={[styles.weightContainer, { marginBottom: 4, paddingBottom: 4 }]}>
                <ThemedText style={styles.statsLabel}>Memory Slots</ThemedText>
                <ThemedText style={styles.statsValue}>{spellItem.slots}</ThemedText>
              </View>
            )}

            {showRequirements && spellItem.requires && spellItem.requires.length > 0 && (
              <View style={[styles.statSection, { borderTopWidth: 0, marginTop: 4, paddingTop: 4 }]}>
                <ThemedText style={styles.statsLabel}>Requirements</ThemedText>
                <View style={styles.statsGrid}>
                  {spellItem.requires.map((req) => (
                    <View key={req.name} style={styles.statItem}>
                      <ThemedText style={styles.statType}>{req.name}</ThemedText>
                      <ThemedText style={[
                        styles.statValue,
                        !canEquipWeapon([req]) && styles.statValueUnmet
                      ]}>
                        {req.amount !== null ? req.amount : 'N/A'}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
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
              {
                backgroundColor: showEquippableOnly ? '#666666' : '#000000',
                borderColor: showEquippableOnly ? '#666666' : '#FFFFFF',
              }
            ]}
            onPress={toggleEquippable}
          >
            <Text style={[
              styles.filterButtonText,
              { color: '#FFFFFF' }
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
  requirementBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 0,
    paddingRight: 2,
  },
  requirementBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 2,
    marginTop: 3,
    marginBottom: 3,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 36,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
  statSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValueUnmet: {
    color: '#ff4444',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#888',
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
  controlsContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingTop: 2,
    paddingBottom: 2,
  },
}); 