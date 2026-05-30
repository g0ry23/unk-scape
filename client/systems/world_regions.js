—→/**
 * UNK-SCAPE World Region & Territory Manager
 * Path: client/systems/world_regions.js
 * Namespace: window.Duskfall.WorldRegions (US.WorldRegions)
 */
(function() {
    window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;
    US.WorldRegions = {};

    // In-memory runtime tracking state for territory control
    const territoryState = {
        'region_north_crest':    { currentOwner: 'neutral',   taxRate: 0.05, guardSpawnActive: true },
        'region_south_vanguard': { currentOwner: 'neutral',   taxRate: 0.05, guardSpawnActive: true },
        'region_spawn_stones':   { currentOwner: 'protected', taxRate: 0.00, guardSpawnActive: true }
    };

    /**
     * Complete Database Configuration Matrix for the 2000x2000 Map Layout
     */
    var REGION_MAP_CONFIG = [
        {
            id: 'region_spawn_stones',
            name: 'The Dawn Horizons',
            bounds: { minX: 900, maxX: 1100, minY: 900, maxY: 1100 },
            security: 'safezone',
            defaultBiome: 'temperate_grass',
            baseTileColor: '#27ae60'
        },
        {
            id: 'region_north_crest',
            name: 'The Ironbound High-Plains',
            bounds: { minX: 0, maxX: 2000, minY: 0, maxY: 900 },
            security: 'contested',
            defaultBiome: 'boreal_highland',
            baseTileColor: '#4a5b6c'
        },
        {
            id: 'region_south_vanguard',
            name: 'The Blood-Oath Badlands',
            bounds: { minX: 0, maxX: 2000, minY: 1100, maxY: 2000 },
            security: 'contested',
            defaultBiome: 'arid_steppe',
            baseTileColor: '#8a4f3e'
        }
    ];

    /**
     * Pinpoints exactly which region a set of map coordinates falls into
     * @param {number} x - Underlying tile game state coordinate X
     * @param {number} y - Underlying tile game state coordinate Y
     * @returns {Object} Region configuration object
     */
    US.WorldRegions.getRegionByCoords = function(x, y) {
        var boundedX = Math.max(0, Math.min(1999, x));
        var boundedY = Math.max(0, Math.min(1999, y));

        for (var i = 0; i < REGION_MAP_CONFIG.length; i++) {
            var reg = REGION_MAP_CONFIG[i];
            if (boundedX >= reg.bounds.minX && boundedX <= reg.bounds.maxX &&
                boundedY >= reg.bounds.minY && boundedY <= reg.bounds.maxY) {
                return reg;
            }
        }

        // Fallback if coordinate falls between explicit zone definitions
        return REGION_MAP_CONFIG[0];
    };

    /**
     * Live query to fetch ownership status for real-time biome color adaptations
     * @param {string} regionId
     * @returns {Object} Current ownership and dynamic tax state data
     */
    US.WorldRegions.getTerritoryState = function(regionId) {
        return territoryState[regionId] || { currentOwner: 'neutral', taxRate: 0.00, guardSpawnActive: false };
    };

    /**
     * Executes a dynamic faction layout override when a regional anchoring boss dies
     * @param {string} regionId - Target region identifier string
     * @param {string} newFactionOwnerId - The claiming faction ID
     */
    US.WorldRegions.flipTerritoryControl = function(regionId, newFactionOwnerId) {
        if (territoryState[regionId] && territoryState[regionId].currentOwner !== 'protected') {
            var oldOwner = territoryState[regionId].currentOwner;
            territoryState[regionId].currentOwner = newFactionOwnerId;

            console.log('[TERRITORY] ' + regionId + ' has flipped from ' + oldOwner + ' to ' + newFactionOwnerId + '!');

            // Dispatch global message alert to UI chat logging element
            if (window.Duskfall.UI && window.Duskfall.UI.addSystemMessage) {
                window.Duskfall.UI.addSystemMessage('The local territory power has shifted to ' + newFactionOwnerId + '!', '#f1c40f');
            }
        }
    };

    console.log('Module Loaded: WorldRegions (Territory Zone Database online)');
})();
