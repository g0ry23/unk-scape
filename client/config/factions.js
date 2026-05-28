(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.FACTIONS = {
    blood_oath: {
      id: "blood_oath",
      name: "Blood-Oath Clans",
      primaryColor: "#c0392b",
      secondaryColor: "#ff7b5c",
      themeClass: "theme-blood-oath",
      icon: "\u{1FA93}",
      color: "#c0392b",
      description: "Aggressive tribal clans and Viking-style raiders who rule through raw battlefield power.",
      perks: ["+15% Melee Crits", "+10% Move Velocity", "Double battlefield coin recovery"],
      modifiers: { meleeDamageMultiplier: 1.15, moveSpeedBonus: 20 },
      buff: { attack: 4, moveSpeed: 0.10 }
    },
    iron_crown: {
      id: "iron_crown",
      name: "Iron-Crown Accord",
      primaryColor: "#2980b9",
      secondaryColor: "#74b9ff",
      themeClass: "theme-iron-crown",
      icon: "\u{1F6E1}\uFE0F",
      color: "#2980b9",
      description: "A disciplined knightly empire built on stone castles, commerce, and rigid regional order.",
      perks: ["+15% Base Armor Values", "+10% Base Building Durability", "Enhanced trading post tax revenue"],
      modifiers: { armorBonus: 5, buildSpeedMultiplier: 1.15 },
      buff: { defense: 5 }
    }
  };

  D.applyFactionTheme = function(factionId) {
    const f = D.FACTIONS[factionId];
    if (!f) return;
    document.body.classList.remove('theme-blood-oath', 'theme-iron-crown');
    if (f.themeClass) document.body.classList.add(f.themeClass);
  };
})();
