"use strict";

class Controller {
  
  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor() {

    this.setup();

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

  setup() {

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

    }

    this.abilityScores.forEach(pairAbilityScores.bind(this));

  }

  setupSkills() {

    function pairSkills(ability, symbol) {

      this.effects.add(`${symbol}skill`, `{{${ability}mod}}`, this, "calculated");
      this.effects.add(`${symbol}skill`, `if({{${symbol}expertise}}, 2*{{prof}}, if({{${symbol}prof}}, {{prof}}, 0))`, this, "calculated");

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
      "featuresTree" : this.view.effectTree.getTree(),
    };
    localStorage.characterSheet = JSON.stringify(saveInfo);
    return(saveInfo);

  }


  
}