"use strict";

import Attribute from "./Attribute.js";
import FeaturesAttribute from "./FeaturesAttribute.js";
import HitDiceAttribute from "./HitDiceAttribute.js";
import HpAttribute from "./HpAttribute.js";
import JoinedAttribute from "./JoinedAttribute.js";

let abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

export const AttributeTypes = {
  FEATURES : "features",
  JOINED : "joined",
  CALCULATED : "calculated",
  FIXED : "fixed",
  RESOURCE : "resource",
  HITDICE : "hitdice",
}

export default class Attributes {

  constructor() {
    this.attributeList = {};
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

    this.createAbilityScoreAttributes(value => "base-ability-score-"+value, AttributeTypes.FIXED);
    this.createAbilityScoreAttributes(value => value, AttributeTypes.CALCULATED);
    this.createAbilityScoreAttributes(value => value+"mod", AttributeTypes.CALCULATED);
    this.createAbilityScoreAttributes(value => value+"save", AttributeTypes.CALCULATED);

    this.add("name", AttributeTypes.FIXED);
    this.add("features-list", AttributeTypes.FEATURES);
    this.add("inventory", AttributeTypes.FEATURES);
    this.add("speed", AttributeTypes.CALCULATED);
    this.add("languages", AttributeTypes.JOINED);

    let boundFunc = this.createSkill.bind(this);

    ["acrobatics", "animalhandling", "arcana", "athletics", "deception", "history",
    "history", "insight", "intimidation", "investigation", "medicine", "nature", 
    "perception", "performance", "persuasion", "religion", "sleightofhand", "stealth", 
    "survival"].forEach( boundFunc );

    this.add("prof", AttributeTypes.CALCULATED);

    this.add("background-name", AttributeTypes.CALCULATED);
    this.add("race-name", AttributeTypes.CALCULATED);
    this.add("class-name", "ordered-list");

    this.add("hp", AttributeTypes.RESOURCE);
    this.add("hitdice", AttributeTypes.HITDICE);
    this.add("ac", AttributeTypes.CALCULATED);
    this.add("proficiencies", AttributeTypes.JOINED);

  }

  get(name) {

    return(this.attributeList[name]);

  }

  add(name, calcType, overwrite = false) {
    
    if (name in this.attributeList && !overwrite) {
      return(this.attributeList[name]);
    }

    let attribute;
    switch (calcType) {

      case AttributeTypes.FEATURES:
        attribute = new FeaturesAttribute(name);
        break;

      case AttributeTypes.JOINED:
        attribute = new JoinedAttribute(name);
        break;

      case AttributeTypes.RESOURCE:
        attribute = new HpAttribute(name);
        break;

      case AttributeTypes.HITDICE:
        attribute = new HitDiceAttribute(name);
        break;

      default:
        attribute = new Attribute(name, calcType);
        break;

    }

    this.attributeList[name] = attribute;

    return (attribute);

  }

  createSkill(skill) {

    this.add(`${skill}skill`, AttributeTypes.CALCULATED);
    this.add(`${skill}prof`, "boolean_or");
    this.add(`${skill}expertise`, "boolean_or");

  }

  createAbilityScoreAttributes(attributeNameTemplate, calcType) {

    abilityScores.forEach( (ability) => {

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