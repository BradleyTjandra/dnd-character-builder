"use strict";

class Controller {
  
  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor() {
    this.setupAttributes();
    // this.setupView();
  }

  setupAttributes() {
    this.attributeList = Object.assign(
      this.createAbilityScoreAttributes(value => "base-ability-score-"+value, "fixed"),
      this.createAbilityScoreAttributes(value => value, "calculated"),
      this.createAbilityScoreAttributes(value => value+"mod", "calculated"),
      {"all-features-descriptions" : new Attribute("all-features-descriptions", "concat")},
    );

    this.setupTotalAbilityScoreAttributes();

  }

  createAbilityScoreAttributes(attributeNameTemplate, calcType) {

    let abilityScoreAttributes = Object.fromEntries(
      this.abilityScores.map(value => [attributeNameTemplate(value), new Attribute(attributeNameTemplate(value), calcType)])
    );

    return(abilityScoreAttributes);

  }

  setupTotalAbilityScoreAttributes() {
    
    function pairAbilityScores(value) {
      let total = this.attributeList[`${value}`];
      let effectBaseToTotal = new Effect(total, `{{base-ability-score-${value}}}`, this.attributeList, this, "calculated");
      total.addInput(effectBaseToTotal);

      let mod = this.attributeList[`${value}mod`];
      let effectMod = new Effect(mod, `({{${value}}}-10)/2`, this.attributeList, this, "calculated");
      mod.addInput(effectMod);

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

