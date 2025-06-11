describe('Equipment Requirements', () => {
  interface Stats {
    strength: number;
    dexterity: number;
    intelligence: number;
    faith: number;
    arcane: number;
  }

  interface Requirement {
    name: string;
    amount: number;
  }

  function meetsRequirements(stats: Stats, requirements: Requirement[]): boolean {
    return requirements.every(req => {
      const statName = req.name.toLowerCase();
      switch (statName) {
        case 'str':
        case 'strength':
          return stats.strength >= req.amount;
        case 'dex':
        case 'dexterity':
          return stats.dexterity >= req.amount;
        case 'int':
        case 'intelligence':
          return stats.intelligence >= req.amount;
        case 'fth':
        case 'fai':
        case 'faith':
          return stats.faith >= req.amount;
        case 'arc':
        case 'arcane':
          return stats.arcane >= req.amount;
        default:
          return true;
      }
    });
  }

  test('character meets weapon requirements', () => {
    const stats: Stats = {
      strength: 20,
      dexterity: 15,
      intelligence: 10,
      faith: 10,
      arcane: 10,
    };

    const requirements: Requirement[] = [
      { name: 'Str', amount: 18 },
      { name: 'Dex', amount: 12 },
    ];

    expect(meetsRequirements(stats, requirements)).toBe(true);
  });

  test('character does not meet weapon requirements', () => {
    const stats: Stats = {
      strength: 15,
      dexterity: 10,
      intelligence: 10,
      faith: 10,
      arcane: 10,
    };

    const requirements: Requirement[] = [
      { name: 'Str', amount: 18 },
      { name: 'Dex', amount: 12 },
    ];

    expect(meetsRequirements(stats, requirements)).toBe(false);
  });

  test('handles spell requirements', () => {
    const stats: Stats = {
      strength: 10,
      dexterity: 10,
      intelligence: 25,
      faith: 30,
      arcane: 10,
    };

    const requirements: Requirement[] = [
      { name: 'Int', amount: 20 },
      { name: 'Faith', amount: 25 },
    ];

    expect(meetsRequirements(stats, requirements)).toBe(true);
  });

  test('handles mixed case requirement names', () => {
    const stats: Stats = {
      strength: 20,
      dexterity: 15,
      intelligence: 10,
      faith: 10,
      arcane: 10,
    };

    const requirements: Requirement[] = [
      { name: 'STR', amount: 18 },
      { name: 'dex', amount: 12 },
    ];

    expect(meetsRequirements(stats, requirements)).toBe(true);
  });
}); 