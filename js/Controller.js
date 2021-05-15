"use strict";

class Controller {
  
  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor() {

    this.attributes = new Attributes();
    // this.loadCharacterSheet();
    this.attributes.createAttributesList();
    
    this.effects = new Effects(this.attributes);
    this.setupEffectsBetweenAttributes();

  }

  loadCharacterSheet() {

    let characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));

    if (characterSheetData) {

      this.attributes.loadAttributes(characterSheetData?.attributes);

    }

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

    let saveInfo = {
      "attributes" : this.attributes.getSaveInfo(),
      "effects" : this.effects.getSaveInfo()
    };
    localStorage.characterSheet = JSON.stringify(saveInfo);
  }


  
}