(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.BankSystem=function(game){this.game=game;this.items={};};
  US.BankSystem.prototype.deposit=function(id,qty=1){
    const inv=this.game.systems.inventory;if(!inv.has(id,qty))return false;
    inv.remove(id,qty);this.items[id]=(this.items[id]||0)+qty;this.game.flags.bankDeposits++;this.game.systems.quests.notify('bankDeposit',id,1);this.game.ui.renderPanel();return true;
  };
  US.BankSystem.prototype.withdraw=function(id,qty=1){
    if((this.items[id]||0)<qty)return false;
    this.items[id]-=qty;if(this.items[id]<=0)delete this.items[id];this.game.systems.inventory.add(id,qty,true);this.game.ui.renderPanel();return true;
  };
  US.BankSystem.prototype.toSave=function(){return{...this.items};};
  US.BankSystem.prototype.fromSave=function(data){this.items={...(data||{})};};
})();
