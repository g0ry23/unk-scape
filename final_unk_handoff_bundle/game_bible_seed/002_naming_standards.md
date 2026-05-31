# UNKSCAPE — Naming Standards
## game_bible_seed/002_naming_standards.md

---

## Official Brand Names

| Use | Value |
|-----|-------|
| Primary written brand | UNKSCAPE |
| Visual / logo variant | UNK-SCAPE |
| Internal code prefix | UNKSCAPE |

**Always use UNKSCAPE (all caps) as the standard written name.**
UNK-SCAPE may be used for logos, UI headers, and stylized titles only.

---

## Runtime Namespace

| Context | Identifier |
|---------|-----------|
| Global namespace | window.UNKSCAPE |
| Inside IIFEs (alias) | const US = window.UNKSCAPE = window.UNKSCAPE || {} |
| 3D engine global | window.UnkScape3D |
| Inside render_3d.js (alias) | const E = window.UnkScape3D |

---

## FORBIDDEN Identifiers

These identifiers are from a legacy abandoned namespace and must NEVER appear in new code:

- D2
- window.D2
- D2.game
- D2.game.player
- Any D2.* reference

The legacy namespace was fully purged. Do not reintroduce it.

---

## localStorage Key Names

| Key | Description |
|-----|-------------|
| unkscape:saves | Player save data |
| unkscape:worlds | World data |

These keys are protected. Do not rename or alias them.

---

## File Naming Conventions

| Context | Convention |
|---------|-----------|
| Patch prompts | final_unk_patch_NNN_description.md |
| Game Bible files | NNN_topic_name.md (zero-padded) |
| Production files | topic_name.md (lowercase) |
| Runtime JS files | topic_name.js (lowercase, underscores) |

---

## Content ID Prefixes

| Content Type | Prefix Example |
|-------------|---------------|
| Race IDs | race_human, race_orc |
| Realm IDs | realm_hearthvale_fields |
| Town IDs | town_oathstead_village |
| Dungeon IDs | dungeon_harvest_hollow |
| Boss IDs | boss_marik_redharrow |
| Quest IDs | quest_hearthvale_wake_at_the_common |
| Skill IDs | skill_woodcutting |
| NPC IDs | npc_innkeeper_oathstead |

---

## Faction Names

| Faction | Written Name |
|---------|-------------|
| Faction 1 | Blood Oath |
| Faction 2 | Highborn |

---

## Race Names (9 Total)

Human, Orc, Elf, Dwarf, Troll, Goblin, Nomad, Nocturnan, Aetherian

---

## Forbidden Content References

Do not copy or reference protected names, maps, monsters, icons, questlines, items, or terms from:
- Other commercial MMOs
- Other survival games
- Other fantasy game franchises

UNKSCAPE is original. Use original names for everything.
