(function(){
  const US = window.UnkScape = window.UnkScape || {};const D = US;
  D.EconomySystem=function(game){this.game=game;};
  D.EconomySystem.prototype.buy=function(id){
    const price=D.priceOf(id), inv=this.game.systems.inventory;
    if(!inv.has('coin',price)){this.game.ui.toast('Not enough coins',`${D.ITEMS[id].name} costs ${price}.`,'bad');return;}
    inv.remove('coin',price);inv.add(id,1,true);this.game.ui.toast('Purchased',`${D.ITEMS[id].name} for ${price} coins.`,'good');this.game.ui.renderDialog();
  };
  D.EconomySystem.prototype.sell=function(id){
    const inv=this.game.systems.inventory;if(id==='coin')return;
    if(!inv.has(id)){this.game.ui.toast('Missing item','You do not have that item.','bad');return;}
    const price=Math.max(1,Math.floor(D.priceOf(id)*.55));
    inv.remove(id,1);inv.add('coin',price,true);this.game.ui.toast('Sold',`${D.ITEMS[id].name} for ${price} coins.`,'gold');this.game.ui.renderDialog();
  };
})();
