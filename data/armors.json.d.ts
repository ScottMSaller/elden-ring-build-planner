interface DamageNegation {
  physical: number;
  strike: number;
  slash: number;
  pierce: number;
  magic: number;
  fire: number;
  lightning: number;
  holy: number;
}

interface Resistance {
  immunity: number;
  robustness: number;
  focus: number;
  vitality: number;
}

interface ArmorItem {
  id: string;
  name: string;
  image: string | null;
  description: string;
  category: string;
  weight: number;
  dmgNegation: DamageNegation;
  resistance: Resistance;
}

declare const armor: ArmorItem[];
export default armor; 