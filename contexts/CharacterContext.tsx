import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface CharacterStats {
  level: number;
  vigor: number;
  mind: number;
  endurance: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  faith: number;
  arcane: number;
}

interface CharacterContextType {
  stats: CharacterStats;
  updateStat: (stat: keyof CharacterStats, value: number) => void;
  resetStats: () => void;
  canEquipWeapon: (requirements: any) => boolean;
  getAvailablePoints: () => number;
  getUsedPoints: () => number;
}

const defaultStats: CharacterStats = {
  level: 1,
  vigor: 10,
  mind: 10,
  endurance: 10,
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  faith: 10,
  arcane: 10,
};

const BASE_POINTS = 80;
const POINTS_PER_LEVEL = 1;

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const STORAGE_KEY = 'elden_ring_character_stats';

interface CharacterProviderProps {
  children: ReactNode;
}

export function CharacterProvider({ children }: CharacterProviderProps) {
  const [stats, setStats] = useState<CharacterStats>(defaultStats);

  // Load stats from storage on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const storedStats = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error('Error loading character stats:', error);
    }
  };

  const saveStats = async (newStats: CharacterStats) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Error saving character stats:', error);
    }
  };

  const updateStat = (stat: keyof CharacterStats, value: number) => {
    const newStats = { ...stats, [stat]: Math.max(1, value) };
    setStats(newStats);
    saveStats(newStats);
  };

  const resetStats = () => {
    setStats(defaultStats);
    saveStats(defaultStats);
  };

  const canEquipWeapon = (requirements: any): boolean => {
    if (!requirements) return true;
    
    // The API structure might vary, so we'll handle different formats
    const checkRequirement = (statName: string, required: number): boolean => {
      switch (statName.toLowerCase()) {
        case 'str':
        case 'strength':
          return stats.strength >= required;
        case 'dex':
        case 'dexterity':
          return stats.dexterity >= required;
        case 'int':
        case 'intelligence':
          return stats.intelligence >= required;
        case 'fth':
        case 'fai':
        case 'faith':
          return stats.faith >= required;
        case 'arc':
        case 'arcane':
          return stats.arcane >= required;
        default:
          return true;
      }
    };

    // Handle different requirement formats that might come from the API
    if (Array.isArray(requirements)) {
      return requirements.every((req: any) => {
        if (
          typeof req === 'object' &&
          req.name &&
          req.name !== '-' &&
          req.amount !== undefined &&
          req.amount !== null &&
          Number(req.amount) > 0
        ) {
          return checkRequirement(req.name, parseInt(req.amount));
        }
        return true;
      });
    }

    if (typeof requirements === 'object') {
      return Object.entries(requirements).every(([stat, value]) => {
        const numValue = parseInt(value as string) || 0;
        return checkRequirement(stat, numValue);
      });
    }

    return true;
  };

  const getUsedPoints = () => {
    return (
      (stats.vigor) +
      (stats.mind) +
      (stats.endurance) +
      (stats.strength) +
      (stats.dexterity) +
      (stats.intelligence) +
      (stats.faith) +
      (stats.arcane)
    );
  };

  const getAvailablePoints = () => {
    const totalPoints = BASE_POINTS + (stats.level - 1) * POINTS_PER_LEVEL;
    return totalPoints - getUsedPoints();
  };

  const value: CharacterContextType = {
    stats,
    updateStat,
    resetStats,
    canEquipWeapon,
    getAvailablePoints,
    getUsedPoints,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
} 