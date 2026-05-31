# UNKSCAPE — Accounts, Security, and Anti-Cheat
## game_bible_seed/008_accounts_security_anticheat.md

---

## Current Development Phase

Early builds use local browser saves (localStorage) for development convenience.
Local saves are NOT final MMO-secure.

**This is expected and acceptable for Alpha 0.1.**

---

## Future Multiplayer Security Requirements

Final official multiplayer progression must be server-authoritative.
The client must NEVER be trusted for final:

- XP values
- Levels
- Inventory contents
- Bank contents
- Item drops
- Boss kills
- Trades
- Marketplace listings
- Currency amounts
- Rare items
- Extraction rewards
- Resource gathering results
- Crafting results

---

## Anti-Cheat Threat Model

Plan for future anti-cheat and validation against:

| Threat | Description |
|--------|-------------|
| Mining bots | Auto-click resource gathering |
| Woodcutting bots | Auto-click woodcutting |
| Fishing bots | Auto-click fishing |
| Auto-clickers | General skill automation |
| Marketplace bots | Auto-buy/sell manipulation |
| Fake clients | Modified client sending invalid data |
| Packet replay | Replaying valid packets to duplicate actions |
| Item dupes | Exploiting timing to duplicate items |
| Bank manipulation | Exploiting save/load to duplicate bank contents |
| XP boosting | Finding unvalidated XP gain exploits |
| NPC exploitation | Repeating NPC interactions for infinite gain |

---

## Alpha 0.1 Save System Notes

Current save system:
- localStorage key: unkscape:saves
- Stores XP, inventory, character identity, position
- Works correctly for single-player alpha testing
- NOT secure against manipulation by a technically savvy user

This is acceptable for Alpha 0.1 solo testing.
Server authority migration is planned for multiplayer beta.

---

## Account System Planning

Account system is future/locked content.
Do not create account systems, login flows, or server-side auth in current builds without owner approval.

---

## Building Placement Security (Future)

Players cannot build anywhere randomly.
Allowed building areas:
- Claim Zones
- Frontier Wards
- Guild Plots
- Faction Camps
- Wilderness Siege Zones
- Homestead Wards

Forbidden building areas:
- Major roads
- Main towns
- Sacred ruins
- Dungeons
- Boss arenas
- Protected trade hubs
