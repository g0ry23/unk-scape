(function(){
  const US = window.UnkScape = window.UnkScape || {};const D = US;

  // === RACES CONFIG ===
  // Race selection is separate from class. Race provides baseline stat bonuses
  // that stack on top of faction and class modifiers.
  D.RACES = {
      human: {
            id: 'human',
            name: 'Human',
            icon: '🧑',
            description: 'Balanced and adaptable. Humans learn faster and craft more efficiently than any other race.',
            perk: 'Learns all skills 5% faster and crafts 5% quicker.',
            bonuses: { xpGain: 1.05, craftingSpeed: 1.05 },
            statMods: { maxHp: 0, attack: 0, defense: 0, moveSpeed: 0 }
          },
      orc: {
            id: 'orc',
            name: 'Orc',
            icon: '👹',
            description: 'Strong, aggressive warriors built for front-line combat and enduring punishment.',
            perk: 'Deals 15% more melee damage and has 10% more max health.',
            bonuses: { meleeDamage: 1.15, maxHp: 1.10 },
            statMods: { maxHp: 15, attack: 2, defense: 0, moveSpeed: 0 }
          },
      dwarf: {
            id: 'dwarf',
            name: 'Dwarf',
            icon: '⛏️',
            description: 'Hardy miners and master craftsmen. Dwarves extract more from the earth and build stronger structures.',
            perk: 'Gathers 15% more stone and ore. Armor and structures last 10% longer.',
            bonuses: { miningYield: 1.15, armorDurability: 1.10 },
            statMods: { maxHp: 5, attack: 0, defense: 3, moveSpeed: -0.02 }
          },
      elf: {
            id: 'elf',
            name: 'Elf',
            icon: '🧝',
            description: 'Fast, precise, and attuned to nature. Elves excel at ranged combat and move through terrain swiftly.',
            perk: 'Better bow accuracy and +5% movement speed. Higher arrow recovery chance.',
            bonuses: { bowDamage: 1.10, movementSpeed: 1.05 },
            statMods: { maxHp: -5, attack: 0, defense: 0, moveSpeed: 0.04 }
          }
    };

  // Helper to get race config safely
  D.getRace = function(id) { return D.RACES[id] || D.RACES.human; };

  // Calculate combined arrow recovery chance based on class, faction, and race
  D.calculateArrowRecoveryChance = function(player) {
      let chance = 0.45;
      if (player.classId === 'range') chance += 0.20;
      if (player.factionId === 'ashfang') chance += 0.10;
      if (player.raceId === 'elf') chance += 0.10;
      return Math.min(chance, 0.85);
    };

  // Apply race stat modifiers to a player stat block
  D.applyRaceMods = function(stats, raceId) {
      const race = D.RACES[raceId];
      if (!race) return stats;
      if (race.statMods.maxHp)   stats.maxHp  = (stats.maxHp  || 100) + race.statMods.maxHp;
      if (race.statMods.attack)  stats.attack  = (stats.attack  || 0)  + race.statMods.attack;
      if (race.statMods.defense) stats.defense = (stats.defense || 0)  + race.statMods.defense;
      if (race.statMods.moveSpeed) stats.moveSpeed = ((stats.moveSpeed || 1) + race.statMods.moveSpeed);
      return stats;
    };
  })();
