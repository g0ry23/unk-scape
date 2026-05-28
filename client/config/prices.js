(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.PRICES = {
    berry:5,cooked_berry:16,health_salve:35,torch:12,
    log:4,pine_log:9,yew_log:24,stone:3,herb:12,copper_ore:12,iron_ore:22,silver_ore:30,gold_ore:55,raw_fish:8,raw_trout:18,emerald:75,ruby:125,hide:10,bone:8,dusk_essence:55,
    stone_hatchet:55,iron_pickaxe:155,crude_sword:75,iron_sword:265,wooden_shield:70,hide_armor:130,iron_armor:430,
    campfire:30
  };
  D.priceOf = id => D.PRICES[id] ?? (D.ITEMS[id]?.value || 1);
})();
</script>
<script>
