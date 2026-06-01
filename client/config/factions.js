(function(){
const US = window.UnkScape = window.UnkScape || {};
// Canon Factions v2 — blood_oath + highborn (framework 001)
// blood_oath: display "Blood Oath"
// highborn: display "Highborn"
US.FACTIONS = US.FACTIONS || {};

US.FACTIONS.blood_oath = {
id: "blood_oath",
name: "Blood Oath",
primaryColor: "#c0392b",
secondaryColor: "#ff7b5c",
themeClass: "theme-blood-oath",
icon: "\u2694\uFE0F",
color: "#c0392b",
description: "Aggressive tribal clans and Viking-style raiders who rule through raw battlefield power.",
desc: "Aggressive tribal clans and Viking-style raiders who rule through raw battlefield power.",
perks: ["+15% Melee Crits", "+10% Move Velocity", "Double battlefield coin recovery"],
modifiers: { meleeDamageMultiplier: 1.15, moveSpeedBonus: 20 },
buff: { attack: 4, moveSpeed: 0.10 }
};

US.FACTIONS.highborn = {
id: "highborn",
name: "Highborn",
primaryColor: "#2980b9",
secondaryColor: "#74b9ff",
themeClass: "theme-highborn",
icon: "\u{1F6E1}\uFE0F",
color: "#2980b9",
description: "A disciplined knightly empire built on stone castles, commerce, and rigid regional order.",
desc: "A disciplined knightly empire built on stone castles, commerce, and rigid regional order.",
perks: ["+15% Base Armor Values", "+10% Base Building Durability", "Enhanced trading post tax revenue"],
modifiers: { armorBonus: 5, buildSpeedMultiplier: 1.15 },
buff: { defense: 5 }
};

US.applyFactionTheme = function(factionId) {
const f = US.FACTIONS[factionId];
if (!f) return;
document.body.classList.remove('theme-blood-oath', 'theme-highborn');
if (f.themeClass) document.body.classList.add(f.themeClass);
if (f.color || f.primaryColor) {
const c = f.color || f.primaryColor;
document.documentElement.style.setProperty('--faction-primary', c);
document.documentElement.style.setProperty('--faction-glow', c + '38');
}
};
})();
