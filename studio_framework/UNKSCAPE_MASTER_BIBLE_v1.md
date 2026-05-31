# UNKSCAPE MASTER BIBLE v1
Official Source-of-Truth Assembly

Project: UNKSCAPE

Status: MASTER ASSEMBLY

Scope: Frameworks 001-018

---

# Table of Contents
- [001_locked_canon_names.md](#001-locked-canon-names)
- [002_master_game_identity.md](#002-master-game-identity)
- [003_engine_and_namespace_rules.md](#003-engine-and-namespace-rules)
- [004_database_and_id_framework.md](#004-database-and-id-framework)
- [005_alpha_0_1_scope.md](#005-alpha-0-1-scope)
- [006_oathstead_full_town_framework.md](#006-oathstead-full-town-framework)
- [007_core_skills_framework.md](#007-core-skills-framework)
- [008_items_resources_inventory_framework.md](#008-items-resources-inventory-framework)
- [009_npc_services_economy_framework.md](#009-npc-services-economy-framework)
- [010_quests_dungeons_extraction_framework.md](#010-quests-dungeons-extraction-framework)
- [011_player_progression_schema.md](#011-player-progression-schema)
- [012_world_map_terrain_horizon_framework.md](#012-world-map-terrain-horizon-framework)
- [013_animation_audio_ui_framework.md](#013-animation-audio-ui-framework)
- [014_future_races_realms_expansion_framework.md](#014-future-races-realms-expansion-framework)
- [015_security_anticheat_server_framework.md](#015-security-anticheat-server-framework)
- [016_validation_and_qa_rules.md](#016-validation-and-qa-rules)
- [017_claude_build_execution_rules.md](#017-claude-build-execution-rules)
- [018_project_master_readme.md](#018-project-master-readme)

\newpage

---

# 001_locked_canon_names {#001-locked-canon-names}

---

# 001 — Locked Canon Names

## Purpose

This document locks the approved canon names, IDs, spelling, capitalization, public branding, and naming rules for UNKSCAPE.

This file exists to prevent accidental renaming, AI-generated replacement names, inconsistent casing, duplicate identities, or abandoned project language from entering the repo.

All future lore, code, data files, UI text, patch prompts, art prompts, NPC databases, item registries, quest systems, and release documents must follow this canon unless the project owner explicitly approves a change.

---

## Canon Authority Rule

The approved canon in this document is authoritative.

Claude, Gemini, Perplexity, Firefly prompts, future AI assistants, contractors, and scripts must not rename these records without explicit owner approval.

If a future file conflicts with this document, this document wins unless a newer owner-approved canon update exists.

---

## Official Public Game Name

Primary official name:

```text
UNKSCAPE
```

Optional stylized logo/visual variant:

```text id="1zn7ol"
UNK-SCAPE
```

Use `UNKSCAPE` as the main written brand wherever possible.

Use `UNK-SCAPE` only as a stylized visual/logo treatment or when the owner explicitly requests it.

---

## Forbidden Abandoned Names

Do not use, restore, mention, or reintroduce abandoned or previous project names in runtime files, public-facing text, lore, UI, marketing copy, or documentation.

The official project identity is:

```text id="ow10wf"
UNKSCAPE
```

Any older AI-generated project name is considered abandoned and must not be used.

---

## Brand Capitalization Rules

Preferred public display:

```text id="z6af4e"
UNKSCAPE
```

Allowed stylized display:

```text id="p09txm"
UNK-SCAPE
```

Recommended lowercase technical/file-safe usage:

```text id="yfrfsw"
unkscape
```

Use lowercase `unkscape` only where lowercase is technically safer or required, such as:

* localStorage keys
* URL slugs
* filenames
* folder names
* CSS class names
* IDs where lowercase conventions are already used
* package-safe references

Do not create multiple competing brand variants.

Avoid inconsistent variants such as:

```text id="n26gnm"
UnkScape
Unkscape
UNKscape
Unk-Scape
Unk Scape
```

unless explicitly required by an existing file and approved for compatibility.

---

## Canon Runtime Namespace

Canonical runtime namespace:

```js id="jvtzhg"
window.UNKSCAPE
```

Preferred module pattern for future runtime files:

```js id="62355w"
(function(){
  "use strict";
  const U = window.UNKSCAPE = window.UNKSCAPE || {};

  // module content here
})();
```

Preferred internal alias:

```js id="hu9nqj"
U
```

Do not introduce alternate runtime globals.

Do not create or use:

```js id="v7orbe"
window.unkscape
window.Unkscape
window.UnkScape
```

unless a specific backward-compatibility bridge is explicitly approved.

---

## Protected Save Keys

These save keys are locked and protected:

```text id="9cmwhr"
unkscape:saves
unkscape:worlds
```

Do not rename them.

Do not wipe them.

Do not clear localStorage automatically.

Do not destructively migrate them without explicit owner approval.

Any future save migration must be:

* versioned
* reversible where possible
* non-destructive
* documented
* tested
* approved by owner

---

## Primary Factions

Exactly two primary world factions are locked at this stage.

### Blood Oath

Canonical ID:

```text id="jd0h3h"
faction_blood_oath
```

Display name:

```text id="80800m"
Blood Oath
```

Identity:

* spiritual
* grounded
* ritualistic
* firelit
* survival-driven
* oath-bound
* ancestor-memory culture
* frontier freedom
* rebellion pressure
* blood/fire symbolism

Cultural influence rule:

Blood Oath may draw atmospheric inspiration from Afro-Caribbean, Yoruba, Santeria, Cuban/Latin ritual aesthetics, drums, fire, sacrifice symbolism, and spiritual ancestry in an original fantasy way.

Do not directly copy real sacred names, prayers, ceremonies, saints, religious objects, living religious practices, or protected cultural expressions disrespectfully.

Use original fantasy names and respectful influence.

---

### Highborn

Canonical ID:

```text id="55q0ob"
faction_highborn
```

Display name:

```text id="t3q6n9"
Highborn
```

Identity:

* order
* law
* wealth
* divine right
* holy courts
* judges
* engineer-priests
* sealed contracts
* noble authority
* structured civilization
* controlled safety
* polished hierarchy

Highborn is not simply “good.”

Highborn protects through order but can oppress through law, taxes, caste, courts, debt, and divine authority.

---

## Faction Morality Rule

Neither Blood Oath nor Highborn is fully good or evil.

Both protect people.

Both control people.

Both can save a region.

Both can ruin a region.

Both can produce heroes, tyrants, traitors, prophets, soldiers, merchants, and rebels.

Do not write either faction as a flat villain faction or a flat hero faction.

---

## Nine Playable Race Identities

Exactly nine race identities are locked for the current master framework.

Only Human is playable in Alpha 0.1.

All others are known/future/locked unless owner approves otherwise.

| Race ID          | Display Name | Alpha 0.1 State |
| ---------------- | ------------ | --------------- |
| `race_human`     | Human        | alpha           |
| `race_orc`       | Orc          | locked          |
| `race_elf`       | Elf          | locked          |
| `race_dwarf`     | Dwarf        | locked          |
| `race_troll`     | Troll        | locked          |
| `race_goblin`    | Goblin       | locked          |
| `race_nomad`     | Nomad        | locked          |
| `race_nocturnan` | Nocturnan    | locked          |
| `race_aetherian` | Aetherian    | locked          |

Do not rename these races.

Do not replace these races with alternate fantasy species without owner approval.

Do not create duplicate near-equivalents such as “Shadefolk,” “Starborn,” “Beastkin,” “Sunborn,” “Lycanth,” or “Djinn” unless owner later reopens race design.

---

## Alpha 0.1 Canon Scope Names

The Alpha 0.1 foundation slice uses the following canon names.

### Alpha Race

```text id="8evr17"
race_human — Human
```

### Alpha Realm

```text id="maiopz"
realm_hearthvale_fields — Hearthvale Fields
```

### First Fully Built Alpha Town

```text id="f3f91s"
town_oathstead_village — Oathstead Village
```

### Locked / Reference Town

```text id="oe0lmk"
town_highmere_keep — Highmere Keep
```

### Alpha Dungeon

```text id="s87216"
dungeon_harvest_hollow — Harvest Hollow
```

### Known Regional Bosses

```text id="63mye5"
boss_marik_redharrow — Marik Redharrow
boss_cassian_goldseal — Cassian Goldseal
```

Do not rename these.

Do not swap which town is first.

Do not fully build Highmere before Oathstead is complete unless owner changes the implementation order.

---

## Alpha 0.1 Implementation Priority

The first fully built playable slice is:

```text id="qphoos"
Human / Hearthvale Fields / Oathstead Village / Harvest Hollow
```

The first fully authored town is:

```text id="kys78d"
Oathstead Village
```

Highmere Keep remains:

```text id="hpv04z"
locked/reference
```

until Oathstead is complete and approved.

---

## Release State Vocabulary

Use exactly these release states:

```text id="e0uweb"
alpha
locked
future
disabled
```

Meaning:

| Release State | Meaning                                          |
| ------------- | ------------------------------------------------ |
| `alpha`       | current/playable/available in active Alpha slice |
| `locked`      | known but unavailable to players                 |
| `future`      | planned but not implemented                      |
| `disabled`    | intentionally off/hidden temporarily             |

Unknown content must fail closed.

If content does not clearly belong in Alpha, it should not become playable by accident.

---

## World Surface Name

Official surface world ID:

```text id="2pzoh1"
world_surface_age_one
```

World size:

```text id="37mwt1"
16,000 x 12,800 tiles
```

Tile scale target:

```text id="m7ojrw"
approximately 2 meters per tile
```

Approximate world footprint:

```text id="b32zck"
32 km x 25.6 km
819.2 km²
```

Do not rename the official world surface without owner approval.

---

## Dungeon And Extraction Canon

Alpha dungeon:

```text id="xijadn"
dungeon_harvest_hollow — Harvest Hollow
```

Harvest Hollow rules:

* PvE only
* starter difficulty
* no full PvP extraction
* no permadeath
* no full inventory wipe
* unstable loot may be lost on failed extraction
* secured loot remains safe
* quest-critical items recoverable

Loot state IDs:

```text id="67hmah"
unstable
secured
quest_critical
```

Do not add hardcore extraction rules to Alpha 0.1.

---

## Core Skill IDs

Exactly fifteen core skill IDs are locked.

```text id="104v4u"
combat
mining
smithing
woodcutting
fishing
cooking
herbalism
alchemy
crafting
farming
hunting
building_claim_crafting
trading_merchanting
survival
extraction
```

All fifteen core skills must be beginner-accessible during Alpha 0.1 through Oathstead/Hearthvale systems.

Do not lock base skill access behind future races or future regions.

Future regions may add:

* higher mastery
* rare materials
* dangerous nodes
* advanced tools
* special recipes
* faction bonuses
* cultural specialization
* higher XP rates
* unique trainers

Future regions do not unlock the base skill itself.

---

## Oathstead Starter Facility Names

Oathstead Village must eventually support beginner access to these facility concepts:

```text id="6lweuv"
combat yard
shallow mine
forge
anvil
woodlot
riverbank
cooking fire
inn kitchen
herb field
apothecary table
crafting shed
starter farming plots
hunting trail
claim tutorial plot
bank counter
general vendor stall
dungeon broker table
Harvest Hollow entry marker
water source
campfire/shelter point
```

Exact facility IDs should use lowercase snake_case and begin with:

```text id="tjdqh0"
facility_oathstead_
```

Example:

```text id="qu329g"
facility_oathstead_shallow_mine
```

---

## NPC Role IDs

Oathstead Village must eventually include service coverage for these role IDs:

```text id="g7sbhb"
town_leader
banker
innkeeper
general_vendor
specialty_vendor
skill_trainer_combat
skill_trainer_mining
skill_trainer_smithing
skill_trainer_woodcutting
skill_trainer_fishing
skill_trainer_cooking
skill_trainer_herbalism
skill_trainer_alchemy
skill_trainer_crafting
skill_trainer_farming
skill_trainer_hunting
skill_trainer_building_claim_crafting
skill_trainer_trading_merchanting
skill_trainer_survival
skill_trainer_extraction
guard_captain
medic_alchemist
claim_registrar
dungeon_broker
cartographer
laborer
rumor_npc
personal_quest_npc
```

Claude may generate original final NPC names for Oathstead only when specifically approved to build Oathstead data.

Do not generate final names for future towns yet.

---

## Starter Quest Chain IDs

The Hearthvale starter quest chain contains exactly ten locked quest IDs and names:

```text id="fk8rqd"
quest_hearthvale_wake_at_the_common — Wake at the Common
quest_hearthvale_first_steps — First Steps Through Hearthvale
quest_hearthvale_two_banners — Two Banners Over One Valley
quest_hearthvale_tools_of_the_valley — Tools of the Valley
quest_hearthvale_bank_and_barter — Bank and Barter
quest_hearthvale_feed_the_fire — Feed the Fire
quest_hearthvale_claim_marker — The First Claim Marker
quest_hearthvale_whispers_under_harvest — Whispers Under Harvest
quest_hearthvale_hollow_run — The Hollow Run
quest_hearthvale_choose_your_road — Choose Your Road
```

Do not rename these quests.

Do not reorder them unless owner approves a quest flow revision.

---

## Approved Starter Item IDs

The following Alpha starter item IDs are approved.

### Tools

```text id="4dqtlr"
item_tool_copper_pickaxe
item_tool_copper_hatchet
item_tool_fishing_line_basic
item_tool_hunting_snare_basic
item_tool_farming_trowel_basic
item_tool_crafting_needle_basic
item_tool_smithing_hammer_basic
item_tool_alchemy_bowl_basic
```

### Weapons

```text id="84wicn"
item_weapon_training_sword
item_weapon_oathstead_wooden_bow
item_weapon_field_dagger
```

### Armor

```text id="m5ug2n"
item_armor_padded_tunic
item_armor_leather_wrappings
item_armor_oathstead_field_boots
```

### Food / Water

```text id="zjudgg"
item_food_hearthbread
item_food_roasted_root
item_water_clay_jug
```

### Resource Items

```text id="gcmn4a"
item_resource_copper_ore
item_resource_tin_ore
item_resource_iron_scrap
item_resource_oak_log
item_resource_fiber_bundle
item_resource_field_stone
item_resource_raw_fish_small
item_resource_bitterleaf
item_resource_redroot
item_resource_hide_scrap
```

### Potions

```text id="o1dual"
item_potion_minor_mending
item_potion_stamina_sip
```

### Quest / Service

```text id="pirn1t"
item_quest_oathstead_claim_marker
item_quest_harvest_hollow_token
item_service_bank_note_basic
```

Do not rename these starter item IDs.

Do not invent copied holiday or rare item terminology from existing games.

---

## Approved Starter Resource Node IDs

The following Oathstead/Hearthvale beginner resource node IDs are approved:

```text id="w60688"
node_copper_vein_basic
node_tin_vein_basic
node_iron_scrap_pile_basic
node_oak_tree_young
node_fiber_patch_basic
node_river_fishing_spot_small
node_bitterleaf_patch
node_redroot_patch
node_field_stone_pile
node_small_game_trail
```

Do not spawn thousands of nodes during data foundation.

These IDs are for metadata and controlled starter placement only.

---

## Original Rare Cosmetic Naming Direction

Do not use copied rare cosmetic names from other games.

Approved original naming direction for future locked metadata includes:

```text id="9ko0pa"
Age-One Relic
Elderday Crown
First Claim Mantle
Frostwake Cap
Hollow-Eve Visor
```

These are future/locked concepts unless owner approves active release.

---

## ID Format Rules

Use lowercase snake_case for IDs.

Allowed examples:

```text id="r3o3fz"
race_human
faction_blood_oath
realm_hearthvale_fields
town_oathstead_village
npc_oathstead_banker_mara_coinhand
item_tool_copper_pickaxe
quest_hearthvale_wake_at_the_common
facility_oathstead_shallow_mine
resource_node_copper_vein_basic
```

Do not use spaces in IDs.

Do not use uppercase letters in IDs.

Do not use random UUIDs as primary design IDs.

Do not use display names as IDs.

Do not use temporary placeholder names as final IDs.

---

## Standard Record Fields

Every major game record should include:

```text id="qsyge8"
id
displayName
type
releaseState
versionIntroduced
tags
notes
```

For Alpha records, use:

```text id="2m2oho"
alpha_0_1
```

as the version introduced.

---

## Naming Approval Rule

Any new race, faction, realm, town, dungeon, boss, item category, skill, core NPC role, or major lore term must be owner-approved before becoming canon.

Claude may propose names when asked.

Claude must not silently promote proposed names into canon without owner approval.

---

## Future Content Lock Rule

Future content may exist as metadata only.

Future content must not become playable unless explicitly released.

Future content includes:

```text id="gvir4y"
race_orc
race_elf
race_dwarf
race_troll
race_goblin
race_nomad
race_nocturnan
race_aetherian
all non-Hearthvale realms
all future towns
all future dungeons
all future bosses
all future advanced skill zones
all future rare item drops
all future global marketplace systems
all future PvP extraction systems
```

---

## Do Not Copy Rule

UNKSCAPE must not copy protected names, maps, monsters, icons, factions, questlines, logos, UI identities, or item names from existing games.

Do not use final public-facing terms such as:

```text id="yhqim6"
party hat
lesser dragon
blue dragon
Horde
Alliance
Azeroth
RuneScape
OSRS
Varrock
Lumbridge
Gielinor
World of Warcraft
WoW
```

in canon content, final item names, public lore, or production databases.

Original equivalents should be used instead.

---

## Canon Conflict Handling

If a later file introduces a conflicting name:

1. Do not automatically accept the conflict.
2. Mark it as a canon conflict.
3. Report the file path.
4. Report the conflicting term.
5. Preserve this document as the current source of truth.
6. Ask the owner for approval before changing canon.

---

## Claude Compliance Rules

Claude must:

* preserve locked names
* preserve `UNKSCAPE`
* preserve `window.UNKSCAPE`
* preserve `unkscape:saves`
* preserve `unkscape:worlds`
* avoid abandoned names
* avoid Godot assumptions in the WebGL repo
* avoid copied game terms
* keep future content locked
* build Oathstead first
* keep all 15 skills beginner-accessible
* report conflicts before changing canon

Claude must not:

* rename canon records
* invent replacement races
* invent replacement factions
* unlock future content early
* generate final names for future towns
* rename save keys
* wipe saves
* touch runtime systems during documentation-only tasks
* execute patch prompts without exact owner approval

---

## Current Canon Lock Status

```text id="2pwjxu"
canon_locked: true
framework_file: 001_locked_canon_names.md
owner_revision_required_for_renames: true
active_alpha_focus: Oathstead Village
active_alpha_race: Human
active_alpha_realm: Hearthvale Fields
active_alpha_dungeon: Harvest Hollow
primary_factions: Blood Oath, Highborn
runtime_namespace: window.UNKSCAPE
protected_save_keys: unkscape:saves, unkscape:worlds
```

---

## Summary

This file locks the first official naming foundation for UNKSCAPE.

Everything else in the framework should build on this document.

If names drift, stop and correct them before implementation continues.

\newpage

---

# 002_master_game_identity {#002-master-game-identity}

---

002 — Master Game Identity
Purpose

This document defines the official creative identity, gameplay promise, emotional target, genre blend, world tone, originality rules, and long-term player fantasy for UNKSCAPE.

This file is not runtime code.

This file is the creative north star.

All future lore, quests, systems, art direction, NPC writing, UI design, sound direction, worldbuilding, progression systems, and feature planning must align with this identity unless the owner explicitly approves a direction change.

Official Game Name

Primary public name:

UNKSCAPE

Optional stylized/logo variant:

UNK-SCAPE

Use UNKSCAPE as the main written brand.

One-Sentence Identity

UNKSCAPE is an original low-poly medieval fantasy survival-sandbox MMORPG built around grind-heavy progression, meaningful travel, faction pressure, skill mastery, economy, rare loot, claim-based building, and PvE extraction-style dungeons.

Short Identity Statement

UNKSCAPE is a one-of-one medieval fantasy MMO world where players begin as ordinary survivors in a divided realm, train every core skill from the ground up, choose how to survive between Blood Oath grit and Highborn order, and slowly grow into builders, merchants, raiders, crafters, dungeon runners, faction agents, and legends.

The world is large, dangerous, skill-heavy, and intentionally grindy.

The game should feel like an old-school MMO dream rebuilt with modern lessons, survival tension, better structure, stronger anti-cheat planning, deeper identity, and original lore.

Genre Blend

UNKSCAPE combines elements of:

old-school MMORPG
sandbox survival
open-world fantasy RPG
skill-based progression game
crafting/economy simulator
faction territory game
PvE dungeon extraction game
rare loot hunter
quest-heavy adventure game
low-poly retro fantasy world

The game should never feel like only one genre.

The blend is intentional.

The core game loop should let players shift between:

questing
skilling
gathering
crafting
banking
trading
surviving travel
building in allowed claims
fighting mobs
running dungeons
hunting rare drops
preparing supplies
exploring the world
progressing faction stories
Emotional Target

UNKSCAPE should make the player feel:

small at first
hungry for progression
attached to their starter town
aware that the world is bigger than them
rewarded for grinding
nervous before entering dungeons
proud of gathered resources
protective of their bank/inventory
curious about locked regions
tempted by rare drops
invested in their skills
connected to NPCs and towns
pulled between faction philosophies
excited to travel farther
motivated to return after logout

The player should feel that every tool, level, route, bag slot, potion, banked ore, cooked meal, and dungeon extract matters.

Core Player Fantasy

The player fantasy is:

Start with almost nothing.
Learn the land.
Train your skills.
Earn tools.
Survive the road.
Pick your opportunities.
Bank your gains.
Craft your gear.
Enter danger.
Extract what you can.
Build your name.
Expand your world.

UNKSCAPE is not about instant power.

UNKSCAPE is about earning power.

Intended First Impression

The first Alpha experience should communicate:

this is a real world, not a test grid
there is a town with people and services
there are factions watching the region
there are skills to train immediately
there are tools to earn/use
resources have purpose
the bank matters
food/water matter lightly
the dungeon is risky but not unfair
the world continues beyond the starter area
future races/regions exist but are locked
the game is ambitious but controlled

The first build does not need final graphics.

It does need a coherent identity.

Design Pillars
1. Grind With Purpose

Grinding is allowed and expected.

However, grinding should always connect to:

skill levels
tools
recipes
gear
trade value
town economy
quests
dungeon preparation
building materials
faction tasks
rare unlocks

Avoid meaningless grinding.

Every repeated action should push some form of progression, knowledge, resource stockpile, or economy value.

2. All Core Skills Matter Early

All fifteen core skills must be available in beginner form during Alpha 0.1.

The player should not have to wait for future races or distant regions just to start mining, smithing, fishing, farming, hunting, cooking, crafting, or alchemy.

Future regions add depth.

They do not gate the base existence of the skill.

3. One Full Town Before Many Empty Towns

The first playable priority is one complete town:

Oathstead Village

Oathstead must feel functional before the world expands.

A small complete town is better than nine hollow towns.

Town systems should include:

banker
innkeeper
vendors
trainers
services
facilities
starter quests
skill access
economy identity
NPC routines
claim tutorial
dungeon access
4. Massive World, Controlled Loading

UNKSCAPE’s official world is large:

16,000 x 12,800 tiles

The world should feel big and travel-worthy.

However, the engine must never try to spawn/render/simulate the whole world at once.

Use:

world coordinates
chunks
metadata
near-player simulation
locked future zones
visual horizon tricks
progressive content rollout

The player should feel a huge world exists without the browser melting.

5. Survival Pressure Without Early Misery

Survival exists to make travel and preparation meaningful.

Survival should not punish new Alpha players too hard.

Early survival includes:

hunger
thirst
food
water
shelter
campfire/inn relief
light injury concepts
low weather pressure

Future survival may add:

cold
heat
disease
poison
bleeding
exhaustion
storms
supply routes
medicine
dangerous biomes

Survival should create decisions, not rage quits.

6. Extraction Dungeons With MMO Soul

Dungeons should carry extraction tension.

The core loop:

Enter.
Loot.
Fight.
Complete objective.
Manage risk.
Extract.
Secure reward.

Alpha extraction is PvE starter extraction only.

Do not add:

permadeath
full inventory wipe
full PvP looting
hardcore punishment

Alpha Harvest Hollow should teach the concept safely.

Failure should hurt, but not erase the player.

7. Economy And Banking Matter

UNKSCAPE should respect the old-school feeling of banking, storing, selling, trading, and preparing.

The bank should feel important.

Items should have value.

Resources should feed skills.

Vendors should serve a town economy.

Future marketplace systems must be protected against dupes, bots, fake clients, and client-side manipulation.

Do not treat inventory and bank data casually.

8. Claim-Based Building, Not Random World Spam

Players should eventually build, but not anywhere.

Building is controlled through:

Claim Zones
Frontier Wards
Guild Plots
Faction Camps
Wilderness Siege Zones
Homestead Wards

Forbidden building zones include:

major roads
main towns
sacred ruins
dungeons
boss arenas
protected trade hubs

The goal is survival/base identity without turning the world into random clutter.

9. Factions With Philosophy, Not Flat Teams

The two major factions are:

Blood Oath
Highborn

They should not feel like simple red vs blue.

They represent different ways of surviving civilization after collapse.

Blood Oath is not evil.

Highborn is not purely holy.

Blood Oath can protect through loyalty and sacrifice.

Blood Oath can destroy through vengeance and raids.

Highborn can protect through law and infrastructure.

Highborn can destroy through oppression and control.

The player should feel morally pulled, not spoon-fed.

10. Originality Over Imitation

UNKSCAPE may be inspired by the feeling of old MMORPGs and survival games.

It must not copy their protected names, maps, monsters, items, UI identity, logos, questlines, races, or signature terminology.

If a concept is familiar, the execution must be original.

Use original naming, original culture, original layout, original factions, original lore, original mobs, original rare item families, and original quest text.

Core Factions In Identity Terms
Blood Oath

Blood Oath represents survival through oath, fire, sacrifice, memory, land, rebellion, family, and spiritual grit.

Tone words:

firelit
rough
ritual
earthbound
drum-heavy
ancestral
field-born
blood-sworn
unpolished
warm but dangerous

Blood Oath visual/audio direction:

firelight
ash
dark leather
bone/rattle accents
drums
red cloth
rough iron
smoke
mud paths
oath circles
handmade banners
survival camps
ritual field markings

Cultural influence rule:

Blood Oath may carry Afro-Caribbean/Yoruba/Santeria-inspired atmosphere in a respectful original fantasy form.

Do not copy real sacred names, prayers, saints, ceremonies, or living religious rites.

The influence should be emotional, rhythmic, symbolic, and original — not literal theft.

Highborn

Highborn represents order through law, wealth, divine authority, contracts, courts, engineering, taxation, military discipline, and polished safety.

Tone words:

stone
gold
law
contract
bell
court
ledger
engineered
holy order
controlled safety
cold beauty

Highborn visual/audio direction:

stone halls
gold seals
bells
clean metal
blue/white/gold accents if needed
legal banners
tax offices
organized patrols
engineered bridges
sealed doors
polished armor
court parchment
structured plazas

Highborn is powerful because it makes the world safer and more predictable.

Highborn is dangerous because safety may cost freedom.

Alpha Setting Identity

Alpha 0.1 takes place in:

Hearthvale Fields

The first complete town is:

Oathstead Village

Hearthvale Fields should feel like:

farms
fields
rolling ground
small riverbanks
old stone traces
shallow mines
starter forests
herb patches
hunting trails
campfires
carts
rough roads
cellar doors
distant keep silhouettes
buried history under peaceful land

It should not feel like a flat empty test map.

It should feel like a beginner valley with hidden danger underneath.

Oathstead Village Identity

Oathstead Village is:

Blood Oath influenced
Human starter settlement
rough but warm
field-labor culture
practical survival town
starter skilling hub
first emotional home

Oathstead should not feel rich.

It should feel useful.

It should feel like people survive there because they work, trade, share fire, keep oaths, and distrust polished authority.

Oathstead is where the player learns:

movement
banking
vendors
gathering
crafting
survival
questing
faction tension
claim basics
dungeon risk
extraction rules
why the world is divided
Highmere Keep Identity

Highmere Keep exists as the Highborn presence in Hearthvale.

For now it is:

locked/reference

It should feel like:

stone authority
patrols
taxes
court order
safer roads
controlled access
clean banners
class division
legal pressure
military discipline

Highmere is not fully built in the first implementation pass.

It remains visible/known as a future expansion anchor.

Harvest Hollow Identity

Harvest Hollow is the Alpha starter dungeon.

It should feel like:

old field cellar
collapsed root tunnels
stolen harvest stores
candlelit warnings
dirt walls
roots
water drips
scavenged crates
weak enemies at first
escalating danger
extraction tension
beginner mystery

It is not a giant raid.

It teaches players that dungeons are where greed and preparation matter.

Long-Term World Identity

UNKSCAPE is eventually a nine-race, multi-realm world.

Each race should eventually have:

homeland
culture
two faction-influenced towns
local economy
local skill emphasis
local resources
local mobs
local dungeon
two regional bosses
territory pressure
story chain
future expansion potential

However, this long-term structure must not overload Alpha.

Alpha builds the model once with Human/Oathstead, then repeats/improves it later.

Visual Style Identity

UNKSCAPE should be:

low-poly
retro fantasy
browser-friendly
chunk-streamed
readable from top/down or 3D angled view
gritty but not ugly
stylized but not childish
old-school inspired but modernized

The visual goal is not photorealism.

The visual goal is:

readable silhouettes
strong faction identity
atmospheric terrain
clear interactables
visible tools/resources
cozy towns
dangerous dungeons
meaningful horizon
no black void world
no floating block feel
UI Identity

UNKSCAPE UI should feel embedded in the world.

Suggested UI direction:

parchment
stone
iron
leather
wax seals
faction badges
compact readable panels
clear inventory slots
readable item tooltips
bank safety emphasis
quest cards
survival indicators
extraction status
skill progress

Blood Oath UI flavor:

rough leather
red cloth
charcoal iron
fire highlights
hand-marked symbols

Highborn UI flavor:

stone paneling
gold seals
clean borders
legal stamp effects
organized tabs

Do not let UI become generic modern sci-fi menus.

Audio Identity

UNKSCAPE audio should support the world mood.

Hearthvale base ambience:

wind over fields
river water
birds
distant tools
market murmur
campfires
occasional distant forge
nighttime insects
dungeon warning tones

Blood Oath sound profile:

drums
fire
leather
bone/rattle accents
low chants
ritual tension

Highborn sound profile:

bells
clean metal
stone reverb
marching rhythm
court ambience
controlled order

Audio can start as metadata/planning hooks before final assets exist.

Missing audio assets should not crash gameplay.

Progression Identity

Progression should feel layered.

Player progression includes:

combat levels
skill levels
tool upgrades
recipes
quest completion
faction reputation
bank wealth
trade value
survival knowledge
dungeon extraction confidence
claim ownership
location discovery
rare item collection
social/guild identity later

Progression should not depend only on killing enemies.

A merchant, skiller, crafter, builder, hunter, or dungeon runner should all feel valid over time.

Quest Identity

Quests should matter heavily.

Quest design should include:

short tutorial quests
town service quests
skill introduction quests
faction philosophy quests
gathering/crafting tasks
survival preparation tasks
dungeon unlock quests
boss lead-in quests
moral choice quests later
long-form lore chains later

Quest writing should avoid generic filler.

Even simple tasks should teach the world.

For example:

“Collect bitterleaf” should also teach:

who needs medicine
why the town lacks supplies
what danger is nearby
which faction controls the route
how the economy works
Rare Loot Identity

Rare loot should feel exciting and protected.

Rare item families should be original.

Future rare cosmetics may include:

Age-One Relics
Elderday Crowns
First Claim Mantles
Frostwake Caps
Hollow-Eve Visors

Do not copy rare holiday item names from other games.

Do not make rare item systems client-authoritative in final multiplayer.

Rare drops should eventually require server validation.

Anti-Cheat Identity

UNKSCAPE must learn from old MMO failures.

Future official multiplayer must protect against:

bots
auto-clickers
mining scripts
fishing scripts
woodcutting scripts
fake clients
packet replay
item duplication
bank manipulation
marketplace manipulation
XP boosting
NPC exploitation
dungeon reward abuse

Early local saves are acceptable for development only.

Final MMO progression must be server-authoritative.

What UNKSCAPE Is Not

UNKSCAPE is not:

a clone of any existing MMO
a Minecraft-style build-anywhere chaos map
a flat test grid with a logo
a pure survival punishment simulator
a pure dungeon extraction shooter
a simple red-vs-blue faction war
a one-town tech demo forever
a game where every system unlocks at once
a game where future lore overrides current scope
a game where localStorage is trusted for final economy/security
Player Onboarding Promise

The first hour should ideally teach:

Who the player is.
Where they are.
What Oathstead is.
What Blood Oath influence feels like.
That Highborn exists nearby.
How to move and interact.
How to gather.
How to use tools.
How to bank.
How to buy/sell.
How to train skills.
How hunger/thirst works lightly.
How to enter Harvest Hollow.
How unstable loot differs from secured loot.
That the world is much bigger.
Long-Term Promise

UNKSCAPE’s long-term promise is:

A huge original fantasy MMO world where skilling, survival, economy, faction pressure, dungeons, building, quests, and rare loot all connect into one persistent identity.

The game should grow outward from a solid first town.

Not explode outward into half-built systems.

Implementation Priority From This Identity

The identity demands the following implementation order:

Preserve engine stability.
Preserve save/load.
Lock canon names.
Build data/ID foundation.
Build one full town.
Make all core skills beginner-accessible.
Add starter inventory/resource/quest/economy data.
Add Harvest Hollow starter extraction.
Validate everything.
Expand only after the slice works.
Identity Compliance Rules For Claude

Claude must:

preserve canon names
preserve the UNKSCAPE brand
preserve custom WebGL engine assumptions
avoid Godot assumptions
avoid copied MMO terminology
build Oathstead first
keep Highmere locked/reference
keep all future races locked
keep all fifteen skills available in beginner form
keep data lightweight
avoid massive world generation
avoid full server claims during local Alpha
report identity conflicts before implementing

Claude must not:

rename factions
rename races
rename towns
invent replacement world names
unlock future races early
build all towns at once
generate massive item databases without approval
treat local saves as final MMO security
make Harvest Hollow hardcore extraction
turn UNKSCAPE into a clone of another game

\newpage

---

# 003_engine_and_namespace_rules {#003-engine-and-namespace-rules}

---

Purpose

This document defines the official technical foundation rules for UNKSCAPE’s current custom browser-based game engine.

This file exists to protect the current WebGL/JavaScript engine from namespace drift, abandoned project names, Godot contamination, save-key damage, unsafe script loading, duplicate systems, and accidental rewrites.

This document is not runtime code.

It is a technical governance framework for all future UNKSCAPE implementation work.

Current Engine Target

UNKSCAPE’s current active engine is:

Custom browser-based WebGL 3D engine
Vanilla JavaScript
GitHub Pages compatible
Low-poly retro fantasy MMORPG / survival sandbox style

This is the active implementation target.

All current code, data modules, patch prompts, and implementation directives must assume the custom browser/WebGL engine unless the owner explicitly approves a future engine migration.

Backup Engine Policy

Godot is a backup option only.

Do not add Godot-specific files, assumptions, or syntax to the current WebGL repo.

Forbidden in the active WebGL repo unless explicitly approved:

res:// paths
.gd scripts
.tscn scene assumptions
Godot node names
Godot ProjectSettings references
Godot CharacterBody3D assumptions
Godot input map assumptions
Godot export annotations

Do not write documentation that implies Godot is the current engine.

Do not generate implementation files for Godot unless the owner starts a separate migration project.

Canonical Runtime Namespace

The only approved runtime namespace is:

window.UNKSCAPE

All future runtime modules must attach to this namespace.

Preferred module pattern:

(function(){
  "use strict";

  const U = window.UNKSCAPE = window.UNKSCAPE || {};

  // module content here
})();

Preferred internal alias:

U

This pattern ensures every module attaches to the same shared global object.

Forbidden Runtime Namespaces

Do not create or reintroduce alternate namespace roots.

Forbidden:

window.unkscape
window.Unkscape
window.UnkScape

Do not create compatibility bridges unless explicitly approved by owner.

Do not reintroduce any abandoned project namespace.

Do not split game systems across multiple global objects.

Namespace Drift Rule

If any file uses a different global namespace, stop and report:

File path.
Namespace found.
Whether it is runtime or documentation.
Risk level.
Suggested safe fix.

Do not silently patch namespace conflicts without reporting first if the change affects runtime systems.

Protected Save Keys

These localStorage keys are locked:

unkscape:saves
unkscape:worlds

Do not rename.

Do not wipe.

Do not clear localStorage automatically.

Do not destructively migrate.

Do not create new competing save keys for the same purpose unless approved.

Any future migration must be:

versioned
non-destructive
documented
reversible where possible
tested
owner-approved
Save System Respect Rule

Early UNKSCAPE builds may use local browser saves for development.

That does not mean local browser saves are final MMO security.

Future official multiplayer progression must be server-authoritative.

Do not trust client-only localStorage for final:

XP
levels
inventory
bank
currency
trades
boss drops
rare items
marketplace listings
resource gathering
crafting results
extraction rewards
Local Save Development Rule

During Alpha development, local saves may store:

world list
character list
position
basic inventory if existing system supports it
progress flags
settings
local test state

But local saves must be treated as:

development convenience
not final security

Do not claim local saves are cheat-proof.

Root Object Structure

Future systems should organize under the canonical root:

U.Data = U.Data || {};
U.Systems = U.Systems || {};
U.Constants = U.Constants || {};
U.State = U.State || {};
U.Config = U.Config || {};

Recommended meanings:

Root	Purpose
U.Data	static game data, registries, canon records
U.Systems	functions/helpers/rules that operate on data
U.Constants	fixed technical constants
U.State	runtime mutable state if the engine already uses it
U.Config	configurable values/tuning

Do not duplicate roots with different casing.

Required Future Data Namespaces

Future runtime data should use these namespaces when implemented:

U.Data.Release
U.Data.Factions
U.Data.Races
U.Data.Realms
U.Data.Towns
U.Data.Facilities
U.Data.Skills
U.Data.Items
U.Data.Resources
U.Data.NPCs
U.Data.Quests
U.Data.Dungeons
U.Data.Bosses
U.Data.Economy
U.Data.PlayerProgressionSchema
U.Data.World
U.Data.Alpha01

Do not create unrelated alternate structures unless the existing repo architecture clearly requires adaptation.

If adaptation is needed, document the mapping.

Required Future System Namespaces

Future helper/system modules should use:

U.Systems.Release
U.Systems.Registry
U.Systems.Factions
U.Systems.Races
U.Systems.Towns
U.Systems.Facilities
U.Systems.Skills
U.Systems.Items
U.Systems.Resources
U.Systems.NPCs
U.Systems.Quests
U.Systems.Economy
U.Systems.PlayerProgression
U.Systems.WorldMath
U.Systems.Validation

Do not duplicate similar systems.

If an existing system already exists, extend carefully instead of replacing.

Module Safety Rules

Every future runtime module should:

Use "use strict";
Attach to window.UNKSCAPE.
Avoid leaking local variables globally.
Avoid throwing on missing optional future data.
Return safe validation output when possible.
Avoid side effects during load unless intentional.
Avoid spawning world objects just because data loaded.
Avoid modifying saves during static data initialization.
Avoid touching DOM unless it is a UI module.
Avoid touching rendering unless it is a renderer module.
Static Data vs Runtime Behavior

Static data files should define records only.

Static data files should not:

spawn NPCs
spawn resources
move the player
mutate saves
create DOM panels
trigger combat
start timers
load heavy assets
generate the full world
modify player inventory
unlock content automatically

Runtime systems may consume static data, but only through controlled implementation.

Script Loading Rules

If the project uses direct script tags in index.html, load order matters.

Recommended load order for future data architecture:

namespace/bootstrap first
release states / constants
world constants
registry helpers
factions
races
realms
towns
facilities
skills
items
resources
NPCs
economy
dungeons
quests
player progression schema
validation last
runtime consumers after data is available

Do not randomly reorder unrelated script tags.

Do not add duplicate script tags.

Do not remove existing scripts unless specifically approved.

If index.html script order is unclear, stop and report before modifying.

File Path Guidance

Preferred future runtime structure if compatible with the repo:

client/data/
client/systems/
client/engine/
client/ui/
client/assets/
docs/
final_unk_handoff_bundle/

Suggested data paths for future implementation:

client/data/release_states.js
client/data/factions.js
client/data/races.js
client/data/world_constants.js
client/data/realms.js
client/data/towns.js
client/data/oathstead_facilities.js
client/data/skills.js
client/data/items_alpha_starter.js
client/data/resources_alpha_starter.js
client/data/oathstead_npcs.js
client/data/oathstead_economy.js
client/data/hearthvale_quests.js
client/data/harvest_hollow.js
client/data/player_progression_schema.js

Suggested system paths:

client/systems/registry.js
client/systems/release_rules.js
client/systems/world_math.js
client/systems/skill_rules.js
client/systems/item_rules.js
client/systems/town_rules.js
client/systems/npc_rules.js
client/systems/quest_rules.js
client/systems/economy_rules.js
client/systems/progression_rules.js
client/systems/validation.js

If the repo uses different conventions, adapt carefully and report the chosen paths.

GitHub Pages Compatibility Rule

UNKSCAPE must remain compatible with GitHub Pages unless the owner explicitly changes deployment.

Avoid requiring:

Node server at runtime
private backend for Alpha local test
build tools that GitHub Pages cannot serve
server-side rendering
native desktop-only features
dynamic imports unsupported by the current deployment approach
non-static asset hosting assumptions

If a feature requires a backend, mark it as future and do not implement it into current Alpha runtime.

Browser Compatibility Rule

The game should remain browser-friendly.

Avoid:

huge startup payloads
massive JSON files
synchronous heavy loops
full-map generation at boot
uncontrolled memory growth
thousands of DOM nodes for world objects
excessive console spam
blocking resource loads
unbounded localStorage writes

The browser must remain responsive.

World Size Rule

Official surface world:

world_surface_age_one

Official dimensions:

16,000 x 12,800 tiles

Tile scale target:

approximately 2 meters per tile

This does not mean the engine should generate, simulate, or render every tile at once.

The world size is a coordinate foundation.

Use:

chunk streaming
near-player simulation
metadata
region records
lightweight procedural rules
horizon/proxy visuals
content gating

Do not create a giant full-world tile array.

No Full World Generation Rule

Do not generate:

full 16,000 x 12,800 terrain data
full resource map
full NPC population
full mob population
full dungeon population
one giant map JSON
one giant collision grid
all towns at once
all regions at once

Current strategy is:

big coordinate world
small active playable slice
future content locked
load near-player details only
No Floating Block Visual Rule

Technical chunk loading is allowed.

The visible world must not look like a tiny floating block in black space.

Renderer planning should support:

near gameplay ring
mid visual ring
far proxy ring
sky/fog/horizon layer
terrain continuation illusion
distant silhouettes
haze/fog
mountains/trees/ocean proxies
no hard black void around the player

Do not solve this by rendering the entire world in detail.

Runtime Mutation Rule

Documentation tasks must not modify runtime files.

Data foundation tasks may create data files only when approved.

Runtime integration tasks may touch engine/UI/gameplay only when specifically approved.

Each task must clearly state whether it is:

documentation only
data foundation
runtime integration
QA/validation
bugfix
rollback

Claude must not blend these task types without approval.

Patch Execution Rule

Patch prompts inside:

final_unk_handoff_bundle/patch_prompts/

are inert documentation until the owner explicitly approves a patch by exact ID.

Example approval format:

approved for Claude execution: FINAL_UNK_PATCH_001

Do not execute patches based on implication.

Do not execute multiple patches unless explicitly approved.

Do not skip ahead.

Build Directive Rule

Build directives are separate from patch prompts.

A build directive may authorize runtime coding if it clearly states so.

If a build directive conflicts with locked canon, stop and report.

If a build directive would break save/load, stop and report.

If a build directive would require major engine rewrite, stop and report.

index.html Protection Rule

index.html is sensitive because it controls script load order.

Do not modify index.html during documentation-only tasks.

When runtime data/system files are added, script tags may be required.

Before changing index.html, Claude must report:

Existing relevant script tags.
New script tags proposed.
Exact insertion location.
Why the load order is safe.
Whether any unrelated script tags changed.

Do not reorder unrelated scripts.

Console Safety Rule

All validation helpers should be callable from the browser console.

Validation helpers should return plain objects:

{
  ok: true,
  errors: [],
  warnings: [],
  counts: {}
}

Validation should not throw for normal missing/future content.

Fatal errors should be reserved for actual syntax/runtime failures.

Error Handling Philosophy

Prefer safe failure over silent corruption.

If content is missing:

return null
return warning
return validation error
fail closed
keep content locked

Do not auto-unlock unknown content.

Do not make assumptions that mutate game state.

Data Registry Philosophy

The engine-side data registry is not the final production server database.

It is a structured local/static game data foundation that can later migrate to a server-backed database.

Data should be:

ID-stable
searchable
validateable
versioned
release-gated
lightweight
portable

Do not design it as throwaway placeholder data.

Versioning Rule

Alpha records should use:

alpha_0_1

as versionIntroduced.

Future records may use:

future

or a future version only when known.

Do not claim future content is implemented before it exists.

Logging Rule

Avoid console spam.

If debug logs are necessary, use existing debug conventions if present.

If no debug system exists, keep logs minimal and mostly within validation/reporting functions.

Do not print huge registries every frame.

Performance Rule

Do not create systems that run heavy validation every frame.

Validation should be manual/console/test triggered unless specifically designed as lightweight boot checks.

Avoid:

per-frame full registry scans
per-frame localStorage writes
per-frame DOM rebuilds
per-frame full world calculations
per-frame full inventory validation
File Creation Rule

When creating files, use clear names.

Do not create duplicate files with similar meanings.

Do not create temporary files as final files.

Do not create backup files inside runtime folders unless approved.

Avoid:

new_new_final.js
fixed2.js
temp.js
copy.js
test_final_real.js

Use production names.

Documentation Location Rule

Permanent framework documentation belongs in:

final_unk_handoff_bundle/studio_framework/

Patch prompts belong in:

final_unk_handoff_bundle/patch_prompts/

Production tracking seeds belong in:

final_unk_handoff_bundle/production_seed/

Game Bible seed docs belong in:

final_unk_handoff_bundle/game_bible_seed/

Do not mix runtime JS into documentation folders.

Canon Conflict Rule

If a technical implementation conflicts with canon naming, stop and report.

Examples:

different game name
different faction name
different race list
different town ID
different save key
alternate namespace
Godot-only code in WebGL repo

Do not “fix creatively.”

Report and wait.

Repo Audit Expectations

Before major implementation, Claude should audit:

index.html
client/
engine/
entities/
systems/
data/
ui/
assets/
localStorage usage
namespace usage
save/load files
world constants
script load order
existing player creation
existing resource/NPC creation
existing renderer

Exact paths depend on repo structure.

Claude must report findings before risky changes.

Runtime Compatibility Checklist

Any future runtime implementation must preserve:

game boots
player can move
basic interaction works if previously working
save keys still exist
load does not crash
window.UNKSCAPE exists
console has no fatal errors
index.html script order is valid
no giant resource spawn
no full-world generation
future content remains locked
Manual Smoke Test Expectations

After any runtime implementation, owner should test:

Open game.
Confirm no fatal console errors.
Confirm window.UNKSCAPE.
Confirm player can move.
Confirm basic interaction still works if previously working.
Save.
Refresh.
Load.
Confirm position/progress still valid.
Confirm protected save keys remain.

Console checks:

window.UNKSCAPE
localStorage.getItem("unkscape:saves")
localStorage.getItem("unkscape:worlds")
Claude Output Requirements For Runtime Tasks

After any runtime task, Claude must report:

Task ID/name.
Audit findings.
Files created.
Files modified.
Full code for changed runtime JS files.
Exact index.html changes if any.
Namespace confirmation.
Save key confirmation.
Validation results.
Smoke tests.
Warnings.
Recommended next step.
Stop Conditions

Claude must stop and report if:

repo structure is unclear
namespace is fragmented
save/load files are risky
index.html load order is unclear
implementation requires engine rewrite
implementation would wipe or migrate saves
implementation would generate massive world data
implementation would require backend/server
implementation would require Godot
implementation would unlock future content accidentally

Do not push through stop conditions.

Summary

UNKSCAPE’s current active engine is a custom browser-based WebGL/vanilla JavaScript engine.

The runtime namespace is:

window.UNKSCAPE

The protected save keys are:

unkscape:saves
unkscape:worlds

Godot is backup only.

Future coding must protect engine stability, script loading, save/load, namespace consistency, browser performance, and Alpha scope.

All implementation must build on this foundation.

\newpage

---

# 004_database_and_id_framework {#004-database-and-id-framework}

---

004 — Database And ID Framework
Purpose

This document defines the official UNKSCAPE database-style framework, ID rules, registry structure, record schemas, validation expectations, and future-proof data organization standards.

This file is not runtime code.

This file is the blueprint Claude must follow when creating data modules, registries, item records, NPC records, quest records, skill records, resource nodes, world metadata, player progression schemas, and future server database mappings.

The goal is to prevent messy data, duplicate IDs, inconsistent naming, missing fields, untracked content, and future migration pain.

Core Principle

UNKSCAPE must be built as a data-driven game.

Every major object in the world should have a stable ID.

Every stable ID should be:

lowercase
snake_case
readable
unique within its registry
predictable
future-safe
owner-approved if canon-level

The data layer should be structured enough to grow into a real MMO database later.

Current Database Type

During current Alpha development, the “database” is not a live backend database.

It is an engine-side structured game data registry made of JavaScript objects/arrays attached to:

window.UNKSCAPE

Future production MMO systems may migrate this to a server-authoritative database.

Current data should be designed so that migration is possible later.

Runtime Root

All future runtime data must live under:

window.UNKSCAPE

Preferred alias inside modules:

const U = window.UNKSCAPE = window.UNKSCAPE || {};

Required root groups:

U.Data = U.Data || {};
U.Systems = U.Systems || {};
U.Constants = U.Constants || {};
U.Config = U.Config || {};
U.State = U.State || {};

Meaning:

Root	Purpose
U.Data	static records and registries
U.Systems	logic, helper methods, validation, lookup rules
U.Constants	fixed engine/world constants
U.Config	tunable configuration
U.State	runtime mutable state if existing engine uses it
Data Registry Namespaces

Future data registries should use these canonical namespaces:

U.Data.Release
U.Data.Factions
U.Data.Races
U.Data.Realms
U.Data.Towns
U.Data.Facilities
U.Data.Skills
U.Data.Items
U.Data.Resources
U.Data.NPCs
U.Data.Quests
U.Data.Dungeons
U.Data.Bosses
U.Data.Economy
U.Data.PlayerProgressionSchema
U.Data.World
U.Data.Alpha01

Do not create duplicate names like:

U.Data.ItemDatabase
U.Data.item_db
U.Data.ItemsList
U.items
U.gameItems

unless existing repo compatibility requires mapping.

If mapping is required, document the mapping clearly.

System Registry Namespaces

Future system helpers should use:

U.Systems.Release
U.Systems.Registry
U.Systems.Factions
U.Systems.Races
U.Systems.Realms
U.Systems.Towns
U.Systems.Facilities
U.Systems.Skills
U.Systems.Items
U.Systems.Resources
U.Systems.NPCs
U.Systems.Quests
U.Systems.Dungeons
U.Systems.Bosses
U.Systems.Economy
U.Systems.PlayerProgression
U.Systems.WorldMath
U.Systems.Validation

System modules must not silently overwrite existing systems.

They should extend safely.

ID Format Standard

All major IDs must use:

lowercase_snake_case

Approved examples:

race_human
faction_blood_oath
realm_hearthvale_fields
town_oathstead_village
facility_oathstead_shallow_mine
npc_oathstead_banker_mara_coinhand
item_tool_copper_pickaxe
resource_node_copper_vein_basic
quest_hearthvale_wake_at_the_common
dungeon_harvest_hollow
boss_marik_redharrow
economy_oathstead_village

Do not use:

spaces
uppercase letters
random casing
UUIDs as main design IDs
display names as IDs
ambiguous short IDs
temporary placeholders as final IDs

Bad examples:

Human
RaceHuman
raceHuman
race-human
town1
npc007
itemFinalNew
Copper Pickaxe
Stable ID Rule

Once an ID is used in saved data, quests, inventory, NPC references, economy data, or progression records, it should be treated as stable.

Renaming an ID later requires:

migration plan
compatibility map
owner approval
testing
rollback notes

Avoid casual renaming.

Standard Record Fields

Every major record should include at minimum:

id
displayName
type
releaseState
versionIntroduced
tags
notes

Recommended base shape:

{
  id: "item_tool_copper_pickaxe",
  displayName: "Copper Pickaxe",
  type: "item",
  releaseState: "alpha",
  versionIntroduced: "alpha_0_1",
  tags: [],
  notes: ""
}
Release States

Use only:

alpha
locked
future
disabled

Meanings:

State	Meaning
alpha	active/current/playable in Alpha scope
locked	known but unavailable to players
future	planned but not implemented
disabled	intentionally turned off/hidden

Unknown content should fail closed.

If a record lacks a release state, validation should warn or fail depending on severity.

Versioning Standard

Alpha records use:

alpha_0_1

Future records may use:

future

or a later version only when owner-approved.

Do not mark future content as alpha unless it is meant to be playable/active.

Canon vs Runtime Data

Canon data means approved creative identity.

Runtime data means records the engine can consume.

A canon name may exist before runtime implementation.

A runtime record should not invent canon-breaking names.

Examples:

Oathstead Village

is canon.

Its runtime ID is:

town_oathstead_village

Both must stay aligned.

Registry Shapes

Registries may be stored as object maps keyed by ID or arrays with IDs.

Preferred for lookups:

U.Data.Items = {
  byId: {
    item_tool_copper_pickaxe: {
      id: "item_tool_copper_pickaxe",
      displayName: "Copper Pickaxe"
    }
  },
  allIds: ["item_tool_copper_pickaxe"]
};

Alternative acceptable for small/simple registries:

U.Data.Items = [
  {
    id: "item_tool_copper_pickaxe",
    displayName: "Copper Pickaxe"
  }
];

If arrays are used, provide helper functions to find by ID.

Avoid mixing both patterns randomly.

Recommended Registry Standard

For future consistency, prefer this shape:

{
  byId: {},
  allIds: [],
  meta: {
    registryId: "items",
    versionIntroduced: "alpha_0_1",
    owner: "UNKSCAPE"
  }
}

Every record ID in allIds should exist in byId.

Every record in byId should appear in allIds.

Validation must check this.

Global Registry Helper

A future U.Systems.Registry should provide safe helpers:

getRegistry
getById
hasId
listIds
listRecords
filterByReleaseState
filterByTag
validateRegistryShape
validateUniqueIds
validateRequiredFields

Expected behavior:

return null or empty arrays safely
do not throw for missing future registries
report warnings through validation
avoid mutating records unless specifically intended
ID Uniqueness Rule

IDs should be unique within their registry.

Some IDs should also be globally unique across all major registries to avoid confusion.

Example conflict to avoid:

item_oathstead_token
quest_oathstead_token

This is technically different if prefixes differ, but confusing if display names overlap.

Use clear prefixes:

item_
quest_
npc_
town_
realm_
skill_
facility_
resource_node_
dungeon_
boss_
economy_
Required ID Prefixes

Use these prefixes:

Category	Prefix
Race	race_
Faction	faction_
Realm	realm_
Town	town_
Facility	facility_
NPC	npc_
Skill	no prefix required for core skill IDs
Item	item_
Resource Node	node_ or resource_node_
Quest	quest_
Dungeon	dungeon_
Boss	boss_
Economy Profile	economy_
Vendor Profile	vendor_
Dialogue Set	dialogue_
Loot Table	loot_
Recipe	recipe_
Claim Zone	claim_
Region	region_
World Surface	world_

Core skills intentionally use direct IDs:

mining
smithing
woodcutting

because they are fundamental player progression fields.

Race Record Schema

Race records should include:

id
displayName
type
releaseState
versionIntroduced
playable
starterRealmId
starterTownIds
factionOptions
skillLean
description
tags
notes

Required race IDs:

race_human
race_orc
race_elf
race_dwarf
race_troll
race_goblin
race_nomad
race_nocturnan
race_aetherian

Only race_human is Alpha playable.

Faction Record Schema

Faction records should include:

id
displayName
type
releaseState
versionIntroduced
alignmentStyle
coreValues
visualTags
audioTags
strengths
risks
description
tags
notes

Required faction IDs:

faction_blood_oath
faction_highborn

Do not create Horde/Alliance-style copied terms.

Realm Record Schema

Realm records should include:

id
displayName
type
releaseState
versionIntroduced
raceAffinity
biomeTags
starterTownIds
dungeonIds
bossIds
skillFocus
resourceThemes
description
tags
notes

Alpha realm:

realm_hearthvale_fields
Town Record Schema

Town records should include:

id
displayName
type
releaseState
versionIntroduced
realmId
raceAffinity
factionInfluence
townRole
facilityIds
npcIds
questIds
vendorProfileIds
economyProfileId
dungeonAccessIds
claimZoneIds
description
tags
notes

Alpha town:

town_oathstead_village

Locked/reference town:

town_highmere_keep
Facility Record Schema

Facility records should include:

id
displayName
type
releaseState
versionIntroduced
townId
realmId
skillIds
serviceTypes
npcIds
requiredItemIds
starterUse
futureUpgradeNotes
description
tags
notes

Oathstead facility IDs should begin with:

facility_oathstead_
Skill Record Schema

Core skill records should include:

id
displayName
type
releaseState
versionIntroduced
category
beginnerAccessible
starterFacilityIds
starterToolIds
starterResourceNodeIds
starterRecipeIds
xpConcept
levelCapAlpha
futureExpansionNotes
description
tags
notes

Required core skill count:

15

Required core skills:

combat
mining
smithing
woodcutting
fishing
cooking
herbalism
alchemy
crafting
farming
hunting
building_claim_crafting
trading_merchanting
survival
extraction

All must be beginner-accessible in Alpha 0.1.

Item Record Schema

Item records should include:

id
displayName
type
category
tier
releaseState
versionIntroduced
stackable
maxStack
tradeable
bankable
destroyable
sourceTags
skillRequirements
useTags
valueCopper
description
tags
notes

Item categories:

currency
tool
weapon
armor
resource
food
water
herb
potion
crafting_material
quest_item
dungeon_loot
building_material
cosmetic
document
service_token
Resource Node Record Schema

Resource node records should include:

id
displayName
type
releaseState
versionIntroduced
resourceItemIds
skillId
requiredToolCategory
levelRequirement
biomeTags
respawnConcept
rarity
dangerLevel
description
tags
notes

Approved starter nodes:

node_copper_vein_basic
node_tin_vein_basic
node_iron_scrap_pile_basic
node_oak_tree_young
node_fiber_patch_basic
node_river_fishing_spot_small
node_bitterleaf_patch
node_redroot_patch
node_field_stone_pile
node_small_game_trail
NPC Record Schema

NPC records should include:

id
displayName
type
releaseState
versionIntroduced
raceId
townId
realmId
factionInfluence
roleId
occupation
serviceTypes
primaryFacilityId
questIds
vendorProfileId
trainerSkillIds
relationshipIds
dailyWageCopper
estimatedNetWorthCopper
dialogueTone
personality
dailyRoutineSummary
description
tags
notes

NPC IDs should be descriptive:

npc_oathstead_banker_mara_coinhand

Do not use vague IDs like:

npc_001
Quest Record Schema

Quest records should include:

id
displayName
type
releaseState
versionIntroduced
realmId
townId
order
category
giverNpcId
turnInNpcId
prerequisiteQuestIds
teaches
objectives
rewardConcepts
xpRewardConcepts
itemRewardIds
currencyRewardCopper
unlocks
safetyNotes
summary
tags
notes

Starter quest chain has 10 locked IDs.

Dungeon Record Schema

Dungeon records should include:

id
displayName
type
releaseState
versionIntroduced
realmId
townAccessIds
recommendedLevel
extractionEnabled
pvpEnabled
permadeathEnabled
inventoryWipeRules
lootStateRules
bossIds
mobThemeTags
objectiveTypes
entryRequirements
failureRules
description
tags
notes

Alpha dungeon:

dungeon_harvest_hollow
Boss Record Schema

Boss records should include:

id
displayName
type
releaseState
versionIntroduced
realmId
townInfluenceId
factionId
dungeonId
difficultyTier
mechanicThemes
lootThemeTags
storyPurpose
defeatConsequences
description
tags
notes

Known regional bosses:

boss_marik_redharrow
boss_cassian_goldseal

Do not fully implement boss fights until the owner approves combat/boss implementation.

Economy Profile Schema

Economy profiles should include:

id
displayName
type
releaseState
versionIntroduced
townId
currencyBase
denominations
conversionRates
primaryExports
primaryImports
taxStyle
marketMood
averageLaborWageCopper
bankingAvailable
repairAvailable
starterToolAccess
foodWaterAccess
tradeRouteNotes
futureMarketplaceNotes
tags
notes

Base currency:

copper

Denominations:

copper
silver
gold

Conversion:

100 copper = 1 silver
100 silver = 1 gold
Vendor Profile Schema

Vendor profiles should include:

id
displayName
type
releaseState
versionIntroduced
npcId
townId
buyCategories
sellItemIds
repairServices
priceModifier
stockRefreshConcept
currencyAccepted
description
tags
notes

Do not implement full live marketplace yet.

Vendor profiles are town/service metadata first.

Player Progression Schema Reference

Player progression should eventually track:

playerId
characterId
displayName
raceId
currentRealmId
currentTownId
position
skills
inventory
bank
quests
factionReputation
survivalState
extractionState
claimData
discoveredLocations
createdAt
updatedAt
version

This framework defines schema only.

Do not force current saves into a new schema unless approved and safe.

Position Schema

Position records should use world coordinates compatible with the current engine.

Recommended conceptual shape:

{
  worldId: "world_surface_age_one",
  x: 0,
  y: 0,
  z: 0,
  regionId: null,
  townId: "town_oathstead_village"
}

If the existing engine uses a different coordinate structure, adapt carefully and document mapping.

Skill Progress Schema

Skill progress per character:

{
  level: 1,
  xp: 0,
  unlocked: true,
  lastTrainedAt: null
}

All 15 core skills should exist in the player progression schema, even if some are beginner-only.

Inventory Item Instance Schema

Inventory item records should eventually support:

itemId
quantity
state
bound
durability
metadata

Possible item states:

normal
unstable
secured
quest_critical
broken
equipped
banked

Extraction loot must distinguish unstable vs secured.

Quest Progress Schema

Quest states:

not_started
active
completed
failed
repeatable_available

Quest progress should track:

questId
state
objectiveProgress
startedAt
completedAt
metadata
Relationship References

When one record references another, use IDs.

Example:

{
  townId: "town_oathstead_village",
  npcIds: ["npc_oathstead_banker_mara_coinhand"]
}

Do not embed full nested copies of major records inside each other.

Use references to avoid duplication.

Missing Reference Rule

If a record references another ID that does not exist:

validation should report it
runtime should fail safely
content should not auto-unlock
do not silently create placeholder records
Placeholder Policy

Avoid placeholders in final framework.

If a record cannot be finalized yet, use:

releaseState: "future"

or:

notes: "pending owner-approved final content"

Do not use placeholder IDs like:

todo
unknown
temp
placeholder
npc_name_here

unless the file is explicitly a template and not runtime data.

Future Content Data Rule

Future content can be scaffolded as metadata.

Future content must be:

releaseState: "future"

or:

releaseState: "locked"

Future content must not:

appear in playable selection
spawn into the world
appear as available vendor stock
appear as active quests
appear as available bosses
grant rewards
modify saves

until released.

Alpha Content Data Rule

Alpha 0.1 active content is limited to:

race_human
realm_hearthvale_fields
town_oathstead_village
dungeon_harvest_hollow

Known but not fully active:

town_highmere_keep
boss_marik_redharrow
boss_cassian_goldseal

All other races, realms, towns, dungeons, bosses, and advanced regions are locked/future.

Data File Size Rule

Keep data files lightweight.

Do not create massive files containing thousands of records in one implementation pass.

Do not generate full-world datasets.

For Alpha, create:

registry schemas
starter items
starter NPCs
starter resources
starter quests
starter economy
starter dungeon metadata

Only enough for one full town and all beginner skills.

Validation Required

The data foundation must eventually support validation functions:

validateReleaseStates
validateIdUniqueness
validateRegistryShape
validateRequiredFields
validateReferences
validateAlphaScope
validateSkillRegistry
validateOathsteadTownPack
validateItemRegistry
validateResourceRegistry
validateQuestChain
validateEconomyProfile
validatePlayerProgressionSchema
validateFullAlphaDatabaseFoundation

Validation output shape:

{
  ok: true,
  errors: [],
  warnings: [],
  counts: {}
}
Registry Count Expectations For Alpha Data Foundation

When the Alpha data foundation is built, minimum expected counts should include:

factions: 2
races: 9
realms: at least 1
towns: at least 2 records, with only Oathstead alpha and Highmere locked/reference
skills: 15
facilities: Oathstead starter facility set
items: approved starter item set
resourceNodes: approved starter node set
NPCs: full Oathstead service set
quests: 10 starter quests
dungeons: 1 Harvest Hollow
bosses: 2 known/reference bosses
economyProfiles: at least 1 Oathstead economy profile

Counts may grow later but should not explode during Alpha foundation.

Database Migration Future

Future MMO/server database may use:

PostgreSQL
SQLite for tooling
JSON export/import pipeline
server-side authoritative item tables
account/character tables
inventory tables
bank tables
trade logs
economy logs
anti-cheat event logs
dungeon run logs

Current client-side registries should be structured so migration is not painful.

Server Authority Future

Final MMO production must not trust client-created values for:

XP
levels
inventory
bank
currency
trade offers
marketplace listings
boss kill credit
rare drops
resource gather results
crafting outputs
extraction success

The current database framework is a design/data layer, not a security layer.

Documentation And Code Separation

Framework docs belong in:

final_unk_handoff_bundle/studio_framework/

Runtime data files belong in the active engine structure, such as:

client/data/
client/systems/

Do not place runtime JS inside the framework folder.

Do not place permanent framework docs inside runtime folders.

Claude Implementation Rule

When Claude later implements this framework, it must:

audit existing repo structure first
preserve current engine conventions
create or update data files carefully
avoid duplicate systems
preserve window.UNKSCAPE
preserve save keys
avoid full-world generation
keep future content locked
build Oathstead first
provide validation helpers
report full changed files
stop on risky conflicts
Required Report After Implementation

Any future implementation of this database framework must report:

files created
files modified
registry names created
record counts by registry
validation results
script tags added if any
save key confirmation
namespace confirmation
future content lock confirmation
warnings/issues
Summary

UNKSCAPE’s data layer must be stable, readable, ID-driven, release-gated, validateable, and future-migratable.

The first implementation should not attempt the whole universe.

It should create the foundation for:

Human
Hearthvale Fields
Oathstead Village
Harvest Hollow
all 15 beginner skills
starter items
starter resources
starter NPC services
starter quests
starter economy
future locked expansion

This framework is the database spine of UNKSCAPE.

\newpage

---

# 005_alpha_0_1_scope {#005-alpha-0-1-scope}

---

005 — Alpha 0.1 Scope
Purpose

This document locks the official Alpha 0.1 implementation scope for UNKSCAPE.

This file exists to prevent scope explosion, accidental future-content unlocks, overbuilding, broken save migrations, giant world generation, unfinished town spam, and AI-created feature creep.

Alpha 0.1 must prove one complete playable slice first.

Alpha 0.1 Core Rule

Alpha 0.1 is not the full game.

Alpha 0.1 is the first complete proof slice.

The first complete proof slice is:

Human / Hearthvale Fields / Oathstead Village / Harvest Hollow

Everything else may exist as documentation, locked metadata, future references, or inactive design structure only.

Official Alpha 0.1 Active Content

The only active/playable Alpha 0.1 content is:

race_human
realm_hearthvale_fields
town_oathstead_village
dungeon_harvest_hollow

Display names:

Human
Hearthvale Fields
Oathstead Village
Harvest Hollow
Official Alpha 0.1 Player Start

The player starts as:

race_human

in:

realm_hearthvale_fields

at or near:

town_oathstead_village

The player should be introduced to the world through Oathstead Village, not through an empty test field.

First Fully Authored Town

The first fully authored town is:

town_oathstead_village — Oathstead Village

Oathstead Village must be treated as the Alpha 0.1 town model.

Build Oathstead deeply before expanding outward.

A complete Oathstead is more valuable than nine shallow towns.

Oathstead Village Alpha Identity

Oathstead Village is:

Human starter town
Blood Oath influenced
rough
warm
survival-driven
practical
firelit
field-labor based
oath-family culture
starter skill hub
starter quest hub
starter survival hub
starter dungeon access hub

Oathstead should feel like the first real home.

It should support the player emotionally, mechanically, and economically.

Locked / Reference Alpha Realm Content

The following content exists in canon but is not fully active yet:

town_highmere_keep — Highmere Keep
boss_marik_redharrow — Marik Redharrow
boss_cassian_goldseal — Cassian Goldseal

These may appear as:

locked metadata
distant references
rumor text
map labels if supported safely
future expansion hooks
validation records
quest foreshadowing

They must not be fully implemented as complete playable systems during the first Oathstead implementation pass.

Highmere Keep Alpha Status

Highmere Keep exists as the Highborn counterpart in Hearthvale Fields.

ID:

town_highmere_keep

Display name:

Highmere Keep

Release state:

locked

Faction influence:

Highborn

Highmere Keep may be referenced as a future location but should not become a fully populated town in Alpha 0.1.

Do not fully build:

complete NPC pack
full vendors
full quests
full economy
full interiors
full services
full faction legal systems
full guard patrol network

until Oathstead is complete and approved.

Known Boss Alpha Status

Known Hearthvale regional bosses:

boss_marik_redharrow — Marik Redharrow
boss_cassian_goldseal — Cassian Goldseal

Their status in Alpha 0.1:

locked/reference

They may exist as metadata and story pressure.

They should not become full boss fights until combat/boss implementation is owner-approved.

They may be referenced by:

NPC dialogue
rumor systems
locked boss records
future quest hooks
faction tension
region history

Do not implement full boss combat yet.

Future Content Lock

All non-Hearthvale content remains locked or future.

Locked/future races:

race_orc
race_elf
race_dwarf
race_troll
race_goblin
race_nomad
race_nocturnan
race_aetherian

Locked/future content includes:

all non-Hearthvale realms
all future towns
all future dungeons
all future bosses
all advanced regional questlines
all full regional faction wars
all future race starter zones
all future world boss events
all future global marketplace systems
all future PvP extraction systems

Do not make future content playable by accident.

Release State Requirements

Use exactly:

alpha
locked
future
disabled

Alpha 0.1 content:

race_human — alpha
realm_hearthvale_fields — alpha
town_oathstead_village — alpha
dungeon_harvest_hollow — alpha

Known/reference content:

town_highmere_keep — locked
boss_marik_redharrow — locked
boss_cassian_goldseal — locked

Future race content:

race_orc — locked
race_elf — locked
race_dwarf — locked
race_troll — locked
race_goblin — locked
race_nomad — locked
race_nocturnan — locked
race_aetherian — locked

If a record has no release state, validation should warn or fail depending on severity.

Alpha 0.1 Skill Rule

All fifteen core skills must be beginner-accessible in Alpha 0.1.

Core skills:

combat
mining
smithing
woodcutting
fishing
cooking
herbalism
alchemy
crafting
farming
hunting
building_claim_crafting
trading_merchanting
survival
extraction

Do not lock base skill access behind future races or future regions.

Future regions may improve or specialize skills, but they do not unlock the base existence of the skill.

Alpha 0.1 Starter Skill Facilities

Oathstead/Hearthvale must provide beginner access to all core skills through starter facilities.

Required starter facility concepts:

combat yard
shallow mine
forge
anvil
woodlot
riverbank
cooking fire
inn kitchen
herb field
apothecary table
crafting shed
starter farming plots
hunting trail
claim tutorial plot
bank counter
general vendor stall
dungeon broker table
Harvest Hollow entry marker
water source
campfire/shelter point

Facilities may start as metadata before being fully interactive, but they must be represented in the Alpha data framework.

Alpha 0.1 Systems To Prove

Alpha 0.1 should prove:

Stable game boot.
Stable namespace.
Stable save/load.
Large world coordinate foundation.
Human start.
One functional starter town.
All core skills beginner-accessible.
Starter items/tools/resources.
Starter NPC service coverage.
Starter economy metadata.
Starter quest chain.
Starter survival pressure.
Starter PvE extraction dungeon.
Future content locked.
Validation tools.
Alpha 0.1 Systems Not To Fully Build Yet

Do not fully build these in Alpha 0.1 foundation:

all nine race starter zones
all eighteen regional bosses
full world boss event
full global marketplace
full MMO server backend
full anti-cheat production stack
full PvP extraction
full faction territory war
full building system everywhere
full weather survival simulation
full advanced crafting trees
full rare item economy
full dungeon raid system
all future towns
all future mobs
full world resource population

These may exist as future design records only.

Alpha 0.1 Survival Scope

Alpha survival should be beginner-friendly.

Active Alpha survival concepts:

hunger
thirst
basic food
basic water
shelter
campfire/inn support
light injury concepts
low weather pressure

Do not punish new players too hard.

Do not add:

permadeath
extreme starvation death loops
harsh disease systems
severe temperature systems
full medical trauma systems
unfair travel punishment

in the first Alpha proof slice.

Alpha 0.1 Extraction Scope

Harvest Hollow is the Alpha starter extraction dungeon.

ID:

dungeon_harvest_hollow

Display name:

Harvest Hollow

Rules:

PvE only
starter difficulty
no full PvP extraction
no permadeath
no full inventory wipe
unstable loot may be lost on failed extraction
secured loot remains safe
quest-critical items recoverable

Loot states:

unstable
secured
quest_critical

Do not implement dangerous inventory wipe logic.

Do not implement PvP looting.

Do not implement hardcore extraction.

Alpha 0.1 Quest Scope

Alpha 0.1 uses the Hearthvale starter quest chain.

Quest IDs:

quest_hearthvale_wake_at_the_common
quest_hearthvale_first_steps
quest_hearthvale_two_banners
quest_hearthvale_tools_of_the_valley
quest_hearthvale_bank_and_barter
quest_hearthvale_feed_the_fire
quest_hearthvale_claim_marker
quest_hearthvale_whispers_under_harvest
quest_hearthvale_hollow_run
quest_hearthvale_choose_your_road

The starter chain should teach:

movement
NPC interaction
town services
factions
banking
vendors
basic skilling
food/water
claim basics
Harvest Hollow
unstable vs secured loot
future world expansion

Do not create a giant quest database yet.

Build the starter chain first.

Alpha 0.1 Item Scope

Alpha 0.1 item data should include:

starter tools
starter weapons
starter armor
beginner food/water
beginner resources
beginner herbs
beginner potions
quest/service items
basic dungeon loot concepts
future rare cosmetic metadata only if locked/future

Do not create massive endgame item databases yet.

Do not create final rare drop economies yet.

Do not make future rare cosmetics obtainable unless owner approves.

Alpha 0.1 Economy Scope

Oathstead economy should support:

copper as base currency
optional silver/gold denominations
banking metadata
starter vendors
starter tool access
food/water access
labor wage references
town exports/imports
repair availability if safe
future marketplace notes

Do not implement full global marketplace yet.

Do not implement player-to-player trading yet unless owner approves and security strategy exists.

Do not trust client-only currency/inventory for final MMO.

Alpha 0.1 Building Scope

Building is limited to tutorial/metadata level unless owner approves runtime build placement.

Allowed Alpha building concept:

claim tutorial plot

Do not allow random building anywhere.

Do not allow building on:

major roads
main town core
dungeons
boss arenas
protected trade hubs
sacred ruins

Alpha should teach the idea of controlled claims, not open world spam.

Alpha 0.1 World Size Scope

Official world surface:

world_surface_age_one

World size:

16,000 x 12,800 tiles

This is a coordinate foundation, not a full terrain generation instruction.

Do not generate:

full terrain
full resource map
full NPC map
full mob map
full dungeon map
full collision map
one giant map JSON

Use lightweight metadata and near-player logic.

Alpha 0.1 Rendering Scope

The Alpha world must not look like a tiny floating block in a void.

Rendering/horizon work should eventually support:

near gameplay ring
mid visual ring
far proxy ring
sky/fog/horizon layer
terrain continuation illusion
distant silhouettes
haze/fog
distant mountains
far trees
ocean/land continuation

Do not solve this by rendering the full 16,000 x 12,800 world in detail.

Alpha 0.1 NPC Scope

Oathstead should receive the full service framework.

Required NPC/service roles:

town_leader
banker
innkeeper
general_vendor
specialty_vendor
skill_trainer_combat
skill_trainer_mining
skill_trainer_smithing
skill_trainer_woodcutting
skill_trainer_fishing
skill_trainer_cooking
skill_trainer_herbalism
skill_trainer_alchemy
skill_trainer_crafting
skill_trainer_farming
skill_trainer_hunting
skill_trainer_building_claim_crafting
skill_trainer_trading_merchanting
skill_trainer_survival
skill_trainer_extraction
guard_captain
medic_alchemist
claim_registrar
dungeon_broker
cartographer
laborer
rumor_npc
personal_quest_npc

Claude may generate original final names for Oathstead NPCs only when implementing the Oathstead data pack.

Do not fully name or populate future-town NPCs yet.

Alpha 0.1 Data Foundation Scope

The Alpha data foundation should create or define:

release states
factions
races
realms
towns
facilities
skills
items
resources
NPCs
quests
dungeons
boss metadata
economy profile
player progression schema
validation helpers

This foundation should be lightweight and stable.

It should not spawn everything into runtime automatically.

Alpha 0.1 Validation Expectations

Alpha validation must confirm:

window.UNKSCAPE exists
save keys unchanged
2 factions exist
9 races exist
Human is alpha playable
future races are locked
Hearthvale exists
Oathstead exists
Highmere is locked/reference
15 skills exist
all 15 skills are beginner-accessible
Oathstead facilities exist
starter items exist
starter resource nodes exist
Oathstead NPC service coverage exists
10 starter quests exist
Harvest Hollow exists
future content remains locked
no full world generation occurred

Validation should return:

{
  ok: true,
  errors: [],
  warnings: [],
  counts: {}
}
Alpha 0.1 Save/Load Protection

Alpha implementation must preserve:

unkscape:saves
unkscape:worlds

Do not:

rename save keys
clear saves
wipe characters
destructively migrate saves
overwrite save schema without approval
assume local saves are final MMO security

If progression schema differs from existing saves, document migration needs but do not force destructive changes.

Alpha 0.1 Security Reality

Alpha local saves are development/testing tools.

They are not final MMO security.

Do not claim Alpha client-side inventory, bank, XP, currency, or item drops are cheat-proof.

Future official multiplayer must be server-authoritative.

Alpha 0.1 Done Definition

Alpha 0.1 foundation is considered structurally successful when:

Game still boots.
Player can still move.
Save/load still works.
window.UNKSCAPE remains canonical.
Save keys remain unchanged.
Oathstead data exists.
All 15 skills exist and are beginner-accessible.
Starter item/resource/NPC/quest/economy records exist.
Harvest Hollow metadata exists.
Future content is locked.
Validation reports pass or understandable warnings.
No massive world data was generated.
No Godot files were introduced.
No abandoned project names were reintroduced.
Claude Compliance Rules

Claude must:

build only within Alpha 0.1 scope unless owner approves otherwise
build Oathstead first
keep Highmere locked/reference
keep future races locked
keep all 15 skills beginner-accessible
preserve window.UNKSCAPE
preserve unkscape:saves
preserve unkscape:worlds
avoid full world generation
avoid giant data files
avoid Godot assumptions
avoid fake server security claims
report conflicts before risky changes

Claude must not:

unlock all races
build all towns
fully implement future bosses
fully implement global marketplace
fully implement PvP extraction
wipe or migrate saves without approval
generate the full 16,000 x 12,800 world
create massive resource/NPC populations
rename canon records
reintroduce abandoned project names
Summary

Alpha 0.1 proves one complete foundation slice:

Human / Hearthvale Fields / Oathstead Village / Harvest Hollow

The game Bible may describe a massive world.

The implementation must start focused.

Build one town right.

Make all core skills accessible.

Keep future content locked.

Protect the engine.

Protect saves.

Validate everything.

\newpage

---

# 006_oathstead_full_town_framework {#006-oathstead-full-town-framework}

---

# 006_OATHSTEAD_FULL_TOWN_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Realm: Hearthvale Fields
Primary Town: Oathstead Village

---

# PURPOSE

This framework establishes Oathstead Village as the complete Alpha 0.1 starter town and foundational player hub for UNKSCAPE.

Oathstead serves as:

- First settlement players encounter
- First safe-zone community
- Introduction to Blood Oath culture
- Tutorial hub for all 15 core skills
- Economy introduction center
- Banking/storage hub
- Trade hub
- Survival learning area
- Faction narrative introduction
- Gateway to Harvest Hollow

This town must be designed as a living settlement rather than a tutorial island.

Players should feel:

"I could live here."

rather than:

"This is a temporary starting zone."

---

# LOCKED CANON REFERENCES

Realm:

realm_hearthvale_fields

Primary Town:

town_oathstead_village

Connected Dungeon:

dungeon_harvest_hollow

Known Opposing Settlement:

town_highmere_keep

Associated Faction:

faction_blood_oath

Nearby Threat Figures:

boss_marik_redharrow
boss_cassian_goldseal

---

# TOWN IDENTITY

Oathstead Village is the oldest surviving Blood Oath settlement in Hearthvale Fields.

It is not a city.

It is not a fortress.

It is not a capital.

It is a frontier settlement built through generations of survival.

Core themes:

- hard work
- family lineage
- ancestor respect
- self-sufficiency
- community defense
- survival knowledge
- earned trust

Visual atmosphere:

- timber buildings
- stone foundations
- smoke from chimneys
- drying herbs
- stacked firewood
- fenced gardens
- dirt roads
- market stalls
- animal pens
- lantern posts
- communal fire circles

Mood:

Warm but rugged.

Safe but not luxurious.

Welcoming but cautious.

---

# BLOOD OATH INFLUENCE

Oathstead reflects Blood Oath philosophy without functioning as a religious center.

Common visual influences:

- carved oath stones
- memorial pillars
- fire braziers
- family banners
- ancestor markers
- ceremonial gathering circles

Blood Oath symbolism should emphasize:

- memory
- sacrifice
- survival
- family
- responsibility

Avoid:

- direct real-world religious symbols
- copied sacred imagery
- real-world ceremonial practices
- direct references to living religions

The goal is original fantasy culture.

---

# PLAYER EXPERIENCE GOAL

A new player should spend many hours inside or around Oathstead before naturally expanding outward.

Desired progression:

Arrival

↓

Basic survival

↓

First quests

↓

Gathering skills

↓

Crafting skills

↓

Trading

↓

Claim introduction

↓

Dungeon preparation

↓

Harvest Hollow

↓

Regional exploration

Oathstead should remain useful long after players leave starter status.

---

# TOWN LAYOUT STRUCTURE

Oathstead should be organized into functional districts.

District count:

8

---

## DISTRICT 01

Village Gate

Purpose:

- arrival point
- tutorial entry
- newcomer guidance

Contains:

- guard post
- welcome signage
- road markers
- local notices

---

## DISTRICT 02

Central Commons

Purpose:

Main social hub

Contains:

- central fire
- gathering space
- public announcements
- community events

This acts as the social heart of Oathstead.

---

## DISTRICT 03

Market Row

Purpose:

Economy center

Contains:

- merchants
- traders
- supply vendors
- repair services

Primary trading location.

---

## DISTRICT 04

Craftsman's Yard

Purpose:

Production zone

Contains:

- smithing
- crafting
- alchemy
- processing stations

Most skill production occurs here.

---

## DISTRICT 05

Storehouse Quarter

Purpose:

Banking and storage

Contains:

- village vault
- banking NPCs
- item storage
- trade records

Primary inventory management area.

---

## DISTRICT 06

Farming Edge

Purpose:

Food production

Contains:

- fields
- livestock
- irrigation
- farming tutorials

Supports:

farming
cooking
survival

---

## DISTRICT 07

Claim Training Grounds

Purpose:

Building introduction

Contains:

- sample plots
- construction demonstrations
- repair exercises

Introduces:

building_claim_crafting

without granting large-scale land ownership.

---

## DISTRICT 08

Wilderness Outskirts

Purpose:

Transition zone

Contains:

- hunting grounds
- resource nodes
- wildlife
- Harvest Hollow road access

Acts as bridge to the wider world.

---

# REQUIRED PLAYER SERVICES

Oathstead must support all core starter needs.

Required services:

- banking
- storage
- repair
- buying
- selling
- crafting access
- cooking access
- claim introduction
- quest access
- trainer access
- travel guidance
- survival guidance

Players should never need another settlement during Alpha 0.1.

---

# ALL 15 SKILL COVERAGE REQUIREMENT

Every core skill must be introduced in or immediately around Oathstead.

---

combat

Training dummies
Starter enemies

---

mining

Nearby rock nodes

---

smithing

Forge access

---

woodcutting

Village woodlots

---

fishing

Local ponds and streams

---

cooking

Cooking fires

---

herbalism

Wild herbs around outskirts

---

alchemy

Basic alchemy station

---

crafting

Workbench access

---

farming

Training plots

---

hunting

Small wildlife

---

building_claim_crafting

Claim tutorial area

---

trading_merchanting

Market Row

---

survival

Food, weather, shelter systems

---

extraction

Harvest Hollow introduction

---

# NPC SERVICE COVERAGE

Minimum required NPC categories:

Village Elder

Quest Distributor

Bank Keeper

Merchant

General Supplier

Blacksmith

Crafting Master

Alchemist

Farmer

Hunter

Cook

Fisher

Woodworker

Stable Keeper

Guard Captain

Scout

Claim Instructor

Dungeon Guide

No named NPCs are locked at this stage.

Only roles are required.

---

# STARTER ECONOMY ROLE

Oathstead functions as the first economic hub.

Primary economic activities:

- gathering
- selling resources
- repairing gear
- purchasing essentials
- learning market systems

Oathstead should not support:

- high-tier gear
- legendary crafting
- endgame trade

Economy focus:

basic survival and progression.

---

# BANKING FRAMEWORK

Required services:

Personal Bank

Shared Character Storage

Deposit

Withdraw

Sort

Search

Future expansion compatibility

Banking must become a permanent account progression feature.

---

# VENDOR FRAMEWORK

Vendor categories:

Food

Tools

Crafting Supplies

Survival Goods

Basic Equipment

Utility Items

No rare items.

No legendary items.

No endgame resources.

---

# TRAINER FRAMEWORK

Trainers introduce mechanics.

They do not sell power.

Trainers should teach:

- systems
- interactions
- gameplay loops

They should not function as level gates.

---

# CLAIM TUTORIAL AREA

Purpose:

Teach building_claim_crafting.

Must demonstrate:

- placing structures
- repairing structures
- maintaining structures
- storage placement
- claim boundaries

Must remain heavily restricted.

Players should not receive unlimited land.

This area is educational only.

---

# SURVIVAL SUPPORT

Oathstead must teach:

Food

Shelter

Resource gathering

Basic danger awareness

Equipment maintenance

Travel preparation

The town serves as a safe fallback location.

---

# HARVEST HOLLOW CONNECTION

Harvest Hollow is introduced through Oathstead.

Requirements:

- visible route
- rumors
- quests
- NPC references
- preparation guidance

Players should understand:

Harvest Hollow is dangerous.

Harvest Hollow is profitable.

Harvest Hollow is optional but rewarding.

---

# HIGHMERE TENSION

Oathstead and Highmere are not openly at war.

Current relationship:

Political strain.

Trade disagreements.

Border disputes.

Cultural distrust.

Narrative goal:

Players should understand that larger faction conflict exists.

Alpha 0.1 should not contain full-scale warfare.

Only tension.

---

# RELATIONSHIP TO HEARTHVALE FIELDS

Oathstead functions as:

Primary settlement of southern Hearthvale.

Resource intake point.

Trade hub.

Quest hub.

Social hub.

Dungeon preparation center.

Most nearby roads should naturally lead back toward Oathstead.

---

# DATA EXPECTATIONS

Required IDs:

town_oathstead_village

District IDs:

district_gate
district_commons
district_market
district_craftsman
district_storehouse
district_farming
district_claim_training
district_outskirts

All future content should reference IDs rather than hardcoded names.

---

# IMPLEMENTATION BOUNDARIES

DO NOT:

Build a massive city

Build capital-scale infrastructure

Create dozens of empty buildings

Create advanced transportation systems

Create endgame content

Create large faction warfare systems

Create housing districts for thousands of players

Oathstead should feel complete, not oversized.

---

# WHAT NOT TO OVERBUILD

Avoid:

Quest bloat

NPC bloat

Vendor duplication

Unused structures

Oversized roads

Massive walls

Excessive decoration

Every structure should serve gameplay.

---

# VALIDATION REQUIREMENTS

A completed Oathstead implementation passes validation if:

✓ New players understand where to go

✓ All 15 skills are accessible

✓ Banking functions

✓ Trading functions

✓ Survival systems are introduced

✓ Harvest Hollow is discoverable

✓ Blood Oath culture is visible

✓ Hearthvale feels connected

✓ Town remains useful after early game

✓ No capital-city scale creep exists

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve all locked IDs

Preserve Oathstead as starter town

Preserve Blood Oath influence

Support all 15 skills

Support banking

Support trading

Support survival systems

Support Harvest Hollow onboarding

Keep town size reasonable

Avoid MMO capital-city scale

Avoid replacing Oathstead with future settlements

Avoid introducing alternative starter towns

Avoid introducing race-exclusive access restrictions

Oathstead is the permanent Alpha foundation settlement.

---

# SUMMARY

Oathstead Village is the foundational settlement of UNKSCAPE Alpha 0.1.

It introduces:

- Blood Oath culture
- survival gameplay
- gathering
- crafting
- economy
- banking
- claim systems
- dungeon preparation
- regional exploration

It must feel alive, useful, and expandable while remaining appropriately scaled for an Alpha starter settlement.

This town serves as the first true home of every UNKSCAPE player.

\newpage

---

# 007_core_skills_framework {#007-core-skills-framework}

---

# 007_CORE_SKILLS_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Alpha 0.1 Core Skill System

---

# PURPOSE

This framework defines the official 15-skill foundation for UNKSCAPE.

The core skill system must support:

- long-term MMO progression
- beginner-friendly Alpha access
- survival sandbox gameplay
- economy-heavy loops
- crafting and resource value
- dungeon preparation
- player identity
- future race specialization
- future faction/world expansion

Skills are not side systems.

Skills are one of the main reasons players return every day.

---

# LOCKED CORE SKILL LIST

UNKSCAPE has exactly 15 core skills at this framework stage:

1. combat
2. mining
3. smithing
4. woodcutting
5. fishing
6. cooking
7. herbalism
8. alchemy
9. crafting
10. farming
11. hunting
12. building_claim_crafting
13. trading_merchanting
14. survival
15. extraction

Do not rename these IDs.

Do not remove any of these skills.

Do not merge them without owner approval.

Do not add additional core skills during Alpha 0.1.

---

# ALPHA ACCESS RULE

All 15 skills must be beginner-accessible in:

realm_hearthvale_fields

Primary settlement:

town_oathstead_village

Nearby Alpha dungeon:

dungeon_harvest_hollow

No core skill may be locked behind:

- future races
- future realms
- future factions
- future towns
- paid systems
- advanced travel
- endgame bosses

Alpha 0.1 must allow the player to taste every skill loop.

---

# SKILL DESIGN PHILOSOPHY

Each skill should follow this loop:

Learn

↓

Gather or perform

↓

Gain XP

↓

Unlock better methods

↓

Create value

↓

Support economy or survival

↓

Feed into quests, crafting, combat, or exploration

The goal is not instant gratification.

The goal is satisfying grind with visible payoff.

UNKSCAPE should feel:

- old-school
- rewarding
- grind-heavy
- skill-based
- economy-connected
- survival-aware

---

# SKILL PROGRESSION STRUCTURE

Each skill should eventually support:

- XP
- levels
- unlock tiers
- tool requirements
- resource tiers
- activity difficulty
- failure/success chances where useful
- recipe unlocks where useful
- quest integrations
- economy value

Alpha 0.1 does not need final balancing.

Alpha 0.1 does need clean structure.

---

# RECOMMENDED LEVEL RANGE

Alpha 0.1 should support visible progression roughly from:

Level 1 to Level 20

Future systems may expand to:

Level 99
Level 120
prestige
mastery
specialization

But Alpha 0.1 should avoid overbuilding endgame leveling.

---

# SKILL 01: COMBAT

ID:

combat

Purpose:

Combat defines the player's ability to survive hostile creatures, faction enemies, dungeon threats, and boss encounters.

Alpha coverage:

- training dummies
- basic melee
- basic ranged
- basic enemy targeting
- damage feedback
- death/failure handling
- loot drops

Oathstead access:

- guard training yard
- nearby weak enemies
- Harvest Hollow preparation

Future expansion:

- class styles
- boss mechanics
- faction combat
- PvP systems
- weapon mastery

Boundaries:

Do not overbuild full PvP combat in Alpha 0.1.

---

# SKILL 02: MINING

ID:

mining

Purpose:

Mining allows players to gather stone, ore, minerals, and future rare underground resources.

Alpha coverage:

- basic rock nodes
- copper/iron-style starter ores
- stone
- tool durability interaction

Oathstead access:

- nearby rocky outcrops
- small mine entrance or quarry area

Biome relationship:

Mining should become strongest in mountains, caves, cliffs, and dwarf-aligned future regions.

Future expansion:

- deep mines
- rare veins
- cave danger
- mining claims
- underground bosses

---

# SKILL 03: SMITHING

ID:

smithing

Purpose:

Smithing converts ore and metal resources into tools, weapons, armor parts, and repair materials.

Alpha coverage:

- forge
- anvil
- basic bars
- basic tools
- basic weapon repairs

Oathstead access:

- blacksmith station in Craftsman's Yard

Economy role:

Smithing should create high-demand utility items.

Future expansion:

- armor tiers
- weapon tiers
- faction-forged equipment
- rare metals
- masterwork items

---

# SKILL 04: WOODCUTTING

ID:

woodcutting

Purpose:

Woodcutting gathers logs, branches, timber, bark, and future rare woods.

Alpha coverage:

- starter trees
- basic logs
- tool requirement
- respawning nodes

Oathstead access:

- managed village woodlot
- nearby forest edges

Biome relationship:

Woodcutting should vary by biome.

Examples:

- plains: common trees
- forest: dense timber
- swamp: wetwood
- mountain: pine
- jungle: rare canopy wood

Future expansion:

- rare woods
- tree spirits
- forest events
- lumber claims

---

# SKILL 05: FISHING

ID:

fishing

Purpose:

Fishing provides food, trade goods, cooking materials, and future rare aquatic resources.

Alpha coverage:

- pond fishing
- stream fishing
- basic fish
- simple bait or rod logic

Oathstead access:

- village pond
- nearby creek
- Hearthvale river edge

Biome relationship:

Fishing should vary by water type:

- pond
- river
- swamp
- coast
- ocean
- underground lake

Future expansion:

- boats
- ocean fishing
- rare catches
- fishing events

---

# SKILL 06: COOKING

ID:

cooking

Purpose:

Cooking converts raw food into survival supplies, buffs, trade goods, and dungeon preparation items.

Alpha coverage:

- cooking fire
- basic fish
- basic meat
- simple recipes

Oathstead access:

- communal fire
- tavern kitchen
- farmstead ovens

Survival role:

Cooking supports hunger, stamina, warmth, and travel preparation.

Future expansion:

- advanced meals
- faction dishes
- rare buffs
- feast systems

---

# SKILL 07: HERBALISM

ID:

herbalism

Purpose:

Herbalism allows players to identify and gather plants, roots, fungi, flowers, and healing ingredients.

Alpha coverage:

- starter herbs
- gatherable plants
- simple respawn logic
- basic identification

Oathstead access:

- herb patches
- wild outskirts
- farming edge

Biome relationship:

Herbs must reflect environment.

Examples:

- plains herbs
- forest moss
- swamp reeds
- mountain roots
- cave fungi
- jungle blooms

Future expansion:

- poison plants
- rare medicine
- magical herbs
- biome-specific recipes

---

# SKILL 08: ALCHEMY

ID:

alchemy

Purpose:

Alchemy converts herbs, minerals, liquids, monster parts, and rare materials into potions, oils, antidotes, and utility mixtures.

Alpha coverage:

- basic healing item
- basic stamina item
- simple mixing station
- ingredient discovery

Oathstead access:

- alchemy table in Craftsman's Yard
- herbalist hut

Economy role:

Alchemy creates consumables that support combat, survival, and extraction.

Future expansion:

- poisons
- oils
- resistance brews
- dungeon utility mixtures
- rare faction recipes

---

# SKILL 09: CRAFTING

ID:

crafting

Purpose:

Crafting produces non-smithing utility items, tools, containers, simple gear, components, and survival equipment.

Alpha coverage:

- workbench
- basic recipes
- resource conversion
- utility item creation

Oathstead access:

- crafting bench
- market supply station
- claim tutorial area

Future expansion:

- bags
- traps
- furniture
- trade goods
- rare crafted components

Boundary:

Crafting should not replace smithing.

---

# SKILL 10: FARMING

ID:

farming

Purpose:

Farming allows players to grow food, herbs, fiber, and future economic crops.

Alpha coverage:

- tutorial plots
- simple seeds
- watering
- crop growth timer
- harvest

Oathstead access:

- Farming Edge district

Economy role:

Farming supports cooking, herbalism, alchemy, and trading.

Future expansion:

- player farms
- weather effects
- crop disease
- irrigation
- faction crops

---

# SKILL 11: HUNTING

ID:

hunting

Purpose:

Hunting allows players to track and harvest wildlife for meat, hides, bones, feathers, and rare animal materials.

Alpha coverage:

- small animals
- basic tracking signs
- simple traps or ranged kills
- meat/hide drops

Oathstead access:

- wilderness outskirts
- nearby fields

Biome relationship:

Hunting should reflect wildlife habitat.

Examples:

- plains: rabbits, deer
- forest: boar, wolves
- swamp: reptiles
- mountain: goats, bears
- jungle: exotic beasts

Future expansion:

- tracking mastery
- legendary beasts
- rare pelts
- faction hunts

---

# SKILL 12: BUILDING_CLAIM_CRAFTING

ID:

building_claim_crafting

Purpose:

This skill introduces player construction, claim interaction, repairs, storage placement, and future base-building systems.

Alpha coverage:

- claim tutorial
- placing simple structures
- repairing objects
- understanding claim boundaries
- storage basics

Oathstead access:

- Claim Training Grounds

Future expansion:

- player bases
- claim zones
- guild holdings
- siege systems
- farms
- workshops
- defense upgrades

Boundary:

Alpha 0.1 should teach claims.

Alpha 0.1 should not allow uncontrolled world spam.

---

# SKILL 13: TRADING_MERCHANTING

ID:

trading_merchanting

Purpose:

Trading and merchanting define player economy interaction, buying, selling, price awareness, market behavior, and future Grand Exchange systems.

Alpha coverage:

- sell resources
- buy tools
- basic vendor pricing
- starter trade goods
- item value awareness

Oathstead access:

- Market Row
- Storehouse Quarter

Future expansion:

- player stalls
- regional pricing
- trade routes
- caravan risk
- auction systems
- global merchant listings

Boundary:

Do not build full global economy in Alpha 0.1.

But the structure must support it later.

---

# SKILL 14: SURVIVAL

ID:

survival

Purpose:

Survival measures the player's ability to manage danger, food, travel, weather, shelter, fatigue, and hostile environments.

Alpha coverage:

- hunger or stamina pressure
- food usage
- warmth/shelter concept
- travel preparation
- basic hazard awareness

Oathstead access:

- survival guide NPC
- cooking access
- supply vendors
- nearby wilderness

Biome relationship:

Survival difficulty should change by environment.

Examples:

- wetlands: sickness, mud
- mountains: cold, cliffs
- desert: thirst, heat
- jungle: poison, dense terrain
- ocean: drowning, storms
- caves: darkness, collapse risk

Future expansion:

- weather systems
- camps
- disease
- exposure
- biome hazards

---

# SKILL 15: EXTRACTION

ID:

extraction

Purpose:

Extraction supports dungeon risk/reward gameplay where players enter dangerous zones, gather loot, survive threats, and return safely.

Alpha coverage:

- Harvest Hollow entry
- danger warning
- loot recovery
- escape/return loop
- failure consequence

Oathstead access:

- Dungeon Guide NPC
- Harvest Hollow road access
- preparation quests

Gameplay role:

Extraction should make dungeons feel dangerous and profitable.

Future expansion:

- deeper dungeon layers
- timed extraction
- rare loot rooms
- faction interference
- boss escape mechanics

Boundary:

Alpha extraction should be simple but meaningful.

---

# BIOME AND TERRAIN INTEGRATION RULE

Skills must respect world terrain and biome identity.

UNKSCAPE is not a flat world.

The skill system must support:

- flat farming zones
- wet fishing zones
- forest woodcutting zones
- mountain mining zones
- cave extraction zones
- swamp herbalism zones
- ocean fishing zones
- jungle hunting zones
- faction-specific homelands

The world must eventually support:

- hills
- cliffs
- valleys
- rivers
- wetlands
- caves
- beaches
- oceans
- forests
- mountains
- exotic fantasy regions

Skill nodes should be placed by biome metadata, not random decoration.

---

# OATHSTEAD ALPHA SKILL COVERAGE MATRIX

| Skill | Oathstead Access Point | Alpha Purpose |
|---|---|---|
| combat | guard yard / outskirts | basic fighting |
| mining | quarry / rock nodes | ore and stone |
| smithing | forge | tools and repairs |
| woodcutting | woodlot | logs |
| fishing | pond / creek | food |
| cooking | fire / kitchen | meals |
| herbalism | herb patches | ingredients |
| alchemy | alchemy table | potions |
| crafting | workbench | utility items |
| farming | farm plots | crops |
| hunting | outskirts | meat and hides |
| building_claim_crafting | claim training grounds | building tutorial |
| trading_merchanting | market row | economy intro |
| survival | wilderness guide | food/travel prep |
| extraction | Harvest Hollow | dungeon risk loop |

---

# STARTER TOOL EXPECTATIONS

Alpha should include basic tool categories:

- training weapon
- simple pickaxe
- simple axe
- fishing rod
- cooking access
- herb pouch or gather interaction
- alchemy station
- crafting hammer or toolkit
- seed pouch
- hunting tool or starter bow
- claim marker tutorial item
- trade ledger concept
- survival pack
- dungeon token or entry marker

Tools do not need final art quality during framework stage.

They do need clear purpose.

---

# XP EXPECTATIONS

Each skill action should eventually award XP.

Alpha actions should produce small but visible progress.

XP should be awarded for:

- gathering
- crafting
- cooking
- successful combat
- trading milestones
- farming harvests
- hunting harvests
- dungeon extraction
- survival tasks

Avoid awarding XP for meaningless spam.

---

# ECONOMY CONNECTIONS

Skills should feed into one another.

Examples:

Mining → Smithing

Woodcutting → Crafting / Building

Fishing → Cooking

Herbalism → Alchemy

Hunting → Cooking / Crafting

Farming → Cooking / Alchemy / Trading

Extraction → Combat / Trading / Crafting

Survival → Food / Gear / Preparation

Trading → All gathered resources

The economy should feel interconnected.

---

# QUEST CONNECTIONS

Oathstead quests should introduce skills naturally.

Example quest categories:

- gather logs
- mine ore
- cook food
- catch fish
- craft tool
- plant crop
- gather herbs
- make potion
- hunt wildlife
- repair fence
- sell goods
- survive night
- enter Harvest Hollow

Quests should teach systems.

They should not feel like disconnected errands.

---

# FUTURE RACE SPECIALIZATION RULE

Future races may gain bonuses or cultural advantages.

But they must not remove base skill access.

Examples:

Dwarves may excel at mining.

Elves may excel at woodcutting or hunting.

Orcs may excel at combat.

Trolls may excel at survival.

Goblins may excel at trading.

Nomads may excel at travel/survival.

Nocturnans may excel in caves/night systems.

Aetherians may excel in magic/fantasy utility.

But every race must still be able to use every core skill.

---

# IMPLEMENTATION BOUNDARIES

Do not build:

- full endgame skill trees
- prestige systems
- hundreds of recipes
- global markets
- full player housing economy
- advanced PvP skill balancing
- race-exclusive locked skills
- huge crafting databases before Alpha basics work

Alpha priority:

Make the first version functional, expandable, and readable.

---

# DATA EXPECTATIONS

Each skill should eventually have a database object.

Minimum expected fields:

id

displayName

description

category

alphaEnabled

starterAccessLocation

relatedTools

relatedResources

relatedStations

relatedNPCs

relatedQuests

futureExpansionNotes

Do not hardcode skill logic directly into UI.

Use data-driven references where practical.

---

# VALIDATION REQUIREMENTS

The skill framework passes validation if:

✓ all 15 locked skills exist

✓ all 15 have Alpha access

✓ all 15 connect to Oathstead or Hearthvale

✓ each skill has a basic gameplay purpose

✓ skill IDs remain unchanged

✓ no extra core skills are introduced

✓ future race bonuses do not block access

✓ terrain and biome identity are respected

✓ economy links are present

✓ skill loops are expandable

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve all 15 skill IDs exactly.

Implement Alpha access for every skill.

Avoid inventing new core skills.

Avoid renaming skills.

Avoid locking base skills behind future races.

Avoid creating endgame systems too early.

Respect biome and terrain placement.

Keep Oathstead as the Alpha skill hub.

Keep Hearthvale Fields as the first skill training region.

Keep Harvest Hollow as the first extraction skill location.

Use data-driven structures wherever possible.

---

# SUMMARY

The UNKSCAPE skill system is the backbone of player progression.

Alpha 0.1 must make all 15 skills accessible, understandable, and useful.

Oathstead Village and Hearthvale Fields must introduce the full foundation of:

- gathering
- crafting
- economy
- survival
- combat
- dungeon extraction
- claim building

The system should feel old-school, rewarding, grind-heavy, and expandable without becoming bloated before the Alpha foundation is stable.

\newpage

---

# 008_items_resources_inventory_framework {#008-items-resources-inventory-framework}

---

# 008_ITEMS_RESOURCES_INVENTORY_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Item Systems, Resource Systems, Inventory Systems

---

# PURPOSE

This framework establishes the official foundation for:

- item architecture
- resource architecture
- inventory systems
- equipment systems
- loot systems
- storage systems
- item progression
- economy integration

Items are one of the primary reward mechanisms of UNKSCAPE.

Players should constantly feel they are:

- finding something
- gathering something
- improving something
- storing something
- selling something
- crafting something

Every item should serve a purpose.

Avoid meaningless item clutter.

---

# CORE ITEM PHILOSOPHY

UNKSCAPE should follow:

Meaning > Quantity

The goal is not thousands of useless items.

The goal is:

- recognizable resources
- useful materials
- memorable loot
- meaningful upgrades
- economy value

Players should quickly learn:

"What is this used for?"

Items should rarely exist without purpose.

---

# ITEM CLASSIFICATION SYSTEM

Every item must belong to a primary category.

---

## CATEGORY_RESOURCE

Raw gathering materials.

Examples:

- stone
- ore
- wood
- herbs
- hides
- fish

Purpose:

Crafting and economy.

---

## CATEGORY_TOOL

Gathering or utility equipment.

Examples:

- axe
- pickaxe
- fishing rod
- hunting knife

Purpose:

Enable gameplay loops.

---

## CATEGORY_WEAPON

Combat equipment.

Examples:

- sword
- spear
- bow
- staff

Purpose:

Combat progression.

---

## CATEGORY_ARMOR

Protective equipment.

Examples:

- helmet
- chest
- gloves
- boots

Purpose:

Defense and survivability.

---

## CATEGORY_CONSUMABLE

Temporary-use items.

Examples:

- food
- potions
- bandages

Purpose:

Recovery and preparation.

---

## CATEGORY_COMPONENT

Crafting ingredients.

Examples:

- metal bar
- cloth strip
- leather strap

Purpose:

Intermediate crafting steps.

---

## CATEGORY_QUEST

Quest-specific items.

Examples:

- sealed letter
- relic fragment
- oath token

Purpose:

Quest progression.

---

## CATEGORY_MISC

Utility items not fitting other categories.

Examples:

- lantern
- rope
- travel pack

Purpose:

World interaction.

---

# ALPHA RESOURCE TIERS

Alpha should remain simple.

---

## TIER_1_COMMON

Most frequently gathered.

Examples:

- wood
- stone
- fiber
- fish
- herbs

---

## TIER_2_UNCOMMON

Less common resources.

Examples:

- iron ore
- quality hides
- rare herbs

---

## TIER_3_RARE

Difficult but obtainable.

Examples:

- silver ore
- rare fungus
- ancient wood

---

## TIER_4_EPIC

Future content.

Not required Alpha 0.1.

---

## TIER_5_LEGENDARY

Future content.

Not required Alpha 0.1.

---

# ALPHA RESOURCE FAMILIES

---

## WOODS

Examples:

- rough wood
- seasoned wood
- hardwood

Used for:

- crafting
- building
- repairs

Gathered through:

woodcutting

---

## STONE

Examples:

- stone
- granite
- limestone

Used for:

- building
- crafting
- smithing support

Gathered through:

mining

---

## ORES

Examples:

- copper ore
- iron ore
- silver ore

Used for:

smithing

Gathered through:

mining

---

## HERBS

Examples:

- healing herb
- bitter root
- riverleaf

Used for:

- alchemy
- cooking

Gathered through:

herbalism

---

## FOOD RESOURCES

Examples:

- fish
- berries
- mushrooms
- meat

Used for:

cooking

Gathered through:

fishing
hunting
farming
foraging

---

## ANIMAL MATERIALS

Examples:

- hide
- fur
- feathers
- bone

Used for:

crafting

Gathered through:

hunting

---

# STARTER TOOL FAMILY

Every skill should have starter tools.

---

Mining

- crude pickaxe

---

Woodcutting

- crude axe

---

Fishing

- simple fishing rod

---

Hunting

- training bow
- hunting knife

---

Crafting

- starter toolkit

---

Building

- repair hammer

---

Alchemy

- mixing kit

---

Farming

- hand hoe

---

# EQUIPMENT SYSTEM

Alpha equipment categories:

---

Head

---

Chest

---

Legs

---

Hands

---

Feet

---

Main Hand

---

Off Hand

---

Back

Future:

- rings
- amulets
- relic slots

Not required Alpha 0.1.

---

# EQUIPMENT TIERS

---

Common

White

---

Uncommon

Green

---

Rare

Blue

---

Epic

Purple

Future

---

Legendary

Gold

Future

Alpha focus:

Common
Uncommon
Rare

Only.

---

# DURABILITY RULES

Tools and equipment may lose durability.

Goals:

- create economy demand
- encourage repairs
- support smithing

Durability should:

- degrade slowly
- never feel punishing
- be repairable

Avoid:

constant breakage frustration.

---

# STACKING RULES

Resources should stack.

Examples:

- wood
- stone
- herbs
- ore

Equipment should not stack.

Examples:

- swords
- armor
- tools

Quest items may have special rules.

---

# INVENTORY SYSTEM

Inventory should feel readable.

Alpha target:

Grid-based inventory.

Recommended:

6 x 5

30 slots

Expandable later.

---

# INVENTORY DESIGN GOALS

Players should immediately understand:

- what they own
- what is equipped
- what can be sold
- what is valuable

Inventory should prioritize:

clarity over realism.

---

# WEIGHT SYSTEM RULE

Alpha 0.1 should NOT use harsh realism weight.

Use one of:

- slot limits
or
- light encumbrance

Avoid:

heavy survival inventory punishment.

---

# STORAGE SYSTEM

Oathstead requires:

Village Bank

Functions:

- deposit
- withdraw
- sorting
- searching

Storage becomes long-term progression.

---

# PERSONAL STORAGE

Every character receives:

Starter storage access.

Purpose:

Protect valuable items.

Encourage collecting.

Support economy growth.

---

# CLAIM STORAGE

Future feature.

Storage placed on player claims.

Not required Alpha 0.1.

Must remain compatible.

---

# LOOT SYSTEM PHILOSOPHY

Loot should feel exciting.

Not random junk spam.

Players should occasionally think:

"Nice. I needed that."

or

"I can sell this."

or

"I should save this."

---

# LOOT SOURCES

Alpha sources:

- creatures
- gathering nodes
- quests
- chests
- Harvest Hollow

Future:

- bosses
- world events
- faction rewards
- raids

---

# HARVEST HOLLOW LOOT ROLE

Harvest Hollow should introduce:

Risk

↓

Loot

↓

Extraction

↓

Return to Oathstead

This loop becomes foundational.

Dungeon rewards should feel noticeably better than village gathering.

---

# ITEM VALUE STRUCTURE

Every item should have:

Utility value

or

Economic value

or

Quest value

or

Crafting value

or

Collection value

Prefer multiple values.

Avoid useless filler items.

---

# ITEM RARITY VISUALIZATION

Recommended colors:

Common = White

Uncommon = Green

Rare = Blue

Epic = Purple

Legendary = Gold

Future expansion supported.

---

# ITEM NAMING RULES

Names should be:

Readable

Memorable

Lore-friendly

Avoid:

overly long fantasy names

Examples:

Good:

- Rough Wood
- Riverleaf
- Iron Ore
- Hunter's Knife

Bad:

- Ancient Ethereal Celestial Timber of Forgotten Kings

Keep names practical.

---

# RESOURCE SPAWN RULES

Resources must respect biome identity.

Examples:

Forest:

- trees
- herbs
- wildlife

Mountain:

- ore
- stone

River:

- fish
- reeds

Swamp:

- rare herbs
- fungi

Beach:

- shells
- fish

Future biome expansion should follow this rule.

---

# ITEM DATABASE EXPECTATIONS

Minimum fields:

id

displayName

description

category

rarity

value

stackSize

alphaEnabled

skillSource

biomeSource

vendorSellable

tradable

questRelated

futureNotes

---

# RESOURCE DATABASE EXPECTATIONS

Minimum fields:

id

resourceType

biome

requiredSkill

requiredTool

xpReward

respawnTime

rarity

---

# INVENTORY DATABASE EXPECTATIONS

Minimum fields:

inventoryId

ownerId

slots

capacity

storageType

lastModified

---

# ALPHA IMPLEMENTATION BOUNDARIES

Do NOT build:

- 5000 items
- full auction house
- artifact systems
- set bonuses
- relic systems
- enchanting systems
- socket systems
- transmog systems

Alpha focus:

Simple

Functional

Expandable

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ item categories exist

✓ resource families exist

✓ inventory structure exists

✓ storage structure exists

✓ equipment structure exists

✓ Harvest Hollow loot loop exists

✓ biome-based spawning exists

✓ all 15 skills have item relationships

✓ no unnecessary item bloat exists

✓ future expansion remains supported

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve category structure.

Preserve rarity structure.

Preserve inventory philosophy.

Preserve Oathstead bank role.

Preserve Harvest Hollow loot loop.

Avoid excessive item counts.

Avoid meaningless loot.

Respect biome spawning rules.

Support future expansion.

Do not replace inventory with survival realism systems.

Do not introduce pay-to-win item mechanics.

---

# SUMMARY

The item framework creates the foundation for progression, gathering, crafting, economy, storage, and loot.

Players should constantly be collecting, improving, crafting, trading, and preparing.

Items must remain meaningful.

Resources must respect biome identity.

Inventory must remain readable.

Harvest Hollow establishes the first risk-versus-reward loot loop.

This framework forms the backbone of the UNKSCAPE economy and progression ecosystem.

\newpage

---

# 009_npc_services_economy_framework {#009-npc-services-economy-framework}

---

# 009_NPC_SERVICES_ECONOMY_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: NPC Systems, Services, Economy, Trading, Banking

---

# PURPOSE

This framework defines the living-world systems that make UNKSCAPE feel populated, functional, and economically alive.

NPCs are not decoration.

NPCs are world infrastructure.

The economy is not a side feature.

The economy is one of the primary progression systems of UNKSCAPE.

Players should constantly interact with:

- vendors
- trainers
- traders
- banks
- craftsmen
- guides
- guards
- transport services
- future player merchants

A successful economy creates:

- player retention
- item value
- profession value
- gathering value
- crafting value
- regional identity

---

# CORE ECONOMY PHILOSOPHY

UNKSCAPE should follow:

Work → Value

Risk → Reward

Scarcity → Demand

Travel → Opportunity

Knowledge → Profit

The economy should reward:

- effort
- preparation
- specialization
- exploration
- market awareness

The economy should not reward:

- AFK abuse
- infinite farming exploits
- duplicated resources
- pay-to-win mechanics

---

# NPC DESIGN PHILOSOPHY

NPCs should serve one or more purposes:

- gameplay
- lore
- economy
- world guidance
- progression

Every NPC should justify its existence.

Avoid:

- filler NPCs
- meaningless crowds
- empty dialogue spam

Players should quickly understand:

Who this NPC is.

What they do.

Why they matter.

---

# ALPHA NPC CATEGORIES

Alpha 0.1 should support the following categories.

---

## NPC_GUARD

Purpose:

Security and guidance.

Functions:

- patrols
- town defense
- local directions
- tutorial hints

Primary location:

Oathstead Village

---

## NPC_MERCHANT

Purpose:

Basic buying and selling.

Functions:

- resource purchasing
- tool sales
- supply sales

Primary location:

Market Row

---

## NPC_BANKER

Purpose:

Item storage and banking.

Functions:

- deposit
- withdraw
- sort
- search

Primary location:

Storehouse Quarter

---

## NPC_TRAINER

Purpose:

Skill introductions.

Functions:

- tutorials
- system guidance
- starter quests

Primary location:

Multiple districts

---

## NPC_CRAFTER

Purpose:

Production services.

Functions:

- repairs
- crafting access
- crafting guidance

Primary location:

Craftsman's Yard

---

## NPC_FARMER

Purpose:

Agriculture support.

Functions:

- seeds
- farming tutorials
- farming quests

Primary location:

Farming Edge

---

## NPC_HUNTER

Purpose:

Wildlife knowledge.

Functions:

- hunting tutorials
- tracking guidance
- hunting quests

Primary location:

Outskirts

---

## NPC_SCOUT

Purpose:

Exploration guidance.

Functions:

- route information
- danger warnings
- dungeon directions

Primary location:

Village Gate

---

## NPC_DUNGEON_GUIDE

Purpose:

Extraction introduction.

Functions:

- Harvest Hollow access
- risk explanation
- preparation advice

Primary location:

Outskirts

---

## NPC_QUEST_GIVER

Purpose:

Narrative and progression.

Functions:

- quests
- reputation
- tutorials
- story advancement

Primary location:

Throughout Oathstead

---

# OATHSTEAD REQUIRED SERVICE COVERAGE

The following services must exist.

---

Banking

---

Storage

---

Buying

---

Selling

---

Repairs

---

Crafting Access

---

Skill Guidance

---

Quest Access

---

Survival Guidance

---

Dungeon Preparation

---

Claim Training

---

Travel Information

---

All Alpha players must have access to these services.

---

# BANKING FRAMEWORK

Official Alpha banking hub:

Storehouse Quarter

Banking functions:

- deposit
- withdraw
- search
- sort
- storage management

Banking is account progression.

Banking should remain valuable throughout the entire game.

Future support:

- multiple banks
- regional storage
- guild storage
- claim storage

Alpha should establish the foundation only.

---

# VENDOR ECONOMY FRAMEWORK

Vendors provide stability.

Vendors prevent economic deadlocks.

Vendors should:

Buy common resources

Sell common supplies

Offer predictable pricing

Vendors should NOT:

Replace player trading

Replace crafting

Replace rare item markets

Replace future economy systems

---

# PLAYER ECONOMY PHILOSOPHY

The strongest economy should eventually be:

Player-driven

Not NPC-driven.

NPCs provide baseline value.

Players create premium value.

Examples:

Vendor buys ore.

Player smith sells weapon.

Vendor buys fish.

Player cook sells meals.

Vendor buys herbs.

Player alchemist sells potions.

---

# PRICE STRUCTURE RULE

Every item should have:

Base Vendor Value

Future systems may support:

Regional Value

Market Value

Player Value

Trade Route Value

Alpha only requires:

Base Vendor Value

---

# RESOURCE FLOW MODEL

Gatherers

↓

Processors

↓

Crafters

↓

Traders

↓

Consumers

↓

Repeat

Examples:

Mining

↓

Smithing

↓

Weapons

↓

Combat Players

↓

Repairs

↓

Mining

Loop continues.

---

# SERVICE ECONOMY CATEGORIES

Alpha services include:

---

Equipment Repair

---

Tool Repair

---

Supply Purchasing

---

Basic Crafting

---

Storage Access

---

Quest Services

---

Dungeon Preparation

---

Future services may expand.

---

# REPAIR SYSTEM FRAMEWORK

Purpose:

Support durability economy.

Repairs should:

Cost currency

Restore equipment

Provide item sink

Support smithing value

Repairs should never:

Feel punitive

Destroy progression

Encourage excessive grinding

---

# OATHSTEAD MARKET ROW FRAMEWORK

Market Row is the economic center of Alpha 0.1.

Contains:

- merchants
- suppliers
- traders
- repair services
- bulletin boards

Functions:

- player education
- resource conversion
- trade introduction

Market Row should feel active.

---

# STOREHOUSE QUARTER FRAMEWORK

Storehouse Quarter is the logistical center of Oathstead.

Contains:

- bank
- vault
- storage clerks
- trade records

Functions:

- inventory management
- wealth storage
- item protection

This district should remain important permanently.

---

# FUTURE PLAYER MARKETPLACE SUPPORT

Alpha should prepare for future systems.

Future features:

- player stalls
- trading posts
- auction systems
- regional exchanges
- merchant caravans

Do not implement full versions in Alpha.

Only preserve compatibility.

---

# CURRENCY FRAMEWORK

Alpha requires one primary currency.

Recommended:

Coins

Currency functions:

- vendor purchases
- repairs
- supplies
- basic services

Future support:

- faction currency
- event currency
- reputation currency

Not required Alpha 0.1.

---

# ANTI-INFLATION RULES

Future economy systems should support:

- repair costs
- service fees
- travel fees
- crafting costs

Purpose:

Remove currency from circulation.

Avoid:

Infinite money accumulation.

---

# REGIONAL ECONOMY FOUNDATION

Future regions should eventually develop specialties.

Examples:

Mountain Regions:

- ore
- stone

Forest Regions:

- wood
- wildlife

Wetlands:

- herbs
- alchemy resources

Coastal Regions:

- fish
- trade routes

This creates meaningful trade opportunities.

Alpha establishes the philosophy only.

---

# NPC DAILY LIFE RULE

NPCs should eventually appear alive.

Future support:

- schedules
- sleeping
- patrol routes
- work routines
- gathering routines

Alpha may use simplified behavior.

But the framework should support future expansion.

---

# GUARD FRAMEWORK

Guards provide:

- visual security
- faction presence
- beginner guidance

Guards should:

Patrol

Observe

Defend

Warn

Guards should not:

Act as invincible gods.

Future threats should matter.

---

# TRAINER FRAMEWORK

Trainers teach.

Trainers do not sell power.

Trainers should:

Explain mechanics

Introduce skills

Provide beginner quests

Avoid:

Hard progression gates.

---

# QUEST SUPPORT FRAMEWORK

NPCs drive:

- progression
- education
- lore
- world discovery

Quest NPCs should naturally introduce:

Skills

Districts

Economy

Harvest Hollow

Faction tension

---

# HARVEST HOLLOW ECONOMIC ROLE

Harvest Hollow introduces:

Risk

↓

Loot

↓

Extraction

↓

Profit

↓

Town Spending

↓

Preparation

↓

Repeat

This becomes a foundational gameplay loop.

---

# BLOOD OATH ECONOMIC CULTURE

Blood Oath communities value:

- self-sufficiency
- practical trade
- community support
- earned reputation

Oathstead should reflect:

Frontier trade culture

rather than

Luxury market culture

---

# HIGHBORN ECONOMIC CONTRAST

Future Highborn settlements should emphasize:

- regulation
- taxation
- contracts
- administration
- structured commerce

This creates economic identity differences.

---

# REPUTATION FOUNDATION

Future systems may support:

Town Reputation

Faction Reputation

Merchant Reputation

Crafting Reputation

Alpha should preserve compatibility.

Do not fully implement yet.

---

# DATA EXPECTATIONS

NPC minimum fields:

id

displayName

npcType

location

services

dialoguePool

questLinks

factionAssociation

alphaEnabled

futureNotes

---

Vendor minimum fields:

vendorId

inventory

buyCategories

sellCategories

pricingRules

location

---

Bank minimum fields:

bankId

storageSlots

accessRules

location

---

# IMPLEMENTATION BOUNDARIES

Do NOT build:

- global auction house
- advanced stock market
- player taxation systems
- guild economies
- banking interest systems
- political economies
- complicated inflation simulations

Alpha priority:

Simple

Readable

Expandable

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ banking exists

✓ storage exists

✓ vendors exist

✓ repair services exist

✓ trainers exist

✓ quest NPCs exist

✓ Harvest Hollow profit loop exists

✓ Oathstead functions as economic hub

✓ player economy remains future-compatible

✓ NPC categories remain clear

✓ currency structure exists

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve Oathstead as Alpha economic hub.

Preserve Market Row.

Preserve Storehouse Quarter.

Preserve banking systems.

Preserve vendor systems.

Preserve repair systems.

Preserve future player marketplace compatibility.

Avoid replacing player economy with NPC economy.

Avoid implementing advanced auction systems too early.

Avoid excessive economic complexity in Alpha.

Keep systems expandable.

---

# SUMMARY

The UNKSCAPE economy is built around meaningful work, valuable resources, useful services, and future player-driven trade.

Oathstead Village serves as the first economic hub.

NPCs provide infrastructure.

Players create value.

Harvest Hollow introduces risk-versus-reward extraction economics.

The long-term vision is a living MMORPG economy supported by meaningful gathering, crafting, trading, and exploration rather than artificial item generation.

\newpage

---

# 010_quests_dungeons_extraction_framework {#010-quests-dungeons-extraction-framework}

---

# 010_QUESTS_DUNGEONS_EXTRACTION_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Quests, Dungeon Design, Extraction Loop, Harvest Hollow Starter Dungeon

---

# PURPOSE

This framework defines the quest, dungeon, and extraction gameplay foundation for UNKSCAPE.

UNKSCAPE is not only a survival sandbox.

It is also a quest-driven, progression-heavy fantasy MMO world.

Quests teach the world.

Dungeons create danger.

Extraction creates decision-making.

The purpose of this framework is to ensure that the Alpha 0.1 gameplay loop connects:

- town life
- NPC guidance
- skilling
- preparation
- danger
- loot
- risk
- return
- progression

The player should not simply wander into random combat.

The player should understand why danger matters.

---

# CORE QUEST PHILOSOPHY

Quests in UNKSCAPE must serve a purpose.

Every quest should do at least one of the following:

- teach a system
- reveal the world
- introduce a character
- explain faction tension
- guide exploration
- unlock progression
- prepare the player for danger
- create emotional investment
- support economy or skill learning

Avoid quests that exist only as filler.

A simple quest is acceptable.

A meaningless quest is not.

---

# ALPHA QUEST PURPOSE

Alpha 0.1 quests should teach the player:

- movement
- interaction
- Oathstead services
- banking
- vendors
- all core skill basics
- hunger and thirst basics
- claim tutorial basics
- faction pressure
- dungeon preparation
- unstable loot
- secured loot
- extraction success

The first quest chain should function as a guided onboarding path.

Not a hand-holding prison.

Players should be able to explore, but the quest chain gives structure.

---

# STARTER QUEST CHAIN

Official Alpha starter quest chain:

quest_hearthvale_wake_at_the_common
quest_hearthvale_first_steps
quest_hearthvale_two_banners
quest_hearthvale_tools_of_the_valley
quest_hearthvale_bank_and_barter
quest_hearthvale_feed_the_fire
quest_hearthvale_claim_marker
quest_hearthvale_whispers_under_harvest
quest_hearthvale_hollow_run
quest_hearthvale_choose_your_road

These IDs are locked.

Do not rename.

Do not replace with generic IDs.

---

# QUEST 01

ID:

quest_hearthvale_wake_at_the_common

Purpose:

Introduce player to Oathstead Village.

Teaches:

- movement
- basic interaction
- central commons
- first NPC contact

Tone:

The player wakes near or inside the village commons and is directed toward local guidance.

---

# QUEST 02

ID:

quest_hearthvale_first_steps

Purpose:

Teach basic services and town navigation.

Teaches:

- finding NPCs
- identifying facilities
- safe-zone logic
- local map awareness

---

# QUEST 03

ID:

quest_hearthvale_two_banners

Purpose:

Introduce Blood Oath and Highborn tension.

Teaches:

- factions exist
- neither faction is simple good/evil
- Oathstead is Blood Oath influenced
- Highmere exists nearby as locked/reference content

---

# QUEST 04

ID:

quest_hearthvale_tools_of_the_valley

Purpose:

Introduce starter tools and core gathering skills.

Teaches:

- mining
- woodcutting
- fishing
- herbalism
- tool usage
- resource value

---

# QUEST 05

ID:

quest_hearthvale_bank_and_barter

Purpose:

Introduce banking and economy.

Teaches:

- bank deposit
- bank withdrawal
- selling resources
- buying essentials
- copper currency

---

# QUEST 06

ID:

quest_hearthvale_feed_the_fire

Purpose:

Introduce survival and production.

Teaches:

- hunger
- thirst
- cooking
- campfire/inn relief
- food preparation
- water importance

---

# QUEST 07

ID:

quest_hearthvale_claim_marker

Purpose:

Introduce building_claim_crafting.

Teaches:

- claim concept
- restricted building zones
- claim boundaries
- future housing/base systems

Alpha scope:

Tutorial only.

No unrestricted world building.

---

# QUEST 08

ID:

quest_hearthvale_whispers_under_harvest

Purpose:

Introduce Harvest Hollow danger.

Teaches:

- dungeon rumors
- preparation
- risk
- why extraction matters

---

# QUEST 09

ID:

quest_hearthvale_hollow_run

Purpose:

Guide first Harvest Hollow extraction run.

Teaches:

- dungeon entry
- loot states
- objective completion
- extraction point
- return to town

---

# QUEST 10

ID:

quest_hearthvale_choose_your_road

Purpose:

Conclude Alpha onboarding and point toward future progression.

Teaches:

- player freedom
- skill paths
- faction futures
- wider world promise
- repeated dungeon/progression loop

---

# QUEST STRUCTURE RULES

Every quest record should include:

id

displayName

type

releaseState

versionIntroduced

realmId

townId

order

category

giverNpcId

turnInNpcId

prerequisiteQuestIds

teaches

objectives

rewardConcepts

xpRewardConcepts

itemRewardIds

currencyRewardCopper

unlocks

safetyNotes

summary

tags

notes

---

# QUEST CATEGORY TYPES

Approved categories:

intro

tutorial

skill_training

economy

survival

faction_intro

dungeon_intro

extraction

story

future_reference

---

# QUEST DESIGN RULES

Quests should avoid:

- meaningless errands
- excessive walking without purpose
- confusing objectives
- hidden requirements
- overlong dialogue early
- massive reward inflation
- lore dumps with no gameplay

Quests should include:

- clear objective
- clear NPC/source
- clear reward concept
- clear reason to care

---

# DUNGEON PHILOSOPHY

Dungeons in UNKSCAPE should not be simple caves with enemies.

A dungeon should provide:

- danger
- exploration
- loot
- preparation pressure
- atmosphere
- decision-making
- extraction tension

Players should ask:

"Do I go deeper or leave now?"

That question is core to dungeon identity.

---

# ALPHA DUNGEON

Official Alpha dungeon:

dungeon_harvest_hollow

Display name:

Harvest Hollow

Status:

Alpha Active

Type:

Starter PvE extraction dungeon

Realm:

realm_hearthvale_fields

Town connection:

town_oathstead_village

---

# HARVEST HOLLOW IDENTITY

Harvest Hollow is the first dungeon players encounter.

It should feel like:

- old farm storage below the fields
- root tunnels
- collapsed cellars
- stolen harvest stores
- dirt walls
- old crates
- candlelit warnings
- dripping water
- weak but unsettling enemies
- hidden danger under peaceful land

It is not a giant raid.

It is not a full endgame dungeon.

It is the teaching dungeon.

---

# HARVEST HOLLOW GAMEPLAY ROLE

Harvest Hollow teaches:

- dungeon preparation
- combat under pressure
- inventory decisions
- unstable loot
- secured loot
- extraction timing
- return-to-town reward loop

Players should learn that greed can cost them.

But failure should not destroy the character.

---

# EXTRACTION PHILOSOPHY

Extraction means players must leave safely to secure certain rewards.

This creates tension.

Core loop:

Prepare

Enter

Explore

Fight/Gather/Loot

Choose to continue or leave

Extract

Secure rewards

Return to town

Restock

Repeat

---

# ALPHA EXTRACTION RULES

Harvest Hollow uses beginner-friendly extraction.

Rules:

PvE only

No full PvP extraction

No permadeath

No full inventory wipe

No hardcore loss system

Unstable loot can be lost if extraction fails

Secured loot remains protected

Quest-critical items remain recoverable

---

# LOOT STATE DEFINITIONS

Loot states:

unstable

secured

quest_critical

---

## UNSTABLE LOOT

Loot gained inside the dungeon before extraction.

May be lost if the player fails extraction.

Creates tension.

---

## SECURED LOOT

Loot safely carried out or banked.

Should persist.

Represents successful extraction.

---

## QUEST_CRITICAL LOOT

Important quest items.

Should not permanently softlock the player.

Must be recoverable.

---

# EXTRACTION FAILURE RULE

Failure should hurt but not erase the player.

Possible Alpha failure consequences:

- lose unstable loot
- return to dungeon entrance or town
- durability damage
- light injury state
- quest reminder to prepare better

Do not implement:

- full character deletion
- full bank loss
- full inventory wipe
- permanent progression loss

---

# DUNGEON ENTRY RULE

Harvest Hollow should be accessed through a physical world entrance.

Do not use menu-only dungeon entry.

Required access elements:

- road/trail from Oathstead
- visible entrance
- warning/signposting
- NPC guidance
- quest connection

---

# DUNGEON PREPARATION RULE

Before entering, players should be encouraged to bring:

- food
- water
- weapon
- tool if relevant
- bag space
- light source if implemented

This reinforces survival and economy systems.

---

# DUNGEON ENEMY RULE

Alpha enemies should be beginner-friendly.

They should teach:

- combat
- positioning
- retreat
- resource management

Avoid:

- unfair burst damage
- unavoidable death
- complex boss mechanics
- enemy spam

---

# DUNGEON LOOT RULE

Harvest Hollow loot should support:

- starter progression
- crafting
- survival
- economy
- early rare excitement

Do not introduce endgame items.

Do not create broken economy rewards.

---

# DUNGEON OBJECTIVE TYPES

Approved Alpha objective types:

- recover supplies
- clear small threat
- find marked crate
- gather dungeon herbs/resources
- reach extraction marker
- return to Oathstead

Future objective types:

- boss defeat
- puzzle rooms
- faction sabotage
- rescue mission
- timed extraction
- multi-party runs

---

# DUNGEON BOSS POLICY

Harvest Hollow may hint at larger threats.

Do not fully implement major regional boss fights yet unless owner approves.

Known bosses:

boss_marik_redharrow
boss_cassian_goldseal

Status:

locked/reference

They may be foreshadowed.

They should not become full Alpha boss fights yet.

---

# FACTION CONNECTION

Harvest Hollow should connect lightly to faction tension.

Possible themes:

- stolen food stores
- contested supply routes
- rumors of faction sabotage
- Oathstead struggling while Highmere controls resources

Do not make the dungeon a full faction war instance in Alpha.

---

# REPEATABILITY RULE

Harvest Hollow should be repeatable.

Repeat runs may provide:

- resources
- small loot
- skill training
- extraction practice

The first quest run teaches it.

Later runs reinforce progression.

---

# SOLO AND FUTURE PARTY COMPATIBILITY

Alpha may be solo-focused.

Architecture should preserve future compatibility for:

- party runs
- guild runs
- scaling difficulty
- shared extraction
- loot rules

Do not hard-code systems that prevent future multiplayer dungeon support.

---

# DUNGEON RECORD REQUIREMENTS

Dungeon records should include:

id

displayName

type

releaseState

versionIntroduced

realmId

townAccessIds

recommendedLevel

extractionEnabled

pvpEnabled

permadeathEnabled

inventoryWipeRules

lootStateRules

bossIds

mobThemeTags

objectiveTypes

entryRequirements

failureRules

description

tags

notes

---

# EXTRACTION DATA REQUIREMENTS

Extraction rules should define:

- unstable loot behavior
- secured loot behavior
- failure behavior
- success behavior
- quest-critical item handling
- entry requirements
- exit requirements

Do not bury these rules only in code.

They should be visible in data or documented systems.

---

# QUEST-DUNGEON CONNECTION RULE

Quest chain must connect to Harvest Hollow through:

quest_hearthvale_whispers_under_harvest

and:

quest_hearthvale_hollow_run

These quests must introduce the dungeon before repeated independent runs become natural.

---

# DUNGEON UI EXPECTATIONS

Dungeon/extraction UI should eventually show:

- dungeon name
- objective
- unstable loot indicator
- extraction status
- warning before leaving/failing
- reward summary on success

Alpha UI may be simple.

But the information must be understandable.

---

# IMPLEMENTATION BOUNDARIES

Do NOT build:

- full raid system
- PvP extraction
- permadeath
- full inventory wipe
- complex boss mechanics
- large dungeon networks
- endgame loot tables
- party matchmaking
- server economy validation

Alpha focus:

One starter PvE extraction dungeon.

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ starter quest chain exists

✓ all 10 quest IDs are preserved

✓ quests teach Alpha systems

✓ Harvest Hollow exists

✓ Harvest Hollow is PvE extraction

✓ extraction loot states exist

✓ unstable/secured/quest-critical rules exist

✓ physical dungeon entrance exists conceptually

✓ failure does not wipe full progress

✓ dungeon connects to Oathstead

✓ future boss references remain locked

✓ PvP extraction remains future

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve all quest IDs.

Preserve dungeon_harvest_hollow.

Preserve Harvest Hollow as starter dungeon.

Preserve PvE extraction Alpha rule.

Preserve unstable/secured/quest_critical loot states.

Avoid full inventory wipe.

Avoid permadeath.

Avoid PvP extraction in Alpha.

Avoid full boss implementation without approval.

Avoid menu-only dungeon access.

Connect dungeon to Oathstead.

Keep Alpha dungeon beginner-friendly.

---

# SUMMARY

Quests are the teaching spine of UNKSCAPE.

Dungeons are the danger spine.

Extraction is the risk-reward spine.

Alpha 0.1 must prove this through one focused path:

Oathstead Village

↓

Starter Quest Chain

↓

Harvest Hollow

↓

Extraction

↓

Return With Secured Progress

This loop becomes the foundation for future dungeons, regional stories, faction conflicts, and long-term progression.

\newpage

---

# 011_player_progression_schema {#011-player-progression-schema}

---

# 011_PLAYER_PROGRESSION_SCHEMA

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Character Progression, Skill Progression, Reputation, Identity, Long-Term Retention

---

# PURPOSE

This framework defines how players grow throughout their UNKSCAPE journey.

Progression is one of the most important systems in the game.

Everything ultimately connects to progression:

- skills
- combat
- exploration
- economy
- crafting
- faction reputation
- survival
- extraction
- achievements

The purpose of progression is to create long-term goals without forcing players into a single path.

Players should always feel:

"I'm stronger than I was yesterday."

without feeling:

"I finished the game."

---

# CORE PROGRESSION PHILOSOPHY

UNKSCAPE progression is built around:

Time

Effort

Knowledge

Risk

Mastery

The game should reward:

- commitment
- specialization
- preparation
- experience

The game should not reward:

- cash spending
- idle progression
- excessive shortcuts
- pay-to-win mechanics

---

# PRIMARY PROGRESSION PILLARS

UNKSCAPE progression consists of six major pillars.

---

## PILLAR 01

Character Progression

Represents:

Combat capability

Survivability

Equipment access

Combat growth

---

## PILLAR 02

Skill Progression

Represents:

Gathering

Crafting

Production

Economic capability

---

## PILLAR 03

Economic Progression

Represents:

Wealth

Trade influence

Resource ownership

Merchant capability

---

## PILLAR 04

Exploration Progression

Represents:

World knowledge

Discoveries

Travel experience

Regional familiarity

---

## PILLAR 05

Faction Progression

Represents:

Standing

Trust

Influence

Political access

---

## PILLAR 06

Reputation Progression

Represents:

Local trust

Achievements

Recognition

Future opportunities

---

# CHARACTER PROGRESSION

Character progression reflects combat effectiveness.

This is NOT a class-level system.

UNKSCAPE does not use:

"Level 1 Warrior"

"Level 20 Mage"

"Level 50 Ranger"

Instead:

The player develops their character through multiple systems simultaneously.

---

# COMBAT GROWTH MODEL

Combat strength should come from:

- equipment
- skill mastery
- preparation
- knowledge
- progression

Not simply:

Level number.

This creates healthier long-term gameplay.

---

# SKILL PROGRESSION MODEL

Each core skill maintains its own progression.

Examples:

combat

mining

smithing

woodcutting

fishing

cooking

herbalism

alchemy

crafting

farming

hunting

building_claim_crafting

trading_merchanting

survival

extraction

Each skill progresses independently.

---

# MULTI-PATH PROGRESSION

Players should be free to specialize.

Examples:

Miner

Merchant

Hunter

Explorer

Builder

Crafter

Combat Specialist

Or:

A balanced generalist.

No single path should be mandatory.

---

# LEVEL STRUCTURE

Recommended long-term structure:

1-99

for every core skill.

Alpha 0.1 support target:

1-20

visible progression.

Future systems may support:

Mastery

Prestige

Specialization

Do not implement those yet.

---

# XP PHILOSOPHY

XP should come from meaningful actions.

Examples:

Mining ore

Cutting trees

Cooking meals

Completing quests

Extracting successfully

Crafting useful items

Avoid:

Meaningless repetitive spam.

---

# SOFT SPECIALIZATION RULE

Players may naturally become known for:

Smithing

Trading

Building

Combat

Exploration

Etc.

The game should encourage identity.

The game should not force identity.

---

# CLASS PHILOSOPHY

Alpha race:

race_human

Future races:

race_orc

race_elf

race_dwarf

race_troll

race_goblin

race_nomad

race_nocturnan

race_aetherian

Races may provide bonuses.

Races do NOT lock progression paths.

Every race can:

Use every skill

Access every profession

Participate in every system

---

# GEAR PROGRESSION

Equipment progression should feel earned.

Progression examples:

Crude

↓

Common

↓

Uncommon

↓

Rare

↓

Epic

↓

Legendary

Future

Alpha focus:

Crude → Rare

Only.

---

# KNOWLEDGE PROGRESSION

Knowledge is progression.

Players who learn:

- trade routes
- profitable resources
- dungeon layouts
- efficient crafting
- hidden locations

Should gain meaningful advantages.

Knowledge is part of mastery.

---

# SURVIVAL PROGRESSION

Survival becomes more important as players expand.

Players should gradually learn:

Food management

Travel planning

Risk management

Preparation

Environmental awareness

Future regions should increase these demands.

---

# EXPLORATION PROGRESSION

Players should be rewarded for:

Discovering landmarks

Finding locations

Traveling regions

Completing exploration objectives

Future systems may include:

Map completion

Discovery journals

Region mastery

Alpha should remain compatible.

---

# REPUTATION FRAMEWORK

Future reputation categories:

Town Reputation

Faction Reputation

Merchant Reputation

Explorer Reputation

Crafting Reputation

Alpha preserves compatibility.

Do not fully implement yet.

---

# OATHSTEAD REPUTATION

Oathstead should eventually recognize:

Helpful players

Skilled players

Trusted players

This creates attachment to the starting town.

---

# FACTION PROGRESSION

Future faction progression supports:

Blood Oath

Highborn

Standing should influence:

Dialogue

Access

Story opportunities

Future rewards

Alpha only establishes structure.

---

# BLOOD OATH PROGRESSION

Players should gradually learn:

Culture

History

Values

Regional influence

The player earns trust.

Trust is not automatic.

---

# HIGHBORN PROGRESSION

Players should gradually learn:

Authority

Administration

Political influence

Regional power

Trust must be earned.

---

# ECONOMIC PROGRESSION

Wealth is progression.

Examples:

Better tools

More storage

Better equipment

Business opportunities

Future trade networks

Economic progression should feel meaningful.

---

# BUILDER PROGRESSION

building_claim_crafting should eventually support:

Claim ownership

Structures

Workshops

Defenses

Storage

Guild holdings

Alpha teaches foundations only.

---

# EXTRACTION PROGRESSION

Players become better at:

Preparation

Navigation

Risk assessment

Loot optimization

Successful extraction

Experience matters.

Knowledge matters.

Skill matters.

---

# ACHIEVEMENT PHILOSOPHY

Achievements should recognize:

Exploration

Crafting

Combat

Survival

Economy

Faction involvement

Achievements should celebrate progression.

Not replace progression.

---

# PLAYER IDENTITY PHILOSOPHY

The goal is for players to become known.

Examples:

Master Smith

Top Trader

Explorer

Dungeon Runner

Builder

Faction Hero

The world should remember accomplishments.

---

# ALT CHARACTER RULE

Future support:

Multiple characters

Multiple worlds

Protected save keys:

unkscape:saves

unkscape:worlds

Do not alter.

Progression should remain character-based.

---

# LONG-TERM RETENTION PHILOSOPHY

Players should always have:

A next goal.

Examples:

New skill level

New equipment

New quest

New region

New reputation

New dungeon

New discovery

Progression never truly ends.

It expands.

---

# WORLD SCALE CONNECTION

Official world:

world_surface_age_one

Approximate scale:

32 km x 25.6 km

819.2 km²

Progression should naturally encourage players to move outward.

Oathstead is the beginning.

Not the destination.

---

# ALPHA PROGRESSION GOALS

By the end of Alpha 0.1 players should:

Understand all 15 skills

Understand Oathstead

Understand Harvest Hollow

Understand extraction

Understand the faction foundations

Reach visible progression milestones

Want more world to explore

---

# DATA EXPECTATIONS

Player Profile Minimum Fields

id

characterName

raceId

factionId

creationDate

playTime

location

reputationData

achievementData

futureNotes

---

Skill Progress Minimum Fields

skillId

level

xp

xpToNext

lastModified

---

Faction Progress Minimum Fields

factionId

standing

rank

reputation

futureUnlocks

---

Exploration Progress Minimum Fields

regionsVisited

landmarksFound

dungeonsEntered

futureMetrics

---

# IMPLEMENTATION BOUNDARIES

Do NOT build:

- prestige systems
- reincarnation systems
- seasonal resets
- battle passes
- paid progression
- class lock systems
- mandatory specialization

Alpha focus:

Simple

Expandable

Meaningful

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ all 15 skills progress independently

✓ progression supports multiple playstyles

✓ no race locks exist

✓ no class locks exist

✓ economic progression exists

✓ exploration progression exists

✓ reputation structure exists

✓ faction structure exists

✓ extraction progression exists

✓ long-term retention goals exist

✓ future expansion remains compatible

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve independent skill progression.

Preserve multi-path progression.

Preserve race flexibility.

Preserve faction compatibility.

Preserve reputation compatibility.

Preserve extraction progression.

Avoid class-lock systems.

Avoid pay-to-win progression.

Avoid battle-pass mechanics.

Avoid mandatory specialization.

Support long-term growth.

Keep progression meaningful.

---

# SUMMARY

The UNKSCAPE progression system is designed around freedom, mastery, reputation, and long-term growth.

Players are not defined by a single class.

Players are defined by what they do.

Skills, economy, exploration, faction standing, survival, and extraction all contribute to a player's story.

Oathstead begins the journey.

The wider world creates the legend.

Progression should feel earned, memorable, and expandable for years without requiring artificial resets or pay-to-win shortcuts.

\newpage

---

# 012_world_map_terrain_horizon_framework {#012-world-map-terrain-horizon-framework}

---

# 012_WORLD_MAP_TERRAIN_HORIZON_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: World Scale, Terrain, Map Structure, Chunking, Horizon Illusion, Exploration

---

# PURPOSE

This framework defines the world map, terrain, chunking, streaming, horizon, and exploration structure for UNKSCAPE.

UNKSCAPE is designed to feel massive.

But the game must remain browser-friendly.

The goal is to create the illusion and structure of a huge living world without requiring the engine to render, simulate, or store the entire world at once.

This framework protects the game from:

- tiny floating test-map feeling
- flat empty terrain
- black void edges
- full-world generation crashes
- oversized JSON maps
- browser memory overload
- unplanned world expansion

The world should feel big.

The engine should stay light.

---

# OFFICIAL WORLD SURFACE

Official world ID:

world_surface_age_one

This ID is locked.

Do not rename.

Do not replace.

Do not create alternate main world IDs without approval.

---

# OFFICIAL WORLD SIZE

World dimensions:

16,000 x 12,800 tiles

Approximate tile scale:

2 meters per tile

Approximate real-world scale:

32 km x 25.6 km

Approximate total area:

819.2 km²

This is the official coordinate foundation.

It does NOT mean the full world should be generated immediately.

---

# WORLD SIZE PHILOSOPHY

World size is a promise.

Not a startup task.

The engine should understand large coordinates.

The renderer should only show what matters near the player.

The data layer should define regions without loading everything.

---

# NO FULL WORLD GENERATION RULE

Do NOT generate:

- 16,000 x 12,800 tile array
- full terrain map
- full resource map
- full NPC map
- full mob map
- full collision map
- one giant world JSON file
- all towns at once
- all dungeons at once
- all biomes at once

This will destroy performance.

The world must be streamed, generated, or represented in layers.

---

# CHUNK SYSTEM TARGET

Recommended gameplay chunk size:

64 x 64 tiles

Recommended macro region size:

128 x 128 tiles

Chunking should support:

- near-player loading
- unloading distant detail
- lightweight collision
- resource spawning near player
- terrain streaming
- future multiplayer authority

---

# CHUNK PHILOSOPHY

Chunks are technical.

Players should not feel like the world is broken into squares.

Chunk boundaries must not be visually obvious.

Avoid:

- hard terrain seams
- sudden pop-in near player
- black void borders
- floating chunk islands

---

# ACTIVE PLAYABLE SLICE

Alpha 0.1 active playable slice:

realm_hearthvale_fields

town_oathstead_village

dungeon_harvest_hollow

The larger world exists as coordinate and future expansion structure.

Only the Alpha slice is active.

---

# REALM STRUCTURE

Realms are major world regions.

Alpha active realm:

realm_hearthvale_fields

Future realms may be added later.

Each realm should have:

- terrain identity
- biome identity
- economy identity
- faction influence
- town anchors
- dungeon anchors
- resource themes
- exploration hooks

---

# HEARTHVALE FIELDS TERRAIN IDENTITY

Hearthvale Fields should include:

- rolling fields
- low hills
- riverbanks
- farms
- shallow mines
- starter forests
- herb patches
- dirt roads
- old stone ruins
- cellar doors
- creek crossings
- distant keep silhouette
- wilderness outskirts

Hearthvale should feel peaceful on the surface.

But dangerous underneath.

---

# OATHSTEAD PLACEMENT

Oathstead Village should sit within Hearthvale Fields as:

- starter town
- road hub
- service hub
- skill hub
- dungeon preparation center

Nearby terrain should support:

- mining
- woodcutting
- fishing
- farming
- hunting
- herbalism
- survival practice

---

# HARVEST HOLLOW PLACEMENT

Harvest Hollow should be physically connected to the world.

It should not feel like a menu instance.

Access should include:

- road/trail from Oathstead
- visible entrance
- warnings
- local rumors
- quest tie-in

The entrance may be near:

- old fields
- cellar ruins
- root-covered slope
- abandoned farm structure

---

# HIGHMERE KEEP PLACEMENT

Highmere Keep exists as a locked/reference location.

It may appear as:

- distant silhouette
- map label
- rumor reference
- faction tension marker

Do not fully build Highmere in Alpha 0.1.

---

# TERRAIN HEIGHT REQUIREMENT

UNKSCAPE must not remain a flat test board.

Terrain architecture should support:

- slopes
- hills
- cliffs
- valleys
- cave entrances
- water edges
- raised roads
- ruins
- walls
- indoor/outdoor transitions

Alpha may start simple.

But systems must not block future terrain height.

---

# HORIZON REQUIREMENT

UNKSCAPE must not look like a small floating slab in black space.

The renderer/world presentation should support:

- near gameplay ring
- mid visual ring
- far proxy ring
- sky layer
- fog/haze
- terrain continuation illusion
- distant silhouettes
- distant trees
- distant mountains
- distant water/ocean/land continuation

This creates world scale without rendering everything.

---

# HORIZON LAYERS

Recommended visual layers:

Layer 1

Near Gameplay Terrain

Fully interactive.

---

Layer 2

Midground Terrain

Lower detail.

Limited interaction or visual-only.

---

Layer 3

Far Proxy Terrain

Simple shapes/silhouettes.

No interaction.

---

Layer 4

Atmosphere

Fog, haze, sky gradient.

---

Layer 5

Distant Landmarks

Mountains, keep silhouettes, forests.

Visual only.

---

# FOG AND ATMOSPHERE RULE

Fog should hide technical limits.

Fog should also support mood.

Use fog/haze to:

- soften chunk edges
- improve depth
- create scale
- hide pop-in
- support time-of-day feel

Avoid thick fog that makes navigation annoying.

---

# WATER AND COASTLINE RULE

World architecture should support:

- rivers
- ponds
- lakes
- coastlines
- marshes
- future ocean edge

Water should support:

- fishing
- travel barriers
- survival water access
- visual identity

Do not implement full ocean simulation in Alpha.

---

# ROAD SYSTEM PHILOSOPHY

Roads should guide players naturally.

Roads should connect:

- Oathstead
- resource areas
- Harvest Hollow
- future Highmere direction
- fields
- farms
- wilderness outskirts

Roads are onboarding tools.

Not just decoration.

---

# RESOURCE PLACEMENT PHILOSOPHY

Resources should follow terrain logic.

Examples:

Ore near stone/mines.

Fish near water.

Herbs near fields/outskirts.

Wood near trees.

Hunting near trails.

Do not randomly scatter nodes everywhere.

---

# BIOME IDENTITY RULE

Every biome should have:

Visual identity.

Resource identity.

Audio identity.

Gameplay identity.

Survival identity.

If two biomes feel the same, one is unnecessary.

---

# MAP UI PHILOSOPHY

Map UI should support discovery.

Alpha may start simple.

Future map should show:

- current location
- Oathstead
- Harvest Hollow
- roads
- discovered landmarks
- locked/future regions
- faction influence
- claim zones

Do not reveal the entire world immediately if discovery is intended.

---

# DISCOVERY RULE

The world should reward exploration.

Future support:

- discovered locations
- fog of war
- map notes
- landmarks
- cartographer services

Alpha should preserve compatibility.

---

# CARTOGRAPHER ROLE

Oathstead may include a cartographer/service NPC.

Purpose:

- explain map
- reveal local area
- hint at Highmere
- hint at Harvest Hollow
- support exploration progression

---

# WORLD COORDINATE RULE

All major locations should eventually have world coordinates.

Coordinate record should support:

worldId

x

y

z/height

regionId

realmId

townId or landmarkId

Do not hardcode location identity by display name alone.

---

# REGION RECORD EXPECTATIONS

Region records should include:

id

displayName

worldId

realmId

bounds

biomeTags

factionInfluence

resourceThemes

dangerLevel

releaseState

notes

---

# LANDMARK RECORD EXPECTATIONS

Landmark records should include:

id

displayName

worldId

realmId

regionId

position

releaseState

tags

notes

---

# PERFORMANCE RULES

World systems must avoid:

- full map loops every frame
- per-frame full registry scans
- loading all terrain data at boot
- spawning all NPCs/resources at once
- generating all chunks simultaneously
- excessive draw calls
- huge uncompressed assets

Use:

- culling
- chunk streaming
- lazy loading
- object pooling
- lightweight proxies
- LOD concepts

---

# LOW-END HARDWARE RULE

UNKSCAPE must stay playable on modest hardware.

Visual scale must be achieved through smart design.

Not brute force.

---

# ALPHA IMPLEMENTATION BOUNDARIES

Do NOT build:

- entire world map
- all realms
- all towns
- all biome systems
- full ocean
- full mountain network
- full cave network
- massive terrain generator
- full global resource placement

Alpha focus:

Hearthvale Fields starter slice.

Oathstead.

Harvest Hollow.

Horizon illusion foundation.

---

# WORLD VALIDATION REQUIREMENTS

Framework passes validation if:

✓ world_surface_age_one exists

✓ dimensions remain 16,000 x 12,800

✓ full-world generation is forbidden

✓ chunking strategy exists

✓ horizon strategy exists

✓ terrain height support exists

✓ Hearthvale is Alpha realm

✓ Oathstead is primary town

✓ Harvest Hollow has physical placement

✓ Highmere remains locked/reference

✓ no black void/floating block target remains

✓ browser performance is protected

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve world_surface_age_one.

Preserve official world dimensions.

Use chunk/streaming concepts.

Avoid full-world generation.

Avoid giant JSON maps.

Avoid black void presentation.

Support terrain height.

Support horizon illusion.

Keep Alpha focused on Hearthvale/Oathstead/Harvest Hollow.

Keep future regions locked.

Respect browser performance.

---

# SUMMARY

UNKSCAPE's world is officially massive.

But the browser should only load what it needs.

The world must feel:

- large
- continuous
- explorable
- atmospheric
- grounded

without becoming technically reckless.

The Alpha build should establish the foundation:

Hearthvale Fields

Oathstead Village

Harvest Hollow

chunk streaming logic

terrain depth support

horizon illusion

future expansion compatibility

The player should never feel trapped on a tiny floating test island.

The world should always feel bigger than the current screen.

\newpage

---

# 013_animation_audio_ui_framework {#013-animation-audio-ui-framework}

---

# 013_ANIMATION_AUDIO_UI_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Animation, Audio, User Interface, Presentation, Feedback Systems

---

# PURPOSE

This framework defines the animation, audio, user interface, feedback, and presentation rules for UNKSCAPE.

UNKSCAPE must feel like a game.

Not a browser dashboard.

Not a test page.

Not a generic web app.

The goal is to make every system communicate clearly through:

- movement
- sound
- feedback
- UI
- atmosphere
- world presentation

Good feedback makes simple systems feel alive.

Bad feedback makes deep systems feel broken.

---

# PRESENTATION PHILOSOPHY

UNKSCAPE should feel:

- low-poly
- readable
- fantasy
- grounded
- atmospheric
- old-school inspired
- custom
- browser-friendly

The game does not need photorealistic visuals.

It needs strong identity.

---

# VISUAL IDENTITY RULE

Visual style should support:

- clear silhouettes
- readable resource nodes
- visible NPC roles
- recognizable towns
- faction identity
- terrain depth
- dungeon atmosphere
- horizon scale

Avoid visual clutter.

Readability matters more than detail density.

---

# UI IDENTITY RULE

UNKSCAPE UI should feel embedded in the fantasy world.

Suggested materials:

- parchment
- stone
- leather
- iron
- wax seals
- carved wood
- faction badges

UI should not feel like:

- corporate dashboard
- SaaS admin panel
- plain Bootstrap site
- generic form UI
- sci-fi HUD

---

# UI CORE REQUIREMENTS

Alpha UI must support:

- character creation
- race selection
- locked race display
- inventory
- bank
- skills
- quests
- map
- vendor
- crafting
- survival indicators
- extraction status
- settings

Some systems may be simple at first.

But they must be visually coherent.

---

# CHARACTER CREATION UI

Alpha character creation must show:

race_human

Future races may be:

- hidden
or
- displayed as locked

Future locked races:

race_orc

race_elf

race_dwarf

race_troll

race_goblin

race_nomad

race_nocturnan

race_aetherian

Do not allow selection of locked races.

---

# FACTION PRESENTATION

Current factions:

faction_blood_oath

faction_highborn

UI should support faction identity without copying existing MMO faction designs.

---

# BLOOD OATH PRESENTATION

Blood Oath UI/material flavor:

- rough leather
- dark iron
- red cloth
- fire glow
- ash texture
- hand-marked symbols
- carved oath marks

Mood:

warm

rugged

ritual

survival-driven

---

# HIGHBORN PRESENTATION

Highborn UI/material flavor:

- stone
- gold seal
- parchment contracts
- clean lines
- blue/white/gold accents if needed
- legal stamps
- polished borders

Mood:

ordered

controlled

authoritative

formal

---

# INVENTORY UI RULE

Inventory should prioritize:

- clear slots
- readable item icons
- stack counts
- tooltips
- category clarity
- drag/drop compatibility if implemented

Inventory should not become visually noisy.

---

# BANK UI RULE

Bank UI should feel safe.

Banking is important in UNKSCAPE.

Bank UI should support:

- deposit
- withdraw
- sorting
- searching
- categories
- future tabs
- future shared storage

Do not treat bank as a temporary test panel.

---

# SKILL UI RULE

Skill UI should show all 15 core skills:

combat

mining

smithing

woodcutting

fishing

cooking

herbalism

alchemy

crafting

farming

hunting

building_claim_crafting

trading_merchanting

survival

extraction

All must appear beginner-accessible in Alpha 0.1.

---

# QUEST UI RULE

Quest UI should show:

- quest title
- current objective
- giver/turn-in if known
- reward concept
- progress state
- completed state

Quest UI should guide without overwhelming.

---

# MAP UI RULE

Map UI should eventually support:

- Oathstead
- Harvest Hollow
- roads
- nearby resources
- future Highmere reference
- discovered landmarks
- locked regions

Alpha map may start simple.

But it should not look like a developer debug grid as final presentation.

---

# EXTRACTION UI RULE

Extraction UI should show:

- dungeon name
- objective
- unstable loot indicator
- extraction status
- warning if loot is not secured
- success summary

This is critical to teach extraction.

---

# SURVIVAL UI RULE

Survival indicators should be readable and calm.

Alpha survival indicators:

- hunger
- thirst
- health if implemented
- stamina/energy if implemented

Avoid overwhelming new players with too many meters early.

---

# AUDIO PHILOSOPHY

Audio should make the world feel alive.

Audio should support:

- terrain identity
- town identity
- faction identity
- dungeon danger
- skill feedback
- combat clarity
- UI confirmation

Silence makes systems feel unfinished.

---

# HEARTHVALE AUDIO IDENTITY

Hearthvale Fields ambience:

- wind through fields
- birds
- soft insects
- distant tools
- river water
- campfires
- light village murmur
- occasional forge sound

Mood:

peaceful but exposed.

---

# OATHSTEAD AUDIO IDENTITY

Oathstead Village ambience:

- central fire
- footsteps on dirt
- market chatter
- hammering
- animals
- wood chopping
- cooking
- quiet guard calls

Mood:

warm, working, alive.

---

# HARVEST HOLLOW AUDIO IDENTITY

Harvest Hollow ambience:

- dripping water
- low rumble
- roots creaking
- distant scuttles
- muffled earth
- candle flicker
- wooden crate movement

Mood:

underground, tense, beginner-danger.

---

# BLOOD OATH AUDIO IDENTITY

Blood Oath sound profile:

- drums
- fire crackle
- leather movement
- low ritual rhythm
- bone/rattle accents
- rough chanting tones

Must remain original fantasy.

Do not copy real sacred chants or ceremonies.

---

# HIGHBORN AUDIO IDENTITY

Highborn sound profile:

- bells
- stone reverb
- clean metal
- marching rhythm
- court ambience
- parchment/ledger sounds

Mood:

controlled and formal.

---

# UI AUDIO RULE

UI audio should be subtle.

Examples:

- soft click
- page turn
- inventory move
- coin sound
- bank deposit
- quest accepted
- quest completed
- warning tone

Avoid loud repetitive sounds.

---

# SKILL FEEDBACK RULE

Every skill action should eventually provide feedback.

Examples:

Mining:

pick impact

stone crack

ore pickup

Woodcutting:

axe hit

wood split

log pickup

Fishing:

line cast

water tug

catch sound

Cooking:

fire crackle

sizzle

success/fail cue

Feedback makes skilling satisfying.

---

# COMBAT FEEDBACK RULE

Combat feedback should communicate:

- hit
- miss
- damage
- danger
- enemy defeat
- player hurt

Avoid unclear combat.

Players must understand what happened.

---

# ANIMATION PHILOSOPHY

Animations should communicate action.

They do not need to be complex.

They must be readable.

A simple readable animation is better than a fancy unclear one.

---

# PLAYER ANIMATION REQUIREMENTS

Player animation should eventually include:

- idle
- walk
- run
- gather
- attack
- hurt
- interact
- carry/use item

Alpha may use simplified animations.

But systems should support expansion.

---

# NPC ANIMATION REQUIREMENTS

NPCs should feel alive through:

- idle motion
- facing player
- walking routes
- working actions
- vendor stance
- guard stance

Avoid frozen mannequin towns as final presentation.

---

# RESOURCE ANIMATION RULE

Resource nodes should provide feedback.

Examples:

- tree shake when chopped
- rock chips when mined
- herb pickup motion
- fishing ripple

Small effects matter.

---

# DUNGEON ANIMATION RULE

Dungeon animation should support danger.

Examples:

- flickering candles
- moving shadows
- enemy idle motion
- extraction marker pulse
- loot sparkle/marker

Avoid excessive particles that harm performance.

---

# PERFORMANCE RULE

Presentation must remain low-spec friendly.

Avoid:

- expensive particles
- too many animated objects
- massive audio layers
- high-poly models
- overdraw-heavy UI
- per-frame DOM rebuilding

Use:

- simple animation loops
- sprite/model reuse
- pooled effects
- lightweight audio triggers
- efficient UI updates

---

# ACCESSIBILITY RULE

UI should support:

- readable font sizes
- strong contrast
- clear icons
- understandable tooltips
- avoid color-only meaning where possible

Faction colors may help.

But icons/text should clarify meaning.

---

# RESPONSIVE UI RULE

UI should support different screen sizes.

Minimum target:

Desktop browser play.

Future support:

large monitors

smaller laptops

Do not design only for one screen size.

---

# ERROR FEEDBACK RULE

When an action fails, the player should understand why.

Examples:

Need tool.

Inventory full.

Level too low.

Not enough resources.

Locked content.

Future race unavailable.

Do not fail silently.

---

# LOCKED CONTENT FEEDBACK RULE

When future content is shown as locked:

Tell player it is future/locked.

Do not crash.

Do not allow selection.

Do not hide errors behind broken buttons.

---

# LOADING SCREEN PHILOSOPHY

Loading screens should feel branded.

Possible elements:

- UNKSCAPE logo
- world tip
- faction quote
- parchment/stone panel
- low-poly background
- Hearthvale silhouette

Avoid generic loading bars alone.

---

# TITLE SCREEN PHILOSOPHY

Title screen should communicate:

- fantasy world
- scale
- survival
- faction identity
- low-poly style

It should not feel like a default web template.

---

# IMPLEMENTATION BOUNDARIES

Do NOT overbuild:

- cinematic animation system
- expensive VFX pipeline
- huge audio library
- advanced shader system
- mobile-first UI rewrite
- massive menu redesign before gameplay works

Alpha focus:

Readable UI.

Basic feedback.

World atmosphere.

Stable interaction.

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ UI identity is defined

✓ all core UI panels are listed

✓ Blood Oath UI identity exists

✓ Highborn UI identity exists

✓ audio identity exists

✓ animation requirements exist

✓ extraction UI requirements exist

✓ survival UI requirements exist

✓ performance limits exist

✓ accessibility rules exist

✓ locked content feedback exists

---

# CLAUDE COMPLIANCE RULES

Claude must:

Make UI feel like a game.

Avoid generic dashboard design.

Preserve all 15 skill UI visibility.

Preserve Human-only Alpha selection.

Show future races only as locked if displayed.

Support inventory, bank, skills, quests, map, vendor, crafting, survival, extraction UI.

Avoid expensive effects.

Avoid silent failed actions.

Support low-end performance.

Preserve original faction presentation.

---

# SUMMARY

UNKSCAPE presentation should make the world feel alive, readable, and original.

The game can be low-poly.

It cannot feel lazy.

Animation, audio, UI, and feedback must work together to support:

- survival
- skilling
- economy
- quests
- extraction
- faction identity
- exploration

The player should always understand what is happening, why it matters, and what they can do next.

\newpage

---

# 014_future_races_realms_expansion_framework {#014-future-races-realms-expansion-framework}

---

# 014_FUTURE_RACES_REALMS_EXPANSION_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Future Races, Realms, Regional Expansion, World Growth

---

# PURPOSE

This framework defines the future expansion architecture of UNKSCAPE.

Alpha 0.1 intentionally launches with limited playable content.

This is not because the world is small.

This is because the world is being built in layers.

The goal is to establish a stable foundation that can expand for years without requiring major redesigns.

UNKSCAPE should always feel larger than what is currently playable.

Players should feel:

"There is more out there."

---

# EXPANSION PHILOSOPHY

The world should expand through:

- new races
- new realms
- new towns
- new dungeons
- new regions
- new factions
- new landmarks
- new progression opportunities

Expansion should feel natural.

Not forced.

Every new addition must fit into the existing world.

---

# LOCKED RACE LIST

Official playable race IDs:

race_human

race_orc

race_elf

race_dwarf

race_troll

race_goblin

race_nomad

race_nocturnan

race_aetherian

These IDs are locked.

Do not rename.

Do not replace.

Do not create alternate race IDs.

---

# ALPHA CHARACTER CREATION RULE

Alpha 0.1 character creation supports:

race_human

ONLY.

Human is the only playable race during Alpha.

All future races remain unavailable.

Future races may be:

- hidden
or
- displayed as locked

Both approaches are acceptable.

They must not be selectable.

---

# BETA CHARACTER CREATION RULE

Planned Beta playable races:

race_human

race_orc

race_elf

race_dwarf

Only these four races should be considered for first expansion availability.

Remaining races remain locked.

---

# FUTURE RACE RELEASE ORDER

Recommended roadmap:

Phase 1

Human

---

Phase 2

Orc

Elf

Dwarf

---

Phase 3

Troll

Goblin

Nomad

---

Phase 4

Nocturnan

Aetherian

This roadmap may evolve.

The framework should preserve compatibility.

---

# RACE DESIGN PHILOSOPHY

Races provide identity.

Races do not provide restrictions.

Every race should be capable of:

- all skills
- all professions
- all content
- all progression paths

Races may influence:

- appearance
- starting bonuses
- lore
- cultural identity

Races should not hard-lock gameplay.

---

# HUMAN FRAMEWORK

ID:

race_human

Status:

Alpha Active

Identity:

Adaptable

Resourceful

Balanced

Explorative

Associated Region:

realm_hearthvale_fields

Role:

Baseline race and foundation for all systems.

---

# ORC FRAMEWORK

ID:

race_orc

Status:

Future Locked

Identity:

Strength

Endurance

Frontier Survival

Tribal Unity

Preferred Terrain:

Rugged highlands

Harsh frontiers

Rocky regions

Potential Skill Affinity:

combat

survival

hunting

---

# ELF FRAMEWORK

ID:

race_elf

Status:

Future Locked

Identity:

Patience

Tradition

Harmony

Precision

Preferred Terrain:

Deep forests

Ancient groves

Canopy regions

Potential Skill Affinity:

woodcutting

hunting

herbalism

---

# DWARF FRAMEWORK

ID:

race_dwarf

Status:

Future Locked

Identity:

Industry

Craftsmanship

Stonework

Determination

Preferred Terrain:

Mountains

Caves

Stone strongholds

Potential Skill Affinity:

mining

smithing

crafting

---

# TROLL FRAMEWORK

ID:

race_troll

Status:

Future Locked

Identity:

Adaptation

Persistence

Swamp Survival

Ancient Traditions

Preferred Terrain:

Wetlands

Marshes

Flooded ruins

Potential Skill Affinity:

survival

fishing

herbalism

---

# GOBLIN FRAMEWORK

ID:

race_goblin

Status:

Future Locked

Identity:

Ingenuity

Trade

Scavenging

Opportunity

Preferred Terrain:

Jungles

Trade hubs

Dense frontier regions

Potential Skill Affinity:

trading_merchanting

crafting

extraction

---

# NOMAD FRAMEWORK

ID:

race_nomad

Status:

Future Locked

Identity:

Travel

Adaptability

Exploration

Independence

Preferred Terrain:

Plains

Deserts

Open roads

Potential Skill Affinity:

survival

exploration

trading_merchanting

---

# NOCTURNAN FRAMEWORK

ID:

race_nocturnan

Status:

Future Locked

Identity:

Mystery

Night Travel

Underground Culture

Secrecy

Preferred Terrain:

Caves

Underground regions

Dark forests

Potential Skill Affinity:

extraction

mining

survival

---

# AETHERIAN FRAMEWORK

ID:

race_aetherian

Status:

Future Locked

Identity:

Wonder

Knowledge

Ancient Mysticism

Exploration

Preferred Terrain:

Crystal regions

Magical highlands

Aetherreach

Potential Skill Affinity:

alchemy

crafting

exploration

---

# REALM EXPANSION PHILOSOPHY

Realms are major world regions.

A realm should feel like entering another part of the world.

Not another colored zone.

Every realm must provide:

- visual identity
- terrain identity
- audio identity
- economic identity
- exploration identity

---

# LOCKED ALPHA REALM

Active:

realm_hearthvale_fields

Contains:

town_oathstead_village

dungeon_harvest_hollow

This remains the only active Alpha realm.

---

# FUTURE REALM ARCHITECTURE

Future realms may include:

Ironspine Range

Whisperwood

Mire of Echoes

Sunder Coast

Verdant Expanse

Ashen Scar

Nocturn Veil

Aetherreach

These names remain framework references.

Future additions require approval.

---

# EXPANSION WORLD RULE

Future regions should connect naturally.

Avoid:

Portal-based disconnected worlds.

Prefer:

Roads

Mountain passes

Coastal routes

River systems

Natural travel paths

The world should feel connected.

---

# TOWN EXPANSION RULE

Future towns must support:

- economy
- storage
- quests
- local identity

Future towns must not invalidate:

town_oathstead_village

Oathstead remains historically important.

---

# DUNGEON EXPANSION RULE

Future dungeons should follow:

Risk

↓

Reward

↓

Extraction

Harvest Hollow establishes the model.

Future dungeons expand it.

---

# FACTION EXPANSION RULE

Current factions:

faction_blood_oath

faction_highborn

Future factions may exist.

Current factions remain foundational.

Do not replace them.

---

# EXPANSION CONTENT PHILOSOPHY

Future content should expand horizontally.

Not only vertically.

Examples:

New regions

New discoveries

New economies

New stories

New professions

Avoid endless power creep.

---

# NEW PLAYER EXPERIENCE RULE

Future expansions must not break:

Alpha onboarding

Human starter experience

Oathstead progression

Hearthvale learning path

New players must still begin in a controlled environment.

---

# DATA EXPECTATIONS

Race Minimum Fields

id

displayName

status

preferredTerrain

racialIdentity

futureAffinity

futureNotes

---

Realm Minimum Fields

id

displayName

status

terrainProfile

factionPresence

resourceProfile

audioProfile

futureNotes

---

Expansion Minimum Fields

id

releasePhase

regionsAdded

racesAdded

systemsAdded

futureNotes

---

# IMPLEMENTATION BOUNDARIES

Do NOT build:

- all race homelands
- all future realms
- all future towns
- all future dungeons
- all future faction systems

Alpha focus:

Preserve compatibility.

Build foundation.

Leave room for growth.

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ all race IDs remain locked

✓ Alpha supports Human only

✓ Beta supports Human, Orc, Elf, Dwarf

✓ future races remain compatible

✓ future realms remain compatible

✓ future towns remain compatible

✓ future dungeons remain compatible

✓ Oathstead remains important

✓ Hearthvale remains Alpha foundation

✓ no race locks block gameplay systems

✓ world expansion remains natural

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve all locked race IDs.

Preserve Alpha Human-only character creation.

Preserve Beta race roadmap.

Preserve Hearthvale as Alpha realm.

Preserve Oathstead as starter town.

Preserve Harvest Hollow as starter dungeon.

Avoid implementing future races prematurely.

Avoid implementing future realms prematurely.

Avoid race-locked gameplay systems.

Avoid replacing Blood Oath or Highborn.

Support long-term expansion.

Keep Alpha focused and stable.

---

# SUMMARY

UNKSCAPE launches with a deliberately focused scope:

- Human race
- Hearthvale Fields
- Oathstead Village
- Harvest Hollow

This is the foundation.

Future expansions introduce new races, realms, towns, dungeons, and discoveries without replacing the original player journey.

The world should always feel larger than the currently playable content.

Every expansion should make the world feel deeper, not merely bigger.

UNKSCAPE is designed for long-term growth without sacrificing its foundation.

\newpage

---

# 015_security_anticheat_server_framework {#015-security-anticheat-server-framework}

---

# 015_SECURITY_ANTICHEAT_SERVER_FRAMEWORK

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Security, Anti-Cheat, Save Protection, Multiplayer Architecture, World Integrity

---

# PURPOSE

This framework establishes the security, anti-cheat, persistence, and multiplayer architecture principles of UNKSCAPE.

Security is not a future feature.

Security is a foundational system.

Every progression system depends on trust.

Players must trust:

- their characters
- their items
- their progression
- the economy
- the world

Without trust, progression loses value.

Without value, the game loses longevity.

---

# CORE SECURITY PHILOSOPHY

Protect:

- player progress
- character data
- inventory data
- economy data
- world state
- claim ownership
- future multiplayer integrity

Security must be considered from the beginning.

Do not build first and secure later.

---

# ALPHA SECURITY REALITY

Alpha 0.1 is primarily:

Local

Single-player capable

Browser-based

GitHub Pages compatible

Because of this:

Perfect cheat prevention is impossible.

The objective is:

Reasonable protection

Clean architecture

Future migration readiness

---

# SAVE SYSTEM PROTECTION

Protected Save Keys:

unkscape:saves

unkscape:worlds

These identifiers are LOCKED.

Do not rename.

Do not replace.

Do not delete automatically.

Do not migrate destructively.

Future save versions must preserve compatibility whenever possible.

---

# SAVE PHILOSOPHY

Player saves are valuable.

A save contains:

- character identity
- inventory
- skills
- progression
- discoveries
- reputation
- world interaction

Save corruption should be treated as a critical failure.

---

# SAVE VERSIONING RULE

Every save must include:

saveVersion

Example:

0.1.0

0.2.0

1.0.0

Future updates should support:

Version checking

Migration logic

Fallback handling

Never assume all saves are current.

---

# BACKUP PHILOSOPHY

Players should never lose everything due to a single corruption event.

Future support:

- backup snapshots
- previous save recovery
- world recovery
- character recovery

Alpha should preserve compatibility.

---

# CHARACTER IDENTITY RULE

Every character requires:

Persistent unique identifier

Character names alone are not identity.

Character IDs remain permanent.

Character IDs should survive:

- renames
- updates
- migrations

---

# INVENTORY PROTECTION RULE

Inventory integrity is critical.

The system must prevent:

- item duplication
- inventory corruption
- invalid stack counts
- impossible inventory states

Inventory validation should occur whenever practical.

---

# CURRENCY PROTECTION RULE

Currency integrity directly affects the economy.

The system should detect:

- negative balances
- impossible balances
- duplicated rewards
- invalid transactions

The economy must remain trustworthy.

---

# ITEM DUPLICATION PHILOSOPHY

Duplication is one of the greatest threats to MMO economies.

Future multiplayer systems must prioritize:

Transaction validation

Inventory validation

Trade validation

Storage validation

Item duplication should be treated as a severe exploit.

---

# CLAIM OWNERSHIP PROTECTION

Future claim systems require:

Owner validation

Permission validation

Access validation

Claim ownership must remain authoritative.

Future structures should not be vulnerable to simple client edits.

---

# CLIENT TRUST RULE

Clients should never be fully trusted.

The client exists to:

Display

Request

Interact

The client should not become the ultimate authority.

---

# FUTURE SERVER AUTHORITY RULE

Long-term architecture target:

Server-authoritative systems.

Server validates:

- inventory
- movement
- trades
- crafting
- economy
- claims
- combat

The client should not determine truth.

The server should determine truth.

---

# MULTIPLAYER EVOLUTION PATH

Phase 1

Single-player capable

Local persistence

---

Phase 2

Small online infrastructure

Shared services

Basic account systems

---

Phase 3

Persistent multiplayer world

Authoritative services

Economy synchronization

---

Phase 4

Full MMO infrastructure

Scalable world services

Regional services

Future cluster support

---

# CHEAT PHILOSOPHY

Cheat prevention should focus on:

Progression integrity

Economy integrity

World integrity

Not aggressive player punishment.

---

# ALPHA CHEAT EXPECTATIONS

Alpha may encounter:

- save editing
- local storage editing
- memory modification
- browser manipulation

This is expected.

Architecture should be designed for future authority migration.

---

# EXPLOIT RESPONSE PHILOSOPHY

Detect

Validate

Log

Correct

Do not rely solely on punishment.

The goal is prevention first.

---

# TRANSACTION PHILOSOPHY

Every major transaction should be treated carefully.

Examples:

Inventory move

Vendor sale

Vendor purchase

Crafting result

Bank deposit

Bank withdrawal

Trade completion

Future claim transfer

These actions should be verifiable.

---

# CRAFTING VALIDATION RULE

Future crafting systems should validate:

Required materials

Required tools

Required stations

Output legitimacy

Players should not generate items without valid inputs.

---

# COMBAT VALIDATION RULE

Future combat systems should validate:

Damage sources

Equipment influence

Target legitimacy

Loot generation

Combat should remain deterministic when practical.

---

# MOVEMENT VALIDATION RULE

Future multiplayer systems should validate:

Position

Speed

Travel state

Movement exploits should be detectable.

---

# ECONOMY PROTECTION PHILOSOPHY

Economies fail when:

Currency becomes meaningless.

Items become meaningless.

Resources become meaningless.

Protection goals:

- item integrity
- trade integrity
- resource integrity
- reward integrity

---

# BANKING SECURITY RULE

Future banking systems require:

Access validation

Storage validation

Transaction logging

Bank systems should never become duplication sources.

---

# FUTURE PLAYER TRADING RULE

Trades should validate:

Ownership

Quantity

Availability

Completion state

Both sides should remain protected.

---

# LOGGING PHILOSOPHY

Future systems should support:

Error logs

Transaction logs

Economy logs

World logs

Claim logs

Logs provide visibility.

Visibility enables correction.

---

# WORLD INTEGRITY RULE

World state must remain consistent.

Future systems should protect:

Resource nodes

Claims

Events

NPC states

World progression

Avoid conflicting states.

---

# MULTIWORLD SUPPORT

Protected keys:

unkscape:saves

unkscape:worlds

The architecture must support:

Multiple worlds

Multiple characters

Independent progression

Without data collisions.

---

# FUTURE ACCOUNT SYSTEM COMPATIBILITY

Alpha may operate without full account systems.

Future support:

Accounts

Cloud saves

Cross-device access

Character recovery

Identity validation

Do not block future implementation.

---

# OFFLINE-FIRST PHILOSOPHY

Alpha should remain playable.

Future online systems should enhance the experience.

Not completely destroy offline compatibility where avoidable.

---

# PERFORMANCE RULE

Security systems should remain lightweight.

Avoid:

Heavy intrusive systems

Excessive background processing

Expensive validation loops

Security must scale.

---

# DATA EXPECTATIONS

Save Minimum Fields

saveVersion

characterId

worldId

createdAt

modifiedAt

integrityHash

futureNotes

---

Character Minimum Fields

characterId

characterName

raceId

factionId

inventoryState

skillState

worldState

futureNotes

---

Transaction Minimum Fields

transactionId

transactionType

timestamp

source

destination

result

futureNotes

---

World Minimum Fields

worldId

worldName

seed

createdAt

lastPlayed

worldVersion

futureNotes

---

# IMPLEMENTATION BOUNDARIES

Do NOT build:

- enterprise MMO infrastructure
- anti-cheat kernel systems
- invasive software
- aggressive DRM
- complex cloud architecture

Alpha focus:

Protection

Validation

Future compatibility

Data integrity

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ save keys remain protected

✓ save versioning exists

✓ inventory protection exists

✓ currency protection exists

✓ duplication prevention philosophy exists

✓ future server authority exists

✓ transaction validation exists

✓ world integrity exists

✓ multiplayer roadmap exists

✓ future account compatibility exists

✓ multiple worlds remain supported

---

# CLAUDE COMPLIANCE RULES

Claude must:

Preserve:

unkscape:saves

Preserve:

unkscape:worlds

Preserve save versioning.

Preserve future server-authority architecture.

Preserve inventory validation concepts.

Preserve economy protection concepts.

Preserve world integrity concepts.

Avoid destructive save migrations.

Avoid trusting the client completely.

Avoid building architecture that prevents future MMO expansion.

Design systems with migration in mind.

Protect progression.

Protect player trust.

---

# SUMMARY

UNKSCAPE security exists to protect player trust.

The Alpha version prioritizes:

- save integrity
- inventory integrity
- economy integrity
- world integrity
- future multiplayer compatibility

The architecture must evolve naturally from local browser persistence into future server-authoritative MMO systems without requiring a complete rebuild.

Progression only matters if players believe it is protected.

Trust is part of the game.

\newpage

---

# 016_validation_and_qa_rules {#016-validation-and-qa-rules}

---

# 016_VALIDATION_AND_QA_RULES

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Validation Standards, Quality Assurance, Build Review, Feature Approval

---

# PURPOSE

This framework establishes the official validation and quality assurance rules for UNKSCAPE.

Its purpose is to ensure:

- consistency
- stability
- maintainability
- scalability
- lore integrity
- gameplay integrity
- expansion compatibility

Every future feature must pass validation before becoming part of the official game.

The objective is simple:

Protect UNKSCAPE from feature creep, poor architecture, inconsistent design, and low-quality implementation.

---

# MASTER VALIDATION PHILOSOPHY

Every addition to UNKSCAPE must answer:

Does this improve the game?

Does this fit the world?

Does this fit the framework?

Does this support long-term growth?

If the answer is no:

Reject it.

---

# CORE REVIEW QUESTIONS

Every proposed feature should be evaluated against the following:

1. Does it support UNKSCAPE's identity?

2. Does it create meaningful gameplay?

3. Does it improve player experience?

4. Does it respect performance requirements?

5. Does it remain compatible with future expansion?

6. Does it create unnecessary complexity?

7. Does it damage another system?

---

# UNKSCAPE IDENTITY VALIDATION

Features must support:

- fantasy exploration
- survival
- progression
- economy
- crafting
- extraction
- faction identity
- world immersion

Avoid features that feel disconnected from the game's core vision.

---

# WORLD VALIDATION RULES

World additions must:

- fit established geography
- respect biome identity
- support exploration
- support world scale

Reject:

- random disconnected zones
- floating test maps
- biome copies
- unnecessary duplication

---

# TERRAIN VALIDATION RULES

Terrain must support:

- exploration
- readability
- performance
- visual identity

Reject:

- flat empty landscapes
- unrealistic terrain transitions
- excessive clutter
- navigation frustration

---

# BIOME VALIDATION RULES

Every biome must have:

Visual Identity

Audio Identity

Resource Identity

Gameplay Identity

Survival Identity

If a biome feels interchangeable:

It fails validation.

---

# TOWN VALIDATION RULES

Every town must provide:

Purpose

Services

Identity

Lore connection

Economic value

Reject:

Towns that exist only as decoration.

---

# NPC VALIDATION RULES

Every NPC must answer:

Why does this NPC exist?

If the answer is unclear:

Remove or redesign.

NPCs should provide:

- services
- quests
- lore
- guidance
- atmosphere

Avoid filler NPCs.

---

# QUEST VALIDATION RULES

Every quest must teach, reveal, reward, or advance something.

Quest must provide at least one:

Gameplay Lesson

Lore Lesson

Exploration Lesson

Economic Lesson

Reject:

Meaningless filler quests.

---

# DUNGEON VALIDATION RULES

Every dungeon must include:

Risk

Reward

Exploration

Extraction Opportunity

Identity

Reject:

Hallway combat simulators.

---

# EXTRACTION VALIDATION RULES

Extraction content must create tension.

Players should make decisions.

Examples:

Leave now?

Go deeper?

Spend supplies?

Risk loot?

If no meaningful decisions exist:

The extraction loop fails.

---

# SKILL VALIDATION RULES

Every skill update must:

Support progression

Create value

Support economy or gameplay

Respect existing skill structure

Reject:

Skills that duplicate other skills.

---

# ITEM VALIDATION RULES

Every item must have purpose.

Examples:

Utility

Crafting

Combat

Quest

Trade

Collection

Reject:

Meaningless loot filler.

---

# RESOURCE VALIDATION RULES

Resources must obey biome logic.

Examples:

Ore in mountains

Fish in water

Herbs in appropriate environments

Reject:

Random resource placement.

---

# ECONOMY VALIDATION RULES

Economy changes must answer:

Does this create value?

Does this protect value?

Does this support player interaction?

Reject:

Systems that make gathering, crafting, or trading meaningless.

---

# INVENTORY VALIDATION RULES

Inventory changes must improve:

Readability

Usability

Organization

Reject:

Complexity for complexity's sake.

---

# COMBAT VALIDATION RULES

Combat additions must improve:

Clarity

Skill expression

Feedback

Decision making

Reject:

Artificial difficulty through health inflation alone.

---

# SURVIVAL VALIDATION RULES

Survival systems should create preparation.

Not annoyance.

Reject:

Excessive punishment

Constant micromanagement

Survival should be meaningful.

Not exhausting.

---

# REPUTATION VALIDATION RULES

Reputation should:

Reward investment

Create opportunities

Support role identity

Reject:

Reputation systems that become mandatory grind walls.

---

# FACTION VALIDATION RULES

Faction content must respect:

Blood Oath

Highborn

Neither faction should become:

Purely good

Purely evil

Maintain nuance.

---

# RACE VALIDATION RULES

Race additions must:

Support identity

Support lore

Support world integration

Reject:

Race-exclusive core gameplay access.

---

# UI VALIDATION RULES

UI changes must improve:

Readability

Accessibility

Speed

Consistency

Reject:

Generic dashboard design

Corporate SaaS aesthetics

Browser-admin-panel appearance

UNKSCAPE should feel like a game.

---

# AUDIO VALIDATION RULES

Audio additions must:

Improve immersion

Support biome identity

Support atmosphere

Reject:

Noise without purpose.

---

# ANIMATION VALIDATION RULES

Animations must communicate information.

Reject:

Animation complexity without gameplay value.

---

# PERFORMANCE VALIDATION RULES

Every feature must answer:

Can low-end systems run this?

Performance is a core design pillar.

Reject:

Features that require excessive hardware for minimal gameplay benefit.

---

# SAVE SYSTEM VALIDATION RULES

Changes must preserve:

unkscape:saves

unkscape:worlds

Reject:

Destructive save migrations.

---

# EXPANSION VALIDATION RULES

Future content must:

Fit existing architecture

Preserve world consistency

Support long-term growth

Reject:

Expansion content that invalidates previous content.

---

# PLAYER EXPERIENCE VALIDATION RULES

Ask:

Would a new player understand this?

Would an experienced player value this?

If both answers are no:

Reconsider.

---

# FEATURE CREEP RULE

More features does not equal a better game.

Features should solve problems.

Not create them.

Reject:

Ideas that add complexity without meaningful value.

---

# TECHNICAL VALIDATION CHECKLIST

Before approval:

✓ No broken IDs

✓ No lore conflicts

✓ No save conflicts

✓ No inventory conflicts

✓ No economy conflicts

✓ No progression conflicts

✓ No faction conflicts

✓ No race conflicts

✓ No performance regressions

✓ Future compatibility maintained

---

# QA TESTING PHILOSOPHY

Testing should focus on:

Functionality

Stability

Consistency

Player experience

Testing is not optional.

---

# QA TEST CATEGORIES

System Testing

UI Testing

Inventory Testing

Economy Testing

Quest Testing

Dungeon Testing

Extraction Testing

Save Testing

Performance Testing

Regression Testing

---

# REGRESSION RULE

Every update should answer:

What did this break?

If nobody checks:

Assume something broke.

Regression testing is mandatory.

---

# BUG PRIORITY FRAMEWORK

Critical

Progression loss

Save corruption

World corruption

Economy corruption

---

High

Broken systems

Broken quests

Broken inventory

---

Medium

Visual issues

Minor gameplay issues

---

Low

Cosmetic issues

Minor polish items

---

# APPROVAL PHILOSOPHY

A feature should only become official when it is:

Stable

Useful

Performant

Consistent

Expandable

---

# FINAL QUALITY QUESTION

Before any feature is accepted:

Does this make UNKSCAPE better?

If the answer is uncertain:

Review again.

---

# IMPLEMENTATION BOUNDARIES

Do NOT:

Approve features solely because they are impressive.

Approve systems solely because other games use them.

Approve systems that conflict with the established framework.

Quality always wins.

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ all major systems have review rules

✓ expansion review exists

✓ performance review exists

✓ progression review exists

✓ economy review exists

✓ save protection review exists

✓ QA categories exist

✓ regression philosophy exists

✓ feature creep protection exists

✓ final approval standards exist

---

# CLAUDE COMPLIANCE RULES

Claude must:

Use this framework as a review layer.

Validate new systems before implementation.

Avoid feature creep.

Avoid framework conflicts.

Avoid unnecessary complexity.

Protect performance.

Protect progression.

Protect world identity.

Protect player experience.

Protect future expansion compatibility.

When uncertain:

Follow the framework.

---

# SUMMARY

This framework acts as the quality gatekeeper for UNKSCAPE.

Every future feature, update, patch, system, biome, quest, dungeon, race, item, UI panel, and mechanic should be measured against these standards.

The goal is not to build the biggest game.

The goal is to build the best version of UNKSCAPE.

Quality over quantity.

Consistency over chaos.

Longevity over shortcuts.

\newpage

---

# 017_claude_build_execution_rules {#017-claude-build-execution-rules}

---

# 017_CLAUDE_BUILD_EXECUTION_RULES

Version: Alpha Framework
Status: LOCKED
Project: UNKSCAPE
Scope: Claude Build Rules, Repo Editing Rules, Implementation Boundaries, Patch Discipline

---

# PURPOSE

This framework defines the official execution rules Claude must follow when building UNKSCAPE.

Claude is not being asked to invent the game.

Claude is being asked to implement the approved framework.

The source of truth is the studio framework folder:

final_unk_handoff_bundle/studio_framework/

Claude must treat these framework files as binding project law.

---

# CORE EXECUTION PHILOSOPHY

Claude must act as:

- implementation engineer
- code maintainer
- QA assistant
- architecture-preserving builder

Claude must not act as:

- game director
- lore inventor
- canon replacer
- uncontrolled feature generator

The creator owns the vision.

The framework defines the plan.

Claude builds within the plan.

---

# ABSOLUTE CANON RULE

Claude must never rename, replace, or reinterpret locked canon.

Protected names and IDs include:

UNKSCAPE

UNK-SCAPE

window.UNKSCAPE

unkscape:saves

unkscape:worlds

faction_blood_oath

faction_highborn

race_human

race_orc

race_elf

race_dwarf

race_troll

race_goblin

race_nomad

race_nocturnan

race_aetherian

realm_hearthvale_fields

town_oathstead_village

town_highmere_keep

dungeon_harvest_hollow

boss_marik_redharrow

boss_cassian_goldseal

world_surface_age_one

These are locked.

Do not rename.

Do not duplicate.

Do not replace with alternates.

---

# RUNTIME NAMESPACE RULE

All runtime modules must attach to:

window.UNKSCAPE

Preferred module pattern:

(function(){
  "use strict";
  const U = window.UNKSCAPE = window.UNKSCAPE || {};
})();

Do not use:

window.UnkScape

window.UnkScpae

window.UNK

window.Game

window.App

or any alternate namespace.

---

# SAVE KEY PROTECTION RULE

Protected localStorage keys:

unkscape:saves

unkscape:worlds

Claude must not:

- clear these keys
- rename these keys
- overwrite them destructively
- migrate them without backups
- create incompatible save structures without version checks

Any save migration must be:

- versioned
- reversible where practical
- non-destructive
- documented

---

# GODOT BACKUP RULE

Godot is backup only.

Claude must not add:

- .gd files
- res:// paths
- Godot scene assumptions
- Godot project structures
- Godot-specific architecture

Current engine direction:

Custom browser-based WebGL 3D engine

Vanilla JavaScript

GitHub Pages compatible

---

# CURRENT ALPHA SCOPE RULE

Alpha 0.1 active scope:

race_human

realm_hearthvale_fields

town_oathstead_village

dungeon_harvest_hollow

Only these are playable/active.

Future references may exist as locked metadata.

Do not make future content playable early unless owner approves.

---

# CHARACTER CREATION RULE

Alpha 0.1 character creation must allow:

race_human

ONLY.

Future races may be:

- hidden
or
- displayed as locked

They must not be selectable.

Beta may unlock:

race_human

race_orc

race_elf

race_dwarf

Remaining races stay locked until later expansion.

---

# WORLD SCALE RULE

Official world:

world_surface_age_one

Size:

16,000 x 12,800 tiles

Tile scale:

approximately 2 meters per tile

Gameplay chunk:

64 x 64 tiles

Macro region:

128 x 128 tiles

Claude must not:

- generate full world at once
- create one giant world JSON
- spawn all resources globally
- spawn all NPCs globally
- load full terrain into memory

Use chunk streaming and metadata-driven world structure.

---

# NO FLAT WORLD RULE

UNKSCAPE must not be implemented as a flat test board.

Terrain must support:

- height
- hills
- valleys
- cliffs
- rivers
- lakes
- caves
- coastlines
- mountains
- biome transitions

Alpha may begin simple.

But architecture must support full vertical terrain.

---

# NO FLOATING BLOCK RULE

UNKSCAPE must not look like a floating slab in black space.

Outdoor rendering must support:

- near terrain
- mid terrain
- far proxy terrain
- horizon silhouettes
- fog
- sky gradient
- terrain skirts
- distant trees
- distant mountains
- land/ocean continuation

Claude must not leave black void edges visible as final presentation.

---

# ALPHA TOWN RULE

Primary Alpha town:

town_oathstead_village

Oathstead must remain:

- first player home
- Blood Oath-influenced
- service hub
- skill hub
- bank hub
- market hub
- Harvest Hollow preparation hub

Do not replace Oathstead with another starter town.

---

# SKILL SYSTEM RULE

Exactly 15 core skills:

combat

mining

smithing

woodcutting

fishing

cooking

herbalism

alchemy

crafting

farming

hunting

building_claim_crafting

trading_merchanting

survival

extraction

Claude must not:

- rename skills
- remove skills
- merge skills
- add new core skills during Alpha
- lock skills behind future races

All 15 skills must be beginner-accessible in Oathstead/Hearthvale.

---

# ITEM SYSTEM RULE

Items must remain:

- meaningful
- categorized
- economy-connected
- skill-connected
- biome-connected

Avoid:

- meaningless loot spam
- thousands of unused items
- random filler drops

Item systems must support:

- resources
- tools
- weapons
- armor
- consumables
- components
- quest items
- misc utility items

---

# ECONOMY RULE

NPCs provide baseline value.

Players create premium value.

Claude must not build an economy where:

- vendors replace players
- crafting becomes useless
- gathering becomes useless
- rare loot becomes meaningless

Alpha economy should stay simple, expandable, and stable.

---

# NPC RULE

NPCs must serve a purpose.

Acceptable NPC purposes:

- service
- quest
- guidance
- lore
- economy
- atmosphere

Avoid filler NPCs with no function.

---

# QUEST RULE

Quests must:

- teach
- reveal
- reward
- guide
- advance progression

Avoid empty fetch quests.

Avoid meaningless XP vending.

Harvest Hollow must connect through quest flow.

---

# DUNGEON AND EXTRACTION RULE

Alpha dungeon:

dungeon_harvest_hollow

Claude must preserve:

- physical world entrance
- preparation loop
- danger
- loot
- extraction decision
- return-to-town profit loop

Do not replace extraction gameplay with simple instanced teleport menus.

---

# PROGRESSION RULE

Progression should support:

- independent skill growth
- economic growth
- exploration growth
- faction compatibility
- reputation compatibility
- extraction mastery

Avoid:

- class locks
- race locks
- pay-to-win progression
- battle passes
- forced specialization

---

# UI RULE

UNKSCAPE UI must feel like a game.

Not:

- SaaS dashboard
- generic web app
- browser admin panel
- placeholder HTML screen

UI should be:

- readable
- fantasy-themed
- custom
- responsive
- low-poly/retro-compatible

Alpha UI must support:

- character creation
- inventory
- skills
- quests
- map
- bank
- vendor
- crafting
- settings

---

# AUDIO AND PRESENTATION RULE

Audio and feedback must support:

- world identity
- biome identity
- combat clarity
- gathering clarity
- progression satisfaction

Avoid silent systems.

Players should receive feedback for meaningful actions.

---

# PERFORMANCE RULE

UNKSCAPE must run on low-end systems as much as practical.

Claude must prioritize:

- chunk streaming
- culling
- object pooling
- lightweight geometry
- simple shaders
- efficient loops
- limited draw calls
- metadata-driven spawning

Avoid:

- expensive particles
- over-rendering
- full-world simulation
- massive DOM UI spam
- unbounded entity creation

---

# CODE STYLE RULE

Use:

- vanilla JavaScript
- modular IIFE files
- clear comments
- readable structure
- defensive checks
- no silent failure where avoidable

Avoid:

- huge monolithic files
- hidden magic globals
- inconsistent naming
- untracked dependencies
- unexplained architecture changes

---

# FILE PATCH RULE

Claude must provide exact file changes.

Every build response should include:

- files changed
- what changed
- why it changed
- how to test it

When possible, provide complete file blocks or precise surgical patches.

Avoid vague instructions.

---

# SCRIPT LOAD ORDER RULE

If adding new runtime files, Claude must update:

index.html

with correct script order.

Dependencies must load before dependents.

Do not assume files load automatically.

---

# DATABASE AND ID RULE

Use stable IDs.

Do not hardcode display names as identity.

IDs must drive:

- races
- factions
- towns
- dungeons
- items
- skills
- NPCs
- quests
- regions

Names may change visually.

IDs remain stable.

---

# ERROR HANDLING RULE

Claude must avoid silent failures.

If something cannot load:

- log clear warning
- fail gracefully
- preserve game state
- avoid save corruption

---

# TESTING RULE

Every implementation must include testing instructions.

Minimum testing format:

1. Open game.
2. Perform action.
3. Expected result.
4. Confirm no console errors.
5. Confirm save state remains intact where relevant.

---

# QA GATE RULE

Before declaring complete, Claude must validate:

- console errors
- save integrity
- UI function
- gameplay loop
- performance impact
- ID consistency
- framework compliance

---

# REGRESSION RULE

Every patch must ask:

What could this break?

Claude should mention likely affected systems.

This prevents accidental damage.

---

# FEATURE CREEP RULE

Claude must not add extra systems just because they are interesting.

Only build:

- requested systems
- framework-required systems
- directly necessary support systems

If an idea is outside scope:

mark it as future.

Do not implement it silently.

---

# DESIGN AUTHORITY RULE

When framework and Claude preference conflict:

Framework wins.

When creator direction and Claude preference conflict:

Creator direction wins unless technically unsafe.

When uncertain:

Ask or provide safest minimal implementation path.

---

# HANDOFF RESPONSE FORMAT

Claude build responses should use this structure:

1. Summary

2. Files Changed

3. Exact Code / Patch

4. How To Test

5. Notes / Risks

6. Next Recommended Step

This keeps build work organized.

---

# COMMIT MESSAGE RULE

Recommended commit format:

type(scope): short description

Examples:

feat(character-creation): restrict alpha races to human only

feat(world): add chunk metadata foundation

fix(save): protect existing localStorage keys

docs(framework): add Oathstead service rules

---

# PROHIBITED ACTIONS

Claude must never:

- rename UNKSCAPE canon
- wipe protected saves
- use alternate runtime namespace
- add Godot files
- generate full world at once
- replace Oathstead
- replace Harvest Hollow
- unlock future races in Alpha
- add new core skills in Alpha
- ignore performance
- ignore QA
- invent unrelated lore
- implement monetization systems
- build pay-to-win mechanics

---

# FINAL BUILD STANDARD

A Claude-generated patch is acceptable only if it is:

- framework-compliant
- scoped correctly
- testable
- readable
- non-destructive
- expandable
- performance-aware

If not:

Reject and revise.

---

# VALIDATION REQUIREMENTS

Framework passes validation if:

✓ canon protection exists

✓ save protection exists

✓ namespace rule exists

✓ Alpha scope rule exists

✓ Human-only character creation rule exists

✓ world streaming rule exists

✓ no-floating-block rule exists

✓ skill rules exist

✓ economy rules exist

✓ UI rules exist

✓ QA rules exist

✓ patch response format exists

✓ prohibited actions exist

✓ final build standard exists

---

# CLAUDE COMPLIANCE RULES

Claude must treat this document as the build constitution.

Do not override it.

Do not partially follow it.

Do not reinterpret locked canon.

Do not invent around it.

Build UNKSCAPE from the approved framework.

The framework is the source of truth.

---

# SUMMARY

This framework defines how Claude must build UNKSCAPE.

The vision belongs to the creator.

The framework protects the vision.

Claude's job is to implement the plan with discipline, precision, testing, and respect for canon.

UNKSCAPE is not a random AI experiment.

UNKSCAPE is a structured fantasy MMORPG production pipeline built by one creator with AI as the execution engine.

\newpage

---

# 018_project_master_readme {#018-project-master-readme}

---

# 018_PROJECT_MASTER_README 

Version: Master Project Overview

Status: LOCKED

Project: UNKSCAPE

Purpose: Executive Overview and Primary Handoff Document

---

# WHAT IS UNKSCAPE

UNKSCAPE is a custom low-poly fantasy survival sandbox MMORPG built using a custom browser-based WebGL engine.

The project combines elements commonly found in:

- old-school progression MMOs
- sandbox games
- survival games
- crafting economies
- exploration games
- extraction gameplay

while remaining a completely original world and intellectual property.

UNKSCAPE is not intended to copy existing games.

UNKSCAPE is intended to create its own fantasy identity.

---

# PROJECT GOAL

Create a massive persistent fantasy world that feels:

- alive
- dangerous
- rewarding
- explorable
- expandable

while remaining playable on modest hardware through efficient architecture and streaming systems.

The goal is long-term expansion without requiring major redesigns.

---

# CURRENT DEVELOPMENT STAGE

Current Stage:

Alpha 0.1 Foundation

Only the following content is active:

race_human

realm_hearthvale_fields

town_oathstead_village

dungeon_harvest_hollow

All other races, realms, towns, dungeons, bosses, and expansion content remain future-locked.

---

# TECH STACK

Current Engine Direction:

Custom Browser-Based WebGL Engine

Vanilla JavaScript

GitHub Pages Compatible

Primary Namespace:

window.UNKSCAPE

Preferred Runtime Module Pattern:

(function(){
"use strict";
const U = window.UNKSCAPE = window.UNKSCAPE || {};
})();

---

# PROTECTED SYSTEMS

Protected Save Keys:

unkscape:saves

unkscape:worlds

Protected Canon:

See Framework 001.

Protected Runtime Rules:

See Framework 003.

Protected Build Rules:

See Framework 017.

---

# CORE DESIGN PILLARS

1. Exploration

Players should constantly want to discover new places.

2. Progression

Players should always have meaningful goals.

3. Survival

Preparation should matter.

4. Economy

Player-created value should matter.

5. Extraction

Risk versus reward should matter.

6. World Identity

The world itself should feel memorable.

---

# ALPHA PRIORITIES

Priority 1

Core Engine Stability

Priority 2

Character Creation

Priority 3

Save System

Priority 4

Chunk Streaming Foundation

Priority 5

Terrain Foundation

Priority 6

Oathstead Village

Priority 7

Skill Systems

Priority 8

Inventory Systems

Priority 9

Economy Systems

Priority 10

Harvest Hollow

Priority 11

Quest Systems

Priority 12

UI and Presentation

---

# WORLD SCALE

Official World:

world_surface_age_one

World Size:

16,000 x 12,800 tiles

Approximate Scale:

32 km x 25.6 km

Approximate Area:

819.2 km²

World must use chunk streaming.

World must not load entirely at once.

---

# ALPHA PLAYER EXPERIENCE

The intended Alpha journey:

Create Human Character

↓

Arrive in Oathstead

↓

Learn Skills

↓

Learn Economy

↓

Explore Hearthvale

↓

Prepare for Harvest Hollow

↓

Enter Dungeon

↓

Extract Successfully

↓

Continue Progression

---

# FRAMEWORK AUTHORITY

The official source of truth is:

studio_framework/

All framework files are binding.

If implementation conflicts with framework:

Framework wins.

If future ideas conflict with framework:

Framework wins until officially updated.

---

# CLAUDE INSTRUCTIONS

Claude is not responsible for inventing the game.

Claude is responsible for implementing the approved framework.

Claude must follow:

017_claude_build_execution_rules.md

at all times.

Claude must preserve:

- canon
- IDs
- save keys
- architecture
- expansion compatibility

---

# LONG TERM VISION

UNKSCAPE should eventually support:

- multiple races
- multiple realms
- large world exploration
- player economies
- player claims
- extraction systems
- faction progression
- world events
- regional bosses
- advanced crafting
- large-scale social systems

without requiring replacement of Alpha foundations.

---

# FINAL STATEMENT

UNKSCAPE is not a prototype.

UNKSCAPE is not a game jam project.

UNKSCAPE is intended to become a long-term fantasy MMORPG platform built through disciplined architecture, careful expansion, and consistent execution.

Every implementation decision should move the project closer to that goal.

\newpage
