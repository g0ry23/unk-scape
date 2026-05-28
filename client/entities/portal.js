(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.createPortal=function(id,x,y){return{uid:D.uid('portal'),kind:'portal',id,x,y,r:32,name:id==='dungeon'?'Old Catacombs':'Portal'}};
})();
</script>
<script>
