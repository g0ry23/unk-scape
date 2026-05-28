(function(){
const D = window.Duskfall = window.Duskfall || {};

// Overarching faction theme expansion - two medieval rivalries
// These extend D.FACTIONS with large-scale political factions
D.FACTIONS = D.FACTIONS || {};

D.FACTIONS.blood_oath = {
  id: "blood_oath",
  name: "Blood-Oath Clans",
  icon: "⚔️",
  primaryColor: "#c0392b",
  secondaryColor: "#ff7b5c",
  color: "#c0392b",
  themeClass: "theme-blood-oath",
  description: "Tribal raiders and Viking-style conquerors who dominate through raw battlefield power.",
  desc: "Tribal raiders and Viking-style conquerors who dominate through raw battlefield power.",
  perks: ["+15% Melee Crits", "+10% Weapon Move Velocity", "Double salvage from fallen foes"],
  modifiers: { meleeDamageMultiplier: 1.15, moveSpeedBonus: 20 },
  buff: { attack: 2, moveSpeed: 0.05 }
};

D.FACTIONS.iron_crown = {
  id: "iron_crown",
  name: "Iron-Crown Accord",
  icon: "👑",
  primaryColor: "#2980b9",
  secondaryColor: "#74b9ff",
  color: "#2980b9",
  themeClass: "theme-iron-crown",
  description: "A disciplined feudal empire centered around massive stone fortresses, knights, and rigid overworld order.",
  desc: "A disciplined feudal empire centered around massive stone fortresses, knights, and rigid overworld order.",
  perks: ["+15% Structural Health", "+10% Base Armor Values", "Enhanced global trading tax revenue"],
  modifiers: { armorBonus: 5, buildSpeedMultiplier: 1.15 },
  buff: { defense: 3, accuracy: 0.02 }
};

// Helper: apply faction body theme class
D.applyFactionTheme = function(factionId) {
  const f = D.FACTIONS[factionId];
  if (!f) return;
  document.body.classList.remove('theme-blood-oath', 'theme-iron-crown');
  if (f.themeClass) document.body.classList.add(f.themeClass);
  if (f.color || f.primaryColor) {
    const c = f.color || f.primaryColor;
    document.documentElement.style.setProperty('--faction-primary', c);
    document.documentElement.style.setProperty('--faction-glow', c + '38');
  }
};

})();
