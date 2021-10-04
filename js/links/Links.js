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

  add(attribute, info, source, type = linkType.FIXED) {

    let name = this.generateUniqueID();

    let effect = new Link(this.attributes, source);
    // if (attribute == "con") console.log(this.attributes);

    effect.name = name;
    effect.attribute = attribute;
    effect.type = type;

    if (typeof info === "string") {
      if (type == linkType.FIXED) {
        effect.info = {"value" : info};
      } else if (type == linkType.CALCULATED) {
        effect.info = {"formula" : info};
        // if (attribute == "con") {
        //   console.log("setting con mod to");
        //   console.log(effect._info);
        //   console.log(effect.value);
        // }
        
      } else {
        new Error(`unknown type: ${type}`);
      }
    } else {
      effect.info = info;
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
        effectData.info, 
        effectData.type
        );
      this.effectsList[effectData.name] = effect;

    }

  }

}