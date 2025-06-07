const BASE_URL = 'https://eldenring.fanapis.com/api';

// Types based on the API documentation
export interface EldenRingItem {
  id: string;
  name: string;
  image: string | null;
  description: string;
  type?: string;
  effect?: string;
  affinity?: string;
  skill?: string;
  attack?: any;
  defence?: any;
  scalesWith?: any;
  requiredAttributes?: any;
  category?: string;
  weight?: number;
}

export interface Weapon extends EldenRingItem {
  attack?: any;
  defence?: any;
  scalesWith?: any;
  requiredAttributes?: any;
  category?: string;
  weight?: number;
}

export interface Armor extends EldenRingItem {
  category?: string;
  dmgNegation?: any;
  resistance?: any;
  weight?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  count: number;
  total?: number;
  data: T[];
}

class EldenRingApiService {
  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Weapons
  async getAllWeapons(limit = 100): Promise<ApiResponse<Weapon>> {
    return this.makeRequest<Weapon>('weapons', { limit: limit.toString() });
  }

  async searchWeapons(name: string): Promise<ApiResponse<Weapon>> {
    return this.makeRequest<Weapon>('weapons', { name });
  }

  // Armor
  async getAllArmors(limit = 100): Promise<ApiResponse<Armor>> {
    return this.makeRequest<Armor>('armors', { limit: limit.toString() });
  }

  async searchArmors(name: string): Promise<ApiResponse<Armor>> {
    return this.makeRequest<Armor>('armors', { name });
  }

  // Items
  async getAllItems(limit = 100): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('items', { limit: limit.toString() });
  }

  async searchItems(name: string): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('items', { name });
  }

  // Sorceries (Spells)
  async getAllSorceries(limit = 100): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('sorceries', { limit: limit.toString() });
  }

  async searchSorceries(name: string): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('sorceries', { name });
  }

  // Incantations (Spells)
  async getAllIncantations(limit = 100): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('incantations', { limit: limit.toString() });
  }

  async searchIncantations(name: string): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('incantations', { name });
  }

  // Shields
  async getAllShields(limit = 100): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('shields', { limit: limit.toString() });
  }

  async searchShields(name: string): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('shields', { name });
  }

  // Talismans
  async getAllTalismans(limit = 100): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('talismans', { limit: limit.toString() });
  }

  async searchTalismans(name: string): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('talismans', { name });
  }

  // Spirits (Summons)
  async getAllSpirits(limit = 100): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('spirits', { limit: limit.toString() });
  }

  async searchSpirits(name: string): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('spirits', { name });
  }

  // Ashes of War
  async getAllAshesOfWar(limit = 100): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('ashes', { limit: limit.toString() });
  }

  async searchAshesOfWar(name: string): Promise<ApiResponse<EldenRingItem>> {
    return this.makeRequest<EldenRingItem>('ashes', { name });
  }
}

export const eldenRingApi = new EldenRingApiService(); 