(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.UI.prototype.log=function(msg,type=''){
    const root=document.getElementById('log');
    if(!root.querySelector('.log-box')) root.innerHTML='<div class="log-box"></div>';
    const box=root.querySelector('.log-box'), line=document.createElement('div');line.className='log-line '+type;line.textContent='› '+msg;box.appendChild(line);
    while(box.children.length>4)box.removeChild(box.firstChild);
  };
})();
</script>
<script>
