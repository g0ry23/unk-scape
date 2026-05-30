(function(){
  const US = window.UnkScape = window.UnkScape || {};const D = US;
  D.UI.prototype.openDialog=function(npc){this.dialogNpc=npc;this.game.paused=true;this.clearInputLocks();document.getElementById('dialog').classList.add('show');this.renderDialog();this.syncLayoutState();};
  D.UI.prototype.closeDialog=function(){this.dialogNpc=null;document.getElementById('dialog').classList.remove('show');this.game.paused=false;this.clearInputLocks();this.syncLayoutState();};
  D.UI.prototype.renderDialog=function(){
    const npc=this.dialogNpc;if(!npc)return; const cfg=npc.cfg, el=document.getElementById('dialog');
    if(npc.id==='trader') return this.renderShop(npc);
    if(npc.id==='banker') return this.openPanel('bank');
    el.innerHTML=`<div class="dialog-box"><div class="dialog-top"><div class="portrait">${cfg.icon}</div><div><h3>${cfg.name}</h3><small style="color:var(--muted)">${cfg.role}</small></div></div><div class="dialog-text">${cfg.lines[Math.floor(Math.random()*cfg.lines.length)]}</div><div class="dialog-actions"><button class="action-btn" onclick="UnkScape.game.ui.openPanel('quests')">Open Quests</button><button class="action-btn" onclick="UnkScape.game.ui.closeDialog()">Leave</button></div></div>`;
  };
  D.UI.prototype.renderShop=function(npc){
    const el=document.getElementById('dialog'), inv=this.game.systems.inventory;
    const buy=npc.cfg.shop.buy.map(id=>`<div class="shop-row"><div>${D.ITEMS[id].icon} <b>${D.ITEMS[id].name}</b><small>${D.ITEMS[id].desc}</small></div><span class="coin">${D.priceOf(id)} 🪙</span><button class="small-btn" onclick="UnkScape.game.systems.economy.buy('${id}')">Buy</button></div>`).join('');
    const sell=Object.keys(inv.items).filter(id=>id!=='coin').map(id=>`<div class="shop-row"><div>${D.ITEMS[id].icon} <b>${D.ITEMS[id].name}</b><small>You own x${inv.count(id)}</small></div><span class="coin">${Math.max(1,Math.floor(D.priceOf(id)*.55))} 🪙</span><button class="small-btn" onclick="UnkScape.game.systems.economy.sell('${id}')">Sell 1</button></div>`).join('')||'<div class="help-note">Nothing to sell.</div>';
    el.innerHTML=`<div class="dialog-box"><div class="dialog-top"><div class="portrait">${npc.cfg.icon}</div><div><h3>${npc.cfg.name}</h3><small style="color:var(--muted)">Coins: ${inv.count('coin')}</small></div></div><div class="dialog-text"><div class="two-col"><div><h3>Buy</h3>${buy}</div><div><h3>Sell</h3>${sell}</div></div></div><div class="dialog-actions"><button class="action-btn" onclick="UnkScape.game.ui.closeDialog()">Leave</button></div></div>`;
  };
})();
