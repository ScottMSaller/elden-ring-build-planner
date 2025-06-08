import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface FavoriteItem {
  id: string;
  type: 'weapons' | 'shields' | 'sorceries' | 'spirits' | 'talismans' | 'incantations' | 'items' | 'ashes' | 'armors';
  name: string;
  image?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  React.useEffect(() => {
    // Load favorites from storage on mount
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      const newFavorites = exists
        ? prev.filter(fav => fav.id !== item.id)
        : [...prev, item];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 