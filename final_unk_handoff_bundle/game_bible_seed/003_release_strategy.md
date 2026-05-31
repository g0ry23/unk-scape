# UNKSCAPE — Release Strategy
## game_bible_seed/003_release_strategy.md

---

## Philosophy

The full game Bible describes the entire world. Implementation unlocks slowly.
Alpha 0.1 proves one complete slice before anything else is unlocked.

---

## Release States

| State | Meaning |
|-------|---------|
| alpha | Active in Alpha 0.1 — playable now |
| locked | Known content — not yet unlocked |
| future | Planned but not designed in detail |
| disabled | Exists in code stubs only |

---

## Alpha 0.1 Active Content

Only these are active/playable in Alpha 0.1:

- race_human
- realm_hearthvale_fields
- town_oathstead_village
- town_highmere_keep
- dungeon_harvest_hollow
- boss_marik_redharrow
- boss_cassian_goldseal

**All other races, realms, towns, dungeons, and bosses are locked or future.**

---

## Unlock Philosophy

1. Prove Alpha 0.1 with Human / Hearthvale first
2. Fix all Alpha 0.1 bugs before unlocking more content
3. Each new race gets a dedicated patch batch
4. Each realm gets its own milestone
5. Dungeons unlock after their parent realm is stable
6. Bosses unlock after their parent dungeon is stable

---

## Release Gate Requirements

Before any content moves from locked to alpha:

- Prerequisite content is complete and stable
- Owner approves the unlock
- A specific patch is created and approved
- QA checklist is completed
- Rollback plan exists

---

## Future Content Handling

Future content may exist as:
- Metadata only (IDs and display names)
- Locked UI stubs
- Placeholder registry entries

Do NOT:
- Spawn future content in the world
- Give it active collision
- Make it accessible through normal gameplay
- Display it in the UI without a locked/coming soon state

---

## Version Naming

| Milestone | Version |
|-----------|---------|
| Current alpha | 0.1 |
| Full Hearthvale | 0.2 |
| Second race | 0.3 |
| Multi-realm | 0.4+ |
| Beta | 0.9 |
| Launch | 1.0 |
