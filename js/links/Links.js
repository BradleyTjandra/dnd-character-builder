"use strict";

import { Link, linkType } from "./Link.js";

export default class Links {

  constructor(attributes) {

    this.attributes = attributes;
    this.effectsList = {};
    this.effectsToSave = {};

  }


  get(name) {

    return this.effectsList[name];

  }

  add(attribute, effectInfo, source, effectType = linkType.FIXED) {

    let name = this.generateUniqueID();

    let effect = new Link(this.attributes, source);

    effect.name = name;
    effect.attribute = attribute;
    effect.effectType = effectType;

    if (typeof effectInfo === "string") {
      if (effectType == linkType.FIXED) {
        effect.effectInfo = {"value" : effectInfo};
      } else if (effectType == linkType.CALCULATED) {
        effect.effectInfo = {"formula" : effectInfo}
      } else {
        new Error(`unknown type: ${effectType}`);
      }
    } else {
      effect.effectInfo = effectInfo;
    }

    this.effectsList[name] = effect;

    return(effect);

  }

  removeEffect(effect) {

    effect.removeLinks();
    delete this.effectsList[effect.name];

  }

  generateUniqueID() {
    let S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4());
    // return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }  

  getSaveInfo() {

    let effects = Object.values(this.effectsList);
    let userDefinedEffects = effects.filter( eff => eff.source == "user" );

    let saveInfo = userDefinedEffects.reduce( 
      (o, effect) => Object.assign(o, effect.getSaveInfo() ), {} 
    );

    return(saveInfo);
    
  }

  loadSaveInfo() {

    let characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));

    if (!characterSheetData) return;

    let effects = Object.values(characterSheetData?.effects);

    if (!effects) return;

    for (let effectData of effects) {

      let effect = new Link(this.attributes, "user");
      effect.setDetails(effectData.name, 
        effectData.attribute, 
        effectData.effectInfo, 
        effectData.effectType
        );
      this.effectsList[effectData.name] = effect;

    }

  }

}