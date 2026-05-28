(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.QUESTS = {
    first_night:{
      name:'Survive the First Night', icon:'🌙',
      desc:'Prepare supplies and live through your first dusk.',
      steps:[
        {type:'collect', id:'log', qty:3, text:'Collect 3 Oak Logs'},
        {type:'collect', id:'berry', qty:3, text:'Collect 3 Wild Berries'},
        {type:'surviveNight', qty:1, text:'Survive until dawn'}
      ],
      rewards:{xp:{survival:80,foraging:35}, items:{coin:45,health_salve:1}}
    },
    bank_run:{
      name:'A Safer Pocket', icon:'🏦',
      desc:'Use the bank to store supplies.',
      steps:[
        {type:'bankDeposit', qty:1, text:'Deposit any item into the bank'}
      ],
      rewards:{xp:{survival:30}, items:{coin:20}}
    },
    dusk_hunter:{
      name:'Dusk Hunter', icon:'⚔️',
      desc:'Defeat creatures that emerge after dark.',
      steps:[
        {type:'kill', id:'husk', qty:3, text:'Defeat 3 Husks'},
        {type:'collect', id:'dusk_essence', qty:2, text:'Collect 2 Dusk Essence'}
      ],
      rewards:{xp:{combat:140,survival:70}, items:{coin:90,iron_ore:4}}
    }
  };
})();
</script>
<script>
