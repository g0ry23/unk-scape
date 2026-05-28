(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.BOSS_TIERS={faction:'Faction Boss',world:'World Boss',dungeon:'Dungeon Boss'};
  D.FACTION_BOSSES=[];
  Object.entries(D.CLASSES||{}).slice(0,9).forEach(([id,c])=>{
    (D.getClassFactions(id)||[]).forEach(fid=>{
      const f=D.FACTIONS[fid];
      D.FACTION_BOSSES.push({id:`${id}_${fid}_boss`,name:`${f.name} ${c.name} Champion`,classId:id,factionId:fid,zone:c.zone||'Unknown',tier:'faction',rolePressure:D.CLASS_ROLES[id]||'Hybrid',hp:900,damage:28,lootTable:['coin','class_token','epic_cache'],claimBuff:f.buff||{}});
    });
  });
  D.WORLD_BOSSES={
    dusk_titan:{name:'The Dusk Titan',icon:'🗿',tier:'world',hp:6500,damage:52,zone:'Central Crossroads',lootTable:['mythic_cache','legendary_cache','old_mule_whistle']},
    crownless_drake:{name:'The Crownless Drake',icon:'🐉',tier:'world',hp:8200,damage:64,zone:'High Ruin Expanse',lootTable:['mythic_cache','legendary_cache','dusk_wolf_pup','ember_sprite']}
  };
  D.MOUNTS={old_mule:{name:'Old Mule',icon:'🐴',speedBonus:.12,source:'Rare overworld reward'},ember_stag:{name:'Ember Stag',icon:'🦌',speedBonus:.22,source:'World boss reward'}};
  D.PETS={dusk_wolf_pup:{name:'Dusk Wolf Pup',icon:'🐺',bonus:{attack:1},source:'World boss reward'},ember_sprite:{name:'Ember Sprite',icon:'✨',bonus:{wisdom:1},source:'Mythic support pet'}};
})();
</script>
<script>
