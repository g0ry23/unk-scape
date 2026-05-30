(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.QuestSystem=function(game){this.game=game;this.active={};this.completed={};};
  US.QuestSystem.prototype.init=function(){
    this.active={};this.completed={};
    Object.keys(US.QUESTS).forEach(id=>this.start(id));
    const story=US.getClassStory?.(this.game.player?.classId);
    if(story?.starterQuest && US.CLASS_QUESTS?.[story.starterQuest]) this.start(story.starterQuest);
  };
  US.QuestSystem.prototype.start=function(id){if(this.active[id]||this.completed[id])return;this.active[id]={progress:{}};};
  US.QuestSystem.prototype.notify=function(type,id,qty=1){
    for(const [qid,st] of Object.entries(this.active)){
      const q=US.QUESTS[qid] || US.CLASS_QUESTS?.[qid];
      if(!q) continue;
      q.steps.forEach((step,i)=>{if(step.type===type && (step.id==null||step.id===id)){const k=i;st.progress[k]=(st.progress[k]||0)+qty;}});
      this.check(qid);
    }
  };
  US.QuestSystem.prototype.update=function(){this.checkAll();};
  US.QuestSystem.prototype.checkAll=function(){Object.keys(this.active).forEach(id=>this.check(id));};
  US.QuestSystem.prototype.check=function(id){
    const q=US.QUESTS[id] || US.CLASS_QUESTS?.[id], st=this.active[id]; if(!q||!st)return;
    const done=q.steps.every((s,i)=>(st.progress[i]||0)>=s.qty);
    if(done){this.complete(id);}
  };
  US.QuestSystem.prototype.complete=function(id){
    const q=US.QUESTS[id] || US.CLASS_QUESTS?.[id]; if(!this.active[id]||!q)return;
    delete this.active[id];this.completed[id]=true;
    Object.entries(q.rewards.xp||{}).forEach(([sk,xp])=>this.game.systems.skills.addXp(sk,xp));
    Object.entries(q.rewards.items||{}).forEach(([it,qty])=>this.game.systems.inventory.add(it,qty));
    this.game.ui.toast('Quest Complete',`${q.icon} ${q.name}`,'gold');
  };
  US.QuestSystem.prototype.toSave=function(){return{active:this.active,completed:this.completed};};
  US.QuestSystem.prototype.fromSave=function(data){this.active=data?.active||{};this.completed=data?.completed||{};};
})();
