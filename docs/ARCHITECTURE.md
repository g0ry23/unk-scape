# UNK-SCAPE Architecture

## Current Architecture
Single-file prototype: `index.html`
All game logic, styles, and assets are contained in one file.

## Planned Future Architecture

```
src/
  main.js          - Entry point
    config/          - Game configuration
      engine/          - Core game loop and rendering
        entities/        - Player, NPCs, mobs
          systems/         - Combat, inventory, crafting
            ui/              - HUD, menus, dialogs
            styles/
              main.css         - Global styles
              assets/
                sprites/         - Character and object images
                  tiles/           - World tile images
                    sounds/          - Sound effects
                      music/           - Background music
                      ```

                      ## Note
                      Do not modularize until the prototype is stable and complete.
