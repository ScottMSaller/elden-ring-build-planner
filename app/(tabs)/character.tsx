import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useCharacter } from '@/contexts/CharacterContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CharacterScreen() {
  const { stats, updateStat, resetStats, getAvailablePoints } = useCharacter();
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const handleStatChange = (stat: keyof typeof stats, value: string) => {
    const numValue = parseInt(value) || 1;
    updateStat(stat, numValue);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Character',
      'Are you sure you want to reset all stats to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetStats },
      ]
    );
  };

  const StatRow = ({ label, stat, description, alert }: { 
    label: string; 
    stat: keyof typeof stats; 
    description: string;
    alert?: string;
  }) => {
    const [localValue, setLocalValue] = useState(stats[stat].toString());

    const handleBlur = () => {
      const numValue = parseInt(localValue) || 1;
      handleStatChange(stat, numValue.toString());
    };

    useEffect(() => {
      setLocalValue(stats[stat].toString());
    }, [stats[stat]]);

    return (
      <View style={styles.statRow}>
        <View style={styles.statInfo}>
          <ThemedText style={styles.statLabel}>{label}</ThemedText>
          <ThemedText style={styles.statDescription}>{description}</ThemedText>
        </View>
        <View style={styles.statControls}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={() => updateStat(stat, stats[stat] - 1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.statInput, { 
              borderColor: '#ccc',
              color: colors.text,
            }]}
            value={localValue}
            onChangeText={setLocalValue}
            onBlur={handleBlur}
            keyboardType="numeric"
            maxLength={3}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={() => updateStat(stat, stats[stat] + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Character Stats</ThemedText>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: colors.tint }]}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatRow 
            label="Level" 
            stat="level" 
            description="Overall character level"
          />
          {getAvailablePoints() > 0 && (
            <ThemedText style={styles.pointsInfo}>
              You have {getAvailablePoints()} points available to spend
            </ThemedText>
          )}
          {getAvailablePoints() < 0 && (
            <ThemedText style={[styles.pointsInfo, styles.pointsError]}>
              You have spent {Math.abs(getAvailablePoints())} more points than available
            </ThemedText>
          )}
          <StatRow 
            label="Vigor" 
            stat="vigor" 
            description="Affects HP, fire resistance, and immunity"
          />
          <StatRow 
            label="Mind" 
            stat="mind" 
            description="Affects FP and focus"
          />
          <StatRow 
            label="Endurance" 
            stat="endurance" 
            description="Affects stamina, robustness, and equip load"
          />
          <StatRow 
            label="Strength" 
            stat="strength" 
            description="Affects physical damage of strength weapons"
          />
          <StatRow 
            label="Dexterity" 
            stat="dexterity" 
            description="Affects physical damage of dexterity weapons and casting speed"
          />
          <StatRow 
            label="Intelligence" 
            stat="intelligence" 
            description="Affects magic damage and sorcery effectiveness"
          />
          <StatRow 
            label="Faith" 
            stat="faith" 
            description="Affects incantation effectiveness"
          />
          <StatRow 
            label="Arcane" 
            stat="arcane" 
            description="Affects item discovery and certain sorceries/incantations"
          />
        </View>

        <View style={styles.summary}>
          <ThemedText style={styles.summaryTitle}>Build Summary</ThemedText>
          <ThemedText style={styles.summaryText}>
            Your Tarnished is level {stats.level} with a focus on{' '}
            {Object.entries(stats)
              .filter(([key]) => key !== 'level')
              .sort(([, a], [, b]) => b - a)
              .slice(0, 2)
              .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
              .join(' and ')}.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    paddingTop:4,
    fontSize: 28,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  statsContainer: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  statControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  statInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    marginTop: 32,
    marginBottom: 66,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 22,
  },
  pointsInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 8,
    opacity: 0.8,
  },
  pointsError: {
    color: '#ff6b6b',
  },
}); 