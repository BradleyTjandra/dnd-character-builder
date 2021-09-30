"use strict";

class Effects {

  constructor(attributes) {

    this.attributes = attributes;
    this.effectsList = {};
    this.effectsToSave = {};

  }


  get(name) {

    return this.effectsList[name];

  }

  add(attribute, effectInfo, source, effectType = "fixed") {

    let name = this.generateUniqueID();

    let effect = new Effect(this.attributes, source);
    effect.setDetails(name, attribute, effectInfo, effectType);

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

      let effect = new Effect(this.attributes, "user");
      effect.setDetails(effectData.name, 
        effectData.attribute, 
        effectData.effectInfo, 
        effectData.effectType
        );
      this.effectsList[effectData.name] = effect;

    }

  }

}