"use strict";

class Attributes {
  
  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor() {

    this.attributeList = [];

  }

  loadAttributes() {

    let characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));

    if (!characterSheetData) return;

    let attributes = Object.values(characterSheetData?.attributes);

    if (!attributes) return;

    for (let attributeData of attributes) {

      let attribute = this.add(attributeData.name, attributeData.calcType);
      attribute.setValue(attributeData.value);

    }

  }

  createAttributesList() {

    this.createAbilityScoreAttributes(value => "base-ability-score-"+value, "fixed");
    this.createAbilityScoreAttributes(value => value, "calculated");
    this.createAbilityScoreAttributes(value => value+"mod", "calculated");
    this.createAbilityScoreAttributes(value => value+"save", "calculated");

    this.add("all-features-descriptions", "concat");
    this.add("speed", "calculated");
    this.add("languages", "concat");

    let boundFunc = this.createSkill.bind(this);

    ["acrobatics", "animalhandling", "arcana", "athletics", "deception", "history",
    "history", "insight", "intimidation", "investigation", "medicine", "nature", 
    "perception", "performance", "persuasion", "religion", "sleightofhand", "stealth", 
    "survival"].forEach( boundFunc );

    this.add("prof", "calculated");

    this.add("background-name", "calculated");
    this.add("race-name", "calculated");
    this.add("class-name", "ordered-list");

    this.add("hp", "calculated");
    this.add("hitdice", "hitdice");
    this.add("ac", "calculated");
    this.add("proficiencies", "concat");

  }

  get(name) {

    return(this.attributeList[name]);

  }

  add(name, calcType, overwrite = false) {

    if (name in this.attributeList && !overwrite) return false;

    let attribute = new Attribute(name, calcType);

    this.attributeList[name] = attribute;

    return (attribute);

  }

  createSkill(skill) {

    this.add(`${skill}skill`, "calculated");
    this.add(`${skill}prof`, "boolean_or");
    this.add(`${skill}expertise`, "boolean_or");

  }

  createAbilityScoreAttributes(attributeNameTemplate, calcType) {

    this.abilityScores.forEach( (ability) => {

      let attrName = attributeNameTemplate(ability);
      let attr = this.add(attrName, calcType);
      if (attr) attr.setValue(10);

    });

  }

  getSaveInfo() {

    let listOfAttributes = Object.values(this.attributeList);

    let attributeSaveInfo = listOfAttributes.reduce( 
      (o, attribute) => Object.assign(o, attribute.getSaveInfo() ), {} 
    );

    return(attributeSaveInfo);

  }

  contains(name) {
    
    return(name in this.attributeList);

  }
  
}