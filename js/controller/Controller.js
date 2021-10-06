"use strict";

import Views from "../view/Views.js"
import Attributes from "../attributes/Attributes.js";
import Links from "../links/Links.js"
import Calculation from "../links/Calculation.js";
import { linkType } from "../links/Link.js";
import ContainsCalculation from "../links/ContainsCalculation.js";

export class Controller {
  
  abilityScores = ["str", "dex", "con", "int", "wis", "cha"];

  constructor() {

    this.setupConstants();

    this.attributes = new Attributes();
    this.attributes.loadAttributes();
    this.attributes.createAttributesList();

    this.effects = new Links(this.attributes);
    this.effects.loadSaveInfo();
    this.setupEffectsBetweenAttributes();

    this.views = new Views(this);
    this.views.setup();
    this.views.loadSaveInfo();
    this.views.refreshViews();

  }

  setupConstants() {

    let abilityAndSkills = { 
      str : ["Athletics"],
      dex : ["Acrobatics", "Sleight of Hand", "Stealth"],
      int : ["Arcana", "History", "Investigation", "Nature", "Religion"],
      wis : ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
      cha : ["Deception", "Intimidation", "Performance", "Persuasion"],
    };

    this.abilityAndSkills = {};

    for (let ability in abilityAndSkills) {

      let skills = abilityAndSkills[ability];

      let skillsObj = skills.map( skill => { return({
        symbol : skill.replace(/\s+/g, "").toLowerCase(),
        label : skill,
      })});

      this.abilityAndSkills[ability] = skillsObj;
      
    }

  }

  setupEffectsBetweenAttributes() {
    this.setupTotalAbilityScoreAttributes();
    this.setupSkills();
  }  

  setupTotalAbilityScoreAttributes() {
    function pairAbilityScores(value) {
      this.effects.add(value, `{{base-ability-score-${value}}}`, this, "calculated");
      this.effects.add(`${value}mod`, `({{${value}}}-10)/2`, this, "calculated");
      this.effects.add(`${value}save`, `{{${value}mod}}`, this, "calculated");
    }
    this.abilityScores.forEach(pairAbilityScores.bind(this));
  }

  setupSkills() {

    function pairSkills(ability, symbol) {
      this.effects.add(`${symbol}skill`, `{{${ability}mod}}`, this, "calculated");
      this.effects.add(`${symbol}skill`, `if({{${symbol}expertise}}, 2*{{prof}}, if({{${symbol}prof}}, {{prof}}, 0))`, this, "calculated");
      
      let profCalc = new ContainsCalculation(`${symbol} %in% {{skillprof}}`, this.attributes);
      this.effects.add(`${symbol}prof`, profCalc, this, linkType.CALCULATED);

      let expertCalc = new ContainsCalculation(`${symbol} %in% {{skillexpertise}}`, this.attributes);
      this.effects.add(`${symbol}expertise`, expertCalc, this, linkType.CALCULATED);
    }

    let boundFunc = pairSkills.bind(this);
    
    for (let [ability, skills] of Object.entries(this.abilityAndSkills)) {
      skills.forEach( skill => boundFunc(ability, skill.symbol));
    }

  }

  saveInfo() {

    let saveInfo = {
      "attributes" : this.attributes.getSaveInfo(),
      "effects" : this.effects.getSaveInfo(),
      "featuresTree" : this.views.effectTree.getTree(),
    };
    localStorage.characterSheet = JSON.stringify(saveInfo);
    return(saveInfo);

  }

}