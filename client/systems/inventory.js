(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.InventorySystem=function(game){this.game=game;this.items={};};
  D.InventorySystem.prototype.add=function(id,qty=1,silent=false){
    const it=D.ITEMS[id]; if(!it) return false;
    this.items[id]=(this.items[id]||0)+qty;
    if(!silent) {this.game.systems.audio?.play('pickup');this.game.ui.floatText(this.game.player?.x||0,this.game.player?.y||0,`+${qty} ${it.name}`,'#63e6a4');this.game.systems.quests?.notify('collect',id,qty);}
    return true;
  };
  D.InventorySystem.prototype.remove=function(id,qty=1){
    if((this.items[id]||0)<qty)return false;
    this.items[id]-=qty;if(this.items[id]<=0)delete this.items[id];return true;
  };
  D.InventorySystem.prototype.count=function(id){return this.items[id]||0};
  D.InventorySystem.prototype.has=function(id,qty=1){return this.count(id)>=qty};
  D.InventorySystem.prototype.canAfford=function(req){return Object.entries(req||{}).every(([id,q])=>this.has(id,q));};
  D.InventorySystem.prototype.take=function(req){if(!this.canAfford(req))return false;Object.entries(req).forEach(([id,q])=>this.remove(id,q));return true;};
  D.InventorySystem.prototype.quickUse=function(id){if(this.has(id))this.use(id);else this.game.ui.toast('Missing item',`You do not have ${D.ITEMS[id]?.name||id}.`,'bad');};
  D.InventorySystem.prototype.useHotbar=function(index){
    const g=this.game, id=g.hotbar?.slots?.[index];
    if(!id){g.ui.toast('Empty Slot',`Hotbar slot ${index+1} is empty.`,'bad');return false;}
    g.hotbar.selected=index;
    if(!this.has(id) && !Object.values(g.player.equipment||{}).includes(id)){
      g.ui.toast('Missing Hotbar Item',`Slot ${index+1}: ${D.ITEMS[id]?.name||id} is not in your backpack.`, 'bad');
      return false;
    }
    const equipped=Object.entries(g.player.equipment||{}).find(([slot,item])=>item===id);
    if(equipped){g.ui.toast('Selected',`${D.ITEMS[id]?.name||id} is already equipped.`, 'good');return true;}
    return this.use(id);
  };
  D.InventorySystem.prototype.use=function(id){
    const it=D.ITEMS[id], p=this.game.player;if(!it||!this.has(id))return false;
    if(it.type==='food'){
      this.remove(id,1);p.hunger=Math.min(p.maxHunger,p.hunger+(it.hunger||0));this.game.ui.floatText(p.x,p.y-20,'+'+(it.hunger||0)+' hunger','#ffcf6e');this.game.ui.log(`Ate ${it.name}.`,'good');return true;
    }
    if(it.type==='consumable'&&it.heal){this.remove(id,1);p.heal(it.heal);this.game.ui.log(`Used ${it.name}.`,'good');return true;}
    if(['weapon','armor','tool'].includes(it.type)){this.equip(id);return true;}
    this.game.ui.toast('Cannot use',`${it.name} is not directly usable.`,'bad');return false;
  };
  D.InventorySystem.prototype.equip=function(id){
    const it=D.ITEMS[id], p=this.game.player;if(!it||!it.slot||!this.has(id))return false;
    const old=p.equipment[it.slot];
    p.equipment[it.slot]=id;
    this.remove(id,1); if(old) this.add(old,1,true);
    this.game.systems.audio?.play('equip');this.game.ui.toast('Equipped',it.name,'good');this.game.ui.renderPanel();return true;
  };
  D.InventorySystem.prototype.unequip=function(slot){
    const p=this.game.player,id=p.equipment[slot];if(!id)return;
    p.equipment[slot]=null;this.add(id,1,true);this.game.ui.renderPanel();
  };
  D.InventorySystem.prototype.toSave=function(){return {...this.items};};
  D.InventorySystem.prototype.fromSave=function(data){this.items={...(data||{})};};
})();
