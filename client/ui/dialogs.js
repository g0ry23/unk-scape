(function(){
    const US = window.UnkScape = window.UnkScape || {};const D = US;
    D.UI.prototype.openDialog=function(npc){this.dialogNpc=npc;this.game.paused=true;this.clearInputLocks();document.getElementById('dialog').classList.add('show');this.renderDialog();};
    D.UI.prototype.closeDialog=function(){this.dialogNpc=null;document.getElementById('dialog').classList.remove('show');this.game.paused=false;this.clearInputLocks();this.renderDialog();};
    D.UI.prototype.renderDialog=function(){
          const npc=this.dialogNpc;if(!npc)return; const cfg=npc.cfg, el=document.getElementById('dialog');
          if(npc.id==='trader') return this.renderShop(npc);
          // Oathstead Step 1: canon banker + legacy fallback both open bank panel
          if(npc.id==='banker'||npc.id==='npc_oathstead_banker_torvin_vaultseal') return this.openPanel('bank');
          // Oathstead Step 2: Sela Grainhollow — general vendor shop
          if(npc.id==='npc_oathstead_general_vendor_sela_grainhollow') return this.renderShop(npc);
          el.innerHTML=`<div class="dialog-box"><div class="dialog-top"><div class="portrait">${cfg.icon}</div><div><h3>${cfg.name}</h3><small style="color:var(--muted)">${cfg.role||''}</small></div><button class="h-btn-close" onclick="window.UnkScape.UI.prototype.closeDialog.call(window.UnkScape._uiInst||window.UnkScape.game.ui)">x</button></div><div class="dialog-lines">${(cfg.lines||[]).map(l=>`<p>${l}</p>`).join('')}</div></div>`;
    };
    D.UI.prototype.renderShop=function(npc){
          const el=document.getElementById('dialog'), inv=this.game.systems.inventory;
          const cfg=npc.cfg, pool=cfg.dialoguePool||{};
          const coins=(inv.items['coin']||0);
          const buyItems=(cfg.shop&&cfg.shop.buy)||[];
          const buyRows=buyItems.map(id=>{
                  const item=D.ITEMS[id];if(!item)return '';
                  const price=D.priceOf(id);
                  return `<div class="shop-row h-frame"><span class="shop-name">${item.name}</span><span class="shop-price" style="color:var(--h-gold)">${price}c</span><button class="h-btn" onclick="(function(){const g=window.UnkScape.game;g.systems.economy.buy('${id}');g.ui.renderShop(g.ui.dialogNpc);})()">Buy</button></div>`;
          }).join('');
          const sellRows=Object.keys(inv.items).filter(id=>id!=='coin'&&D.ITEMS[id]).map(id=>{
                  const item=D.ITEMS[id], qty=inv.items[id]||0;if(!qty)return '';
                  const sellPrice=Math.max(1,Math.floor(D.priceOf(id)*.55));
                  return `<div class="shop-row h-frame"><span class="shop-name">${item.name} x${qty}</span><span class="shop-price" style="color:var(--h-stam)">${sellPrice}c</span><button class="h-btn" onclick="(function(){const g=window.UnkScape.game;g.systems.economy.sell('${id}');g.ui.renderShop(g.ui.dialogNpc);})()">Sell</button></div>`;
          }).join('');
          const greeting=pool.greeting||cfg.name;
          el.innerHTML=`<div class="dialog-box h-frame" style="max-width:520px"><div class="dialog-top"><div class="portrait">${cfg.icon}</div><div style="flex:1"><h3 style="color:var(--h-gold)">${cfg.name}</h3><small style="color:var(--h-muted)">${cfg.role||''}</small></div><span style="color:var(--h-gold);font-size:.85em;margin-right:8px">[${coins}c]</span><button class="h-btn-close" onclick="(function(){const g=window.UnkScape.game;g.ui.closeDialog();})()">x</button></div><p style="padding:6px 10px;color:var(--h-muted);font-size:.8em;border-bottom:1px solid var(--h-border)">${greeting}</p><div class="shop-tabs" style="display:grid;grid-template-columns:1fr 1fr;gap:0"><div style="padding:6px 8px;border-right:1px solid var(--h-border)"><div style="color:var(--h-gold);font-size:.75em;margin-bottom:4px;text-transform:uppercase">Buy</div>${buyRows||'<p style="color:var(--h-muted);font-size:.8em">No stock.</p>'}</div><div style="padding:6px 8px"><div style="color:var(--h-stam);font-size:.75em;margin-bottom:4px;text-transform:uppercase">Sell (0.55x)</div>${sellRows||'<p style="color:var(--h-muted);font-size:.8em">Nothing to sell.</p>'}</div></div></div>`;
    };
})();
