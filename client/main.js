window.addEventListener('DOMContentLoaded',()=>{
  const D = window.Duskfall = window.Duskfall || {};
  D.runSmokeTests = function(){
    const testWorld = D.generateWorld(12345);
    console.assert(testWorld && testWorld.tiles && testWorld.tiles.length === D.WORLD.h, 'Smoke test failed: world generation did not create tiles.');
    console.assert(D.WORLD.w>=300 && D.WORLD.h>=300 && D.TILE<=36, 'Smoke test failed: map should use a larger tile-grid with smaller visual tiles.');
    const cx=Math.floor(D.WORLD.w/2), cy=Math.floor(D.WORLD.h/2);
    console.assert(['plaza','stonepath'].includes(testWorld.tiles[cy][cx]), 'Smoke test failed: town center was not generated correctly.');
    console.assert(D.STARTER_ZONES && Object.keys(D.STARTER_ZONES).length===9, 'Smoke test failed: 9 starter zone definitions missing.');
    console.assert(Object.values(D.STARTER_ZONES).every(z=>z.r>=28), 'Smoke test failed: Phase 1 starter zones must be 2x+ larger.');
    console.assert(D.ZONE_FEATURES && Object.keys(D.ZONE_FEATURES).length===9, 'Smoke test failed: zone feature definitions missing.');
    Object.entries(D.CLASSES).forEach(([id,c])=>{
      const z=D.getStarterZone(id), tile=testWorld.tiles[z.y]?.[z.x];
      console.assert(z && tile && !D.TILES[tile].solid, `Smoke test failed: ${id} starter zone is blocked.`);
    });
    console.assert(typeof D.CombatSystem === 'function', 'Smoke test failed: combat system missing.');
    console.assert(D.ENEMIES.rat.attack<=2 && D.ENEMIES.goblin.attack<=4, 'Smoke test failed: early mob balance too strong.');
    console.assert(typeof D.Camera === 'function', 'Smoke test failed: camera system missing.');
    console.assert(typeof D.Camera.prototype.setOverhead === 'function', 'Smoke test failed: overhead camera control missing.');
    console.assert(typeof D.Camera.prototype.rotate === 'function', 'Smoke test failed: camera rotate control missing.');
    const camSmoke={viewW:1280,viewH:720,settings:{cameraMode:'iso'},ui:{toast(){}}};
    const cam=new D.Camera(camSmoke);
    console.assert(cam.targetAngle===0 && cam.targetPitch>=.75, 'Smoke test failed: default camera should not start sideways or too flat.');
    cam.rotate(Math.PI/12);
    console.assert(typeof cam.targetAngle==='number' && typeof cam.targetPitch==='number', 'Smoke test failed: smooth camera targets missing.');
    console.assert(typeof D.BuildSystem === 'function', 'Smoke test failed: build system missing.');
    console.assert(typeof D.AudioSystem === 'function', 'Smoke test failed: audio system missing.');
    console.assert(typeof D.TurfSystem === 'function', 'Smoke test failed: turf system missing.');
    console.assert(typeof D.GatheringSystem === 'function', 'Smoke test failed: gathering system missing.');
    console.assert(D.RESOURCE_TYPES.pine && D.RESOURCE_TYPES.yew && D.RESOURCE_TYPES.copper && D.RESOURCE_TYPES.gold && D.RESOURCE_TYPES.fish && D.RESOURCE_TYPES.gem, 'Smoke test failed: tier resource foundation missing.');
    console.assert(typeof D.UI.prototype.syncLayoutState === 'function', 'Smoke test failed: UI layout state manager missing.');
    const tmpGame={buildMode:false,ui:{toast(){},log(){},floatText(){}},input:{mouse:{}},systems:{inventory:{canAfford(){return true},take(){return true}}},player:{x:D.WORLD.pxW/2,y:D.WORLD.pxH/2,blocking:false},entities:{npcs:[],enemies:[]},world:testWorld};
    const build=new D.BuildSystem(tmpGame);
    console.assert(build.selected()==='woodfloor', 'Smoke test failed: default build tile incorrect.');
    console.assert(D.CLASSES.melee && D.CLASSES.range && D.CLASSES.mage, 'Smoke test failed: core combat classes missing.');
    console.assert(Object.keys(D.CLASSES).length===9, 'Smoke test failed: UNK-SCAPE should have 9 playable classes.');
    console.assert(D.getClassFactions('melee').length===2, 'Smoke test failed: class faction choices missing.');
    console.assert(D.FACTION_BOSSES && D.FACTION_BOSSES.length===18, 'Smoke test failed: 18 faction boss foundations missing.');
    const popSmoke={seed:999,world:testWorld,entities:{resources:[],enemies:[],npcs:[],portals:[],projectiles:[],drops:[],effects:[]}};
    D.populateWorld(popSmoke);
    console.assert(popSmoke.entities.npcs.filter(n=>String(n.id).startsWith('trainer_')).length===9, 'Smoke test failed: 9 class trainers not spawned.');
    console.assert(popSmoke.entities.npcs.filter(n=>String(n.id).startsWith('emissary_')).length===18, 'Smoke test failed: 18 faction emissaries not spawned.');
    console.assert(D.WORLD_BOSSES && Object.keys(D.WORLD_BOSSES).length===2, 'Smoke test failed: 2 world boss foundations missing.');
    console.assert(typeof D.UI.prototype.questsHTML === 'function', 'Smoke test failed: Phase 3 story journal missing.');
    console.assert(D.MOUNTS && D.PETS, 'Smoke test failed: mount/pet foundations missing.');
    console.assert(typeof D.characterLevelForXp === 'function' && typeof D.defaultAttributes === 'function', 'Smoke test failed: character level / attribute foundations missing.');
    console.assert(D.ITEMS.training_bow && D.ITEMS.oak_staff && D.ITEMS.bronze_helm, 'Smoke test failed: expanded class gear missing.');
    console.assert(typeof D.UI.prototype.statsHTML === 'function', 'Smoke test failed: character stat panel missing.');
    const combatSmoke=new D.CombatSystem({input:{mouse:{worldX:0,worldY:0}}});
    console.assert(typeof combatSmoke.rollBonusHit === 'function' && typeof combatSmoke.weaponStyle === 'function', 'Smoke test failed: crit/headshot combat helpers missing.');
    console.assert(combatSmoke.heavyThreshold >= .7, 'Smoke test failed: heavy attack threshold too low.');
    console.assert(typeof combatSmoke.isEnemyNearAimLine === 'function', 'Smoke test failed: ranged aim-line targeting helper missing.');
    console.assert(typeof combatSmoke.spawnAttackProjectile === 'function', 'Smoke test failed: ranged projectile helper missing.');
    console.assert(D.getRecipe('training_bow') && D.getRecipe('leather_hood') && D.getRecipe('ranger_tunic'), 'Smoke test failed: craftable starter gear missing.');
    console.assert(typeof D.UI.prototype.clearInputLocks === 'function', 'Smoke test failed: UI input lock cleanup missing.');
    console.assert(D.TILE===32, 'Smoke test failed: tile size should be reduced from chunky 48px tiles.');
  };
  try{D.runSmokeTests();}catch(err){console.error('Smoke test crash prevented:',err);}
  console.assert(typeof D.createPlayer === 'function', 'Smoke test failed: player factory missing.');
  const smokeGame={
    input:{axis(){return{x:0,y:0}},mouse:{}},
    world:D.generateWorld(777),
    systems:{inventory:{add(){return true}},perks:{reapply(){}}},
    ui:{toast(){},log(){},floatText(){}},
    camera:{snapTo(){}},
    entities:{drops:[]},
    stats:{deaths:0},settings:{hungerEnabled:false}
  };
  const smokePlayer=D.createPlayer(smokeGame,'melee','ironbound');
  console.assert(smokePlayer && smokePlayer.equipment.head === 'bronze_helm', 'Smoke test failed: class/faction player creation failed.');
  console.assert(smokePlayer.factionName === D.FACTIONS.ironbound.name, 'Smoke test failed: faction assignment failed.');
  console.assert(smokePlayer.attributes && smokePlayer.attributePoints >= 0, 'Smoke test failed: player attributes missing.');
  try{
    D.game = new D.Game();
    D.game.init();
  }catch(err){
    console.error('UNK-SCAPE boot crash:',err);
    document.body.innerHTML='<div style="min-height:100vh;display:grid;place-items:center;background:#07090d;color:#e9f0ff;font-family:Inter,Arial;padding:30px"><div style="max-width:760px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:rgba(18,24,38,.94);padding:24px;box-shadow:0 22px 70px rgba(0,0,0,.45)"><h1 style="margin:0 0 10px">UNK-SCAPE Preview Boot Guard</h1><p>The game hit a startup error, but the page is no longer hard-crashing. Open the browser console for the exact stack.</p><pre style="white-space:pre-wrap;color:#ff9b5c;background:rgba(0,0,0,.28);padding:14px;border-radius:14px">'+String(err&&err.stack||err)+'</pre></div></div>';
  }
});
