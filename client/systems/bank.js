(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.BankSystem=function(game){this.game=game;this.items={};};
  D.BankSystem.prototype.deposit=function(id,qty=1){
    const inv=this.game.systems.inventory;if(!inv.has(id,qty))return false;
    inv.remove(id,qty);this.items[id]=(this.items[id]||0)+qty;this.game.flags.bankDeposits++;this.game.systems.quests.notify('bankDeposit',id,1);this.game.ui.renderPanel();return true;
  };
  D.BankSystem.prototype.withdraw=function(id,qty=1){
    if((this.items[id]||0)<qty)return false;
    this.items[id]-=qty;if(this.items[id]<=0)delete this.items[id];this.game.systems.inventory.add(id,qty,true);this.game.ui.renderPanel();return true;
  };
  D.BankSystem.prototype.toSave=function(){return{...this.items};};
  D.BankSystem.prototype.fromSave=function(data){this.items={...(data||{})};};
})();
</script>
<script>
