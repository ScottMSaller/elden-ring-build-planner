describe('Favorites Management', () => {
  interface FavoriteItem {
    id: string;
    type: string;
    name: string;
  }

  class FavoritesManager {
    private favorites: FavoriteItem[] = [];

    addFavorite(item: FavoriteItem) {
      if (!this.isFavorite(item.id)) {
        this.favorites.push(item);
      }
    }

    removeFavorite(id: string) {
      this.favorites = this.favorites.filter(item => item.id !== id);
    }

    isFavorite(id: string): boolean {
      return this.favorites.some(item => item.id === id);
    }

    getFavorites(): FavoriteItem[] {
      return [...this.favorites];
    }
  }

  test('can add items to favorites', () => {
    const manager = new FavoritesManager();
    const item: FavoriteItem = {
      id: 'weapon1',
      type: 'weapon',
      name: 'Sword',
    };

    manager.addFavorite(item);
    expect(manager.isFavorite(item.id)).toBe(true);
    expect(manager.getFavorites()).toHaveLength(1);
  });

  test('can remove items from favorites', () => {
    const manager = new FavoritesManager();
    const item: FavoriteItem = {
      id: 'weapon1',
      type: 'weapon',
      name: 'Sword',
    };

    manager.addFavorite(item);
    manager.removeFavorite(item.id);
    expect(manager.isFavorite(item.id)).toBe(false);
    expect(manager.getFavorites()).toHaveLength(0);
  });

  test('prevents duplicate favorites', () => {
    const manager = new FavoritesManager();
    const item: FavoriteItem = {
      id: 'weapon1',
      type: 'weapon',
      name: 'Sword',
    };

    manager.addFavorite(item);
    manager.addFavorite(item);
    expect(manager.getFavorites()).toHaveLength(1);
  });

  test('can handle multiple favorites', () => {
    const manager = new FavoritesManager();
    const items: FavoriteItem[] = [
      { id: 'weapon1', type: 'weapon', name: 'Sword' },
      { id: 'armor1', type: 'armor', name: 'Shield' },
      { id: 'spell1', type: 'spell', name: 'Fireball' },
    ];

    items.forEach(item => manager.addFavorite(item));
    expect(manager.getFavorites()).toHaveLength(3);

    manager.removeFavorite(items[1].id);
    expect(manager.getFavorites()).toHaveLength(2);
    expect(manager.isFavorite(items[0].id)).toBe(true);
    expect(manager.isFavorite(items[1].id)).toBe(false);
    expect(manager.isFavorite(items[2].id)).toBe(true);
  });
}); 