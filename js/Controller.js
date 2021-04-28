"use strict";

class Controller {
  
  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor() {
    this.setupAttributes();
    // this.setupView();
  }

  setupAttributes() {
    this.attributeList = Object.assign(
      this.createAbilityScoreAttributes("base-ability-score-", "fixed"),
      this.createAbilityScoreAttributes("total-ability-score-", "calculated"),
      this.createAbilityScoreAttributes("total-ability-mod-", "calculated")
    );

    this.setupTotalAbilityScoreAttributes();

  }

  createAbilityScoreAttributes(prefix, calcType) {

    let abilityScoreAttributes = Object.fromEntries(
      this.abilityScores.map(value => [prefix+value, new Attribute(prefix+value, calcType)])
    );

    return(abilityScoreAttributes);

  }

  setupTotalAbilityScoreAttributes() {
    
    function pairAbilityScores(value) {
      let total = this.attributeList[`total-ability-score-${value}`];
      let calc = new Calculation(
        `{{base-ability-score-${value}}}`, 
        this.attributeList,
        this
        );
      total.setInput(calc);

      let mod = this.attributeList[`total-ability-mod-${value}`];
      let mod_calc = new Calculation(
        `({{total-ability-score-${value}}}-10)/2`,
        this.attributeList,
        this
        );
      mod.setInput(mod_calc);

    }

    this.abilityScores.forEach(pairAbilityScores.bind(this));

  }
}





  // setViewListeners() {

  //   let view = this.view;

  //   view.onBaseAbilityScoreUpdate = this.updateBaseAbilityScore.bind(this);

  // }

  // updateBaseAbilityScore(e) {
  //   let input = e.target.closest("input");

  //   if (!input) return;

  //   if (!input.hasAttribute.contains("data-base-ability-score")) return;

  //   // TODO: if input value not a valid number then ignore

  //   let ability = input.data.baseAbilityScore;

  //   this.characterSheetModel["baseAbilityScore"][ability] = input.value;

  //   this.view.update

  // }

