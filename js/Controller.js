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
      // let total = this.attributeList[`${value}`];
      let effectBaseToTotal = new Effect(this.attributeList, this);
      effectBaseToTotal.setDetails(value, `{{base-ability-score-${value}}}`, "calculated");
      // let effectBaseToTotal = new Effect(total, `{{base-ability-score-${value}}}`, this.attributeList, this, "calculated");
      // total.addInput(effectBaseToTotal);

      let effectMod = new Effect(this.attributeList, this);
      effectMod.setDetails(`${value}mod`, `({{${value}}}-10)/2`, "calculated");
      // let mod = this.attributeList[`${value}mod`];
      // let effectMod = new Effect(mod, `({{${value}}}-10)/2`, this.attributeList, this, "calculated");
      // mod.addInput(effectMod);

    }

    this.abilityScores.forEach(pairAbilityScores.bind(this));

  }
}

// constructor(attributeList, source) {
//   this.attributeList = attributeList;
//   this.source = source;
//   this.isSetup = false;
//   this._attribute = {"valid" : false, "data" : undefined};
//   this._effectInfo = {"valid" : false, "data" : undefined};
//   this.inputs = [];
// }

// setDetails(attribute, effectInfo, effectType = "fixed") {

//   this.effectType = effectType; 
//   this.attribute = attribute;
//   this.effectInfo = effectInfo;
  
//   // fixed, calculated, list (for spells), etc.

//   // this.setup();
//   // this.refreshEffectInfoValidity();
// }
