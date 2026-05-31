// client/ui/log.js v2 -- guard: only write when state===play
(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.UI.prototype.log=function(msg,type=''){
if(!this.game||this.game.state!=='play')return;
    const root=document.getElementById('log');
    if(!root.querySelector('.log-box')) root.innerHTML='<div class="log-box"></div>';
    const box=root.querySelector('.log-box'), line=document.createElement('div');line.className='log-line '+type;line.textContent='› '+msg;box.appendChild(line);
    while(box.children.length>4)box.removeChild(box.firstChild);
  };
})();
