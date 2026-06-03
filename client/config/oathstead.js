(function(){
const US = window.UnkScape = window.UnkScape || {};

// ─────────────────────────────────────────────────────────────────────────────
// UNKSCAPE — OATHSTEAD DATA PACK v2.0
// Step 2: Town record, districts, NPC service roles (bank + vendor), economy profile
// Bible refs: Framework 006 (Oathstead), Framework 009 (NPC/Economy), Framework 004 (ID schema)
// All IDs: lowercase_snake_case, npc_oathstead_ prefix, spawned via entities.npcs[]
// releaseState: 'alpha' | versionIntroduced: 'alpha_0_1'
// DO NOT load from studio_framework/ — this file IS the runtime data pack
// ─────────────────────────────────────────────────────────────────────────────

// ── Town Record ──────────────────────────────────────────────────────────────
US.TOWNS = US.TOWNS || {};
US.TOWNS.town_oathstead_village = {
id: 'town_oathstead_village',
displayName: 'Oathstead Village',
type: 'town',
releaseState: 'alpha',
versionIntroduced:'alpha_0_1',
realmId: 'realm_hearthvale_fields',
factionInfluence: 'faction_blood_oath',
townRole: 'starter_hub',
facilityIds: [
'facility_oathstead_village_vault',
'facility_oathstead_market_row',
'facility_oathstead_craftsman_yard',
'facility_oathstead_farming_edge',
'facility_oathstead_claim_training_grounds',
'facility_oathstead_wilderness_outskirts'
],
npcIds: [
'npc_oathstead_banker_torvin_vaultseal',
'npc_oathstead_general_vendor_sela_grainhollow',
'npc_oathstead_town_elder_aldric_ashborne',
'npc_oathstead_guard_captain_varra_ironvow',
'npc_oathstead_blacksmith_dorn_hammerwatch',
'npc_oathstead_alchemist_ysel_brackwater',
'npc_oathstead_innkeeper_moll_cinderwick',
'npc_oathstead_claim_registrar_pell_boundstone',
'npc_oathstead_dungeon_broker_thresh_darkgate',
'npc_oathstead_cartographer_nira_farholm'
],
economyProfileId: 'economy_oathstead_village',
dungeonAccessIds: ['dungeon_harvest_hollow'],
description: 'The oldest surviving Blood Oath settlement in Hearthvale Fields. Frontier town built through generations of survival. Starter hub for all Alpha 0.1 players.',
tags: ['starter','alpha','blood_oath','hearthvale'],
notes: 'Step 2 alpha: bank + general vendor NPCs live.'
};

// ── District Records ─────────────────────────────────────────────────────────
US.DISTRICTS = US.DISTRICTS || {};
US.DISTRICTS.district_gate = { id:'district_gate', townId:'town_oathstead_village', displayName:'Village Gate', releaseState:'alpha', versionIntroduced:'alpha_0_1' };
US.DISTRICTS.district_commons = { id:'district_commons', townId:'town_oathstead_village', displayName:'Central Commons', releaseState:'alpha', versionIntroduced:'alpha_0_1' };
US.DISTRICTS.district_market = { id:'district_market', townId:'town_oathstead_village', displayName:'Market Row', releaseState:'alpha', versionIntroduced:'alpha_0_1' };
US.DISTRICTS.district_craftsman = { id:'district_craftsman', townId:'town_oathstead_village', displayName:"Craftsman's Yard", releaseState:'alpha', versionIntroduced:'alpha_0_1' };
US.DISTRICTS.district_storehouse = { id:'district_storehouse', townId:'town_oathstead_village', displayName:'Storehouse Quarter', releaseState:'alpha', versionIntroduced:'alpha_0_1' };
US.DISTRICTS.district_farming = { id:'district_farming', townId:'town_oathstead_village', displayName:'Farming Edge', releaseState:'alpha', versionIntroduced:'alpha_0_1' };
US.DISTRICTS.district_claim_training = { id:'district_claim_training', townId:'town_oathstead_village', displayName:'Claim Training Grounds', releaseState:'alpha', versionIntroduced:'alpha_0_1' };
US.DISTRICTS.district_outskirts = { id:'district_outskirts', townId:'town_oathstead_village', displayName:'Wilderness Outskirts', releaseState:'alpha', versionIntroduced:'alpha_0_1' };

// ── Facility Records ─────────────────────────────────────────────────────────
US.FACILITIES = US.FACILITIES || {};
US.FACILITIES.facility_oathstead_village_vault = {
id: 'facility_oathstead_village_vault',
displayName: 'Village Vault',
type: 'facility',
releaseState: 'alpha',
versionIntroduced:'alpha_0_1',
townId: 'town_oathstead_village',
districtId: 'district_storehouse',
serviceTypes: ['banking','storage'],
npcIds: ['npc_oathstead_banker_torvin_vaultseal'],
starterUse: true,
description: 'Primary banking and storage facility in Storehouse Quarter.',
tags: ['bank','storage','alpha']
};

// ── NPC Records ──────────────────────────────────────────────────────────────
// Step 1: Bank keeper only. Others are registered with releaseState:'future'
// so they exist in the registry but are not yet spawned in-world.
US.NPC_RECORDS = US.NPC_RECORDS || {};

// STEP 1 — LIVE (spawned in entities.npcs[])
US.NPC_RECORDS.npc_oathstead_banker_torvin_vaultseal = {
id: 'npc_oathstead_banker_torvin_vaultseal',
displayName: 'Torvin Vaultseal',
type: 'npc',
releaseState: 'alpha',
versionIntroduced:'alpha_0_1',
raceId: 'race_human',
townId: 'town_oathstead_village',
realmId: 'realm_hearthvale_fields',
factionInfluence: 'faction_blood_oath',
roleId: 'npc_banker',
occupation: 'Vault Keeper',
serviceTypes: ['banking','deposit','withdraw','storage'],
primaryFacilityId:'facility_oathstead_village_vault',
districtId: 'district_storehouse',
dialogueTone: 'measured, dry wit, protective of coin',
personality: 'Old Blood Oath stockman. Trusts no one fully but serves all who pay.',
dailyRoutineSummary: 'Stands post at the village vault. Keeps ledgers. Guards deposits.',
description: 'Torvin Vaultseal has kept the Oathstead vault since before most players were born. He counts everything twice.',
tags: ['banker','alpha','oathstead','storehouse_quarter'],
notes: 'Step 1 — bank service wired. NPC spawned at cx-4, cy+4 near wanderer hub.',
// Runtime cfg (used by renderDialog / 3D prop)
_cfg: {
icon: '🏦',
name: 'Torvin Vaultseal',
role: 'Vault Keeper — Oathstead',
lines: [
'Coin in your pocket is coin at risk. The vault remembers what your hands forget.',
'I have kept this vault through three hard winters and two raids. Your items are safer here than on your back.',
'Deposit. Withdraw. That is all the vault does. It does both well.'
]
}
};

// STEP 2 — LIVE (spawned in entities.npcs[])
US.NPC_RECORDS.npc_oathstead_general_vendor_sela_grainhollow = {
id: 'npc_oathstead_general_vendor_sela_grainhollow',
displayName: 'Sela Grainhollow',
type: 'npc',
releaseState: 'alpha',
versionIntroduced: 'alpha_0_1',
raceId: 'race_human',
townId: 'town_oathstead_village',
realmId: 'realm_hearthvale_fields',
factionInfluence: 'faction_blood_oath',
roleId: 'npc_merchant',
occupation: 'General Vendor',
districtId: 'district_market',
serviceTypes: ['buying','selling','supplies'],
tags: ['vendor','alpha','oathstead','market_row'],
notes: 'Step 2 — general vendor live.',
_cfg: {
icon: '[S]',
name: 'Sela Grainhollow',
role: 'General Vendor — Market Row',
dialoguePool: {
greeting: "Welcome to the Row. Fields were kind this season — plenty to trade.",
shop: "Honest goods, honest prices. Take a look.",
hook: "Headed for the hollow? Don't go empty — food, a torch, something to swing. I've got all of it.",
farewell: "Keep your fire fed. Come back when your pack's light.",
guidance: "Looking for proper work? The Elder — Aldric Ashborne — holds court at the Commons. He'll set you right."
},
shop: {
buy: ['berry','cooked_berry','raw_fish','torch','health_salve','campfire','stone_hatchet','iron_pickaxe','log','stone','herb','hide','bone','crude_sword','wooden_shield','leather_hood','ranger_tunic','hide_armor','bronze_helm','arrow']
}
}
};
US.NPC_RECORDS.npc_oathstead_town_elder_aldric_ashborne = {
id:'npc_oathstead_town_elder_aldric_ashborne', displayName:'Aldric Ashborne',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_quest_giver', occupation:'Village Elder', districtId:'district_commons',
serviceTypes:['quests','lore','guidance'], tags:['elder','commons']
};
US.NPC_RECORDS.npc_oathstead_guard_captain_varra_ironvow = {
id:'npc_oathstead_guard_captain_varra_ironvow', displayName:'Varra Ironvow',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_guard', occupation:'Guard Captain', districtId:'district_gate',
serviceTypes:['security','guidance','combat_hints'], tags:['guard','gate']
};
US.NPC_RECORDS.npc_oathstead_blacksmith_dorn_hammerwatch = {
id:'npc_oathstead_blacksmith_dorn_hammerwatch', displayName:'Dorn Hammerwatch',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_crafter', occupation:'Blacksmith', districtId:'district_craftsman',
serviceTypes:['smithing','repairs','crafting'], tags:['smith','craftsman_yard']
};
US.NPC_RECORDS.npc_oathstead_alchemist_ysel_brackwater = {
id:'npc_oathstead_alchemist_ysel_brackwater', displayName:'Ysel Brackwater',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_crafter', occupation:'Alchemist', districtId:'district_craftsman',
serviceTypes:['alchemy','potions','herbalism_guidance'], tags:['alchemist','craftsman_yard']
};
US.NPC_RECORDS.npc_oathstead_innkeeper_moll_cinderwick = {
id:'npc_oathstead_innkeeper_moll_cinderwick', displayName:'Moll Cinderwick',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_merchant', occupation:'Innkeeper', districtId:'district_commons',
serviceTypes:['food','rest','local_info'], tags:['innkeeper','commons']
};
US.NPC_RECORDS.npc_oathstead_claim_registrar_pell_boundstone = {
id:'npc_oathstead_claim_registrar_pell_boundstone', displayName:'Pell Boundstone',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_trainer', occupation:'Claim Registrar', districtId:'district_claim_training',
serviceTypes:['building_claim_crafting','claim_tutorial'], tags:['claim','registrar']
};
US.NPC_RECORDS.npc_oathstead_dungeon_broker_thresh_darkgate = {
id:'npc_oathstead_dungeon_broker_thresh_darkgate', displayName:'Thresh Darkgate',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_dungeon_guide', occupation:'Dungeon Broker', districtId:'district_outskirts',
serviceTypes:['extraction','dungeon_access','preparation_advice'], tags:['dungeon','outskirts']
};
US.NPC_RECORDS.npc_oathstead_cartographer_nira_farholm = {
id:'npc_oathstead_cartographer_nira_farholm', displayName:'Nira Farholm',
type:'npc', releaseState:'future', versionIntroduced:'alpha_0_1',
roleId:'npc_scout', occupation:'Cartographer', districtId:'district_gate',
serviceTypes:['travel_info','map_access','route_guidance'], tags:['cartographer','gate']
};

// ── Economy Profile ──────────────────────────────────────────────────────────
US.ECONOMY_PROFILES = US.ECONOMY_PROFILES || {};
US.ECONOMY_PROFILES.economy_oathstead_village = {
id: 'economy_oathstead_village',
displayName: 'Oathstead Village Economy',
type: 'economy_profile',
releaseState: 'alpha',
versionIntroduced:'alpha_0_1',
townId: 'town_oathstead_village',
tier: 'starter',
// Vendor buy multiplier (what vendors pay players, fraction of item base value)
vendorBuyMultiplier: 0.55,
// Vendor sell multiplier (what players pay vendors, fraction of item base value)
vendorSellMultiplier: 1.0,
// No rare/legendary items sold here
maxItemTier: 2,
currency: 'coin',
description: 'Starter economy. Basic resources buy/sell, survival goods, starter tools. No endgame items.',
tags: ['starter','alpha','oathstead']
};

// ── Oathstead NPC Spawn Helper ───────────────────────────────────────────────
// Called by worldgen._placeNPCs to spawn only ALPHA-state Oathstead NPCs
// Returns array of entity objects ready for game.entities.npcs.push()
US.spawnOathsteadNPCs = function(cx, cy, TILE) {
var npcs = [];
var t = TILE;

// ── Bank Keeper: Torvin Vaultseal ─────────────────────────────────────────
// Positioned at district_storehouse: cx-4, cy+4 (same slot as old 'banker' placeholder)
var bankerRec = US.NPC_RECORDS.npc_oathstead_banker_torvin_vaultseal;
npcs.push({
uid: US.uid('npc'),
kind: 'npc',
id: bankerRec.id,
x: (cx - 4) * t + t / 2,
y: (cy + 4) * t + t / 2,
r: 22,
color: '#f1c40f', // gold — vault keeper color
cfg: bankerRec._cfg
});

// — General Vendor: Sela Grainhollow ————————————————————————
// Positioned at district_market: cx+0, cy+2 (Market Row stall)
var selaRec = US.NPC_RECORDS.npc_oathstead_general_vendor_sela_grainhollow;
npcs.push({
uid: US.uid('npc'),
kind: 'npc',
id: selaRec.id,
x: cx * t + t / 2,
y: (cy + 2) * t + t / 2,
r: 22,
color: '#63e6a4',
cfg: selaRec._cfg
});

return npcs;
};

console.log('[UNKSCAPE] Oathstead data pack v2.0 loaded — ' +
Object.keys(US.NPC_RECORDS).length + ' NPC records, 2 alpha-state spawn ready.');

})();
