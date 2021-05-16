"use strict";

class Controller {
  
  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor() {

    this.attributes = new Attributes();
    this.attributes.loadAttributes();
    this.attributes.createAttributesList();
    
    this.effects = new Effects(this.attributes);
    this.effects.loadSaveInfo();
    this.setupEffectsBetweenAttributes();

    this.view = new ViewMaster(this);
    this.view.setup();
    this.view.loadSaveInfo();
    this.view.refreshViews();

  }

  setupEffectsBetweenAttributes() {

    this.setupTotalAbilityScoreAttributes();

  }  

  setupTotalAbilityScoreAttributes() {
    
    function pairAbilityScores(value) {

      this.effects.add(value, `{{base-ability-score-${value}}}`, this, "calculated");
      this.effects.add(`${value}mod`, `({{${value}}}-10)/2`, this, "calculated");

    }

    this.abilityScores.forEach(pairAbilityScores.bind(this));

  }

  saveInfo() {

    if (!this.attributes) alert("noo!");

    let saveInfo = {
      "attributes" : this.attributes.getSaveInfo(),
      "effects" : this.effects.getSaveInfo(),
      "featuresTree" : this.view.effectTree.getTree(),
    };
    localStorage.characterSheet = JSON.stringify(saveInfo);
    return(saveInfo);

  }


  
}