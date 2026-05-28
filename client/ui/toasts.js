(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.UI.prototype.toast=function(title,msg,type=''){
    const root=document.getElementById('toasts'), id=++this.toastId;
    const div=document.createElement('div');div.className='toast '+type;div.dataset.id=id;div.innerHTML=`<b>${title}</b>${msg}`;root.appendChild(div);
    setTimeout(()=>{div.style.opacity='0';div.style.transform='translateY(-8px)';},3300);
    setTimeout(()=>div.remove(),3800);
  };
})();
</script>
<script>
